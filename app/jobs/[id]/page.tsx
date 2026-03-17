"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/ui/spinner";

interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  status: "OPEN" | "CLOSED";
  createdAt: string;
}

export default function JobDetails() {
  const params = useParams();
  const router = useRouter();
  const { userId, token, role, loading: authLoading } = useAuth();

  const jobId = params?.id;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [motivation, setMotivation] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);

  // ✅ Auth guard (NO flicker)
  useEffect(() => {
    if (!authLoading && (!userId || !token || role !== "APPLICANT")) {
      router.replace("/login");
    }
  }, [authLoading, userId, token, role, router]);

  // ✅ Fetch Job safely
  useEffect(() => {
    if (authLoading) return;

    if (!token || !jobId) {
      setLoading(false);
      return;
    }

    const fetchJob = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const response = await res.json();

        if (res.ok && response?.success && response?.data) {
          setJob(response.data);
        } else {
          setJob(null);
          setError(response?.message || "Failed to fetch job details");
        }
      } catch (err) {
        console.error("Error fetching job:", err);
        setJob(null);
        setError("Unable to fetch job. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, token, authLoading]);

  // ✅ Submit application
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!cvFile || !userId || !token) {
      setFormError("Please provide your CV and ensure you are logged in.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("userId", String(userId));
      formData.append("jobId", String(jobId));
      formData.append("cvFile", cvFile);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applications/apply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to submit application");
      }

      // Reset form
      setFullName("");
      setEmail("");
      setMotivation("");
      setCvFile(null);

      router.push("/applicant/applications");
    } catch (err: any) {
      console.error("Application submission error:", err);
      setFormError(err.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Global loading control (no flicker)
  if (authLoading) return <Spinner />;
  if (!userId || !token || role !== "APPLICANT") return <Spinner />;
  if (loading) return <Spinner />;

  // ✅ Error UI
  if (error)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-red-500">{error}</p>
      </div>
    );

  // ✅ No job found
  if (!job)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500">Job not found</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto py-4 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 mb-10">
        {/* Header */}
        <div className="border-b pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {job.title}
          </h1>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Job Description</h2>
          <p className="text-gray-700">{job.description}</p>
        </div>

        {/* Requirements */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Requirements</h2>
          <p className="text-gray-700">{job.requirements}</p>
        </div>

        {/* Apply */}
        {job.status === "OPEN" ? (
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">
              Apply for this Job
            </h2>

            <form className="space-y-4" onSubmit={handleSubmitApplication}>
              {formError && (
                <p className="text-red-500 text-sm">{formError}</p>
              )}

              <input
                type="text"
                placeholder="Full Name"
                className="w-full border p-3 rounded focus:ring-2 focus:ring-[#4B5320]"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full border p-3 rounded focus:ring-2 focus:ring-[#4B5320]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <textarea
                placeholder="Short motivation..."
                rows={4}
                className="w-full border p-3 rounded focus:ring-2 focus:ring-[#4B5320]"
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
              />

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="w-full border p-3 rounded"
                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                required
              />

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#4B5320] text-white px-6 py-2 rounded hover:bg-[#3f461c] transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        ) : (
          <p className="text-center mt-4 text-red-500 font-medium">
            This position is closed.
          </p>
        )}
      </div>
    </div>
  );
}