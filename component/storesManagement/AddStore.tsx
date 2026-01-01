"use client";
import { useSidebar } from "@/lib/SidebarContext";
import { createStore } from "@/app/actions/stores";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  MdArrowBack,
  MdSave,
  MdStore,
  MdLocationOn,
  MdPhone,
  MdEmail,
  MdSettings,
  MdCancel,
} from "react-icons/md";

const AddStore = () => {
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "supershop",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
    email: "",
    timezone: "Asia/Dhaka",
    currency: "BDT",
    locale: "",
    receiptHeader: "",
    receiptFooter: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.type) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("code", formData.code);
      submitData.append("type", formData.type);
      submitData.append("address", JSON.stringify({
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      }));
      submitData.append("phone", formData.phone);
      submitData.append("email", formData.email);
      submitData.append("timezone", formData.timezone);
      submitData.append("settings", JSON.stringify({
        currency: formData.currency,
        locale: formData.locale,
        receiptHeader: formData.receiptHeader,
        receiptFooter: formData.receiptFooter,
      }));

      const result = await createStore(submitData);
      if (result.success) {
        toast.success(result.message || "Store created successfully!");
        router.push("/stores");
      } else {
        toast.error(result.error || "Failed to create store");
      }
    } catch (error: any) {
      console.error("Error creating store:", error);
      toast.error("Failed to create store");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${
      isDarkMode ? "bg-gray-950" : "bg-slate-50"
    }`}>
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className={`flex items-center gap-2 mb-4 ${
              isDarkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <MdArrowBack className="text-xl" />
            Back to Stores
          </button>
          <h1
            className={`text-3xl font-bold mb-2 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Add New Store
          </h1>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            Create a new store location
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div
                className={`rounded-2xl shadow-xl border p-6 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 shadow-gray-900/20"
                    : "bg-white border-gray-100 shadow-slate-200/50"
                }`}
              >
              <div className="flex items-center gap-2 mb-4">
                <MdStore className="text-2xl text-indigo-500" />
                <h2
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Basic Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Store Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Main Store"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Store Code
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="MAIN-001"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Store Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                  >
                    <option value="supershop">Supershop</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="electronics">Electronics</option>
                  </select>
                </div>
              </div>
            </div>

              {/* Address Information */}
              <div
                className={`rounded-2xl shadow-xl border p-6 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 shadow-gray-900/20"
                    : "bg-white border-gray-100 shadow-slate-200/50"
                }`}
              >
              <div className="flex items-center gap-2 mb-4">
                <MdLocationOn className="text-2xl text-green-500" />
                <h2
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Address Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="New York"
                      className={`w-full px-4 py-2 rounded-lg border-2 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="NY"
                      className={`w-full px-4 py-2 rounded-lg border-2 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      ZIP/Postal Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="10001"
                      className={`w-full px-4 py-2 rounded-lg border-2 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="USA"
                      className={`w-full px-4 py-2 rounded-lg border-2 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

              {/* Contact Information */}
              <div
                className={`rounded-2xl shadow-xl border p-6 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 shadow-gray-900/20"
                    : "bg-white border-gray-100 shadow-slate-200/50"
                }`}
              >
              <div className="flex items-center gap-2 mb-4">
                <MdPhone className="text-2xl text-blue-500" />
                <h2
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Contact Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="store@example.com"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                  />
                </div>
              </div>
            </div>
          </div>

            {/* Sidebar - Settings */}
            <div className="space-y-6">
              {/* Store Settings */}
              <div
                className={`rounded-2xl shadow-xl border p-6 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 shadow-gray-900/20"
                    : "bg-white border-gray-100 shadow-slate-200/50"
                }`}
              >
              <div className="flex items-center gap-2 mb-4">
                <MdSettings className="text-2xl text-purple-500" />
                <h2
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Settings
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                  >
                    <option value="BDT">BDT (৳)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Timezone
                  </label>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                  >
                    <option value="Asia/Dhaka">Bangladesh Time (GMT+6)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Asia/Kolkata">India</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Locale
                  </label>
                  <input
                    type="text"
                    name="locale"
                    value={formData.locale}
                    onChange={handleChange}
                    placeholder="en-US"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                  />
                </div>
              </div>
            </div>

              {/* Receipt Settings */}
              <div
                className={`rounded-2xl shadow-xl border p-6 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 shadow-gray-900/20"
                    : "bg-white border-gray-100 shadow-slate-200/50"
                }`}
              >
              <div className="flex items-center gap-2 mb-4">
                <MdEmail className="text-2xl text-orange-500" />
                <h2
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Receipt
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Receipt Header
                  </label>
                  <textarea
                    name="receiptHeader"
                    value={formData.receiptHeader}
                    onChange={handleChange}
                    placeholder="Welcome to Our Store!"
                    rows={2}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Receipt Footer
                  </label>
                  <textarea
                    name="receiptFooter"
                    value={formData.receiptFooter}
                    onChange={handleChange}
                    placeholder="Thank you for your business!"
                    rows={2}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                  />
                </div>
              </div>
            </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
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
                  disabled={loading}
                  className="flex-1 py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <MdSave className="text-xl" />
                      Create Store
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStore;

