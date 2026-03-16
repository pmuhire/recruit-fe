"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  token: string | null;
  role: string | null;
  username: string | null;
  userId: string | null; // Add userId to context
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
  const [userId, setUserId] = useState<string | null>(null); // State for userId

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setRole(localStorage.getItem("role"));
    setUsername(localStorage.getItem("username"));
    setUserId(localStorage.getItem("userId")); // Retrieve userId from localStorage
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
    localStorage.setItem("userId", userId); // Save userId in localStorage

    setToken(token);
    setRole(role);
    setUsername(username);
    setUserId(userId); // Set userId in state
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("userId"); // Remove userId from localStorage

    setToken(null);
    setRole(null);
    setUsername(null);
    setUserId(null); // Reset userId in state
  };

  return (
    <AuthContext.Provider
      value={{ token, role, username, userId, login, logout }}
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
