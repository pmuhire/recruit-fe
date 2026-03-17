"use client";

import Link from "next/link";
import { LayoutDashboard, Briefcase, FileText, Users, Settings, X } from "lucide-react";

interface SidebarProps {
  isOpen?: boolean; // for mobile
  closeSidebar?: () => void;
}

const links = [
  { href: "/hr/dashboard", icon: <LayoutDashboard size={24} />, label: "Dashboard" },
  { href: "/hr/jobs", icon: <Briefcase size={24} />, label: "Jobs" },
  { href: "/hr/applications", icon: <FileText size={24} />, label: "Applications" },
  { href: "/hr/users", icon: <Users size={24} />, label: "Users" },
];

export default function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex rounded-md flex-col h-screen w-20 hover:w-64 bg-gray-900 text-white transition-all duration-300 sticky top-0 left-0 group z-50 shadow-lg">
        <div className="flex flex-col items-center justify-start flex-1 py-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center w-full p-3 hover:bg-gray-800 transition-colors duration-300"
            >
              {/* Icon */}
              <div className="flex justify-center w-10">{link.icon}</div>
              {/* Label */}
              <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 text-white z-50 shadow-lg flex flex-col p-4">
          <div className="flex justify-end mb-6">
            <button onClick={closeSidebar}>
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col space-y-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded"
                onClick={closeSidebar}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}