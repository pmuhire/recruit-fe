"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body>
        <Navbar openSidebar={() => setSidebarOpen(true)} />

        <div className="flex">
          <Sidebar
            isOpen={sidebarOpen}
            closeSidebar={() => setSidebarOpen(false)}
          />
          <main className="flex-1 bg-gray-100 p-6 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
