import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface User {
  id: number;
  username: string;
  email?: string;
  role?: string;
}

interface ApplicationDocument {
  id: number;
  fileName: string;
  uploadedAt?: string;
}

interface Application {
  id: number;
  user: User | null;
  jobId: number;
  jobTitle: string;
  status: "APPROVED" | "REJECTED" | "PENDING";
  reviewReason?: string;
  submittedAt: string;
  documents?: ApplicationDocument[];
}

// Review Modal
export function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
  application,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (status: "APPROVED" | "REJECTED", reason: string) => void;
  application: Application | null;
}) {
  const [decision, setDecision] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [docLoadingId, setDocLoadingId] = useState<number | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!application) return;
    setDecision("APPROVED");
    setReason(application.reviewReason || "");
    console.log(application);
  }, [application]);

  if (!isOpen || !application) return null;

  const handleApprovalOrRejection = async () => {
    setLoading(true);
    setError("");

    try {
      const endpoint =
        decision === "APPROVED"
          ? `/api/applications/${application.id}/approve`
          : `/api/applications/${application.id}/reject`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reviewReason: reason }),
        },
      );

      const data = await response.json();

      if (data.success) {
        alert(`${decision} successful`);
        onSubmit(decision, reason);
        onClose();
      } else {
        setError(data.message || "Something went wrong!");
      }
    } catch (err) {
      setError("Error communicating with the server.");
    } finally {
      setLoading(false);
    }
  };

  const getDocumentUrl = async (documentId: number) => {
    if (!token) {
      throw new Error("Authentication token missing");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/documents/${documentId}/view-url`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to get document URL");
    }

    if (!data?.url) {
      throw new Error("Document URL was not returned");
    }

    return data.url as string;
  };

  const handleViewDocument = async (doc: ApplicationDocument) => {
    try {
      setDocLoadingId(doc.id);
      const signedUrl = await getDocumentUrl(doc.id);
      window.open(signedUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error(err);
      alert("Failed to open document.");
    } finally {
      setDocLoadingId(null);
    }
  };

  const handleDownloadDocument = async (doc: ApplicationDocument) => {
    try {
      setDocLoadingId(doc.id);

      const signedUrl = await getDocumentUrl(doc.id);
      const response = await fetch(signedUrl);

      if (!response.ok) {
        throw new Error("Failed to download document");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = doc.fileName || "document";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
      alert("Failed to download document.");
    } finally {
      setDocLoadingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">Review Application</h2>

        <div className="mb-4 space-y-1">
          <p>
            <span className="font-semibold">Applicant:</span>{" "}
            {application.user?.username || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Email:</span>{" "}
            {application.user?.email || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Job:</span> {application.jobTitle}
          </p>
          <p>
            <span className="font-semibold">Current Status:</span>{" "}
            {application.status}
          </p>
          <p>
            <span className="font-semibold">Submitted At:</span>{" "}
            {new Date(application.submittedAt).toLocaleString()}
          </p>
        </div>

        {application.documents?.length ? (
          <div className="mb-4">
            <h3 className="font-semibold mb-3">Documents</h3>

            <div className="space-y-3">
              {application.documents.map((doc) => {
                const isPDF = doc.fileName.toLowerCase().endsWith(".pdf");
                const isDocLoading = docLoadingId === doc.id;

                return (
                  <div
                    key={doc.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between border p-3 rounded-lg shadow-sm hover:shadow transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-xl">{isPDF ? "📄" : "📁"}</div>
                      <div>
                        <p className="font-medium text-gray-800 break-all">
                          {doc.fileName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {isPDF ? "PDF Document" : "File"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3 md:mt-0">
                      <button
                        type="button"
                        onClick={() => handleViewDocument(doc)}
                        disabled={isDocLoading}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-60"
                      >
                        {isDocLoading ? "Opening..." : "View"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadDocument(doc)}
                        disabled={isDocLoading}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-60"
                      >
                        {isDocLoading ? "Downloading..." : "Download"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 mb-4">
          <select
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={decision}
            onChange={(e) =>
              setDecision(e.target.value as "APPROVED" | "REJECTED")
            }
          >
            <option value="APPROVED">Approve</option>
            <option value="REJECTED">Reject</option>
          </select>

          <textarea
            placeholder="Reason (optional)"
            className="border border-gray-300 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: "#4B5320" }}
            onClick={handleApprovalOrRejection}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Decision"}
          </button>
        </div>
      </div>
    </div>
  );
}