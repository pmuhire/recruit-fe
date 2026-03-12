"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function JobDetails() {
  const params = useParams();
  const jobId = params.id;

  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    const jobs = [
      {
        id: "1",
        title: "Software Engineer",
        department: "Engineering",
        description:
          "We are looking for a software engineer to design, develop, and maintain scalable applications. The candidate should be comfortable working with modern frameworks and backend systems.",
        requirements: [
          "Strong knowledge of JavaScript or Java",
          "Experience with REST APIs",
          "Understanding of databases",
          "Good problem-solving skills",
        ],
      },
      {
        id: "2",
        title: "Cyber Security Analyst",
        department: "Security",
        description:
          "Responsible for monitoring systems, identifying vulnerabilities, and protecting infrastructure against cyber threats.",
        requirements: [
          "Knowledge of network security",
          "Experience with penetration testing",
          "Understanding of cybersecurity tools",
        ],
      },
    ];

    const found = jobs.find((j) => j.id === jobId);
    setJob(found);
  }, [jobId]);

  if (!job) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto py-4 px-4">
      {/* Card Container */}
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
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            {job.requirements.map((req: string, index: number) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>

        {/* Apply Section */}
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
              className="bg-[#4B5320] text-white px-6 py-2 rounded hover:bg-[#3f461c] transition"
            >
              Submit Application
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}