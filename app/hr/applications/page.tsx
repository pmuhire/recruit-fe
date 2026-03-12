"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Card from "@/components/ui/Card";

interface Job {
  id: number;
  title: string;
  description?: string;
}

interface Application {
  id: number;
  jobId: number;
  applicant: string;
  status: "Approved" | "Rejected" | "Pending";
  reason?: string;
  email?: string;
  phone?: string;
  cvUrl?: string; // URL to the uploaded CV
}

// Review / Decide Modal with CV
function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
  application,
  job,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (status: "Approved" | "Rejected", reason: string) => void;
  application: Application | null;
  job: Job | null;
}) {
  const [decision, setDecision] = useState<"Approved" | "Rejected">("Approved");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!application) return;
    setDecision("Approved");
    setReason("");
  }, [application]);

  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">Review Application</h2>

        {/* Applicant Info */}
        <div className="mb-4 space-y-1">
          <p><span className="font-semibold">Applicant:</span> {application.applicant}</p>
          {application.email && <p><span className="font-semibold">Email:</span> {application.email}</p>}
          {application.phone && <p><span className="font-semibold">Phone:</span> {application.phone}</p>}
          <p><span className="font-semibold">Job:</span> {job?.title || "Unknown"}</p>
          {job?.description && <p><span className="font-semibold">Job Description:</span> {job.description}</p>}
          <p><span className="font-semibold">Current Status:</span> {application.status}</p>
          {application.cvUrl && (
            <p>
              <span className="font-semibold">CV:</span>{" "}
              <a
                href={application.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View / Download
              </a>
            </p>
          )}
        </div>

        {/* Decision */}
        <div className="flex flex-col gap-3 mb-4">
          <select
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={decision}
            onChange={(e) => setDecision(e.target.value as "Approved" | "Rejected")}
          >
            <option value="Approved">Approve</option>
            <option value="Rejected">Reject</option>
          </select>
          <textarea
            placeholder="Reason (optional)"
            className="border border-gray-300 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />
        </div>

        {/* Buttons */}
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
            onClick={() => onSubmit(decision, reason)}
          >
            Decide
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Page
export default function PendingApplicationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    const dummyJobs: Job[] = [
      { id: 1, title: "Frontend Developer", description: "Build awesome UIs" },
      { id: 2, title: "Backend Developer", description: "Build APIs and manage DBs" },
      { id: 3, title: "UI/UX Designer", description: "Design user-friendly interfaces" },
    ];
    setJobs(dummyJobs);

    const dummyApplications: Application[] = [
      { id: 1, jobId: 1, applicant: "Alice", status: "Approved", email: "alice@mail.com" },
      { id: 2, jobId: 2, applicant: "Bob", status: "Rejected", phone: "123-456-7890" },
      { id: 3, jobId: 3, applicant: "Charlie", status: "Pending", email: "charlie@mail.com", cvUrl: "/cvs/charlie.pdf" },
      { id: 4, jobId: 1, applicant: "David", status: "Pending", phone: "987-654-3210", cvUrl: "/cvs/david.pdf" },
    ];
    setApplications(dummyApplications);
  }, []);

  const pendingApplications = applications.filter((a) => a.status === "Pending");

  const handleDecide = (status: "Approved" | "Rejected", reason: string) => {
    if (!selectedApplication) return;
    setApplications(
      applications.map((a) =>
        a.id === selectedApplication.id ? { ...a, status, reason } : a
      )
    );
    setModalOpen(false);
    setSelectedApplication(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Pending Applications</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card title="Total Pending" value={pendingApplications.length.toString()} />
          <Card title="Total Approved" value={applications.filter((a) => a.status === "Approved").length.toString()} />
          <Card title="Total Rejected" value={applications.filter((a) => a.status === "Rejected").length.toString()} />
        </div>

        {/* Pending Applications Table */}
        <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b">ID</th>
                <th className="p-3 border-b">Applicant</th>
                <th className="p-3 border-b">Job</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingApplications.map((app, idx) => {
                const job = jobs.find((j) => j.id === app.jobId);
                return (
                  <tr
                    key={app.id}
                    className={idx % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"}
                  >
                    <td className="p-3 border-b">{app.id}</td>
                    <td className="p-3 border-b font-semibold">{app.applicant}</td>
                    <td className="p-3 border-b">{job?.title || "Unknown"}</td>
                    <td className="p-3 border-b text-yellow-600 font-semibold">{app.status}</td>
                    <td className="p-3 border-b">
                      <button
                        className="px-3 py-1 rounded text-white hover:opacity-90 transition"
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
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Review Modal */}
        <ReviewModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleDecide}
          application={selectedApplication}
          job={selectedApplication ? jobs.find((j) => j.id === selectedApplication.jobId) || null : null}
        />
      </div>
    </div>
  );
}