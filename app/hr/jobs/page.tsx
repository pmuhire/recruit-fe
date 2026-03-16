"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  status: "OPEN" | "CLOSED";
}

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (job: Omit<Job, "id">, jobId?: number) => void;
  jobToEdit?: Job | null;
}

function JobModal({ isOpen, onClose, onSubmit, jobToEdit }: JobModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [status, setStatus] = useState<"OPEN" | "CLOSED">("OPEN");

  useEffect(() => {
    if (jobToEdit) {
      setTitle(jobToEdit.title);
      setDescription(jobToEdit.description);
      setRequirements(jobToEdit.requirements);
      setStatus(jobToEdit.status);
    } else {
      setTitle("");
      setDescription("");
      setRequirements("");
      setStatus("OPEN");
    }
  }, [jobToEdit]);

  const handleSubmit = () => {
    if (!title || !description || !requirements) return;
    onSubmit({ title, description, requirements, status }, jobToEdit?.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow">
        <h2 className="text-xl font-bold mb-4">
          {jobToEdit ? "Edit Job" : "Create Job"}
        </h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Job Title"
            className="border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <textarea
            placeholder="Requirements"
            className="border p-2 rounded"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
          />
          <select
            className="border p-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value as "OPEN" | "CLOSED")}
          >
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 text-white rounded"
            style={{ backgroundColor: "#4B5320" }}
            onClick={handleSubmit}
          >
            {jobToEdit ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null);

  // New state for filtered jobs
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [filterText, setFilterText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("title");

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    // Filter jobs whenever `filterText` or `selectedFilter` changes
    if (filterText) {
      setFilteredJobs(
        jobs.filter((job) =>
          selectedFilter === "title"
            ? job.title.toLowerCase().includes(filterText.toLowerCase())
            : selectedFilter === "status"
            ? job.status.toLowerCase().includes(filterText.toLowerCase())
            : job.description.toLowerCase().includes(filterText.toLowerCase())
        )
      );
    } else {
      setFilteredJobs(jobs);
    }
  }, [filterText, selectedFilter, jobs]);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/all`);
      const data = await res.json();
      setJobs(data.data || []);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    }
  };

  const handleSubmitJob = async (job: Omit<Job, "id">, jobId?: number) => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (role !== "HR") {
        alert("Only HR can manage jobs");
        return;
      }

      let res;
      if (jobId) {
        // Update job
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(job),
        });
      } else {
        // Create job
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(job),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit job");
      }

      if (jobId) {
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, ...job } : j))
        );
      } else {
        setJobs((prev) => [...prev, data.data]);
      }

      setJobToEdit(null);
    } catch (error) {
      console.error("Job submit error:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Jobs Management</h1>

        {/* Filter dropdown and input */}
        <div className="flex mb-6 gap-4">
          <select
            className="p-2 border rounded"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="status">Status</option>
            <option value="description">Description</option>
          </select>
          <input
            type="text"
            className="p-2 border rounded"
            placeholder={`Filter by ${selectedFilter}`}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        <button
          className="mb-6 px-4 py-2 rounded text-white"
          style={{ backgroundColor: "#4B5320" }}
          onClick={() => {
            setJobToEdit(null);
            setModalOpen(true);
          }}
        >
          Create Job
        </button>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Requirements</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">{job.id}</td>
                  <td className="p-3 font-semibold">{job.title}</td>
                  <td className="p-3">{job.description}</td>
                  <td className="p-3">{job.requirements}</td>
                  <td className="p-3">
                    <span
                      className={`font-semibold ${
                        job.status === "OPEN" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      className="px-3 py-1 text-white rounded"
                      style={{ backgroundColor: "#4B5320" }}
                      onClick={() => {
                        setJobToEdit(job);
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

        <JobModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmitJob}
          jobToEdit={jobToEdit}
        />
      </div>
    </div>
  );
}