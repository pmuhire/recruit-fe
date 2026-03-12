export const applyForJob = async (data: any) => {
  const formData = new FormData();
  formData.append("jobId", data.jobId);
  formData.append("fullName", data.fullName);
  formData.append("email", data.email);
  formData.append("cvFile", data.cvFile);

  const token = localStorage.getItem("token");

  const res = await fetch("https://dummyjson.com/jobs/apply", {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Application failed");
  return result;
};
export const getApplications = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch("https://dummyjson.com/jobs/myApplications", {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch");
  return data.applications || [];
};