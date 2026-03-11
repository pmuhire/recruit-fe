"use client"

import Link from "next/link"

interface SidebarProps {
  role: string
}

export default function Sidebar({ role }: SidebarProps) {

  let links: { title: string; href: string }[] = []

  if (role === "Applicant") {
    links = [
      { title: "Dashboard", href: "/applicant/dashboard" },
      { title: "My Applications", href: "/applicant/applications" },
      { title: "Profile", href: "/profile" },
    ]
  } else if (role === "HR") {
    links = [
      { title: "HR Dashboard", href: "/hr/dashboard" },
      { title: "Applicants", href: "/hr/applicants" },
      { title: "Statistics", href: "/statistics" },
    ]
  } else if (role === "Admin") {
    links = [
      { title: "Admin Dashboard", href: "/admin/dashboard" },
      { title: "Users", href: "/admin/users" },
      { title: "Statistics", href: "/statistics" },
    ]
  }

  return (
    <aside className="w-64 bg-white h-full shadow-md p-4 hidden md:block">
      <ul className="flex flex-col gap-4">
        {links.map((link, idx) => (
          <li key={idx}>
            <Link href={link.href} className="block p-2 rounded hover:bg-gray-100">
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}