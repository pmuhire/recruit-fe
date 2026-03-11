"use client"

import Card from "../../../components/Card"

export default function ApplicantDashboard() {

  // Mock data
  const applications = [
    { position: "Software Engineer", status: "Pending", submitted: "2026-03-01" },
    { position: "Data Analyst", status: "Approved", submitted: "2026-02-15" },
  ]

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold mb-4">Applicant Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Latest Application">
          <p>{applications[0].position} - <span className="font-semibold">{applications[0].status}</span></p>
        </Card>
        <Card title="Submitted Applications">
          <p>{applications.length} applications submitted</p>
        </Card>
        <Card title="Notifications">
          <p>No new notifications</p>
        </Card>
      </div>

      {/* Applications Table */}
      <Card title="All Applications">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">Position</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{app.position}</td>
                  <td className="px-4 py-2">{app.status}</td>
                  <td className="px-4 py-2">{app.submitted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  )
}