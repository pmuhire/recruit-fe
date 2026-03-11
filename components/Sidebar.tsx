"use client"

import Link from "next/link"
import { X, LayoutDashboard, FileText, Users, User, Settings } from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  closeSidebar: () => void
}

export default function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  return (
    <div
      className={`fixed z-40 top-0 left-0 h-full w-64 bg-gray-900 text-white h-screen w-64 text-white transform 
      ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      transition-transform duration-300 md:translate-x-0 md:static`}
    >

      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h2 className="md:hidden text-lg font-bold">Recruit System</h2>

        {/* Close icon for mobile */}
        <button onClick={closeSidebar} className="md:hidden">
          <X size={22} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-4">

        <Link href="/applicant/dashboard" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded">
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <Link href="/applicant/applications" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded">
          <FileText size={20} />
          Applications
        </Link>

        <Link href="/applicants" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded">
          <Users size={20} />
          Applicants
        </Link>

        <Link href="/profile" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded">
          <User size={20} />
          Profile
        </Link>

        <Link href="/settings" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded">
          <Settings size={20} />
          Settings
        </Link>

      </nav>
    </div>
  )
}