import { fetchAPI } from "@/lib/api";

export const getApplications = () => fetchAPI("/applications");

export const approveApplication = (id: number) =>
  fetchAPI(`/applications/${id}/approve`, {
    method: "PUT",
  });

export const rejectApplication = (id: number) =>
  fetchAPI(`/applications/${id}/reject`, {
    method: "PUT",
  });