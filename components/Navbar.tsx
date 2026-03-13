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
  const [token, setToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Component is now running on client
    setRole(localStorage.getItem("role"));
    setUsername(localStorage.getItem("username"));
    setToken(localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    router.push("/login");
  };

  // Do not render Navbar until we know if the user is logged in
  if (!isClient) return null;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        {openSidebar && role && role !== "APPLICANT" && (
          <button onClick={openSidebar} className="md:hidden">
            <Menu size={24} />
          </button>
        )}

        <h1
          className="font-bold text-lg cursor-pointer"
          onClick={() => router.push(token ? "/dashboard" : "/")}
        >
          E-Recruit
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {token ? (
          <>
            {/* Links based on role */}
            {role === "APPLICANT" && (
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

            {(role === "HR" || role === "SUPERADMIN") && (
              <div className="hidden md:flex gap-3">
                <Link
                  href="/dashboard"
                  className="bg-[#4B5320] text-white px-3 py-1 rounded hover:bg-[#3f461c] transition"
                >
                  Dashboard
                </Link>
                <Link
                  href="/jobs"
                  className="border border-[#4B5320] text-[#4B5320] px-3 py-1 rounded hover:bg-[#4B5320] hover:text-white transition"
                >
                  Jobs
                </Link>
                <Link
                  href="/applications"
                  className="border border-[#4B5320] text-[#4B5320] px-3 py-1 rounded hover:bg-[#4B5320] hover:text-white transition"
                >
                  Applications
                </Link>
                {role === "SUPERADMIN" && (
                  <Link
                    href="/users"
                    className="border border-[#4B5320] text-[#4B5320] px-3 py-1 rounded hover:bg-[#4B5320] hover:text-white transition"
                  >
                    Users
                  </Link>
                )}
              </div>
            )}

            <button
              onClick={handleLogout}
              className="bg-gray-900 text-white px-3 py-1 rounded hover:bg-black transition"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="bg-[#4B5320] text-white px-3 py-1 rounded hover:bg-[#3f461c] transition"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}