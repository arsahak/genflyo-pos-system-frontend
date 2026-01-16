"use client";
import { createCustomer } from "@/app/actions/customers";
import { useSidebar } from "@/lib/SidebarContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  MdArrowBack,
  MdCancel,
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

      const data = new FormData();
      data.append("customerData", JSON.stringify(customerData));

      const result = await createCustomer(data);

      if (result.success) {
        toast.success(result.message || "Customer created successfully!");
        router.push("/customers");
      } else {
        toast.error(result.error || "Failed to create customer");
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className={`text-3xl font-bold mb-2 ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}>
            Create New Customer
          </h1>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            Add a new customer to your database
          </p>
        </div>

        {/* Form */}

        <div
          className={`rounded-2xl shadow-xl border max-w-4xl ${
            isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
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
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-colors ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
                          : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
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
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-colors ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
                          : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
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
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-colors ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
                          : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
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
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
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
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
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
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
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
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
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
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
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
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
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
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-gray-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                placeholder="Additional notes about this customer..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-600">
            <button
              type="button"
              onClick={() => router.push("/customers")}
              disabled={isSubmitting}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold border-2 transition-all flex items-center justify-center gap-2 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100 hover:bg-gray-600"
                  : "bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <MdCancel />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
    </div>
  );
};

export default CreateCustomerPage;

