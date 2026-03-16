"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Application {
  id: number;
  userId: number;
  jobId: number | null;
  jobTitle: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewReason: string | null;
  submittedAt: string;
}

const STATUS_COLORS: Record<Application["status"], string> = {
  APPROVED: "bg-teal-500",
  PENDING: "bg-amber-500",
  REJECTED: "bg-rose-500",
};

export default function ApplicantDashboard() {
  const { userId, token } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<"All" | Application["status"]>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      if (!userId || !token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/applications/user?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();

        if (!data.success) {
          setError(data.message || "Failed to fetch applications");
          setApplications([]);
        } else {
          setApplications(data.data || []);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [userId, token]);

  const filteredApps =
    filter === "All"
      ? applications
      : applications.filter((a) => a.status === filter);

  const total = applications.length;
  const approved = applications.filter((a) => a.status === "APPROVED").length;
  const pending = applications.filter((a) => a.status === "PENDING").length;
  const rejected = applications.filter((a) => a.status === "REJECTED").length;

  if (loading)
    return <p className="text-center">Loading applications...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto my-8">
      <h1 className="text-3xl font-bold text-gray-800">My Applications</h1>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 font-medium">Total Applications</p>
          <p className="text-2xl font-bold">{total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 font-medium">Approved</p>
          <p className="text-teal-500 text-2xl font-bold">{approved}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 font-medium">Pending</p>
          <p className="text-amber-500 text-2xl font-bold">{pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 font-medium">Rejected</p>
          <p className="text-rose-500 text-2xl font-bold">{rejected}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        {(["All", "APPROVED", "PENDING", "REJECTED"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded font-medium transition ${
              filter === status
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Application Cards */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {filteredApps.length > 0 ? (
          filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
            >
              {/* Job Title */}
              <h2 className="font-bold text-xl mb-2 text-gray-800">
                {app.jobTitle || "Unknown Job"}
              </h2>

              {/* Submission Date */}
              <p className="text-gray-500 mb-3">
                Applied on: {new Date(app.submittedAt).toLocaleDateString()}
              </p>

              {/* Status */}
              <span
                className={`px-3 py-1 rounded-md text-white font-semibold ${
                  STATUS_COLORS[app.status] || "bg-gray-500"
                }`}
              >
                {app.status}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No applications found for "{filter}" status.
          </p>
        )}
      </div>
    </div>
  );
}
