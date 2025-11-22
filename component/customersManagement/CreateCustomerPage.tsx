"use client";
import api from "@/lib/api";
import { useSidebar } from "@/lib/SidebarContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  MdArrowBack,
  MdEmail,
  MdLocationOn,
  MdPerson,
  MdPhone,
  MdSave,
} from "react-icons/md";

const CreateCustomerPage = () => {
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    membershipType: "regular" as "none" | "regular" | "silver" | "gold" | "platinum",
    notes: "",
  });

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Customer name is required");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const customerData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        address: {
          street: formData.street.trim() || undefined,
          city: formData.city.trim() || undefined,
          state: formData.state.trim() || undefined,
          zipCode: formData.zipCode.trim() || undefined,
          country: formData.country.trim() || undefined,
        },
        membershipType: formData.membershipType,
        notes: formData.notes.trim() || undefined,
      };

      await api.post("/customers", customerData);
      toast.success("Customer created successfully!");
      router.push("/customers");
    } catch (error) {
      console.error("Error creating customer:", error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to create customer");
    } finally {
      setIsSubmitting(false);
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
        <button
          onClick={() => router.push("/customers")}
          className={`flex items-center gap-2 mb-4 ${
            isDarkMode
              ? "text-gray-400 hover:text-white"
              : "text-gray-600 hover:text-gray-900"
          } transition-colors`}
        >
          <MdArrowBack className="text-xl" />
          Back to Customers
        </button>
        <h1 className="text-3xl font-bold">Create New Customer</h1>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
          Add a new customer to your database
        </p>
      </div>

      {/* Form */}
      <div
        className={`rounded-lg shadow max-w-4xl ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MdPerson
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Enter customer name"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MdPhone
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email (Optional)
                  </label>
                  <div className="relative">
                    <MdEmail
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="customer@example.com"
                    />
                  </div>
                </div>

                {/* Membership Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Membership Type
                  </label>
                  <select
                    value={formData.membershipType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        membershipType: e.target.value as "none" | "regular" | "silver" | "gold" | "platinum",
                      })
                    }
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  >
                    <option value="none">No Membership</option>
                    <option value="regular">Regular (0% discount)</option>
                    <option value="silver">Silver (5% discount)</option>
                    <option value="gold">Gold (10% discount)</option>
                    <option value="platinum">Platinum (15% discount)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="pt-6 border-t border-gray-300 dark:border-gray-600">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MdLocationOn /> Address (Optional)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Street
                  </label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) =>
                      setFormData({ ...formData, street: e.target.value })
                    }
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Street address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) =>
                      setFormData({ ...formData, zipCode: e.target.value })
                    }
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="ZIP Code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Additional notes about this customer..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
            <button
              type="button"
              onClick={() => router.push("/customers")}
              disabled={isSubmitting}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold ${
                isDarkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <MdSave className="text-xl" />
                  Create Customer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCustomerPage;

