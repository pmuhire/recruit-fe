// "use client";

// import { useState } from "react";

// export default function RegisterPage() {

//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     password: "",
//     role_id: ""
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const payload = {
//       username: form.username,
//       email: form.email,
//       password: form.password,
//       role_id: form.role_id
//     };

//     console.log(payload);

//     // Example API request
//     /*
//     fetch("http://localhost:8080/api/auth/register", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(payload)
//     })
//     */
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gray-100">

//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
//       >

//         <h2 className="text-2xl font-bold mb-6 text-center">
//           Create Account
//         </h2>

//         <div className="mb-4">
//           <label className="block text-sm mb-1">
//             Username
//           </label>
//           <input
//             name="username"
//             value={form.username}
//             onChange={handleChange}
//             placeholder="Enter username"
//             required
//             className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm mb-1">
//             Email
//           </label>
//           <input
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             placeholder="Enter email"
//             required
//             className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm mb-1">
//             Password
//           </label>
//           <input
//             type="password"
//             name="password"
//             value={form.password}
//             onChange={handleChange}
//             placeholder="Enter password"
//             required
//             className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block text-sm mb-1">
//             Role
//           </label>

//           <select
//             name="role_id"
//             value={form.role_id}
//             onChange={handleChange}
//             required
//             className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
//           >
//             <option value="">Select Role</option>
//             <option value="1">Admin</option>
//             <option value="2">HR</option>
//             <option value="3">Recruiter</option>
//           </select>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
//         >
//           Register
//         </button>

//       </form>

//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
    else if (!form.email.includes("@"))
      newErrors.email = "Enter a valid email";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    setLoading(false);

    if (data.success) {
      alert("Registration successful");
      router.push("/login");
    } else {
      alert("Registration failed");
    }
  };

  const strength = getPasswordStrength(form.password);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-lg shadow-sm"
      >
        <h1 className="text-3xl font-bold text-center mb-2">
          E-Recruit
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Create your account
        </p>

        {/* Username */}
        <div className="mb-4">
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full border p-3 rounded focus:ring-2 focus:ring-[#4B5320]"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username}
            </p>
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
            <p className="text-red-500 text-sm mt-1">
              {errors.email}
            </p>
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
            {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
          </div>

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password}
            </p>
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