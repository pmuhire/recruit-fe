"use client";

import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loadingRedirect, setLoadingRedirect] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      // Redirect based on role
      switch (role) {
        case "APPLICANT":
          router.replace("/");
          break;
        case "USER":
          router.replace("/");
          break;
        default:
          router.replace("/");
      }
    } else {
      setLoadingRedirect(false);
    }
  }, [router]);

  if (loadingRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting...</p>
      </div>
    );
  }

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("LOGIN REQUEST:", form);

      const res = await fetch(
        "https://recruit-be-production.up.railway.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        },
      );

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (data.success) {
        // Store token and role
        localStorage.setItem("token", data.token);
        if (data.username) localStorage.setItem("username", data.username);
        if (data.role) localStorage.setItem("role", data.role);

        // Redirect based on role
        switch (data.role) {
          case "APPLICANT":
            router.push("/");
            break;
          case "SUPERADMIN":
            router.push("/");
            break;
          default:
            router.push("/login");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError("Unable to connect to server. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-center text-3xl font-bold mb-8 text-gray-800">
          E-Recruit
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 p-8 rounded-lg shadow-sm"
        >
          <h2 className="text-xl font-semibold text-center mb-6 text-gray-700">
            Login to your account
          </h2>

          <div className="space-y-4">
            {/* Error message */}
            {error && (
              <div className="bg-red-100 text-red-700 text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email address"
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#556B2F]"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#556B2F]"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#556B2F] text-white py-3 rounded-md hover:bg-[#3e441a] transition font-semibold"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-[#556B2F] font-medium cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
