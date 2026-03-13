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
            className="p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition bg-white"
          >
            <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
            <p className="text-gray-500 mt-1">{job.description}</p>
            <p className="text-gray-500 mt-1 italic text-sm">
              Requirements: {job.requirements}
            </p>
            <p className="mt-2 text-gray-400 text-sm">
              Posted on: {new Date(job.createdAt).toLocaleDateString()}
            </p>

            <p
              className={`mt-2 font-medium ${
                job.status === "OPEN" ? "text-[#4B5320]" : "text-gray-500"
              }`}
            >
              {job.status}
            </p>

            <Link
              href={job.status === "OPEN" ? `/jobs/${job.id}` : `/jobs/${job.id}`}
              className={`mt-4 block text-center py-2 rounded-md font-medium transition ${
                job.status === "OPEN"
                  ? "bg-[#4B5320] text-white hover:bg-[#3f461c]"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Apply
            </Link>
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
