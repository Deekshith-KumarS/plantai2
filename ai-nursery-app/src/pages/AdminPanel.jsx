import { API_URL } from "../config";
import { useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import Navbar from "../components/Navbar";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data);
      } else {
        setError(data.message || "Failed to fetch users");
      }
    } catch (err) {
      setError("Server error while fetching users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="p-8 lg:p-16 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-500 mt-2 text-lg">Manage and view all registered users.</p>
            </div>
            <div className="bg-green-100 text-green-800 px-6 py-3 rounded-2xl font-bold text-xl shadow-sm border border-green-200">
              Total Users: {users.length}
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-base">
              ⚠️ {error}
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            {loading ? (
              <div className="p-10 text-center text-gray-500 text-xl font-medium animate-pulse">
                Loading users...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-sm tracking-wider">
                      <th className="px-8 py-5 font-semibold">User</th>
                      <th className="px-8 py-5 font-semibold">Email</th>
                      <th className="px-8 py-5 font-semibold">Auth Type</th>
                      <th className="px-8 py-5 font-semibold">Status</th>
                      <th className="px-8 py-5 font-semibold">Role</th>
                      <th className="px-8 py-5 font-semibold">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition duration-150">
                        
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full shadow-sm" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-lg">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="font-semibold text-gray-800 text-lg">{user.name}</span>
                          </div>
                        </td>

                        <td className="px-8 py-5 text-gray-600 font-medium">
                          {user.email}
                        </td>

                        <td className="px-8 py-5">
                          <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                            user.authProvider === "google" 
                              ? "bg-blue-100 text-blue-700 border border-blue-200" 
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}>
                            {user.authProvider === "google" ? "Google" : "Email"}
                          </span>
                        </td>

                        <td className="px-8 py-5">
                          {user.isVerified ? (
                            <span className="flex items-center gap-2 text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full w-max border border-green-200">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              Verified
                            </span>
                          ) : (
                            <span className="flex items-center gap-2 text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-full w-max border border-red-200">
                              <span className="w-2 h-2 rounded-full bg-red-500"></span>
                              Unverified
                            </span>
                          )}
                        </td>

                        <td className="px-8 py-5">
                          {user.isAdmin ? (
                            <span className="text-purple-700 font-bold bg-purple-100 px-3 py-1 rounded-md border border-purple-200">
                              Admin
                            </span>
                          ) : (
                            <span className="text-gray-500 font-medium">User</span>
                          )}
                        </td>

                        <td className="px-8 py-5 text-gray-500 font-medium">
                          {new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>

                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-8 py-10 text-center text-gray-500 text-lg">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
