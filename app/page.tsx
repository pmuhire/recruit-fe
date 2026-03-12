"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Job {
  id: number;
  title: string;
  department: string;
  status: "Open" | "Closed";
}

export default function LandingPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<"All" | "Open" | "Closed">("All");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        setJobs(data);
      } catch {
        // Dummy data if API fails
        setJobs([
          { id: 1, title: "Software Engineer", department: "Engineering", status: "Open" },
          { id: 2, title: "Backend Developer", department: "Engineering", status: "Open" },
          { id: 3, title: "UI/UX Designer", department: "Design", status: "Closed" },
          { id: 4, title: "Cyber Security Analyst", department: "Security", status: "Open" },
          { id: 5, title: "DevOps Engineer", department: "Infrastructure", status: "Closed" },
          { id: 6, title: "Data Analyst", department: "Data", status: "Open" },
        ]);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on selected filter
  const filteredJobs = jobs.filter((job) =>
    filter === "All" ? true : job.status === filter
  );

  return (
    <div className="max-w-6xl mx-auto py-4 px-4">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Available Jobs</h1>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6">
        {(["All", "Open", "Closed"] as const).map((status) => (
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

      {/* Job cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition bg-white"
          >
            <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
            <p className="text-gray-500 mt-1">{job.department}</p>

            {/* Status */}
            <p
              className={`mt-2 font-medium ${
                job.status === "Open" ? "text-[#4B5320]" : "text-gray-500"
              }`}
            >
              {job.status}
            </p>

            {/* Apply Button */}
            <Link
              href={job.status === "Open" ? `/jobs/${job.id}/` : "#"}
              className={`mt-4 block text-center py-2 rounded-md font-medium transition ${
                job.status === "Open"
                  ? "bg-[#4B5320] text-white hover:bg-[#3f461c]"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Apply
            </Link>
          </div>
        ))}

        {/* Message if no jobs */}
        {filteredJobs.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No jobs found for "{filter}"
          </p>
        )}
      </div>
    </div>
  );
}