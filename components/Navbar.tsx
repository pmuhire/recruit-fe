"use client";

import { Menu } from "lucide-react";

export default function Navbar({ openSidebar }: any) {
  return (
    <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
      <button onClick={openSidebar} className="md:hidden">
        <Menu size={26} />
      </button>

      <h1 className="font-bold text-lg">Recruitment System</h1>

      <div>User</div>
    </div>
  );
}
