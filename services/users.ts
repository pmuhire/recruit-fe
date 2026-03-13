import { fetchAPI } from "@/lib/api";

export const getUsers = () => fetchAPI("/users");