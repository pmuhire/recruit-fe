"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  status: "OPEN" | "CLOSED";
  createdAt: string;
}

export default function LandingPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<"ALL" | "OPEN" | "CLOSED">("ALL");
  const [loading, setLoading] = useState(true);

  // Restrict page to APPLICANT only
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "APPLICANT") {
      router.replace("/login");
    }
  }, [router]);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(
          "https://recruit-be-production.up.railway.app/jobs/all",
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const response = await res.json();

        if (res.ok && response.success) {
          setJobs(response.data);
          setError("");
        } else {
          setJobs([]);
          setError(response.message || "Failed to fetch jobs");
        }
      } catch (err) {
        setJobs([]);
        setError("Unable to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) =>
    filter === "ALL" ? true : job.status === filter,
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-4 px-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Available Jobs</h1>

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
                Posted on: {new Date(job.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm line-clamp-3">
              {job.description}
            </p>

            {/* Requirements */}
            <p className="text-gray-500 text-sm italic mt-2 line-clamp-2">
              {job.requirements}
            </p>

            {/* Spacer */}
            <div className="flex-grow" />

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between">
              {/* Status Badge */}
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  job.status === "OPEN"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {job.status}
              </span>

              {/* Apply Button */}
              <Link
                href={`/jobs/${job.id}`}
                className={`px-4 py-2 text-sm rounded-md font-medium transition ${
                  job.status === "OPEN"
                    ? "bg-[#4B5320] text-white hover:bg-[#3f461c]"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
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
