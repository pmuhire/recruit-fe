import { fetchAPI } from "@/lib/api";

export const getJobs = () => fetchAPI("/jobs");

export const createJob = (data: any) =>
  fetchAPI("/jobs", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteJob = (id: number) =>
  fetchAPI(`/jobs/${id}`, {
    method: "DELETE",
  });