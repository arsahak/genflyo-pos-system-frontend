"use client";
import { getCustomerById, updateCustomer, deleteCustomer } from "@/app/actions/customers";
import { useSidebar } from "@/lib/SidebarContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  MdArrowBack,
  MdBlock,
  MdDelete,
  MdEdit,
  MdEmail,
  MdLocationOn,
  MdLockOpen,
  MdPerson,
  MdPhone,
  MdStar,
} from "react-icons/md";
import { ViewCustomerSkeleton } from "./components/ViewCustomerSkeleton";

interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  membershipType: "none" | "regular" | "silver" | "gold" | "platinum";
  loyaltyPoints: number;
  totalSpent: number;
  visitCount: number;
  lastVisit?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ViewCustomerPageProps {
  customerId: string;
}

const ViewCustomerPage = ({ customerId }: ViewCustomerPageProps) => {
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);

  // Fetch customer data
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setIsLoading(true);
        const result = await getCustomerById(customerId);

        if (result.success && result.data) {
          setCustomer(result.data);
        } else {
          toast.error(result.error || "Failed to load customer data");
          router.push("/customers");
        }
      } catch (error) {
        console.error("Error fetching customer:", error);
        toast.error("An unexpected error occurred");
        router.push("/customers");
      } finally {
        setIsLoading(false);
      }
    };

    if (customerId) {
      fetchCustomer();
    }
  }, [customerId, router]);

  // Handle block/unblock
  const handleToggleBlock = async () => {
    if (!customer) return;

    try {
      if (customer.isActive) {
        // Block customer (set isActive to false)
        const formData = new FormData();
        formData.append("customerData", JSON.stringify({ isActive: false }));

        const result = await updateCustomer(customer._id, formData);

        if (result.success) {
          toast.success(`${customer.name} has been blocked`);
        } else {
          toast.error(result.error || "Failed to block customer");
          return;
        }
      } else {
        // Unblock customer (set isActive to true)
        const formData = new FormData();
        formData.append("customerData", JSON.stringify({ isActive: true }));

        const result = await updateCustomer(customer._id, formData);

        if (result.success) {
          toast.success(`${customer.name} has been unblocked`);
        } else {
          toast.error(result.error || "Failed to unblock customer");
          return;
        }
      }

      // Refresh customer data
      const refreshResult = await getCustomerById(customerId);
      if (refreshResult.success && refreshResult.data) {
        setCustomer(refreshResult.data);
      }
    } catch (error) {
      console.error("Error toggling customer status:", error);
      toast.error("An unexpected error occurred");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!customer) return;

    if (
      !window.confirm(
        `Are you sure you want to permanently delete ${customer.name}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const result = await deleteCustomer(customer._id);

      if (result.success) {
        toast.success(result.message || `${customer.name} has been deleted`);
        router.push("/customers");
      } else {
        toast.error(result.error || "Failed to delete customer");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("An unexpected error occurred");
    }
  };

  // Get membership badge color
  const getMembershipColor = (type: string) => {
    switch (type) {
      case "platinum":
        return isDarkMode
          ? "bg-purple-900 text-purple-200"
          : "bg-purple-100 text-purple-800";
      case "gold":
        return isDarkMode
          ? "bg-yellow-900 text-yellow-200"
          : "bg-yellow-100 text-yellow-800";
      case "silver":
        return isDarkMode
          ? "bg-gray-700 text-gray-200"
          : "bg-gray-200 text-gray-800";
      case "regular":
        return isDarkMode
          ? "bg-blue-900 text-blue-200"
          : "bg-blue-100 text-blue-800";
      default:
        return isDarkMode
          ? "bg-gray-800 text-gray-300"
          : "bg-gray-100 text-gray-600";
    }
  };

  if (isLoading) {
    return <ViewCustomerSkeleton isDarkMode={isDarkMode} />;
  }

  if (!customer) {
    return null;
  }

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-950" : "bg-slate-50"
      }`}
    >
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/customers")}
            className={`flex items-center gap-2 mb-4 transition-colors ${
              isDarkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <MdArrowBack className="text-xl" />
            Back to Customers
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}>
                {customer.name}
              </h1>
              <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                Customer Details
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/customers/edit-customer/${customer._id}`)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
              >
                <MdEdit />
                Edit
              </button>
              <button
                onClick={handleToggleBlock}
                className={`px-6 py-3 rounded-xl ${
                  customer.isActive
                    ? "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
                    : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                } text-white transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium`}
              >
                {customer.isActive ? <MdBlock /> : <MdLockOpen />}
                {customer.isActive ? "Block" : "Unblock"}
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
              >
                <MdDelete />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <div
            className={`lg:col-span-2 rounded-2xl shadow-xl border p-6 ${
              isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
            }`}
          >
            <h2 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}>
              Customer Information
            </h2>

          <div className="space-y-4">
            {/* Status */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-300 dark:border-gray-600">
              <span className="font-medium">Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  customer.isActive
                    ? isDarkMode
                      ? "bg-green-900 text-green-200"
                      : "bg-green-100 text-green-800"
                    : isDarkMode
                    ? "bg-red-900 text-red-200"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {customer.isActive ? "Active" : "Blocked"}
              </span>
            </div>

            {/* Name */}
            <div className="flex items-center gap-3">
              <MdPerson
                className={isDarkMode ? "text-gray-400" : "text-gray-500"}
              />
              <div>
                <div className="text-sm text-gray-500">Name</div>
                <div className="font-medium">{customer.name}</div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <MdPhone
                className={isDarkMode ? "text-gray-400" : "text-gray-500"}
              />
              <div>
                <div className="text-sm text-gray-500">Phone</div>
                <div className="font-medium">{customer.phone}</div>
              </div>
            </div>

            {/* Email */}
            {customer.email && (
              <div className="flex items-center gap-3">
                <MdEmail
                  className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium">{customer.email}</div>
                </div>
              </div>
            )}

            {/* Address */}
            {(customer.address?.street ||
              customer.address?.city ||
              customer.address?.state) && (
              <div className="flex items-start gap-3">
                <MdLocationOn
                  className={`mt-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <div>
                  <div className="text-sm text-gray-500">Address</div>
                  <div className="font-medium">
                    {customer.address.street && (
                      <div>{customer.address.street}</div>
                    )}
                    <div>
                      {[
                        customer.address.city,
                        customer.address.state,
                        customer.address.zipCode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                    {customer.address.country && (
                      <div>{customer.address.country}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {customer.notes && (
              <div className="pt-4 border-t border-gray-300 dark:border-gray-600">
                <div className="text-sm text-gray-500 mb-2">Notes</div>
                <div
                  className={`p-3 rounded-lg ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  {customer.notes}
                </div>
              </div>
            )}
          </div>
        </div>

          {/* Stats Card */}
          <div className="space-y-6">
            {/* Membership Card */}
            <div
              className={`rounded-2xl shadow-xl border p-6 ${
                isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
              }`}
            >
              <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}>
                <MdStar className="text-yellow-500" />
                Membership
              </h2>

              <div className="space-y-4">
                <div className="text-center">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-semibold ${getMembershipColor(
                      customer.membershipType
                    )}`}
                  >
                    <MdStar />
                    {customer.membershipType.charAt(0).toUpperCase() +
                      customer.membershipType.slice(1)}
                  </span>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">
                    {customer.loyaltyPoints}
                  </div>
                  <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Loyalty Points
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Card */}
            <div
              className={`rounded-2xl shadow-xl border p-6 ${
                isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
              }`}
            >
              <h2 className={`text-xl font-semibold mb-4 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}>
                Statistics
              </h2>

              <div className="space-y-4">
                <div>
                  <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Total Spent
                  </div>
                  <div className="text-2xl font-bold text-green-500">
                    ${customer.totalSpent.toFixed(2)}
                  </div>
                </div>

                <div>
                  <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Total Visits
                  </div>
                  <div className={`text-2xl font-bold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}>
                    {customer.visitCount}
                  </div>
                </div>

                {customer.lastVisit && (
                  <div>
                    <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Last Visit
                    </div>
                    <div className={`font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      {new Date(customer.lastVisit).toLocaleDateString()}
                    </div>
                  </div>
                )}

                <div>
                  <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Member Since
                  </div>
                  <div className={`font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCustomerPage;

