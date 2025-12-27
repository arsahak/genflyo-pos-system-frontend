"use client";

import { createUser } from "@/app/actions/users";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoMdCamera, IoMdEye, IoMdEyeOff, IoMdPerson } from "react-icons/io";
import {
  MdAdminPanelSettings,
  MdAttachMoney,
  MdSettings,
  MdStore,
  MdSupervisorAccount,
} from "react-icons/md";

export default function NewUserCreate() {
  const { user } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
      // POS & Sales Permissions
      canViewSales: true,
      canCreateSales: true,
      canEditSales: false,
      canDeleteSales: false,
      canProcessRefunds: false,
      canViewSalesReports: false,

      // Product Management Permissions
      canViewProducts: false,
      canAddProducts: false,
      canEditProducts: false,
      canDeleteProducts: false,
      canManageCategories: false,
      canViewInventory: false,
      canManageInventory: false,
      canAdjustStock: false,

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
      canViewDashboard: true,

      // System Settings Permissions
      canManageSettings: false,
      canManagePaymentMethods: false,
      canManageTaxSettings: false,
      canManageReceiptSettings: false,
      canViewSystemLogs: false,
    },
  });

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
        return "Process transactions and handle payments";
      case "seller":
        return "Manage sales and customer interactions";
      case "editor":
        return "Edit content and manage products";
      case "manager":
        return "Oversee operations and manage team";
      case "admin":
        return "Full system access and user management";
      case "super_admin":
        return "Complete system control and configuration";
      default:
        return "Basic user access";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);
      submitData.append("role", formData.role);
      submitData.append("phone", formData.phone);
      submitData.append("address", formData.address);
      submitData.append("permissions", JSON.stringify(formData.permissions));

      if (profileImage) {
        submitData.append("profileImage", profileImage);
      }

      const result = await createUser(submitData);

      if (result.success) {
        toast.success(result.message || "User created successfully!");
        router.push("/users");
      } else {
        toast.error(result.error || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    router.push("/");
    return null;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New User</h1>
          <p className="text-gray-500 mt-1">
            Add a new team member to your system
          </p>
        </div>
        <Link
          href="/users"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <span>←</span>
          <span>Back to Users</span>
        </Link>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Basic Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Image Section */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Image
              </h3>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <IoMdPerson className="w-12 h-12 text-gray-400" />
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
                  <p className="text-sm text-gray-600 mb-2">
                    Upload a profile picture
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG or GIF (max 5MB)
                  </p>
                </div>
              </div>
        </div>

            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
                <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Address Field */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Enter full address"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Security Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Security Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
                  <div className="relative">
            <input
                      type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              minLength={6}
              placeholder="Minimum 6 characters"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password <span className="text-red-500">*</span>
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
              required
              minLength={6}
              placeholder="Re-enter password"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
          </div>

          {/* Right Column - Role & Permissions */}
          <div className="space-y-6">
            {/* Role Selection */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Role & Access
              </h3>

              <div className="space-y-3">
                {[
                  {
                    value: "cashier",
                    label: "Cashier",
                    icon: <MdAttachMoney className="w-5 h-5" />,
                  },
                  {
                    value: "seller",
                    label: "Seller",
                    icon: <MdStore className="w-5 h-5" />,
                  },
                  {
                    value: "editor",
                    label: "Editor",
                    icon: <IoMdPerson className="w-5 h-5" />,
                  },
                  {
                    value: "manager",
                    label: "Manager",
                    icon: <MdSupervisorAccount className="w-5 h-5" />,
                  },
                  {
                    value: "admin",
                    label: "Admin",
                    icon: <MdAdminPanelSettings className="w-5 h-5" />,
                  },
                  {
                    value: "super_admin",
                    label: "Super Admin",
                    icon: <MdSettings className="w-5 h-5" />,
                  },
                ].map((role) => (
                  <label
                    key={role.value}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.role === role.value
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          formData.role === role.value
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {role.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {role.label}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getRoleDescription(role.value)}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Permissions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <MdSettings className="w-5 h-5 mr-2 text-indigo-600" />
                Access Permissions
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Configure user access rights for different modules
              </p>

              <div className="space-y-5">
                {/* POS & Sales Permissions */}
                <div className="border border-green-200 rounded-lg p-4 bg-gradient-to-br from-green-50 to-white hover:shadow-md transition-shadow">
                  <h4 className="text-xs font-bold text-green-700 mb-3 flex items-center uppercase tracking-wider">
                    <MdAttachMoney className="w-4 h-4 mr-2" />
                    POS & Sales
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      {
                        key: "canViewSales",
                        label: "View Sales",
                        description: "Access sales data and reports",
                      },
                      {
                        key: "canCreateSales",
                        label: "Create Sales",
                        description: "Process new transactions",
                      },
                      {
                        key: "canEditSales",
                        label: "Edit Sales",
                        description: "Modify existing transactions",
                      },
                      {
                        key: "canDeleteSales",
                        label: "Delete Sales",
                        description: "Remove sales records",
                      },
                      {
                        key: "canProcessRefunds",
                        label: "Process Refunds",
                        description: "Handle refund transactions",
                      },
                      {
                        key: "canViewSalesReports",
                        label: "View Sales Reports",
                        description: "Access sales analytics",
                      },
                    ].map((permission) => (
                      <label
                        key={permission.key}
                        className="flex items-center justify-between p-2.5 bg-white rounded-md border border-gray-200 hover:border-green-400 hover:bg-green-50/50 transition-all cursor-pointer group"
                      >
                        <div className="flex-1 min-w-0 pr-3">
                          <div className="text-sm font-medium text-gray-900 group-hover:text-green-700">
                            {permission.label}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={
                              formData.permissions[
                                permission.key as keyof typeof formData.permissions
                              ]
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                permissions: {
                                  ...formData.permissions,
                                  [permission.key]: e.target.checked,
                                },
                              })
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-9 h-5 rounded-full transition-colors ${
                              formData.permissions[
                                permission.key as keyof typeof formData.permissions
                              ]
                                ? "bg-green-600"
                                : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                                formData.permissions[
                                  permission.key as keyof typeof formData.permissions
                                ]
                                  ? "translate-x-4"
                                  : "translate-x-0.5"
                              } mt-0.5`}
                            />
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Product Management Permissions */}
                <div className="border border-blue-200 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-shadow">
                  <h4 className="text-xs font-bold text-blue-700 mb-3 flex items-center uppercase tracking-wider">
                    <MdStore className="w-4 h-4 mr-2" />
                    Product Management
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      {
                        key: "canViewProducts",
                        label: "View Products",
                        description: "See product catalog",
                      },
                      {
                        key: "canAddProducts",
                        label: "Add Products",
                        description: "Create new products",
                      },
                      {
                        key: "canEditProducts",
                        label: "Edit Products",
                        description: "Modify product details",
                      },
                      {
                        key: "canDeleteProducts",
                        label: "Delete Products",
                        description: "Remove products",
                      },
                      {
                        key: "canManageCategories",
                        label: "Manage Categories",
                        description: "Organize product categories",
                      },
                      {
                        key: "canViewInventory",
                        label: "View Inventory",
                        description: "See stock levels",
                      },
                      {
                        key: "canManageInventory",
                        label: "Manage Inventory",
                        description: "Update stock quantities",
                      },
                      {
                        key: "canAdjustStock",
                        label: "Adjust Stock",
                        description: "Make stock adjustments",
                      },
                    ].map((permission) => (
                      <label
                        key={permission.key}
                        className="flex items-center justify-between p-2.5 bg-white rounded-md border border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group"
                      >
                        <div className="flex-1 min-w-0 pr-3">
                          <div className="text-sm font-medium text-gray-900 group-hover:text-blue-700">
                            {permission.label}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={
                              formData.permissions[
                                permission.key as keyof typeof formData.permissions
                              ]
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                permissions: {
                                  ...formData.permissions,
                                  [permission.key]: e.target.checked,
                                },
                              })
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-9 h-5 rounded-full transition-colors ${
                              formData.permissions[
                                permission.key as keyof typeof formData.permissions
                              ]
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                                formData.permissions[
                                  permission.key as keyof typeof formData.permissions
                                ]
                                  ? "translate-x-4"
                                  : "translate-x-0.5"
                              } mt-0.5`}
                            />
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Customer Management Permissions */}
                <div className="border border-purple-200 rounded-lg p-4 bg-gradient-to-br from-purple-50 to-white hover:shadow-md transition-shadow">
                  <h4 className="text-xs font-bold text-purple-700 mb-3 flex items-center uppercase tracking-wider">
                    <IoMdPerson className="w-4 h-4 mr-2" />
                    Customer Management
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      {
                        key: "canViewCustomers",
                        label: "View Customers",
                        description: "See customer list",
                      },
                      {
                        key: "canAddCustomers",
                        label: "Add Customers",
                        description: "Create new customers",
                      },
                      {
                        key: "canEditCustomers",
                        label: "Edit Customers",
                        description: "Modify customer details",
                      },
                      {
                        key: "canDeleteCustomers",
                        label: "Delete Customers",
                        description: "Remove customers",
                      },
                      {
                        key: "canViewCustomerHistory",
                        label: "View Customer History",
                        description: "See purchase history",
                      },
                    ].map((permission) => (
                      <label
                        key={permission.key}
                        className="flex items-center justify-between p-2.5 bg-white rounded-md border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer group"
                      >
                        <div className="flex-1 min-w-0 pr-3">
                          <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-700">
                            {permission.label}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={
                              formData.permissions[
                                permission.key as keyof typeof formData.permissions
                              ]
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                permissions: {
                                  ...formData.permissions,
                                  [permission.key]: e.target.checked,
                                },
                              })
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-9 h-5 rounded-full transition-colors ${
                              formData.permissions[
                                permission.key as keyof typeof formData.permissions
                              ]
                                ? "bg-indigo-600"
                                : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                                formData.permissions[
                                  permission.key as keyof typeof formData.permissions
                                ]
                                  ? "translate-x-4"
                                  : "translate-x-0.5"
                              } mt-0.5`}
                            />
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* User Management Permissions */}
                <div className="border border-orange-200 rounded-lg p-4 bg-gradient-to-br from-orange-50 to-white hover:shadow-md transition-shadow">
                  <h4 className="text-xs font-bold text-orange-700 mb-3 flex items-center uppercase tracking-wider">
                    <MdSupervisorAccount className="w-4 h-4 mr-2" />
                    User Management
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      {
                        key: "canViewUsers",
                        label: "View Users",
                        description: "See user list and profiles",
                      },
                      {
                        key: "canAddUsers",
                        label: "Add Users",
                        description: "Create new user accounts",
                      },
                      {
                        key: "canEditUsers",
                        label: "Edit Users",
                        description: "Modify user details",
                      },
                      {
                        key: "canDeleteUsers",
                        label: "Delete Users",
                        description: "Remove user accounts",
                      },
                      {
                        key: "canManageRoles",
                        label: "Manage Roles",
                        description: "Assign and modify roles",
                      },
                    ].map((permission) => (
                      <label
                        key={permission.key}
                        className="flex items-center justify-between p-2.5 bg-white rounded-md border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer group"
                      >
                        <div className="flex-1 min-w-0 pr-3">
                          <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-700">
                            {permission.label}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={
                              formData.permissions[
                                permission.key as keyof typeof formData.permissions
                              ]
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                permissions: {
                                  ...formData.permissions,
                                  [permission.key]: e.target.checked,
                                },
                              })
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-9 h-5 rounded-full transition-colors ${
                              formData.permissions[
                                permission.key as keyof typeof formData.permissions
                              ]
                                ? "bg-indigo-600"
                                : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                                formData.permissions[
                                  permission.key as keyof typeof formData.permissions
                                ]
                                  ? "translate-x-4"
                                  : "translate-x-0.5"
                              } mt-0.5`}
                            />
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Reports & Analytics Permissions */}
                <div className="border border-indigo-200 rounded-lg p-4 bg-gradient-to-br from-indigo-50 to-white hover:shadow-md transition-shadow">
                  <h4 className="text-xs font-bold text-indigo-700 mb-3 flex items-center uppercase tracking-wider">
                    <MdSettings className="w-4 h-4 mr-2" />
                    Reports & Analytics
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      {
                        key: "canViewDashboard",
                        label: "View Dashboard",
                        description: "Access main dashboard",
                      },
                      {
                        key: "canViewReports",
                        label: "View Reports",
                        description: "Access analytics and reports",
                      },
                      {
                        key: "canExportReports",
                        label: "Export Reports",
                        description: "Download report data",
                      },
                      {
                        key: "canViewAnalytics",
                        label: "View Analytics",
                        description: "Access detailed analytics",
                      },
                    ].map((permission) => (
                      <label
                        key={permission.key}
                        className="flex items-center justify-between p-2.5 bg-white rounded-md border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer group"
                      >
                        <div className="flex-1 min-w-0 pr-3">
                          <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-700">
                            {permission.label}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={
                              formData.permissions[
                                permission.key as keyof typeof formData.permissions
                              ]
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                permissions: {
                                  ...formData.permissions,
                                  [permission.key]: e.target.checked,
                                },
                              })
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-9 h-5 rounded-full transition-colors ${
                              formData.permissions[
                                permission.key as keyof typeof formData.permissions
                              ]
                                ? "bg-indigo-600"
                                : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                                formData.permissions[
                                  permission.key as keyof typeof formData.permissions
                                ]
                                  ? "translate-x-4"
                                  : "translate-x-0.5"
                              } mt-0.5`}
                            />
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* System Settings Permissions */}
                <div className="border border-red-200 rounded-lg p-4 bg-gradient-to-br from-red-50 to-white hover:shadow-md transition-shadow">
                  <h4 className="text-xs font-bold text-red-700 mb-3 flex items-center uppercase tracking-wider">
                    <MdAdminPanelSettings className="w-4 h-4 mr-2" />
                    System Settings
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      {
                        key: "canManageSettings",
                        label: "Manage Settings",
                        description: "Configure system settings",
                      },
                      {
                        key: "canManagePaymentMethods",
                        label: "Manage Payment Methods",
                        description: "Configure payment options",
                      },
                      {
                        key: "canManageTaxSettings",
                        label: "Manage Tax Settings",
                        description: "Configure tax rates",
                      },
                      {
                        key: "canManageReceiptSettings",
                        label: "Manage Receipt Settings",
                        description: "Configure receipt templates",
                      },
                      {
                        key: "canViewSystemLogs",
                        label: "View System Logs",
                        description: "Access system activity logs",
                      },
                    ].map((permission) => (
                      <label
                        key={permission.key}
                        className="flex items-center justify-between p-2.5 bg-white rounded-md border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer group"
                      >
                        <div className="flex-1 min-w-0 pr-3">
                          <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-700">
                            {permission.label}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={
                              formData.permissions[
                                permission.key as keyof typeof formData.permissions
                              ]
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                permissions: {
                                  ...formData.permissions,
                                  [permission.key]: e.target.checked,
                                },
                              })
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-9 h-5 rounded-full transition-colors ${
                              formData.permissions[
                                permission.key as keyof typeof formData.permissions
                              ]
                                ? "bg-indigo-600"
                                : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                                formData.permissions[
                                  permission.key as keyof typeof formData.permissions
                                ]
                                  ? "translate-x-4"
                                  : "translate-x-0.5"
                              } mt-0.5`}
                            />
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
          </div>

          {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
                  onClick={handleSubmit}
                  className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
                      Creating User...
                </span>
              ) : (
                "Create User"
              )}
            </button>

                <Link
                  href="/users"
                  className="w-full px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center font-semibold block"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
          </div>
        </form>
    </div>
  );
}
