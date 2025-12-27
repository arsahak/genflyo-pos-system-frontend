"use client";
import { getAllCustomers, deleteCustomer, updateCustomer } from "@/app/actions/customers";
import { useSidebar } from "@/lib/SidebarContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  MdAdd,
  MdBlock,
  MdDelete,
  MdEdit,
  MdEmail,
  MdLockOpen,
  MdPerson,
  MdPhone,
  MdSearch,
  MdStar,
  MdVisibility,
} from "react-icons/md";

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
  tags?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const CustomersDetials = () => {
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch customers
  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getAllCustomers({
        limit: 1000,
        search: searchQuery || undefined,
      });

      if (result.success && result.data) {
        const customersList = result.data.customers || [];
        setCustomers(customersList);
        setFilteredCustomers(customersList);
        toast.success(`${customersList.length} customers loaded`);
      } else {
        toast.error(result.error || "Failed to load customers");
        setCustomers([]);
        setFilteredCustomers([]);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("An unexpected error occurred");
      setCustomers([]);
      setFilteredCustomers([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone.includes(searchQuery) ||
          customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchQuery, customers]);

  // Block/Unblock customer
  const handleToggleBlock = async (customer: Customer) => {
    try {
      if (customer.isActive) {
        // Block customer (set isActive to false)
        const formData = new FormData();
        formData.append("customerData", JSON.stringify({ isActive: false }));

        const result = await updateCustomer(customer._id, formData);

        if (result.success) {
          toast.success(`${customer.name} has been blocked`);
          fetchCustomers();
        } else {
          toast.error(result.error || "Failed to block customer");
        }
      } else {
        // Unblock customer (set isActive to true)
        const formData = new FormData();
        formData.append("customerData", JSON.stringify({ isActive: true }));

        const result = await updateCustomer(customer._id, formData);

        if (result.success) {
          toast.success(`${customer.name} has been unblocked`);
          fetchCustomers();
        } else {
          toast.error(result.error || "Failed to unblock customer");
        }
      }
    } catch (error) {
      console.error("Error toggling customer status:", error);
      toast.error("An unexpected error occurred");
    }
  };

  // Delete customer permanently
  const handleDelete = async (customer: Customer) => {
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
        fetchCustomers();
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

  return (
    <div
      className={`min-h-screen p-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Customer Management</h1>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
          Manage your customers, memberships, and loyalty programs
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div
          className={`p-4 rounded-lg shadow ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                Total Customers
              </p>
              <p className="text-2xl font-bold">{customers.length}</p>
            </div>
            <MdPerson className="text-4xl text-blue-500" />
          </div>
        </div>

        <div
          className={`p-4 rounded-lg shadow ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                Active Customers
              </p>
              <p className="text-2xl font-bold">
                {customers.filter((c) => c.isActive).length}
              </p>
            </div>
            <MdLockOpen className="text-4xl text-green-500" />
          </div>
        </div>

        <div
          className={`p-4 rounded-lg shadow ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                Platinum Members
              </p>
              <p className="text-2xl font-bold">
                {
                  customers.filter((c) => c.membershipType === "platinum")
                    .length
                }
              </p>
            </div>
            <MdStar className="text-4xl text-purple-500" />
          </div>
        </div>

        <div
          className={`p-4 rounded-lg shadow ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                Blocked Customers
              </p>
              <p className="text-2xl font-bold">
                {customers.filter((c) => !c.isActive).length}
              </p>
            </div>
            <MdBlock className="text-4xl text-red-500" />
          </div>
        </div>
      </div>

      {/* Search and Add */}
      <div
        className={`p-4 rounded-lg shadow mb-6 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <MdSearch
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-xl ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>

          {/* Add Button */}
          <button
            onClick={() => router.push("/customers/create-customer")}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg whitespace-nowrap"
          >
            <MdAdd className="text-xl" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Customer List */}
      <div
        className={`rounded-lg shadow overflow-hidden ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading customers...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-8 text-center">
            <MdPerson className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-semibold mb-2">No customers found</p>
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              {searchQuery
                ? "Try adjusting your search"
                : "Add your first customer to get started"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                className={
                  isDarkMode
                    ? "bg-gray-700 border-b border-gray-600"
                    : "bg-gray-50 border-b border-gray-200"
                }
              >
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Membership
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={
                  isDarkMode
                    ? "divide-y divide-gray-700"
                    : "divide-y divide-gray-200"
                }
              >
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer._id}
                    className={`${
                      !customer.isActive
                        ? "opacity-50"
                        : isDarkMode
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-50"
                    } transition-colors`}
                  >
                    {/* Customer Name */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`h-10 w-10 rounded-full ${
                            isDarkMode ? "bg-blue-900" : "bg-blue-100"
                          } flex items-center justify-center mr-3`}
                        >
                          <MdPerson
                            className={
                              isDarkMode ? "text-blue-300" : "text-blue-600"
                            }
                          />
                        </div>
                        <div>
                          <div className="font-semibold">{customer.name}</div>
                          <div
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Joined{" "}
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm">
                          <MdPhone
                            className={
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }
                          />
                          <span>{customer.phone}</span>
                        </div>
                        {customer.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <MdEmail
                              className={
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }
                            />
                            <span className="truncate max-w-[200px]">
                              {customer.email}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Membership */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getMembershipColor(
                            customer.membershipType
                          )}`}
                        >
                          <MdStar />
                          {customer.membershipType.charAt(0).toUpperCase() +
                            customer.membershipType.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {customer.loyaltyPoints} points
                        </span>
                      </div>
                    </td>

                    {/* Stats */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1 text-sm">
                        <div>
                          <span
                            className={
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }
                          >
                            Spent:
                          </span>{" "}
                          <span className="font-semibold">
                            ${customer.totalSpent.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span
                            className={
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }
                          >
                            Visits:
                          </span>{" "}
                          <span className="font-semibold">
                            {customer.visitCount}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
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
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            router.push(`/customers/view-customer/${customer._id}`)
                          }
                          className={`p-2 rounded-lg ${
                            isDarkMode
                              ? "hover:bg-gray-600 text-green-400"
                              : "hover:bg-gray-100 text-green-600"
                          } transition-colors`}
                          title="View Details"
                        >
                          <MdVisibility className="text-xl" />
                        </button>
                        <button
                          onClick={() =>
                            router.push(
                              `/customers/edit-customer/${customer._id}`
                            )
                          }
                          className={`p-2 rounded-lg ${
                            isDarkMode
                              ? "hover:bg-gray-600 text-blue-400"
                              : "hover:bg-gray-100 text-blue-600"
                          } transition-colors`}
                          title="Edit"
                        >
                          <MdEdit className="text-xl" />
                        </button>
                        <button
                          onClick={() => handleToggleBlock(customer)}
                          className={`p-2 rounded-lg ${
                            customer.isActive
                              ? isDarkMode
                                ? "hover:bg-gray-600 text-orange-400"
                                : "hover:bg-gray-100 text-orange-600"
                              : isDarkMode
                              ? "hover:bg-gray-600 text-green-400"
                              : "hover:bg-gray-100 text-green-600"
                          } transition-colors`}
                          title={customer.isActive ? "Block" : "Unblock"}
                        >
                          {customer.isActive ? (
                            <MdBlock className="text-xl" />
                          ) : (
                            <MdLockOpen className="text-xl" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(customer)}
                          className={`p-2 rounded-lg ${
                            isDarkMode
                              ? "hover:bg-gray-600 text-red-400"
                              : "hover:bg-gray-100 text-red-600"
                          } transition-colors`}
                          title="Delete"
                        >
                          <MdDelete className="text-xl" />
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
};

export default CustomersDetials;
