"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  status: "OPEN" | "CLOSED";
}

interface JobsContextType {
  jobs: Job[];
  fetchJobs: () => Promise<void>;
  createJob: (job: Omit<Job, "id">) => Promise<void>;
  updateJob: (jobId: number, job: Omit<Job, "id">) => Promise<void>;
  loading: boolean;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const JobsProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/all`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : { data: [] };
      setJobs(data.data || []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (job: Omit<Job, "id">) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(job),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(data.message || "Failed to create job");

      setJobs((prev) => [...prev, data.data]);
    } catch (err) {
      console.error("Job creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateJob = async (jobId: number, job: Omit<Job, "id">) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(job),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(data.message || "Failed to update job");

      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, ...job } : j))
      );
    } catch (err) {
      console.error("Job update error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <JobsContext.Provider
      value={{ jobs, fetchJobs, createJob, updateJob, loading }}
    >
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) throw new Error("useJobs must be used within JobsProvider");
  return context;
};