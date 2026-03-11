export default function UsersPage() {
  const users = [
    { name: "Alice", role: "Applicant" },
    { name: "Bob", role: "HR" },
    { name: "David", role: "Admin" },
  ];

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">System Users</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{u.name}</td>
                <td>{u.role}</td>

                <td>
                  <button className="bg-blue-600 text-white px-2 py-1 rounded">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
