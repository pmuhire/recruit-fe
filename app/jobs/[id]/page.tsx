"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Job {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string; // plain text
  status: "OPEN" | "CLOSED";
  createdAt: string;
}

export default function JobDetails() {
  const params = useParams();
  const jobId = params.id;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(
          `https://recruit-be-production.up.railway.app/jobs/${jobId}`,
          { headers }
        );

        const response = await res.json();

        if (res.ok && response.success) {
          setJob(response.data);
        } else {
          setJob(null);
          setError(response.message || "Failed to fetch job details");
        }
      } catch (err) {
        console.error("Error fetching job:", err);
        setJob(null);
        setError("Unable to fetch job. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!job) return <p className="text-center mt-10">Job not found</p>;

  return (
    <div className="max-w-3xl mx-auto py-4 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 mb-10">
        {/* Job Header */}
        <div className="border-b pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
          <span className="inline-block mt-2 px-3 py-1 text-sm rounded bg-gray-100 text-gray-600">
            {job.department}
          </span>
        </div>

        {/* Job Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Job Description</h2>
          <p className="text-gray-700 leading-relaxed">{job.description}</p>
        </div>

        {/* Requirements */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Requirements</h2>
          <p className="text-gray-700">{job.requirements}</p>
        </div>

        {/* Apply Section */}
        {job.status === "OPEN" ? (
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Apply for this Job</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-[#4B5320]"
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-[#4B5320]"
              />

              <textarea
                placeholder="Short motivation..."
                rows={4}
                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-[#4B5320]"
              />

              <input
                type="file"
                className="w-full border border-gray-300 p-3 rounded"
              />

              <button
                type="submit"
                className="bg-[#4B5320] text-white px-6 py-2 rounded hover:bg-[#3f461c] transition"
              >
                Submit Application
              </button>
            </form>
          </div>
        ) : (
          <p className="text-center mt-4 text-red-500 font-medium">
            This position is closed.
          </p>
        )}
      </div>
    </div>
  );
}