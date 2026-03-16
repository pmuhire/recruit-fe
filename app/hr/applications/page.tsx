"use client";

import { useState, useEffect, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import Card from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  username: string;
  email?: string;
  role?: string;
}

interface Application {
  id: number;
  user: User; // full user object
  jobId: number;
  jobTitle: string;
  status: "APPROVED" | "REJECTED" | "PENDING";
  reviewReason?: string;
  submittedAt: string;
  documents?: { id: number; fileName: string; fileUrl: string }[];
}

// Review Modal
function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
  application,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (status: "APPROVED" | "REJECTED", reason: string) => void;
  application: Application | null;
}) {
  const [decision, setDecision] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    if (!application) return;
    setDecision("APPROVED");
    setReason(application.reviewReason || "");
  }, [application]);

  if (!isOpen || !application) return null;

  const handleApprovalOrRejection = async () => {
    if (!application) return;

    setLoading(true);
    setError("");

    try {
      // Hardcoded endpoint depending on decision
      const endpoint =
        decision === "APPROVED"
          ? `/api/applications/${application.id}/approve`
          : `/api/applications/${application.id}/reject`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reviewReason: reason }),
        },
      );

      const data = await response.json();

      if (data.success) {
        alert(`${decision} successful`);
        onSubmit(decision, reason);
        onClose();
      } else {
        setError(data.message || "Something went wrong!");
      }
    } catch (err) {
      setError("Error communicating with the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">Review Application</h2>

        {/* Applicant Info */}
        <div className="mb-4 space-y-1">
          <p>
            <span className="font-semibold">Applicant:</span>{" "}
            {application.user.username}
          </p>
          <p>
            <span className="font-semibold">Email:</span>{" "}
            {application.user.email}
          </p>
          <p>
            <span className="font-semibold">Job:</span> {application.jobTitle}
          </p>
          <p>
            <span className="font-semibold">Current Status:</span>{" "}
            {application.status}
          </p>
          <p>
            <span className="font-semibold">Submitted At:</span>{" "}
            {new Date(application.submittedAt).toLocaleString()}
          </p>
        </div>

        {/* Documents / CV */}
        {application.documents && application.documents.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Documents</h3>
            <ul className="space-y-2">
              {application.documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <span>{doc.fileName}</span>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                  >
                    View / Download
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Decision */}
        <div className="flex flex-col gap-3 mb-4">
          <select
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={decision}
            onChange={(e) =>
              setDecision(e.target.value as "APPROVED" | "REJECTED")
            }
          >
            <option value="APPROVED">Approve</option>
            <option value="REJECTED">Reject</option>
          </select>
          <textarea
            placeholder="Reason (optional)"
            className="border border-gray-300 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: "#4B5320" }}
            onClick={handleApprovalOrRejection}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Decision"}
          </button>
        </div>
      </div>
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

  const [filterText, setFilterText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("jobTitle");

  const { token, role } = useAuth();

  const fetchApplications = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setApplications(data.data || []);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    }
  };

  useEffect(() => {
    if (role !== "HR") return;
    fetchApplications();
  }, [role]);

  // Filter for summary cards only
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      let filterValue = "";

      if (selectedFilter === "jobTitle") filterValue = app.jobTitle || "";
      else if (selectedFilter === "applicant")
        filterValue = app.user.username || "";
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

        {/* Filter */}
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

        {/* Table */}
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
              {applications.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-6 text-gray-500">
                    No applications
                  </td>
                </tr>
              )}

              {applications.map((app, idx) => (
                <tr
                  key={app.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">{idx + 1}</td>
                  <td className="p-3 font-semibold text-gray-800">
                    {app.user.username}
                  </td>
                  <td className="p-3">{app.jobTitle}</td>
                  <td className="p-3 text-sm text-gray-600">
                    {app.user.email || "N/A"}
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
              ))}
            </tbody>
          </table>
        </div>

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
