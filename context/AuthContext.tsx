"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  token: string | null;
  role: string | null;
  username: string | null;
  userId: string | null;
  loading: boolean; // ✅ NEW
  login: (
    token: string,
    role: string,
    username: string,
    userId: string,
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // ✅ NEW

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("userId");

    setToken(storedToken);
    setRole(storedRole);
    setUsername(storedUsername);
    setUserId(storedUserId);

    setLoading(false); // ✅ VERY IMPORTANT
  }, []);

  const login = (
    token: string,
    role: string,
    username: string,
    userId: string,
  ) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("username", username);
    localStorage.setItem("userId", userId);

    setToken(token);
    setRole(role);
    setUsername(username);
    setUserId(userId);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");

    setToken(null);
    setRole(null);
    setUsername(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, role, username, userId, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}