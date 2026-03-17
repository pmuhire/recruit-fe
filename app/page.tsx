"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  status: "OPEN" | "CLOSED";
  createdAt: string;
}

// Simple Spinner Component (reusable)
function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-[#4B5320] rounded-full animate-spin" />
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { token, role } = useAuth();

  const [error, setError] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<"ALL" | "OPEN" | "CLOSED">("ALL");
  const [loading, setLoading] = useState(true);

  // ✅ Restrict page using context (NOT localStorage)
  useEffect(() => {
    if (!token || role !== "APPLICANT") {
      router.replace("/login");
    }
  }, [token, role, router]);

  // ✅ Fetch jobs safely
  useEffect(() => {
    if (!token) return;

    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/jobs/all`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // defensive (future-proof)
            },
          }
        );

        const response = await res.json();

        if (res.ok && response?.success && Array.isArray(response.data)) {
          setJobs(response.data);
          setError("");
        } else {
          setJobs([]);
          setError(response?.message || "Failed to fetch jobs");
        }
      } catch (err) {
        console.error(err);
        setJobs([]);
        setError("Unable to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  // ✅ Defensive filtering
  const filteredJobs = jobs.filter((job) =>
    filter === "ALL" ? true : job?.status === filter
  );

  // ✅ Loading state with spinner
  if (loading) return <Spinner />;

  return (
    <div className="max-w-6xl mx-auto py-4 px-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Available Jobs
      </h1>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6">
        {(["ALL", "OPEN", "CLOSED"] as const).map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded-md font-medium transition ${
              filter === status
                ? "bg-[#4B5320] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Job Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="p-5 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition bg-white flex flex-col h-full"
          >
            {/* Header */}
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                {job.title}
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                Posted on:{" "}
                {job.createdAt
                  ? new Date(job.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm line-clamp-3">
              {job.description || "No description"}
            </p>

            {/* Requirements */}
            <p className="text-gray-500 text-sm italic mt-2 line-clamp-2">
              {job.requirements || "No requirements listed"}
            </p>

            <div className="flex-grow" />

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between">
              {/* Status */}
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  job.status === "OPEN"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {job.status}
              </span>

              {/* Apply */}
              <Link
                href={`/jobs/${job.id}`}
                className={`px-4 py-2 text-sm rounded-md font-medium transition ${
                  job.status === "OPEN"
                    ? "bg-[#4B5320] text-white hover:bg-[#3f461c]"
                    : "bg-gray-300 text-gray-600 pointer-events-none"
                }`}
              >
                Apply
              </Link>
            </div>
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No jobs found for "{filter}"
          </p>
        )}
      </div>
    </div>
  );
}