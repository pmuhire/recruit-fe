"use client"

import Card from "../../../components/Card"

export default function HRDashboard() {

  // Mock data for latest 10 applicants
  const applicants = [
    { name: "Alice Johnson", position: "Software Engineer", status: "Pending" },
    { name: "Bob Smith", position: "Data Analyst", status: "Pending" },
    { name: "Carol Lee", position: "UI Designer", status: "Approved" },
    { name: "David Kim", position: "Backend Developer", status: "Rejected" },
    { name: "Eva Green", position: "HR Assistant", status: "Pending" },
    { name: "Frank White", position: "Software Engineer", status: "Pending" },
    { name: "Grace Hall", position: "Data Scientist", status: "Pending" },
    { name: "Henry Brown", position: "UX Designer", status: "Approved" },
    { name: "Isla Scott", position: "Frontend Developer", status: "Pending" },
    { name: "Jack Black", position: "Software Engineer", status: "Pending" },
  ]

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold mb-4">HR Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Applications">
          <p>{applicants.length}</p>
        </Card>
        <Card title="Pending">
          <p>{applicants.filter(a => a.status === "Pending").length}</p>
        </Card>
        <Card title="Approved">
          <p>{applicants.filter(a => a.status === "Approved").length}</p>
        </Card>
      </div>

      {/* Applicants Table */}
      <Card title="Latest Applicants">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Position</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{app.name}</td>
                  <td className="px-4 py-2">{app.position}</td>
                  <td className="px-4 py-2">{app.status}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Approve</button>
                    <button className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Reject</button>
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