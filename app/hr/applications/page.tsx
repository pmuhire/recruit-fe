"use client";

import { useState, useEffect, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import Card from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { ReviewModal } from "@/components/ui/reviewModel";

interface User {
  id: number;
  username: string;
  email?: string;
  role?: string;
}

interface Application {
  id: number;
  user: User | null; // defensive
  jobId: number;
  jobTitle: string;
  status: "APPROVED" | "REJECTED" | "PENDING";
  reviewReason?: string;
  submittedAt: string;
  documents?: { id: number; fileName: string; fileUrl: string }[];
}

// Spinner component
function Loader() {
  return (
    <div className="flex justify-center items-center py-6">
      <div className="w-8 h-8 border-4 border-green-500 border-dashed rounded-full animate-spin" />
    </div>
  );
}



// Main Page
export default function PendingApplicationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [loading, setLoading] = useState(false);

  const [filterText, setFilterText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("jobTitle");

  const { token, role } = useAuth();

  const fetchApplications = async () => {
    if (!token) return; // defensive
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      console.log(data.data);
      setApplications(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Failed to fetch applications", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role !== "HR") return;
    fetchApplications();
  }, [role, token]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (!app) return false;

      let filterValue = "";
      if (selectedFilter === "jobTitle") filterValue = app.jobTitle || "";
      else if (selectedFilter === "applicant")
        filterValue = app.user?.username || "";
      else if (selectedFilter === "status") filterValue = app.status || "";

      return filterValue.toLowerCase().includes(filterText.toLowerCase());
    });
  }, [applications, filterText, selectedFilter]);

  const handleDecide = (status: "APPROVED" | "REJECTED", reason: string) => {
    if (!selectedApplication) return;
    setApplications(
      applications.map((a) =>
        a.id === selectedApplication.id
          ? { ...a, status, reviewReason: reason }
          : a,
      ),
    );
    setSelectedApplication(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Applications</h1>

        <div className="flex mb-6 gap-4">
          <select
            className="p-2 border rounded"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="jobTitle">Job Title</option>
            <option value="applicant">Applicant</option>
            <option value="status">Status</option>
          </select>
          <input
            type="text"
            className="p-2 border rounded"
            placeholder={`Search by ${selectedFilter}`}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card
            title="Total Pending"
            value={filteredApplications
              .filter((a) => a.status === "PENDING")
              .length.toString()}
          />
          <Card
            title="Total APPROVED"
            value={filteredApplications
              .filter((a) => a.status === "APPROVED")
              .length.toString()}
          />
          <Card
            title="Total REJECTED"
            value={filteredApplications
              .filter((a) => a.status === "REJECTED")
              .length.toString()}
          />
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 text-sm uppercase tracking-wide text-gray-600">
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Applicant</th>
                  <th className="p-3 text-left">Job</th>
                  <th className="p-3 text-left">Contact</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-6 text-gray-500">
                      No applications match your filter
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app, idx) => (
                    <tr
                      key={app.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3 font-medium">{idx + 1}</td>
                      <td className="p-3 font-semibold text-gray-800">
                        {app.user?.username || "N/A"}
                      </td>
                      <td className="p-3">{app.jobTitle}</td>
                      <td className="p-3 text-sm text-gray-600">
                        {app.user?.email || "N/A"}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            app.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : app.status === "APPROVED"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          className="px-3 py-1 rounded text-white text-sm hover:opacity-90 transition"
                          style={{ backgroundColor: "#4B5320" }}
                          onClick={() => {
                            setSelectedApplication(app);
                            setModalOpen(true);
                          }}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <ReviewModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleDecide}
          application={selectedApplication}
        />
      </div>
    </div>
  );
}
