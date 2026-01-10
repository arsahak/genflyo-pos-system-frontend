"use client";

import { getUserById, updateUser } from "@/app/actions/users";
import { useStore } from "@/lib/store";
import { useSidebar } from "@/lib/SidebarContext";
import { useLanguage } from "@/lib/LanguageContext";
import { PermissionsRecord } from "@/lib/permissions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoMdCamera, IoMdEye, IoMdEyeOff, IoMdPerson } from "react-icons/io";
import {
    MdAdminPanelSettings,
    MdArrowBack,
    MdAttachMoney,
    MdSettings,
    MdStore,
    MdSupervisorAccount,
} from "react-icons/md";
import { UserFormSkeleton } from "./components/UserFormSkeleton";
import PermissionSelector from "./PermissionSelector";

interface UserEditProps {
  userId: string;
}

export default function UserEdit({ userId }: UserEditProps) {
  const { user } = useStore();
  const { isDarkMode } = useSidebar();
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "cashier",
    phone: "",
    address: "",
    permissions: {
      // Dashboard
      canViewDashboard: true,
      
      // POS & Sales Permissions
      canViewSales: false,
      canCreateSales: false,
      canEditSales: false,
      canDeleteSales: false,
      canProcessRefunds: false,
      canViewSalesReports: false,

      // Order Management Permissions
      canViewOrders: false,
      canCreateOrders: false,
      canEditOrders: false,
      canDeleteOrders: false,
      canApproveOrders: false,
      canCancelOrders: false,

      // Product Management Permissions (includes Barcodes)
      canViewProducts: false,
      canAddProducts: false,
      canEditProducts: false,
      canDeleteProducts: false,
      canManageCategories: false,
      canViewBarcodes: false,
      canGenerateBarcodes: false,
      canDeleteBarcodes: false,
      canManageBarcodes: false,

      // Inventory Management Permissions
      canViewInventory: false,
      canManageInventory: false,
      canAdjustStock: false,

      // Supplier Management Permissions
      canViewSuppliers: false,
      canAddSuppliers: false,
      canEditSuppliers: false,
      canDeleteSuppliers: false,
      canManageSuppliers: false,

      // Customer Management Permissions
      canViewCustomers: false,
      canAddCustomers: false,
      canEditCustomers: false,
      canDeleteCustomers: false,
      canViewCustomerHistory: false,

      // User Management Permissions
      canViewUsers: false,
      canAddUsers: false,
      canEditUsers: false,
      canDeleteUsers: false,
      canManageRoles: false,

      // Store Management Permissions
      canViewStores: false,
      canAddStores: false,
      canEditStores: false,
      canDeleteStores: false,
      canManageStoreSettings: false,

      // Reports & Analytics Permissions
      canViewReports: false,
      canExportReports: false,
      canViewAnalytics: false,

      // System Settings Permissions
      canManageSettings: false,
      canManagePaymentMethods: false,
      canManageTaxSettings: false,
      canManageReceiptSettings: false,
      canViewSystemLogs: false,
    },
  });

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
    loadUser();

    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [userId, user, router]);

  const loadUser = async () => {
    try {
      setFetching(true);
      const result = await getUserById(userId);

      if (result.success && result.data) {
        const userData = result.data;

        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          password: "",
          confirmPassword: "",
          role: userData.role || "cashier",
          phone: userData.phone || "",
          address: userData.address || "",
          permissions: userData.permissions || formData.permissions,
        });

        if (userData.profileImage) {
          setImagePreview(userData.profileImage);
        }
      } else {
        toast.error(result.error || "Failed to load user");
        router.push("/users");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("An unexpected error occurred");
      router.push("/users");
    } finally {
      setFetching(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "cashier":
        return "Process sales and handle transactions";
      case "manager":
        return "Manage inventory and products";
      case "admin":
        return "Full system access";
      default:
        return "Basic user access";
    }
  };

  // Get default permissions based on role
  const getDefaultPermissions = (role: string): PermissionsRecord => {
    const basePermissions = {
      // Dashboard
      canViewDashboard: true,
      
      // POS & Sales
      canViewSales: false,
      canCreateSales: false,
      canEditSales: false,
      canDeleteSales: false,
      canProcessRefunds: false,
      canViewSalesReports: false,

      // Orders
      canViewOrders: false,
      canCreateOrders: false,
      canEditOrders: false,
      canDeleteOrders: false,
      canApproveOrders: false,
      canCancelOrders: false,

      // Products
      canViewProducts: false,
      canAddProducts: false,
      canEditProducts: false,
      canDeleteProducts: false,
      canManageCategories: false,

      // Barcodes
      canViewBarcodes: false,
      canGenerateBarcodes: false,
      canDeleteBarcodes: false,
      canManageBarcodes: false,

      // Inventory
      canViewInventory: false,
      canManageInventory: false,
      canAdjustStock: false,

      // Suppliers
      canViewSuppliers: false,
      canAddSuppliers: false,
      canEditSuppliers: false,
      canDeleteSuppliers: false,
      canManageSuppliers: false,

      // Customers
      canViewCustomers: false,
      canAddCustomers: false,
      canEditCustomers: false,
      canDeleteCustomers: false,
      canViewCustomerHistory: false,

      // Users
      canViewUsers: false,
      canAddUsers: false,
      canEditUsers: false,
      canDeleteUsers: false,
      canManageRoles: false,

      // Stores
      canViewStores: false,
      canAddStores: false,
      canEditStores: false,
      canDeleteStores: false,
      canManageStoreSettings: false,

      // Reports
      canViewReports: false,
      canExportReports: false,
      canViewAnalytics: false,

      // Settings
      canManageSettings: false,
      canManagePaymentMethods: false,
      canManageTaxSettings: false,
      canManageReceiptSettings: false,
      canViewSystemLogs: false,
    };

    switch (role) {
      case "cashier":
        return {
          ...basePermissions,
          canViewSales: true,
          canCreateSales: true,
          canViewProducts: true,
          canViewCustomers: true,
          canAddCustomers: true,
          canViewDashboard: true,
        };

      case "manager":
        return {
          ...basePermissions,
          canViewSales: true,
          canCreateSales: true,
          canEditSales: true,
          canViewSalesReports: true,
          canViewProducts: true,
          canAddProducts: true,
          canEditProducts: true,
          canManageCategories: true,
          canViewInventory: true,
          canManageInventory: true,
          canAdjustStock: true,
          canViewCustomers: true,
          canAddCustomers: true,
          canEditCustomers: true,
          canViewCustomerHistory: true,
          canViewReports: true,
          canViewAnalytics: true,
          canViewDashboard: true,
        };

      case "admin":
        return {
          ...basePermissions,
          canViewSales: true,
          canCreateSales: true,
          canEditSales: true,
          canDeleteSales: true,
          canProcessRefunds: true,
          canViewSalesReports: true,
          canViewProducts: true,
          canAddProducts: true,
          canEditProducts: true,
          canDeleteProducts: true,
          canManageCategories: true,
          canViewInventory: true,
          canManageInventory: true,
          canAdjustStock: true,
          canViewCustomers: true,
          canAddCustomers: true,
          canEditCustomers: true,
          canDeleteCustomers: true,
          canViewCustomerHistory: true,
          canViewUsers: true,
          canAddUsers: true,
          canEditUsers: true,
          canDeleteUsers: true,
          canManageRoles: true,
          canViewStores: true,
          canAddStores: true,
          canEditStores: true,
          canDeleteStores: true,
          canManageStoreSettings: true,
          canViewReports: true,
          canExportReports: true,
          canViewAnalytics: true,
          canViewDashboard: true,
          canManageSettings: true,
          canManagePaymentMethods: true,
          canManageTaxSettings: true,
          canManageReceiptSettings: true,
          canViewSystemLogs: true,
        };

      default:
        return basePermissions;
    }
  };

  // Handle role change and auto-assign permissions
  const handleRoleChange = (newRole: string) => {
    const defaultPermissions = getDefaultPermissions(newRole);
    setFormData({
      ...formData,
      role: newRole,
      permissions: defaultPermissions,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only validate passwords if they are provided
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);

      // Only append password if it's being changed
      if (formData.password && formData.password.trim() !== '') {
        submitData.append("password", formData.password);
      }

      submitData.append("role", formData.role);
      submitData.append("phone", formData.phone);
      submitData.append("address", formData.address);
      submitData.append("permissions", JSON.stringify(formData.permissions));

      if (profileImage) {
        submitData.append("profileImage", profileImage);
      }

      const result = await updateUser(userId, submitData);

      if (result.success) {
        toast.success(result.message || "User updated successfully!");
        router.push("/users");
      } else {
        toast.error(result.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 font-sans ${
      isDarkMode ? "bg-gray-950 text-gray-100" : "bg-slate-50 text-gray-900"
    }`}>
      {initialLoading || fetching ? (
        <UserFormSkeleton isDarkMode={isDarkMode} />
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                {t("editUser") || "Edit User"}
              </h1>
              <p className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                {t("updateUserInfo") || "Update user information and permissions"}
              </p>
            </div>
            <Link
              href="/users"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <MdArrowBack className="w-5 h-5" />
              <span>{t("back") || "Back to Users"}</span>
            </Link>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
        <div className="space-y-6">
            {/* Profile Image Section */}
            <div className={`rounded-2xl border p-6 shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                Profile Image
              </h3>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center overflow-hidden ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <IoMdPerson className={`w-12 h-12 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 cursor-pointer hover:bg-indigo-700 transition-colors">
                    <IoMdCamera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Upload a profile picture
                  </p>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    JPG, PNG or GIF (max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className={`rounded-2xl border p-6 shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="md:col-span-2">
                  <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    placeholder="Enter full name"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    }`}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    placeholder="user@example.com"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    }`}
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+1 (555) 123-4567"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    }`}
                  />
                </div>

                {/* Address Field */}
                <div className="md:col-span-2">
                  <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Enter full address"
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Security Information */}
            <div className={`rounded-2xl border p-6 shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                Change Password
              </h3>
              <p className={`text-sm mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Leave blank to keep current password
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password Field */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      minLength={6}
                      placeholder="Minimum 6 characters"
                      className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                        isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {showPassword ? (
                        <IoMdEyeOff className="w-5 h-5" />
                      ) : (
                        <IoMdEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      minLength={6}
                      placeholder="Re-enter password"
                      className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                        isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {showConfirmPassword ? (
                        <IoMdEyeOff className="w-5 h-5" />
                      ) : (
                        <IoMdEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Selection - Full Width */}
            <div className={`rounded-2xl border p-6 shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <h3 className={`text-lg font-semibold mb-2 flex items-center ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                <MdAdminPanelSettings className="w-5 h-5 mr-2 text-indigo-600" />
                Role & Access
              </h3>
              <p className={`text-sm mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Select user role to auto-configure default permissions
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    value: "cashier",
                    label: "Cashier",
                    icon: <MdAttachMoney className="w-6 h-6" />,
                  },
                  {
                    value: "manager",
                    label: "Manager",
                    icon: <MdSupervisorAccount className="w-6 h-6" />,
                  },
                  {
                    value: "admin",
                    label: "Admin",
                    icon: <MdAdminPanelSettings className="w-6 h-6" />,
                  },
                ].map((role) => (
                  <label
                    key={role.value}
                    className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                      formData.role === role.value
                        ? isDarkMode
                          ? "border-indigo-500 bg-indigo-900/30 shadow-lg"
                          : "border-indigo-500 bg-indigo-50 shadow-lg"
                        : isDarkMode
                        ? "border-gray-600 hover:border-gray-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`p-4 rounded-full mb-3 ${
                        formData.role === role.value
                          ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                          : isDarkMode
                          ? "bg-gray-700 text-gray-400"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {role.icon}
                    </div>
                    <div className="text-center">
                      <div className={`font-semibold text-lg mb-1 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                        {role.label}
                      </div>
                      <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {getRoleDescription(role.value)}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Access Permissions - Full Width */}
            <div className={`rounded-2xl border p-6 shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <h3 className={`text-lg font-semibold mb-2 flex items-center ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                <MdSettings className="w-5 h-5 mr-2 text-indigo-600" />
                Access Permissions
              </h3>
              <p className={`text-sm mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Configure user access rights for different modules
              </p>

              <PermissionSelector
                permissions={formData.permissions}
                onChange={(newPermissions) =>
                  setFormData({ ...formData, permissions: newPermissions })
                }
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-8 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating User...
                    </span>
                  ) : (
                    "Update User"
                  )}
                </button>
              </div>
        </div>
      </form>
        </>
      )}
    </div>
  );
}
