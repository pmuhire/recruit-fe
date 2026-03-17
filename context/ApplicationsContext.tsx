"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export interface User {
  id: number;
  username: string;
  email?: string;
  role?: string;
}

export interface Document {
  id: number;
  fileName: string;
  fileUrl: string;
}

export interface Application {
  id: number;
  user: User;
  jobId: number;
  jobTitle: string;
  status: "APPROVED" | "REJECTED" | "PENDING";
  reviewReason?: string;
  submittedAt: string;
  documents?: Document[];
}

interface ApplicationsContextType {
  applications: Application[];
  fetchApplications: () => Promise<void>;
  updateApplication: (id: number, status: "APPROVED" | "REJECTED", reason?: string) => void;
  loading: boolean;
}

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined);

export const ApplicationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, role } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchApplications = async () => {
    if (!token || role !== "HR") return;

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : { data: [] };

      setApplications(data.data || []);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const updateApplication = (id: number, status: "APPROVED" | "REJECTED", reason?: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status, reviewReason: reason } : app
      )
    );
  };

  useEffect(() => {
    fetchApplications();
  }, [token, role]);

  return (
    <ApplicationsContext.Provider
      value={{ applications, fetchApplications, updateApplication, loading }}
    >
      {children}
    </ApplicationsContext.Provider>
  );
};

export const useApplications = () => {
  const context = useContext(ApplicationsContext);
  if (!context) throw new Error("useApplications must be used within ApplicationsProvider");
  return context;
};