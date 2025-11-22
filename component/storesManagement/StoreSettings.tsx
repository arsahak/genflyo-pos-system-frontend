"use client";
import { useSidebar } from "@/lib/SidebarContext";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  MdArrowBack,
  MdSave,
  MdStore,
  MdLocationOn,
  MdPhone,
  MdSettings,
  MdEmail,
  MdToggleOn,
  MdToggleOff,
} from "react-icons/md";

interface StoreSettingsProps {
  storeId: string;
}

const StoreSettings = ({ storeId }: StoreSettingsProps) => {
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    timezone: "UTC",
    currency: "USD",
    locale: "",
    receiptHeader: "",
    receiptFooter: "",
    isActive: true,
  });

  useEffect(() => {
    fetchStore();
  }, [storeId]);

  const fetchStore = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/stores/${storeId}`);
      const store = response.data;
      
      setFormData({
        name: store.name || "",
        code: store.code || "",
        type: store.type || "supershop",
        street: store.address?.street || "",
        city: store.address?.city || "",
        state: store.address?.state || "",
        zipCode: store.address?.zipCode || "",
        country: store.address?.country || "",
        phone: store.phone || "",
        email: store.email || "",
        timezone: store.timezone || "UTC",
        currency: store.settings?.currency || "USD",
        locale: store.settings?.locale || "",
        receiptHeader: store.settings?.receiptHeader || "",
        receiptFooter: store.settings?.receiptFooter || "",
        isActive: store.isActive !== undefined ? store.isActive : true,
      });
    } catch (error: any) {
      console.error("Error fetching store:", error);
      toast.error(error.response?.data?.message || "Failed to fetch store");
      router.push("/stores");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type) {
      toast.error("Please fill all required fields");
      return;
    }

    setSaving(true);
    try {
      const storeData = {
        name: formData.name,
        code: formData.code,
        type: formData.type,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        phone: formData.phone,
        email: formData.email,
        timezone: formData.timezone,
        settings: {
          currency: formData.currency,
          locale: formData.locale,
          receiptHeader: formData.receiptHeader,
          receiptFooter: formData.receiptFooter,
        },
        isActive: formData.isActive,
      };

      await api.put(`/stores/${storeId}`, storeData);
      toast.success("Store updated successfully!");
      router.push("/stores");
    } catch (error: any) {
      console.error("Error updating store:", error);
      toast.error(error.response?.data?.message || "Failed to update store");
    } finally {
      setSaving(false);
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

  const toggleActive = () => {
    setFormData({
      ...formData,
      isActive: !formData.isActive,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
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
        <div className="flex items-center justify-between">
          <div>
            <h1
              className={`text-3xl font-bold mb-2 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Store Settings
            </h1>
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              Edit store information and settings
            </p>
          </div>
          <button
            onClick={toggleActive}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
              formData.isActive
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {formData.isActive ? (
              <>
                <MdToggleOn className="text-2xl" />
                Active
              </>
            ) : (
              <>
                <MdToggleOff className="text-2xl" />
                Inactive
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div
              className={`rounded-lg border-2 p-6 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
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
                    Store Code
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border-2 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
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
                    className={`w-full px-4 py-2 rounded-lg border-2 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
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
              className={`rounded-lg border-2 p-6 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
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
                    className={`w-full px-4 py-2 rounded-lg border-2 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
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
              className={`rounded-lg border-2 p-6 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
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
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
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

          {/* Sidebar - Settings */}
          <div className="space-y-6">
            {/* Store Settings */}
            <div
              className={`rounded-lg border-2 p-6 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
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
                    className={`w-full px-4 py-2 rounded-lg border-2 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  >
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
                    className={`w-full px-4 py-2 rounded-lg border-2 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  >
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
                    className={`w-full px-4 py-2 rounded-lg border-2 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Receipt Settings */}
            <div
              className={`rounded-lg border-2 p-6 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
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
                    rows={2}
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
                    Receipt Footer
                  </label>
                  <textarea
                    name="receiptFooter"
                    value={formData.receiptFooter}
                    onChange={handleChange}
                    rows={2}
                    className={`w-full px-4 py-2 rounded-lg border-2 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <MdSave />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StoreSettings;

