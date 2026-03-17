"use client";

import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const UsersContext = createContext<any>(null);

export const UsersProvider = ({ children }: any) => {
  const { token, role } = useAuth();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    if (!token) return;

    const res = await fetch("/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setUsers(data.data || []);
  };

  const createHR = async (payload: { username: string; email: string }) => {
    if (!token || role !== "SUPERADMIN") return;

    const res = await fetch("/api/auth/create-hr-default", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return res.json();
  };

  return (
    <UsersContext.Provider value={{ users, fetchUsers, createHR }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => useContext(UsersContext);