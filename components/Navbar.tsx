"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface NavbarProps {
  openSidebar?: () => void;
}

export default function Navbar({ openSidebar }: NavbarProps) {
  const router = useRouter();

  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    setUsername(localStorage.getItem("username"));
  }, []);

  const handleLogout = () => {
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    router.push("/login");
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">

      {/* LEFT */}
      <div className="flex items-center gap-4">

        {/* Hamburger for HR/Admin */}
        {openSidebar && role === "APPLICANT" && (
          <button onClick={openSidebar} className="md:hidden">
            <Menu size={24} />
          </button>
        )}

        {/* Logo */}
        <h1
          className="font-bold text-lg cursor-pointer"
          onClick={() => router.push("/")}
        >
          E-Recruit
        </h1>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* Applicant links */}
        {role !== "APPLICANT" && (
          <div className="hidden md:flex gap-3">

            <Link
              href="/jobs"
              className="bg-[#4B5320] text-white px-3 py-1 rounded hover:bg-[#3f461c] transition"
            >
              Jobs
            </Link>

            <Link
              href="/applicant/applications"
              className="border border-[#4B5320] text-[#4B5320] px-3 py-1 rounded hover:bg-[#4B5320] hover:text-white transition"
            >
              My Applications
            </Link>

          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-gray-900 text-white px-3 py-1 rounded hover:bg-black transition"
        >
          Logout
        </button>

      </div>

    </div>
  );
}