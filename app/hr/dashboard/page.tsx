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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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
  department: string;
  status: "Open" | "Closed";
  createdAt: string;
}

interface Application {
  id: number;
  jobTitle: string;
  applicant: string;
  status: "Approved" | "Rejected" | "Pending";
  appliedAt: string; // for chart over time
}
const chartOptions = {
  plugins: { legend: { display: false }, tooltip: { enabled: true } },
  maintainAspectRatio: false,
};
export default function HRDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const dummyJobs: Job[] = [
      {
        id: 1,
        title: "Frontend Developer",
        department: "IT",
        status: "Open",
        createdAt: "2026-03-01",
      },
      {
        id: 2,
        title: "Backend Developer",
        department: "IT",
        status: "Closed",
        createdAt: "2026-03-05",
      },
      {
        id: 3,
        title: "UI/UX Designer",
        department: "Design",
        status: "Open",
        createdAt: "2026-03-08",
      },
    ];
    setJobs(dummyJobs);

    const dummyApplications: Application[] = [
      {
        id: 1,
        jobTitle: "Frontend Developer",
        applicant: "Alice",
        status: "Approved",
        appliedAt: "2026-03-02",
      },
      {
        id: 2,
        jobTitle: "Backend Developer",
        applicant: "Bob",
        status: "Rejected",
        appliedAt: "2026-03-06",
      },
      {
        id: 3,
        jobTitle: "UI/UX Designer",
        applicant: "Charlie",
        status: "Pending",
        appliedAt: "2026-03-09",
      },
      {
        id: 4,
        jobTitle: "Frontend Developer",
        applicant: "David",
        status: "Approved",
        appliedAt: "2026-03-10",
      },
    ];
    setApplications(dummyApplications);
  }, []);

  // Job stats
  const totalJobs = jobs.length;
  const openJobs = jobs.filter((j) => j.status === "Open").length;
  const closedJobs = jobs.filter((j) => j.status === "Closed").length;

  // Application stats
  const totalApplications = applications.length;
  const approvedApps = applications.filter(
    (a) => a.status === "Approved",
  ).length;
  const rejectedApps = applications.filter(
    (a) => a.status === "Rejected",
  ).length;
  const pendingApps = applications.filter((a) => a.status === "Pending").length;

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
  const appsByDate = applications.reduce<
    Record<string, { approved: number; rejected: number; pending: number }>
  >((acc, app) => {
    if (!acc[app.appliedAt])
      acc[app.appliedAt] = { approved: 0, rejected: 0, pending: 0 };
    acc[app.appliedAt][
      app.status.toLowerCase() as "approved" | "rejected" | "pending"
    ] += 1;
    return acc;
  }, {});

  const appDates = Object.keys(appsByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  const appsLineData = {
    labels: appDates,
    datasets: [
      {
        label: "Approved",
        data: appDates.map((d) => appsByDate[d].approved),
        borderColor: "#4ade80",
        backgroundColor: "#4ade80",
        tension: 0.3,
      },
      {
        label: "Rejected",
        data: appDates.map((d) => appsByDate[d].rejected),
        borderColor: "#f87171",
        backgroundColor: "#f87171",
        tension: 0.3,
      },
      {
        label: "Pending",
        data: appDates.map((d) => appsByDate[d].pending),
        borderColor: "#fbbf24",
        backgroundColor: "#fbbf24",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />
      <div className="flex-1 p-4 sm:p-6">
        <h1 className="text-3xl font-bold mb-6">HR Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
          <Card title="Total Jobs" value={totalJobs.toString()} />
          <Card title="Open Jobs" value={openJobs.toString()} />
          <Card title="Closed Jobs" value={closedJobs.toString()} />
          <Card
            title="Total Applications"
            value={totalApplications.toString()}
          />
          <Card title="Approved Applications" value={approvedApps.toString()} />
          <Card title="Rejected Applications" value={rejectedApps.toString()} />
        </div>

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
            <h2 className="text-xl font-semibold mb-2">Applications Trend</h2>
            <div className="flex-1 min-h-0">
              <Line
                data={appsLineData}
                options={chartOptions}
                className="h-40 md:h-48"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
