"use client";

import { useState, useEffect, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";

// Spinner component
function Loader() {
  return (
    <div className="flex justify-center items-center py-6">
      <div className="w-8 h-8 border-4 border-green-500 border-dashed rounded-full animate-spin" />
    </div>
  );
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

// Create User Modal
function CreateUserModal({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (user: User) => void;
}) {
  const [newUsername, setUsername] = useState("");
  const [newEmail, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useAuth();

  if (!isOpen) return null;

  const handleCreateUser = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/create-hr-default`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username: newUsername, email: newEmail }),
        },
      );

      const data = await res.json();

      if (data.success) {
        onCreate(data.data);
        onClose();
      } else {
        setError(data.message || "Failed to create user");
      }
    } catch (err) {
      setError("Error communicating with server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create User</h2>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Username"
            className="border p-2 rounded"
            value={newUsername}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={newEmail}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: "#4B5320" }}
            onClick={handleCreateUser}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token, role } = useAuth();

  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [sortField, setSortField] = useState<"username" | "email">("username");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 10;

  const fetchUsers = async () => {
    if (!token) return; // Defensive check for token
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Defensive check: ensure array
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role !== "SUPERADMIN" && role !== "HR") return;
    fetchUsers();
  }, [role, token]);

  // Filter + Search + Sort
  const processedUsers = useMemo(() => {
    let filtered = [...users].filter((u): u is User => !!u);

    if (roleFilter !== "ALL") {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          (u.username?.toLowerCase() || "").includes(lowerSearch) ||
          (u.email?.toLowerCase() || "").includes(lowerSearch),
      );
    }

    filtered.sort((a, b) => {
      const fieldA = a[sortField]?.toLowerCase() || "";
      const fieldB = b[sortField]?.toLowerCase() || "";
      if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, roleFilter, searchText, sortField, sortOrder]);

  const totalPages = Math.ceil(processedUsers.length / USERS_PER_PAGE);
  const paginatedUsers = processedUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE,
  );

  const handleCreate = (user: User) => {
    setUsers((prev) => [...prev, user]);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Users</h1>
          {role === "SUPERADMIN" && (
            <button
              className="px-4 py-2 bg-[#4B5320] text-white rounded hover:bg-[#3f461c] transition"
              onClick={() => setModalOpen(true)}
            >
              Create User
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <input
            type="text"
            placeholder="Search by username or email"
            className="flex-1 min-w-[150px] p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition placeholder-gray-400"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <select
            className="p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="APPLICANT">USER</option>
            <option value="HR">HR</option>
            <option value="SUPERADMIN">ADMIN</option>
          </select>

          <select
            className="p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition"
            value={sortField}
            onChange={(e) =>
              setSortField(e.target.value as "username" | "email")
            }
          >
            <option value="username">Sort by Username</option>
            <option value="email">Sort by Email</option>
          </select>

          <select
            className="p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Table */}
            <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
              <div className="overflow-x-auto">
                <table className="min-w-full border overflow-x-auto border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 text-sm uppercase tracking-wide text-gray-600">
                      <th className="p-3 text-left">#</th>
                      <th className="p-3 text-left">Username</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center p-6 text-gray-500"
                        >
                          No users found
                        </td>
                      </tr>
                    ) : (
                      paginatedUsers.map((user, idx) => (
                        <tr
                          key={user.id}
                          className="border-t hover:bg-gray-50 transition"
                        >
                          <td className="p-3 font-medium">
                            {(currentPage - 1) * USERS_PER_PAGE + idx + 1}
                          </td>
                          <td className="p-3 font-semibold text-gray-800">
                            {user.username}
                          </td>
                          <td className="p-3 text-sm text-gray-600">
                            {user.email}
                          </td>
                          <td className="p-3 font-medium">{user.role}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  className="px-3 py-1 border rounded disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="px-3 py-1 border rounded disabled:opacity-50"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        <CreateUserModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreate}
        />
      </div>
    </div>
  );
}
