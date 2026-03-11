"use client"

import Card from "../../../components/Card"

export default function AdminDashboard() {

  // Mock data for system users
  const users = [
    { name: "Alice Johnson", email: "alice@example.com", role: "Applicant" },
    { name: "Bob Smith", email: "bob@example.com", role: "Applicant" },
    { name: "Carol Lee", email: "carol@example.com", role: "HR" },
    { name: "David Kim", email: "david@example.com", role: "Admin" },
    { name: "Eva Green", email: "eva@example.com", role: "HR" },
  ]

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* User Management Table */}
      <Card title="System Users">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">Edit</button>
                    <button className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  )
}