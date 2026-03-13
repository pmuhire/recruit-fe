"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loadingRedirect, setLoadingRedirect] = useState(true);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      // Redirect based on role
      switch (role) {
        case "APPLICANT":
          router.replace("/");
          break;
        case "SUPERADMIN":
          router.replace("/user-home");
          break;
        default:
          router.replace("/login");
      }
    } else {
      setLoadingRedirect(false);
    }
  }, [router]);

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return "Weak";
    if (password.match(/[A-Z]/) && password.match(/[0-9]/)) return "Strong";
    return "Medium";
  };

  const validate = () => {
    let newErrors: any = {};

    if (!form.username) newErrors.username = "Username is required";

    if (!form.email) newErrors.email = "Email is required";
    else if (!form.email.includes("@")) newErrors.email = "Enter a valid email";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setServerError("");

    if (!validate()) {
      setLoading(false);
      return;
    }

    try {
      console.log("REGISTER REQUEST:", form);

      const res = await fetch(
        "https://recruit-be-production.up.railway.app/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        },
      );

      const data = await res.json();
      console.log("REGISTER RESPONSE:", data);

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
            break;
        }
      } else {
        setServerError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      setServerError("Unable to connect to server. Please try again.");
    }

    setLoading(false);
  };

  const strength = getPasswordStrength(form.password);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-lg shadow-sm"
      >
        <h1 className="text-3xl font-bold text-center mb-2">E-Recruit</h1>

        <p className="text-center text-gray-500 mb-6">Create your account</p>

        {/* SERVER ERROR */}
        {serverError && (
          <div className="mb-4 p-3 text-sm bg-red-100 text-red-600 rounded">
            {serverError}
          </div>
        )}

        {/* Username */}
        <div className="mb-4">
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full border p-3 rounded focus:ring-2 focus:ring-[#4B5320]"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border p-3 rounded focus:ring-2 focus:ring-[#4B5320]"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border p-3 rounded pr-10 focus:ring-2 focus:ring-[#4B5320]"
          />

          <div
            className="absolute right-3 top-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}

          {form.password && (
            <p
              className={`text-sm mt-1 ${
                strength === "Weak"
                  ? "text-red-500"
                  : strength === "Medium"
                    ? "text-yellow-500"
                    : "text-green-600"
              }`}
            >
              Password strength: {strength}
            </p>
          )}
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="w-full bg-[#4B5320] text-white py-3 rounded flex justify-center items-center gap-2 hover:bg-[#3f461c]"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          {loading ? "Creating account..." : "Register"}
        </button>

        {/* Login */}
        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-[#4B5320] cursor-pointer font-medium hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
