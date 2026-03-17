"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import JobModal from "@/components/ui/jobModel";
import { useJobs,Job } from "@/context/JobContext";

export default function JobsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null);

  // Filtering
  const [filterText, setFilterText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("title");

  const { jobs, createJob, updateJob, loading } = useJobs();
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  useEffect(() => {
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

  const handleSubmitJob = (job: Omit<Job, "id">, jobId?: number) => {
    if (jobId) {
      updateJob(jobId, job);
    } else {
      createJob(job);
    }
    setJobToEdit(null);
    setModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Jobs Management</h1>

        {/* Filter */}
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

        {/* Loading spinner */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
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
                  <tr
                    key={job.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{job.id}</td>
                    <td className="p-3 font-semibold">{job.title}</td>
                    <td className="p-3">{job.description}</td>
                    <td className="p-3">{job.requirements}</td>
                    <td className="p-3">
                      <span
                        className={`font-semibold ${
                          job.status === "OPEN"
                            ? "text-green-600"
                            : "text-red-600"
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
        )}

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