"use client";

import { useState, useEffect } from "react";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import Card from "@/components/ui/Card";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

interface Job {
  id: number;
  title: string;
  description: string;
  department: string;
  location: string;
  status: "OPEN" | "CLOSED";
  createdAt: string;
  updatedAt?: string;
}

interface Application {
  id: number;
  jobTitle: string;
  applicant: string;
  status: "APPROVED" | "REJECTED" | "PENDING";
  appliedAt: string; // for chart
}

const chartOptions = {
  plugins: { legend: { display: false }, tooltip: { enabled: true } },
  maintainAspectRatio: false,
};

export default function HRDashboard() {
  const { token } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;
      try {
        // Fetch Jobs
        const jobsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/all`);
        const jobsData = await jobsRes.json();
        setJobs(jobsData.data || []);

        // Fetch Applications
        const appsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const appsData = await appsRes.json();
        setApplications(appsData.data || []);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setJobs([]);
        setApplications([]);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) return <p className="p-6">Loading dashboard...</p>;

  // Ensure arrays are always defined
  const jobsList = jobs || [];
  const applicationsList = applications || [];

  // Job stats
  const totalJobs = jobsList.length;
  const openJobs = jobsList.filter((j) => j.status === "OPEN").length;
  const closedJobs = jobsList.filter((j) => j.status === "CLOSED").length;

  // Application stats
  const totalApplications = applicationsList.length;
  const APPROVEDApps = applicationsList.filter((a) => a.status === "APPROVED").length;
  const REJECTEDApps = applicationsList.filter((a) => a.status === "REJECTED").length;
  const PENDINGApps = applicationsList.filter((a) => a.status === "PENDING").length;

  // Pie chart for jobs
  const jobsPieData = {
    labels: ["Open", "Closed"],
    datasets: [
      {
        data: [openJobs, closedJobs],
        backgroundColor: ["#4ade80", "#f87171"],
        hoverOffset: 6,
      },
    ],
  };

  // Line chart for applications
  const appsByDate = applicationsList.reduce<
    Record<string, { APPROVED: number; REJECTED: number; PENDING: number }>
  >((acc, app) => {
    if (!acc[app.appliedAt]) acc[app.appliedAt] = { APPROVED: 0, REJECTED: 0, PENDING: 0 };
    acc[app.appliedAt][
      app.status.toLowerCase() as "APPROVED" | "REJECTED" | "PENDING"
    ] += 1;
    return acc;
  }, {});

  const appDates = Object.keys(appsByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const appsLineData = {
    labels: appDates,
    datasets: [
      {
        label: "Approved",
        data: appDates.map((d) => appsByDate[d].APPROVED),
        borderColor: "#4ade80",
        backgroundColor: "#4ade80",
        tension: 0.3,
      },
      {
        label: "Rejected",
        data: appDates.map((d) => appsByDate[d].REJECTED),
        borderColor: "#f87171",
        backgroundColor: "#f87171",
        tension: 0.3,
      },
      {
        label: "Pending",
        data: appDates.map((d) => appsByDate[d].PENDING),
        borderColor: "#fbbf24",
        backgroundColor: "#fbbf24",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
      <div className="flex-1 p-4 sm:p-6">
        <h1 className="text-3xl font-bold mb-6">HR Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
          <Card title="Total Jobs" value={totalJobs.toString()} />
          <Card title="Open Jobs" value={openJobs.toString()} />
          <Card title="Closed Jobs" value={closedJobs.toString()} />
          <Card title="Total Applications" value={totalApplications.toString()} />
          <Card title="Approved Applications" value={APPROVEDApps.toString()} />
          <Card title="Rejected Applications" value={REJECTEDApps.toString()} />
          <Card title="Pending Applications" value={PENDINGApps.toString()} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-4 flex flex-col h-56 min-h-0">
            <h2 className="text-xl font-semibold mb-2">Jobs Status</h2>
            <div className="flex-1 min-h-0">
              <Pie data={jobsPieData} options={chartOptions} className="w-full h-full" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex flex-col h-56 min-h-0">
            <h2 className="text-xl font-semibold mb-2">Applications Trend</h2>
            <div className="flex-1 min-h-0">
              <Line data={appsLineData} options={chartOptions} className="h-40 md:h-48" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}