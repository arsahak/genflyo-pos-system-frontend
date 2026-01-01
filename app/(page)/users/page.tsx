"use client";

import { deleteUser, getAllUsers } from "@/app/actions/users";
import { UserListSkeleton } from "@/component/userManagement/components/UserListSkeleton";
import { useSidebar } from "@/lib/SidebarContext";
import { useStore } from "@/lib/store";
import ProtectedRoute from "@/component/ProtectedRoute";
import PermissionGuard from "@/component/PermissionGuard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoMdSearch } from "react-icons/io";
import {
  MdDelete,
  MdEdit,
  MdNavigateBefore,
  MdNavigateNext,
  MdPeople,
  MdPersonAdd,
  MdVisibility,
} from "react-icons/md";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  profileImage?: string;
  roleId?: {
    _id: string;
    name: string;
  };
  isActive: boolean;
  lastLogin?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export default function UsersPage() {
  const { user } = useStore();
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasMore: false,
  });

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getAllUsers({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        role: roleFilter || undefined,
      });

      if (result.success && result.data) {
        if (result.data.users) {
          setUsers(result.data.users);
          setPagination(result.data.pagination);
        } else {
          const usersData = Array.isArray(result.data) ? result.data : [];
          setUsers(usersData);
          setPagination({
            total: usersData.length,
            page: 1,
            limit: usersData.length,
            totalPages: 1,
            hasMore: false,
          });
        }
      } else {
        toast.error(result.error || "Failed to load users");
        setUsers([]);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("An unexpected error occurred while loading users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, roleFilter]);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
    loadUsers();
  }, [user, router, loadUsers]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const result = await deleteUser(userId);

      if (result.success) {
        toast.success(result.message || "User deleted successfully");
        loadUsers();
      } else {
        toast.error(result.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An unexpected error occurred while deleting user");
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "admin":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "manager":
        return "bg-green-100 text-green-700 border-green-200";
      case "cashier":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (!user) return null;

  return (
    <ProtectedRoute requiredPermission="canViewUsers">
      <div
        className={`min-h-screen p-6 transition-colors duration-300 font-sans ${
          isDarkMode ? "bg-gray-950 text-gray-100" : "bg-slate-50 text-gray-900"
        }`}
      >
        <div className="max-w-[1920px] mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1
                  className={`text-3xl font-bold mb-2 ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  User Management
                </h1>
                <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  Manage team members and their permissions
                </p>
              </div>
              <PermissionGuard permission="canAddUsers">
                <Link
                  href="/users/create-user"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
                >
                  <MdPersonAdd className="text-xl" />
                  Add New User
                </Link>
              </PermissionGuard>
            </div>
          </div>

        {loading && users.length === 0 ? (
          <UserListSkeleton isDarkMode={isDarkMode} />
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="relative overflow-hidden p-5 rounded-2xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 text-white">
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1 text-blue-100 opacity-90">
                      Total Users
                    </p>
                    <h3 className="text-2xl font-bold text-white">
                      {pagination.total}
                    </h3>
                  </div>
                  <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
                    <MdPeople className="text-2xl" />
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              </div>

              <div className="relative overflow-hidden p-5 rounded-2xl transition-all duration-300 bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30 text-white">
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1 text-green-100 opacity-90">
                      Active Users
                    </p>
                    <h3 className="text-2xl font-bold text-white">
                      {users.filter((u) => u.isActive).length}
                    </h3>
                  </div>
                  <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
                    <MdPeople className="text-2xl" />
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              </div>

              <div className="relative overflow-hidden p-5 rounded-2xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30 text-white">
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1 text-purple-100 opacity-90">
                      Current Page
                    </p>
                    <h3 className="text-2xl font-bold text-white">
                      {pagination.page} / {pagination.totalPages}
                    </h3>
                  </div>
                  <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
                    <MdPeople className="text-2xl" />
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              </div>

              <div className="relative overflow-hidden p-5 rounded-2xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 text-white">
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1 text-orange-100 opacity-90">
                      Showing
                    </p>
                    <h3 className="text-2xl font-bold text-white">
                      {users.length}
                    </h3>
                  </div>
                  <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
                    <MdPeople className="text-2xl" />
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              </div>
            </div>

            {/* Search and Filter */}
            <div
              className={`p-4 rounded-2xl border mb-6 shadow-sm ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                    <input
                      type="text"
                      placeholder="Search by name, email, or phone..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border-2 transition-colors ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 hover:border-gray-500"
                          : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400"
                      } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
                    />
                  </div>
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => handleRoleFilter(e.target.value)}
                  className={`px-4 py-2.5 rounded-xl border-2 transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100 hover:border-gray-500"
                      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
                >
                  <option value="">All Roles</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="cashier">Cashier</option>
                </select>

                {(searchTerm || roleFilter) && (
                  <button
                    onClick={() => {
                      handleSearch("");
                      handleRoleFilter("");
                    }}
                    className="px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all text-sm font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Users Table */}
            <div
              className={`rounded-2xl overflow-hidden shadow-xl border ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 shadow-gray-900/20"
                  : "bg-white border-gray-100 shadow-slate-200/50"
              }`}
            >
              {users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div
                    className={`p-6 rounded-full mb-4 ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <MdPeople
                      className={`text-6xl ${
                        isDarkMode ? "text-gray-600" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    No users found
                  </h3>
                  <p
                    className={`text-center max-w-sm mb-6 ${
                      isDarkMode ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    {searchTerm || roleFilter
                      ? "Try adjusting your filters"
                      : "Get started by creating your first user"}
                  </p>
                  {!searchTerm && !roleFilter && (
                    <Link
                      href="/users/create-user"
                      className="px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg"
                    >
                      Add New User
                    </Link>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr
                        className={`text-left text-xs font-semibold uppercase tracking-wider ${
                          isDarkMode
                            ? "bg-gray-900/50 text-gray-400"
                            : "bg-gray-50/80 text-gray-500"
                        }`}
                      >
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Created By</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        isDarkMode ? "divide-gray-700" : "divide-gray-100"
                      }`}
                    >
                      {users.map((userItem) => (
                        <tr
                          key={userItem._id}
                          className={`group transition-colors ${
                            isDarkMode
                              ? "hover:bg-gray-700/50"
                              : "hover:bg-indigo-50/30"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                {userItem.profileImage ? (
                                  <img
                                    src={userItem.profileImage}
                                    alt={userItem.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                                    {userItem.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div
                                  className={`font-semibold ${
                                    isDarkMode
                                      ? "text-gray-200"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {userItem.name}
                                </div>
                                {userItem.lastLogin ? (
                                  <div className="text-xs text-gray-500">
                                    Last login:{" "}
                                    {new Date(
                                      userItem.lastLogin
                                    ).toLocaleDateString()}
                                  </div>
                                ) : (
                                  <div className="text-xs text-gray-400">
                                    Never logged in
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`text-sm ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {userItem.email}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase border ${getRoleBadgeColor(
                                userItem.role
                              )}`}
                            >
                              {userItem.role.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {userItem.createdBy ? (
                              <div className="text-sm">
                                <div
                                  className={`font-medium ${
                                    isDarkMode
                                      ? "text-gray-200"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {userItem.createdBy.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {userItem.createdBy.email}
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400 italic">
                                System
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase border ${
                                userItem.isActive
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : "bg-red-100 text-red-700 border-red-200"
                              }`}
                            >
                              {userItem.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <PermissionGuard permission="canViewUsers">
                                <Link
                                  href={`/users/${userItem._id}`}
                                  className={`p-2 rounded-lg transition-colors ${
                                    isDarkMode
                                      ? "hover:bg-gray-600 text-gray-400 hover:text-blue-400"
                                      : "hover:bg-blue-50 text-gray-400 hover:text-blue-600"
                                  }`}
                                  title="View"
                                >
                                  <MdVisibility size={18} />
                                </Link>
                              </PermissionGuard>
                              <PermissionGuard permission="canEditUsers">
                                <Link
                                  href={`/users/${userItem._id}/edit`}
                                  className={`p-2 rounded-lg transition-colors ${
                                    isDarkMode
                                      ? "hover:bg-gray-600 text-gray-400 hover:text-green-400"
                                      : "hover:bg-green-50 text-gray-400 hover:text-green-600"
                                  }`}
                                  title="Edit"
                                >
                                  <MdEdit size={18} />
                                </Link>
                              </PermissionGuard>
                              <PermissionGuard permission="canDeleteUsers">
                                <button
                                  onClick={() => handleDelete(userItem._id)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    isDarkMode
                                      ? "hover:bg-gray-600 text-gray-400 hover:text-red-400"
                                      : "hover:bg-red-50 text-gray-400 hover:text-red-600"
                                  }`}
                                  title="Delete"
                                >
                                  <MdDelete size={18} />
                                </button>
                              </PermissionGuard>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div
                      className={`px-6 py-4 border-t flex items-center justify-between ${
                        isDarkMode
                          ? "bg-gray-900/50 border-gray-700"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-700"
                        }`}
                      >
                        Showing{" "}
                        <span className="font-semibold">
                          {(pagination.page - 1) * pagination.limit + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-semibold">
                          {Math.min(
                            pagination.page * pagination.limit,
                            pagination.total
                          )}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold">
                          {pagination.total}
                        </span>{" "}
                        results
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-1 ${
                            isDarkMode
                              ? "border-gray-600 hover:bg-gray-700 disabled:opacity-50"
                              : "border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                          } disabled:cursor-not-allowed`}
                        >
                          <MdNavigateBefore className="w-5 h-5" />
                          Previous
                        </button>

                        <div className="flex items-center gap-1">
                          {Array.from(
                            { length: pagination.totalPages },
                            (_, i) => {
                              const page = i + 1;
                              if (
                                page === 1 ||
                                page === pagination.totalPages ||
                                (page >= currentPage - 1 &&
                                  page <= currentPage + 1)
                              ) {
                                return (
                                  <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-4 py-2 rounded-lg transition-all ${
                                      currentPage === page
                                        ? "bg-indigo-600 text-white font-semibold shadow-lg"
                                        : isDarkMode
                                        ? "border border-gray-600 hover:bg-gray-700"
                                        : "border border-gray-300 hover:bg-gray-100"
                                    }`}
                                  >
                                    {page}
                                  </button>
                                );
                              } else if (
                                page === currentPage - 2 ||
                                page === currentPage + 2
                              ) {
                                return (
                                  <span key={page} className="px-2">
                                    ...
                                  </span>
                                );
                              }
                              return null;
                            }
                          )}
                        </div>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === pagination.totalPages}
                          className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-1 ${
                            isDarkMode
                              ? "border-gray-600 hover:bg-gray-700 disabled:opacity-50"
                              : "border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                          } disabled:cursor-not-allowed`}
                        >
                          Next
                          <MdNavigateNext className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}
