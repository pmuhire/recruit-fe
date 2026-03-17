// "use client";

// import { useEffect, useState } from "react";
// import { Pie, Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// import Card from "@/components/ui/Card";
// import Sidebar from "@/components/Sidebar";
// import { useAuth } from "@/context/AuthContext";
// import { useJobs } from "@/context/JobContext";
// import { useApplications } from "@/context/ApplicationsContext";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const chartOptions = {
//   plugins: { legend: { display: true }, tooltip: { enabled: true } },
//   maintainAspectRatio: false,
// };

// export default function HRDashboard() {
//   const { token, loading: authLoading } = useAuth();
//   const { jobs, fetchJobs, loadingJobs } = useJobs();
//   const { applications, fetchApplications } = useApplications();

//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   useEffect(() => {
//     if (!authLoading && token) {
//       fetchJobs();
//       fetchApplications();
//     }
//   }, [authLoading, token]);

//   if (authLoading || loadingJobs) {
//     return <p className="p-6">Loading dashboard...</p>;
//   }

//   const jobsList = jobs || [];
//   const applicationsList = applications || [];

//   // Job stats
//   const totalJobs = jobsList.length;
//   const openJobs = jobsList.filter((j) => j.status === "OPEN").length;
//   const closedJobs = jobsList.filter((j) => j.status === "CLOSED").length;

//   // Application stats
//   const totalApplications = applicationsList.length;
//   const approved = applicationsList.filter((a) => a.status === "APPROVED").length;
//   const rejected = applicationsList.filter((a) => a.status === "REJECTED").length;
//   const pending = applicationsList.filter((a) => a.status === "PENDING").length;

//   // Pie Chart
//   const jobsPieData = {
//     labels: ["Open", "Closed"],
//     datasets: [
//       {
//         data: [openJobs, closedJobs],
//         backgroundColor: ["#4ade80", "#f87171"],
//       },
//     ],
//   };

//   // Line Chart
//   const appsByDate = applicationsList.reduce<
//     Record<string, { APPROVED: number; REJECTED: number; PENDING: number }>
//   >((acc, app) => {
//     if (!acc[app.appliedAt])
//       acc[app.appliedAt] = { APPROVED: 0, REJECTED: 0, PENDING: 0 };

//     acc[app.appliedAt][app.status] += 1;
//     return acc;
//   }, {});

//   const dates = Object.keys(appsByDate).sort(
//     (a, b) => new Date(a).getTime() - new Date(b).getTime()
//   );

//   const appsLineData = {
//     labels: dates,
//     datasets: [
//       {
//         label: "Approved",
//         data: dates.map((d) => appsByDate[d].APPROVED),
//         borderColor: "#4ade80",
//         tension: 0.3,
//       },
//       {
//         label: "Rejected",
//         data: dates.map((d) => appsByDate[d].REJECTED),
//         borderColor: "#f87171",
//         tension: 0.3,
//       },
//       {
//         label: "Pending",
//         data: dates.map((d) => appsByDate[d].PENDING),
//         borderColor: "#fbbf24",
//         tension: 0.3,
//       },
//     ],
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

//       <div className="flex-1 p-4 sm:p-6">
//         <h1 className="text-3xl font-bold mb-6">HR Dashboard</h1>

//         {/* Stats */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
//           <Card title="Total Jobs" value={totalJobs.toString()} />
//           <Card title="Open Jobs" value={openJobs.toString()} />
//           <Card title="Closed Jobs" value={closedJobs.toString()} />
//           <Card title="Total Applications" value={totalApplications.toString()} />
//           <Card title="Approved" value={approved.toString()} />
//           <Card title="Rejected" value={rejected.toString()} />
//           <Card title="Pending" value={pending.toString()} />
//         </div>

//         {/* Charts */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="bg-white rounded-lg shadow p-4 h-64">
//             <h2 className="text-lg font-semibold mb-2">Jobs Status</h2>
//             <Pie data={jobsPieData} options={chartOptions} />
//           </div>

//           <div className="bg-white rounded-lg shadow p-4 h-64">
//             <h2 className="text-lg font-semibold mb-2">Applications Trend</h2>
//             <Line data={appsLineData} options={chartOptions} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useJobs } from "@/context/JobContext";
import { useApplications } from "@/context/ApplicationsContext";
import Spinner from "@/components/ui/spinner";

import { useEffect } from "react";
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

import Sidebar from "@/components/Sidebar";
import Card from "@/components/ui/Card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  plugins: { legend: { display: true }, tooltip: { enabled: true } },
  maintainAspectRatio: false,
};

export default function HRDashboard() {
  const { jobs, fetchJobs, loading: jobsLoading } = useJobs();
  const { applications, fetchApplications, loading: appsLoading } = useApplications();

  const loading = jobsLoading || appsLoading;

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  if (loading) return <Spinner />;

  // Ensure arrays
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

  // Line chart for applications over time
  // Prepare line chart data safely
const appsByDate = applicationsList.reduce<
  Record<string, { APPROVED: number; REJECTED: number; PENDING: number }>
>((acc, app) => {
  // Ensure we have appliedAt and a valid status
  if (!app.submittedAt) return acc;

  const status = ["APPROVED", "REJECTED", "PENDING"].includes(app.status)
    ? app.status
    : "PENDING"; // default to PENDING if invalid

  const date = new Date(app.submittedAt).toLocaleDateString();

  if (!acc[date]) acc[date] = { APPROVED: 0, REJECTED: 0, PENDING: 0 };

  acc[date][status as "APPROVED" | "REJECTED" | "PENDING"] += 1;

  return acc;
}, {});

// Sort dates
const appDates = Object.keys(appsByDate).sort(
  (a, b) => new Date(a).getTime() - new Date(b).getTime()
);

// Line chart dataset
const appsLineData = {
  labels: appDates,
  datasets: [
    {
      label: "Approved",
      data: appDates.map((d) => appsByDate[d]?.APPROVED ?? 0),
      borderColor: "#4ade80",
      backgroundColor: "#4ade80",
      tension: 0.3,
    },
    {
      label: "Rejected",
      data: appDates.map((d) => appsByDate[d]?.REJECTED ?? 0),
      borderColor: "#f87171",
      backgroundColor: "#f87171",
      tension: 0.3,
    },
    {
      label: "Pending",
      data: appDates.map((d) => appsByDate[d]?.PENDING ?? 0),
      borderColor: "#fbbf24",
      backgroundColor: "#fbbf24",
      tension: 0.3,
    },
  ],
};

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={false} closeSidebar={() => {}} />

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