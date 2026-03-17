"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/ui/spinner"; // ✅ import your spinner

interface Application {
  id: number;
  userId: number;
  jobId: number | null;
  jobTitle: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewReason: string | null;
  submittedAt: string;
}

const STATUS_COLORS: Record<Application["status"], string> = {
  APPROVED: "bg-teal-500",
  PENDING: "bg-amber-500",
  REJECTED: "bg-rose-500",
};

const Stat = ({ label, value, color }: any) => (
  <div className="bg-white rounded-xl p-5 border shadow-sm">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`text-2xl font-bold mt-1 ${color || "text-gray-900"}`}>
      {value}
    </p>
  </div>
);

export default function ApplicantDashboard() {
  const { userId, token, role, loading: authLoading } = useAuth();
  const router = useRouter();

  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<"All" | Application["status"]>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Auth guard
  useEffect(() => {
    if (!authLoading && (!userId || !token || role !== "APPLICANT")) {
      router.replace("/login");
    }
  }, [authLoading, userId, token, role, router]);

  // ✅ Fetch applications safely
  useEffect(() => {
    if (authLoading) return;

    if (!userId || !token) {
      setLoading(false);
      return;
    }

    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/applications/user?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();

        if (res.ok && data?.success && Array.isArray(data.data)) {
          setApplications(data.data);
          setError("");
        } else {
          setApplications([]);
          setError(data?.message || "Failed to fetch applications");
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
        setApplications([]);
        setError("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [userId, token, authLoading]);

  // ✅ Filtering
  const filteredApps =
    filter === "All"
      ? applications
      : applications.filter((a) => a?.status === filter);

  // Stats
  const total = applications.length;
  const approved = applications.filter((a) => a.status === "APPROVED").length;
  const pending = applications.filter((a) => a.status === "PENDING").length;
  const rejected = applications.filter((a) => a.status === "REJECTED").length;

  // ✅ Spinner overlay
  if (loading || authLoading) return <Spinner />;

  // ✅ Error UI
  if (error)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* HEADER */}
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">
            Application Activity
          </h1>
          <p className="text-gray-500">Track your progress in real-time</p>
        </div>

        {/* QUICK STATS */}
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-md bg-gray-50 flex flex-col items-center text-center border border-gray-200">
            <p className="text-xs text-gray-500">Total applications</p>
            <p className="mt-1 text-lg font-semibold text-gray-700">{total}</p>
          </div>

          <div className="p-3 rounded-md bg-green-50 flex flex-col items-center text-center border border-green-100">
            <p className="text-xs text-green-600">Approved</p>
            <p className="mt-1 text-lg font-semibold text-green-700">
              {approved}
            </p>
          </div>

          <div className="p-3 rounded-md bg-yellow-50 flex flex-col items-center text-center border border-yellow-100">
            <p className="text-xs text-yellow-600">Pending</p>
            <p className="mt-1 text-lg font-semibold text-yellow-700">
              {pending}
            </p>
          </div>

          <div className="p-3 rounded-md bg-red-50 flex flex-col items-center text-center border border-red-100">
            <p className="text-xs text-red-600">Rejected</p>
            <p className="mt-1 text-lg font-semibold text-red-700">
              {rejected}
            </p>
          </div>
        </div>

        {/* FILTER */}
        <div className="max-w-3xl mx-auto flex flex-wrap gap-2 justify-center">
          {(["All", "APPROVED", "PENDING", "REJECTED"] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                  filter === status
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {status}
              </button>
            ),
          )}
        </div>

        {/* TIMELINE */}
        <div className="relative max-w-3xl mx-auto">
          {/* vertical line centered */}
          <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gray-200" />

          <div className="space-y-10">
            {filteredApps.length > 0 ? (
              filteredApps.map((app) => (
                <div key={app.id} className="relative flex items-start gap-6">
                  {/* DOT */}
                  <div
                    className={`z-10 mt-1 w-4 h-4 rounded-full border-4 border-white shadow ${
                      app.status === "APPROVED"
                        ? "bg-green-500"
                        : app.status === "PENDING"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  />

                  {/* CARD */}
                  <div className="flex-1 bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">
                    {/* TOP */}
                    <div className="flex justify-between items-center">
                      <h2 className="font-semibold text-gray-900 text-lg">
                        {app.jobTitle || "Unknown Job"}
                      </h2>

                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${
                          STATUS_COLORS[app.status]
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    {/* DATE */}
                    <p className="text-sm text-gray-500 mt-1">
                      {app.submittedAt
                        ? new Date(app.submittedAt).toLocaleString()
                        : "No date"}
                    </p>

                    {/* MESSAGE */}
                    <div className="mt-3 text-sm">
                      {app.status === "APPROVED" && (
                        <p className="text-green-600 font-medium">
                          🎉 Approved — you're moving forward!
                        </p>
                      )}

                      {app.status === "PENDING" && (
                        <p className="text-yellow-600">
                          ⏳ Under review — hang tight.
                        </p>
                      )}

                      {app.status === "REJECTED" && (
                        <p className="text-red-600">
                          ❌ Not selected this time.
                        </p>
                      )}
                    </div>

                    {/* REVIEW */}
                    {app.reviewReason && (
                      <p className="text-xs text-gray-400 mt-2 italic">
                        "{app.reviewReason}"
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-gray-500">
                No activity yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
