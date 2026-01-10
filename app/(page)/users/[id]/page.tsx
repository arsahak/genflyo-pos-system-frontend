"use client";

import { getUserById, deleteUser } from "@/app/actions/users";
import { useStore } from "@/lib/store";
import { useSidebar } from "@/lib/SidebarContext";
import { useLanguage } from "@/lib/LanguageContext";
import { UserDetailsSkeleton } from "@/component/userManagement/components/UserDetailsSkeleton";
import ProtectedRoute from "@/component/ProtectedRoute";
import PermissionGuard from "@/component/PermissionGuard";
import { permissionCategories, getCategoryColorClasses } from "@/lib/permissionsList";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, use, ReactElement } from "react";
import toast from "react-hot-toast";
import { IoMdPerson, IoMdMail, IoMdCall, IoMdHome } from "react-icons/io";
import { 
  MdEdit, 
  MdDelete, 
  MdArrowBack,
  MdDashboard,
  MdAttachMoney,
  MdShoppingCart,
  MdStore,
  MdInventory,
  MdLocalShipping,
  MdPeople,
  MdSupervisorAccount,
  MdAnalytics,
  MdSettings
} from "react-icons/md";

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
  const { isDarkMode } = useSidebar();
  const { t } = useLanguage();
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
      const result = await getUserById(id);

      if (result.success && result.data) {
        setUserData(result.data);
      } else {
        toast.error(result.error || "Failed to load user");
        router.push("/users");
      }
    } catch (error: unknown) {
      console.error("Error loading user:", error);
      toast.error("An unexpected error occurred");
      router.push("/users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const result = await deleteUser(id);

      if (result.success) {
        toast.success("User deleted successfully");
        router.push("/users");
      } else {
        toast.error(result.error || "Failed to delete user");
      }
    } catch (error: unknown) {
      console.error("Error deleting user:", error);
      toast.error("An unexpected error occurred");
    }
  };

  if (!user) return null;

  // Get icon for category
  const getCategoryIcon = (iconName: string) => {
    const icons: Record<string, ReactElement> = {
      dashboard: <MdDashboard className="w-4 h-4" />,
      sales: <MdAttachMoney className="w-4 h-4" />,
      orders: <MdShoppingCart className="w-4 h-4" />,
      products: <MdStore className="w-4 h-4" />,
      inventory: <MdInventory className="w-4 h-4" />,
      suppliers: <MdLocalShipping className="w-4 h-4" />,
      customers: <MdPeople className="w-4 h-4" />,
      users: <MdSupervisorAccount className="w-4 h-4" />,
      stores: <MdStore className="w-4 h-4" />,
      reports: <MdAnalytics className="w-4 h-4" />,
      settings: <MdSettings className="w-4 h-4" />,
    };
    return icons[iconName] || <MdSettings className="w-4 h-4" />;
  };

  return (
    <ProtectedRoute requiredPermission="canViewUsers">
      <div className={`min-h-screen p-6 transition-colors duration-300 font-sans ${
        isDarkMode ? "bg-gray-950 text-gray-100" : "bg-slate-50 text-gray-900"
      }`}>
      {loading ? (
        <>
          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className={`text-3xl font-bold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}>
                User Details
              </h1>
              <p className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                View user information and permissions
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/users"
                className={`px-6 py-3 rounded-2xl transition-all shadow-sm flex items-center gap-2 ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <MdArrowBack className="w-5 h-5" />
                <span>Back</span>
              </Link>
            </div>
          </div>
          <UserDetailsSkeleton isDarkMode={isDarkMode} />
        </>
      ) : !userData ? (
        <div className="text-center py-12">
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            User not found
          </p>
          <Link
            href="/users"
            className="text-indigo-600 hover:underline mt-4 inline-block"
          >
            Back to Users
          </Link>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={`text-3xl font-bold ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}>
            {t("userDetails") || "User Details"}
          </h1>
          <p className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            {t("viewUserInfo") || "View user information and permissions"}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/users"
            className={`px-6 py-3 rounded-2xl transition-all shadow-sm flex items-center gap-2 ${
              isDarkMode
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <MdArrowBack className="w-5 h-5" />
            <span>{t("back") || "Back"}</span>
          </Link>
          <PermissionGuard permission="canEditUsers">
            <Link
              href={`/users/${id}/edit`}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-2xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <MdEdit className="w-5 h-5" />
              <span>{t("edit") || "Edit"}</span>
            </Link>
          </PermissionGuard>
          <PermissionGuard permission="canDeleteUsers">
            <button
              onClick={handleDelete}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-2xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <MdDelete className="w-5 h-5" />
              <span>{t("delete") || "Delete"}</span>
            </button>
          </PermissionGuard>
        </div>
      </div>

      <div className="space-y-6">
        {/* Role & Access Section */}
        <div className={`rounded-2xl border p-6 shadow-sm ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <h3 className={`text-lg font-semibold mb-6 ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}>
            {t("roleAccessLevel") || "Role & Access Level"}
          </h3>
          
          {/* Role Display Card */}
          <div className={`p-6 rounded-xl border-2 transition-all ${
            userData.role === "super_admin"
              ? "border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100/50"
              : userData.role === "admin"
              ? "border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100/50"
              : userData.role === "manager"
              ? "border-green-300 bg-gradient-to-br from-green-50 to-green-100/50"
              : "border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100/50"
          }`}>
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-xl ${
                userData.role === "super_admin"
                  ? "bg-purple-500"
                  : userData.role === "admin"
                  ? "bg-blue-500"
                  : userData.role === "manager"
                  ? "bg-green-500"
                  : "bg-orange-500"
              } text-white shadow-lg`}>
                {userData.role === "super_admin" ? (
                  <MdSupervisorAccount className="w-8 h-8" />
                ) : userData.role === "admin" ? (
                  <MdSupervisorAccount className="w-8 h-8" />
                ) : userData.role === "manager" ? (
                  <MdPeople className="w-8 h-8" />
                ) : (
                  <MdAttachMoney className="w-8 h-8" />
                )}
              </div>
              <div>
                <h4 className={`text-xl font-bold capitalize ${
                  userData.role === "super_admin"
                    ? "text-purple-900"
                    : userData.role === "admin"
                    ? "text-blue-900"
                    : userData.role === "manager"
                    ? "text-green-900"
                    : "text-orange-900"
                }`}>
                  {userData.role.replace("_", " ")}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {userData.role === "super_admin"
                    ? "Full system access with all permissions"
                    : userData.role === "admin"
                    ? "Administrative access with user management"
                    : userData.role === "manager"
                    ? "Management access with inventory control"
                    : "Point of Sale access for transactions"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className={`rounded-2xl shadow-sm border p-6 ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
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
              <h2 className={`text-2xl font-bold mb-1 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}>
                {userData.name}
              </h2>
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
          <div className={`rounded-2xl shadow-sm border p-6 ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}>
              {t("contactInformation") || "Contact Information"}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <IoMdMail className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {t("email") || "Email"}
                  </p>
                  <p className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                    {userData.email}
                  </p>
                </div>
              </div>
              {userData.phone && (
                <div className="flex items-start gap-3">
                  <IoMdCall className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {t("phoneNumber") || "Phone"}
                    </p>
                    <p className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                      {userData.phone}
                    </p>
                  </div>
                </div>
              )}
              {userData.address && (
                <div className="flex items-start gap-3">
                  <IoMdHome className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {t("address") || "Address"}
                    </p>
                    <p className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                      {userData.address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className={`rounded-2xl shadow-sm border p-6 ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}>
              {t("additionalInformation") || "Additional Information"}
            </h3>
            <div className="space-y-3">
              {userData.createdBy && (
                <div>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Created By
                  </p>
                  <p className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                    {userData.createdBy.name}
                  </p>
                </div>
              )}
              <div>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Created At
                </p>
                <p className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                  {new Date(userData.createdAt).toLocaleString()}
                </p>
              </div>
              {userData.lastLogin && (
                <div>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Last Login
                  </p>
                  <p className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                    {new Date(userData.lastLogin).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Permissions */}
        <div className="lg:col-span-2">
          <div className={`rounded-2xl shadow-sm border p-6 ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
            <h3 className={`text-lg font-semibold mb-6 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}>
              {t("accessPermissions") || "Access Permissions"}
            </h3>

            {permissionCategories && permissionCategories.length > 0 ? (
              <div className="space-y-5">
                {permissionCategories.map((category) => {
                  const categoryPermissions = category.permissions;
                  
                  if (categoryPermissions.length === 0) return null;

                  const colorClasses = getCategoryColorClasses(category.color);
                  const grantedCount = categoryPermissions.filter(
                    (perm) => userData.permissions?.[perm.key] === true
                  ).length;

                  return (
                    <div
                      key={category.title}
                      className={`border rounded-lg p-4 transition-shadow ${
                        isDarkMode
                          ? "bg-gray-700/50 border-gray-600"
                          : `${colorClasses.bg} ${colorClasses.border}`
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                          isDarkMode ? "text-gray-300" : colorClasses.text
                        }`}>
                          {getCategoryIcon(category.icon)}
                          {category.title}
                        </h4>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          grantedCount === categoryPermissions.length
                            ? "bg-green-100 text-green-700"
                            : grantedCount > 0
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {grantedCount}/{categoryPermissions.length}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2">
                        {categoryPermissions.map((permission) => {
                          const isGranted = userData.permissions?.[permission.key] === true;
                          return (
                            <div
                              key={permission.key}
                              className={`p-2.5 rounded-md border transition-all ${
                                isGranted
                                  ? isDarkMode
                                    ? "bg-green-900/20 border-green-700"
                                    : "bg-green-50 border-green-200"
                                  : isDarkMode
                                  ? "bg-gray-800 border-gray-700"
                                  : "bg-white border-gray-200"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className={`text-sm font-medium ${
                                    isGranted
                                      ? isDarkMode ? "text-green-300" : "text-green-900"
                                      : isDarkMode ? "text-gray-400" : "text-gray-700"
                                  }`}>
                                    {permission.label}
                                  </div>
                                  <p className={`text-xs ${
                                    isGranted
                                      ? isDarkMode ? "text-green-400/70" : "text-green-600"
                                      : isDarkMode ? "text-gray-500" : "text-gray-500"
                                  }`}>
                                    {permission.description}
                                  </p>
                                </div>
                                <div className="flex-shrink-0 ml-3">
                                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                                    isGranted
                                      ? "bg-green-200 text-green-800"
                                      : isDarkMode
                                      ? "bg-gray-700 text-gray-400"
                                      : "bg-gray-200 text-gray-600"
                                  }`}>
                                    {isGranted ? `✓ ${t("granted") || "Granted"}` : `✗ ${t("denied") || "Denied"}`}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                {t("noPermissions") || "No permissions assigned"}
              </p>
            )}
          </div>
        </div>
      </div>
      </div>
        </>
      )}
    </div>
    </ProtectedRoute>
  );
}
