"use client";

import api from "@/lib/api";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import toast from "react-hot-toast";
import { IoMdPerson, IoMdMail, IoMdCall, IoMdHome } from "react-icons/io";
import { MdEdit, MdDelete, MdArrowBack } from "react-icons/md";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  permissions?: Record<string, boolean>;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function ViewUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useStore();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
    loadUser();
  }, [id, user, router]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${id}`);
      setUserData(response.data);
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to load user";
      toast.error(errorMessage);
      router.push("/users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/users/${id}`);
      toast.success("User deleted successfully");
      router.push("/users");
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to delete user";
      toast.error(errorMessage);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-600">User not found</p>
          <Link href="/users" className="text-indigo-600 hover:underline mt-4 inline-block">
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
          <p className="text-gray-500 mt-1">View user information and permissions</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/users"
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all shadow-sm flex items-center gap-2"
          >
            <MdArrowBack className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <Link
            href={`/users/${id}/edit`}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <MdEdit className="w-5 h-5" />
            <span>Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <MdDelete className="w-5 h-5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-4xl shadow-lg mb-4">
                {userData.profileImage ? (
                  <img
                    src={userData.profileImage}
                    alt={userData.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  userData.name.charAt(0).toUpperCase()
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{userData.name}</h2>
              <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold capitalize mb-4">
                {userData.role.replace("_", " ")}
              </span>
              <div
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  userData.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {userData.isActive ? "Active" : "Inactive"}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <IoMdMail className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900 font-medium">{userData.email}</p>
                </div>
              </div>
              {userData.phone && (
                <div className="flex items-start gap-3">
                  <IoMdCall className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900 font-medium">{userData.phone}</p>
                  </div>
                </div>
              )}
              {userData.address && (
                <div className="flex items-start gap-3">
                  <IoMdHome className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-900 font-medium">{userData.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            <div className="space-y-3">
              {userData.createdBy && (
                <div>
                  <p className="text-sm text-gray-500">Created By</p>
                  <p className="text-gray-900 font-medium">{userData.createdBy.name}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="text-gray-900 font-medium">
                  {new Date(userData.createdAt).toLocaleString()}
                </p>
              </div>
              {userData.lastLogin && (
                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(userData.lastLogin).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Permissions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Permissions</h3>

            {userData.permissions && Object.keys(userData.permissions).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(userData.permissions).map(([key, value]) => (
                  <div
                    key={key}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      value
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {key.replace(/([A-Z])/g, " $1").replace(/^can /, "")}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          value
                            ? "bg-green-200 text-green-800"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {value ? "Granted" : "Denied"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No permissions assigned</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

