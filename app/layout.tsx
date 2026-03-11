"use client"

import "./globals.css"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"

interface RootLayoutProps {
  children: React.ReactNode
}

// Simulated auth & role
const currentUser = {
  isLoggedIn: true, // set false to test unauthenticated
  role: "HR",       // "Applicant" | "HR" | "Admin"
  name:"Patrick"
}

// Simulated authentication status
const isLoggedIn = true  // Change to false to see unauthenticated view

export default function RootLayout({ children }: RootLayoutProps) {

  if (!isLoggedIn) {
    // If not logged in, show only the content (landing/home page)
    return (
      <html lang="en">
        <body className="bg-gray-100 font-sans">
          {children}
        </body>
      </html>
    )
  }

  // If logged in, show Navbar + Sidebar layout
  return (
    <html lang="en">
      <body className="bg-gray-100 font-sans flex flex-col h-screen">

        {/* Navbar */}
        <Navbar currentUser={currentUser} />

        <div className="flex flex-1">

          {/* Sidebar */}
          <Sidebar role={currentUser.role} />

          {/* Main content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>

        </div>
      </body>
    </html>
  )
}