"use client"

interface NavbarProps {
  currentUser: { name: string; role: string }
}

export default function Navbar({ currentUser }: NavbarProps) {
  return (
    <nav className="bg-white shadow-md h-16 flex items-center px-6 justify-between">
      <div className="text-xl font-bold text-blue-600">Recruitment System</div>
      <div className="flex items-center gap-4">
        <span className="text-gray-700">Hi, {currentUser.name} ({currentUser.role})</span>
        <button className="text-gray-700 hover:text-blue-600">Logout</button>
      </div>
    </nav>
  )
}