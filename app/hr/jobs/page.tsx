"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

interface Job {
  id: number;
  title: string;
  department: string;
  status: "Open" | "Closed";
}

interface Application {
  id: number;
  jobId: number;
  applicant: string;
  status: "Approved" | "Rejected" | "Pending";
}

// Modal Component for Create & Edit
function JobModal({
  isOpen,
  onClose,
  onSubmit,
  initialJob,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (job: Omit<Job, "id">, id?: number) => void;
  initialJob?: Job & { description?: string };
}) {
  const [title, setTitle] = useState(initialJob?.title || "");
  const [description, setDescription] = useState(initialJob?.description || "");
  const [status, setStatus] = useState<"Open" | "Closed">(
    initialJob?.status || "Open",
  );

  const handleSubmit = () => {
    if (!title || !description) return;
    onSubmit({ title, department: description, status }, initialJob?.id); // Using "department" field for description in Job interface
    setTitle("");
    setDescription("");
    setStatus("Open");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {initialJob ? "Edit Job" : "Create Job"}
        </h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Heading"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="border border-gray-300 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          <select
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            value={status}
            onChange={(e) => setStatus(e.target.value as "Open" | "Closed")}
          >
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: "#4B5320" }}
            onClick={handleSubmit}
          >
            {initialJob ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);

  useEffect(() => {
    const dummyJobs: Job[] = [
      { id: 1, title: "Frontend Developer", department: "IT", status: "Open" },
      { id: 2, title: "Backend Developer", department: "IT", status: "Closed" },
      { id: 3, title: "UI/UX Designer", department: "Design", status: "Open" },
    ];
    setJobs(dummyJobs);

    const dummyApplications: Application[] = [
      { id: 1, jobId: 1, applicant: "Alice", status: "Approved" },
      { id: 2, jobId: 2, applicant: "Bob", status: "Rejected" },
      { id: 3, jobId: 3, applicant: "Charlie", status: "Pending" },
      { id: 4, jobId: 1, applicant: "David", status: "Approved" },
    ];
    setApplications(dummyApplications);
  }, []);

  const handleCreateOrEditJob = (job: Omit<Job, "id">, id?: number) => {
    if (id) {
      setJobs(jobs.map((j) => (j.id === id ? { ...j, ...job } : j)));
    } else {
      const newJob = {
        ...job,
        id: jobs.length ? jobs[jobs.length - 1].id + 1 : 1,
      };
      setJobs([...jobs, newJob]);
    }
  };

  // Pie chart for jobs
  const jobsPieData = {
    labels: ["Open", "Closed"],
    datasets: [
      {
        data: [
          jobs.filter((j) => j.status === "Open").length,
          jobs.filter((j) => j.status === "Closed").length,
        ],
        backgroundColor: ["#4ade80", "#f87171"],
        hoverOffset: 6,
      },
    ],
  };

  // Bar chart for applications per job
  const applicationsByJob = jobs.map((job) => {
    const apps = applications.filter((a) => a.jobId === job.id);
    return {
      job: job.title,
      approved: apps.filter((a) => a.status === "Approved").length,
      rejected: apps.filter((a) => a.status === "Rejected").length,
      pending: apps.filter((a) => a.status === "Pending").length,
    };
  });

  const applicationsBarData = {
    labels: applicationsByJob.map((a) => a.job),
    datasets: [
      {
        label: "Approved",
        data: applicationsByJob.map((a) => a.approved),
        backgroundColor: "#4ade80",
      },
      {
        label: "Rejected",
        data: applicationsByJob.map((a) => a.rejected),
        backgroundColor: "#f87171",
      },
      {
        label: "Pending",
        data: applicationsByJob.map((a) => a.pending),
        backgroundColor: "#fbbf24",
      },
    ],
  };

  const chartOptions = {
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    maintainAspectRatio: false,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Jobs Management</h1>

        <button
          className="mb-6 px-4 py-2 rounded text-white"
          style={{ backgroundColor: "#4B5320" }}
          onClick={() => {
            setEditJob(null);
            setModalOpen(true);
          }}
        >
          Create New Job
        </button>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-4 flex flex-col h-56 min-h-0">
            <h2 className="text-xl font-semibold mb-2">Jobs Status</h2>
            <div className="flex-1 min-h-0">
              <Pie
                data={jobsPieData}
                options={chartOptions}
                className="w-full h-full"
              />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col h-56 min-h-0">
            <h2 className="text-xl font-semibold mb-2">Applications per Job</h2>
            <div className="flex-1 min-h-0">
              <Bar
                data={applicationsBarData}
                options={chartOptions}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 ">ID</th>
                <th className="p-3">Heading</th>
                <th className="p-3 ">Description</th>
                <th className="p-3 ">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, idx) => (
                <tr
                  key={job.id}
                  className={
                    idx % 2 === 0
                      ? "bg-white hover:bg-gray-50"
                      : "bg-gray-50 hover:bg-gray-100"
                  }
                >
                  <td className="p-3">{job.id}</td>
                  <td className="p-3 font-semibold">{job.title}</td>
                  <td className="p-3 ">{job.department}</td>{" "}
                  {/* department used as description */}
                  <td
                    className={`p-3  font-semibold ${
                      job.status === "Open" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {job.status}
                  </td>
                  <td className="p-3 ">
                    <button
                      className="px-3 py-1 rounded text-white hover:opacity-90 transition"
                      style={{ backgroundColor: "#4B5320" }}
                      onClick={() => {
                        setEditJob(job);
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        <JobModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreateOrEditJob}
          initialJob={editJob || undefined}
        />
      </div>
    </div>
  );
}
