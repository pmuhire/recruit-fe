"use client";

import { useState, useEffect } from "react";

interface Application {
  id: number;
  jobTitle: string;
  status: "Approved" | "Pending" | "Rejected";
  appliedAt: string;
  description: string;
  cv: string;
}

const STATUS_COLORS: Record<Application["status"], string> = {
  Approved: "bg-teal-500",
  Pending: "bg-amber-500",
  Rejected: "bg-rose-500",
};

export default function ApplicantDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<"All" | Application["status"]>("All");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    // Dummy data for preview
    const dummyData: Application[] = [
      {
        id: 1,
        jobTitle: "Frontend Developer",
        status: "Pending",
        appliedAt: "2026-03-10",
        description: "Develop and maintain frontend features with React and Next.js",
        cv: "John_Doe_CV.pdf",
      },
      {
        id: 2,
        jobTitle: "Backend Developer",
        status: "Approved",
        appliedAt: "2026-03-08",
        description: "Work on REST APIs, database schemas, and server-side logic",
        cv: "Jane_Smith_CV.pdf",
      },
      {
        id: 3,
        jobTitle: "UI/UX Designer",
        status: "Rejected",
        appliedAt: "2026-03-05",
        description: "Design user interfaces and ensure a smooth user experience",
        cv: "Alice_W_CV.pdf",
      },
    ];
    setApplications(dummyData);
  }, []);

  const filteredApps =
    filter === "All" ? applications : applications.filter((a) => a.status === filter);

  const total = applications.length;
  const approved = applications.filter((a) => a.status === "Approved").length;
  const pending = applications.filter((a) => a.status === "Pending").length;
  const rejected = applications.filter((a) => a.status === "Rejected").length;

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
        {(["All", "Approved", "Pending", "Rejected"] as const).map((status) => (
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
              onClick={() => setSelectedApp(app)}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
            >
              <h2 className="font-bold text-xl mb-2 text-gray-800">{app.jobTitle}</h2>
              <p className="text-gray-500 mb-3">
                Applied on: {new Date(app.appliedAt).toLocaleDateString()}
              </p>
              <span
                className={`px-3 py-1 rounded-md text-white font-semibold ${
                  STATUS_COLORS[app.status]
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

      {/* Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl"
              onClick={() => setSelectedApp(null)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedApp.jobTitle}</h2>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Applied on:</span>{" "}
              {new Date(selectedApp.appliedAt).toLocaleDateString()}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded-full text-white ${
                  STATUS_COLORS[selectedApp.status]
                }`}
              >
                {selectedApp.status}
              </span>
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Job Description:</span>{" "}
              {selectedApp.description}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">CV:</span> {selectedApp.cv}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}