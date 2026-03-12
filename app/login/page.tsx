// "use client";

// import { useState } from "react";
// import { loginUser } from "../../services/authService";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const router = useRouter();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e: any) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     try {
//       await loginUser(form.email, form.password);
//       router.push("/dashboard");
//     } catch (err: any) {
//       alert(err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded shadow-md w-full max-w-md"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

//         <input
//           name="email"
//           placeholder="Email"
//           onChange={handleChange}
//           className="w-full border p-2 mb-4 rounded"
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           onChange={handleChange}
//           className="w-full border p-2 mb-6 rounded"
//         />

//         <button className="w-full bg-blue-600 text-white p-2 rounded">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);
      router.push("/dashboard");
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* System title */}
        <h1 className="text-center text-3xl font-bold mb-8 text-gray-800">
          E-Recruit
        </h1>

        {/* Login form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 p-8 rounded-lg shadow-sm"
        >
          <h2 className="text-xl font-semibold text-center mb-6 text-gray-700">
            Login to your account
          </h2>

          <div className="space-y-4">

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
              className="w-full bg-[#556B2F] text-white py-3 rounded-md hover:bg-[#3e441a] transition font-semibold"
            >
              Login
            </button>

          </div>

        </form>

        {/* Register link */}
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