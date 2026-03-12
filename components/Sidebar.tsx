// "use client";

// import Link from "next/link";
// import { X, LayoutDashboard, FileText, Users, User, Settings } from "lucide-react";
// import { useEffect, useState } from "react";

// interface SidebarProps {
//   isOpen: boolean;
//   closeSidebar: () => void;
// }

// export default function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
//   const [role, setRole] = useState<string | null>(null);

//   useEffect(() => {
//     const storedRole = localStorage.getItem("role");
//     setRole(storedRole);
//   }, []);

//   // Hide the sidebar completely for applicants
//   if (role === "APPLICANT") return null;

//   const navLinks = [
//     {
//       name: "Dashboard",
//       href: "/applicant/dashboard",
//       icon: <LayoutDashboard size={20} />,
//       roles: ["APPLICANT", "ADMIN", "MANAGER"],
//     },
//     {
//       name: "Applications",
//       href: "/applicant/applications",
//       icon: <FileText size={20} />,
//       roles: ["APPLICANT", "ADMIN", "MANAGER"],
//     },
//     {
//       name: "Applicants",
//       href: "/applicants",
//       icon: <Users size={20} />,
//       roles: ["ADMIN", "MANAGER"],
//     },
//     {
//       name: "Profile",
//       href: "/profile",
//       icon: <User size={20} />,
//       roles: ["ADMIN", "MANAGER"],
//     },
//     {
//       name: "Settings",
//       href: "/settings",
//       icon: <Settings size={20} />,
//       roles: ["ADMIN", "MANAGER"],
//     },
//   ];

//   return (
//     <aside
//       className={`fixed z-50 top-0 left-0 h-full w-64 text-white transform
//       ${isOpen ? "translate-x-0" : "-translate-x-full"}
//       transition-transform duration-300 md:translate-x-0 md:static`}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between p-4">
//         <h2 className="md:hidden text-lg font-bold">Recruit System</h2>

//         {/* Close icon for mobile */}
//         <button onClick={closeSidebar} className="md:hidden">
//           <X size={22} />
//         </button>
//       </div>

//       {/* Navigation */}
//       <nav className="p-4 space-y-4">
//         {navLinks
//           .filter((link) => role && link.roles.includes(role))
//           .map((link) => (
//             <Link
//               key={link.name}
//               href={link.href}
//               className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded"
//             >
//               {link.icon}
//               {link.name}
//             </Link>
//           ))}
//       </nav>
//     </aside>
//   );
// }
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
  { href: "/hr/settings", icon: <Settings size={24} />, label: "Settings" },
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