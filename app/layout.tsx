// "use client";

// import { useState, useEffect } from "react";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
// import "./globals.css";

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [role, setRole] = useState<string | null>(null);
//   const [username, setUsername] = useState<string | null>(null);

//   useEffect(() => {
//     const storedRole = localStorage.getItem("role");
//     const storedUsername = localStorage.getItem("username");
//     setRole(storedRole);
//     setUsername(storedUsername);
//   }, []);

//   return (
//     <html lang="en">
//       <body className="bg-gray-100 min-h-screen">
//         {/* Navbar */}
//         <Navbar openSidebar={() => setSidebarOpen(true)} />

//         <div className="flex">
//           {/* Sidebar (hide for applicants) */}
//           {role !== "APPLICANT" && (
//             <Sidebar
//               isOpen={sidebarOpen}
//               closeSidebar={() => setSidebarOpen(false)}
//             />
//           )}

//           {/* Main content */}
//           <main className="flex-1 p-6 min-h-screen">
//             {children}
//           </main>
//         </div>
//       </body>
//     </html>
//   );
// }

"use client";

import Navbar from "@/components/Navbar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen bg-gray-100">{children}</main>
      </body>
    </html>
  );
}