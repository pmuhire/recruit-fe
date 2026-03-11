"use client"

import Link from "next/link"

export default function HomePage() {

  const isLoggedIn = true // Simulate login state

  if (isLoggedIn) {
    // Redirect or show dashboard placeholder
    return <p>Redirecting to dashboard...</p>
  }

  // Landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center text-center px-6">

      <h1 className="text-5xl font-bold text-blue-600 mb-6">
        Welcome to the Recruitment System
      </h1>

      <p className="text-lg text-gray-700 mb-8 max-w-xl">
        Submit your profile, attach your CV, and track your applications. HR and Admin can manage applications and monitor recruitment statistics.
      </p>

      <div className="flex justify-center gap-4">
        <Link href="/login">
          <button className="bg-blue-600 text-white font-semibold px-6 py-3 rounded shadow hover:bg-blue-700">
            Login
          </button>
        </Link>

        <Link href="/register">
          <button className="border border-blue-600 text-blue-600 font-semibold px-6 py-3 rounded hover:bg-blue-50">
            Register
          </button>
        </Link>
      </div>

      <footer className="text-gray-500 text-sm mt-12">
        © 2026 Recruitment System. All rights reserved.
      </footer>

    </div>
  )
}