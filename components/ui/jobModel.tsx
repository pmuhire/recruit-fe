"use client";

import { useEffect, useState } from "react";

export interface Job {
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

export default function JobModal({
  isOpen,
  onClose,
  onSubmit,
  jobToEdit,
}: JobModalProps) {
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