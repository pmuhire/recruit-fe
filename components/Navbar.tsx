"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  openSidebar?: () => void;
}

export default function Navbar({ openSidebar }: NavbarProps) {
  const router = useRouter();
  const { token, role, username, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Generate links based on role
  const getLinks = () => {
    if (!token) return [];

    if (role === "APPLICANT") {
      return [
        { href: "/jobs", label: "Jobs" },
        { href: "/applicant/applications", label: "My Applications" },
      ];
    }

    if (role === "HR") {
      return [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/jobs", label: "Jobs" },
        { href: "/applications", label: "Applications" },
      ];
    }

    if (role === "SUPERADMIN") {
      return [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/jobs", label: "Jobs" },
        { href: "/applications", label: "Applications" },
        { href: "/users", label: "Users" },
      ];
    }

    return [];
  };

  const links = getLinks();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-4 py-3 md:px-6 flex justify-between items-center relative">

      {/* LEFT */}
      <div className="flex items-center gap-4">
        {/* Sidebar toggle */}
        {openSidebar && role && role !== "APPLICANT" && (
          <button onClick={openSidebar} className="md:hidden">
            <Menu size={24} />
          </button>
        )}

        {/* Logo */}
        <h1
          className="font-bold text-lg cursor-pointer"
          onClick={() => router.push(token ? "/dashboard" : "/")}
        >
          E-Recruit
        </h1>
      </div>

      {/* DESKTOP LINKS */}
      <div className="hidden md:flex items-center gap-4">

        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-[#4B5320] text-white px-3 py-1 rounded hover:bg-[#3f461c] transition"
          >
            {link.label}
          </Link>
        ))}

        {token ? (
          <button
            onClick={handleLogout}
            className="bg-gray-900 text-white px-3 py-1 rounded hover:bg-black transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="bg-[#4B5320] text-white px-3 py-1 rounded hover:bg-[#3f461c] transition"
          >
            Login
          </button>
        )}
      </div>

      {/* MOBILE BUTTON */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md border-t border-gray-200 md:hidden z-50">

          <div className="flex flex-col p-4 gap-2">

            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="bg-[#4B5320] text-white px-3 py-2 rounded hover:bg-[#3f461c] transition text-center"
              >
                {link.label}
              </Link>
            ))}

            {token ? (
              <button
                onClick={handleLogout}
                className="bg-gray-900 text-white px-3 py-2 rounded hover:bg-black transition"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="bg-[#4B5320] text-white px-3 py-2 rounded hover:bg-[#3f461c] transition"
              >
                Login
              </button>
            )}

          </div>

        </div>
      )}
    </nav>
  );
}