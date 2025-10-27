"use client";

import api from "@/lib/api";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  roleId?: {
    _id: string;
    name: string;
  };
  isActive: boolean;
  lastLogin?: string;
}

export default function UsersPage() {
  const { user } = useStore();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
    loadUsers();
  }, [user, router]);

  const loadUsers = async () => {
    try {
      console.log("=== FETCHING USERS ===");
      console.log(
        "1. API Base URL:",
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
      );

      // Check if we have a token
      const token = localStorage.getItem("accessToken");
      console.log("2. Access Token:", token ? "✅ Present" : "❌ Missing");

      console.log("3. Making API call...");
      const response = await api.get("/users");

      console.log("4. Response Status:", response.status);
      console.log("5. Response Data:", response.data);
      console.log("6. Data Type:", typeof response.data);
      console.log("7. Is Array:", Array.isArray(response.data));

      // Ensure we have an array of users
      const usersData = Array.isArray(response.data) ? response.data : [];
      console.log("8. Setting users:", usersData.length, "users");

      setUsers(usersData);
      console.log("✅ Users loaded successfully!");
    } catch (error: unknown) {
      console.error("❌ FAILED TO LOAD USERS");
      console.error("Error:", error);

      // Better error logging
      if (error && typeof error === "object") {
        if ("response" in error) {
          const axiosError = error as {
            response?: {
              data?: unknown;
              status?: number;
              statusText?: string;
              headers?: unknown;
            };
          };
          console.error("Error Details:", {
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText,
            data: axiosError.response?.data,
            headers: axiosError.response?.headers,
          });

          if (axiosError.response?.status === 401) {
            console.error(
              "❌ Authentication failed - Token may be invalid or expired"
            );
            toast.error("Session expired. Please login again.");
            // Redirect to login
            router.push("/");
            return;
          }
        }

        if ("message" in error) {
          console.error(
            "Error Message:",
            (error as { message?: string }).message
          );
        }

        if ("config" in error) {
          const axiosError = error as {
            config?: { url?: string; baseURL?: string };
          };
          console.error(
            "Request URL:",
            `${axiosError.config?.baseURL || ""}${axiosError.config?.url || ""}`
          );
        }
      }

      toast.error("Failed to load users. Please check console for details.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/users/${userId}`);
      toast.success("User deleted successfully");
      loadUsers();
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to delete user";
      toast.error(errorMessage);
    }
  };

  if (!user) return null;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">Manage your team members</p>
        </div>
        <Link
          href="/users/create-user"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <span>+</span>
          <span>Add New User</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white">
          <p className="text-sm opacity-90">Total Users</p>
          <p className="text-3xl font-bold mt-1">{users.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg text-white">
          <p className="text-sm opacity-90">Active Users</p>
          <p className="text-3xl font-bold mt-1">
            {users.filter((u) => u.isActive).length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg text-white">
          <p className="text-sm opacity-90">Admins</p>
          <p className="text-3xl font-bold mt-1">
            {
              users.filter(
                (u) => u.role === "admin" || u.role === "super_admin"
              ).length
            }
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-lg text-white">
          <p className="text-sm opacity-90">Cashiers</p>
          <p className="text-3xl font-bold mt-1">
            {
              users.filter((u) => u.role === "cashier" || u.role === "seller")
                .length
            }
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by creating your first user
            </p>
            <Link
              href="/users/create-user"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
            >
              Add New User
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((userItem) => (
                  <tr
                    key={userItem._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {userItem.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="font-semibold text-gray-900">
                            {userItem.name}
                          </div>
                          {userItem.lastLogin ? (
                            <div className="text-xs text-gray-500">
                              Last login:{" "}
                              {new Date(userItem.lastLogin).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400">
                              Never logged in
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {userItem.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 capitalize">
                        {userItem.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          userItem.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {userItem.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/users/${userItem._id}`}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          View
                        </Link>
                        <Link
                          href={`/users/${userItem._id}/edit`}
                          className="text-green-600 hover:text-green-900 font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(userItem._id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
