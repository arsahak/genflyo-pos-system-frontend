"use client";
import { useSidebar } from "@/lib/SidebarContext";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MdArrowBack, MdSave, MdBusiness, MdLanguage, MdAttachMoney } from "react-icons/md";

const GeneralSettings = () => {
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "retail",
    logo: "",
    tagline: "",
    currency: "USD",
    currencySymbol: "$",
    currencyPosition: "before",
    timezone: "UTC",
    dateFormat: "YYYY-MM-DD",
    timeFormat: "12h",
    language: "en",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/settings");
      const settings = response.data;
      
      setFormData({
        businessName: settings.businessName || "",
        businessType: settings.businessType || "retail",
        logo: settings.logo || "",
        tagline: settings.tagline || "",
        currency: settings.currency || "USD",
        currencySymbol: settings.currencySymbol || "$",
        currencyPosition: settings.currencyPosition || "before",
        timezone: settings.timezone || "UTC",
        dateFormat: settings.dateFormat || "YYYY-MM-DD",
        timeFormat: settings.timeFormat || "12h",
        language: settings.language || "en",
      });
    } catch (error: any) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await api.put("/settings/general", formData);
      toast.success("General settings updated successfully!");
    } catch (error: any) {
      console.error("Error updating settings:", error);
      toast.error(error.response?.data?.message || "Failed to update settings");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={() => router.back()}
        className={`flex items-center gap-2 mb-4 ${
          isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-800"
        }`}
      >
        <MdArrowBack className="text-xl" />
        Back to Settings
      </button>

      <h1
        className={`text-3xl font-bold mb-2 ${
          isDarkMode ? "text-gray-100" : "text-gray-900"
        }`}
      >
        General Settings
      </h1>
      <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
        Configure basic business information and regional settings
      </p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Business Information */}
            <div
              className={`rounded-lg border-2 p-6 ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <MdBusiness className="text-2xl text-indigo-500" />
                <h2 className={`text-xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                  Business Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-lg border-2 ${
                      isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Business Type *
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border-2 ${
                      isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="retail">Retail</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="service">Service</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Logo URL
                  </label>
                  <input
                    type="text"
                    name="logo"
                    value={formData.logo}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                    className={`w-full px-4 py-2 rounded-lg border-2 ${
                      isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Tagline
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    placeholder="Your business tagline"
                    className={`w-full px-4 py-2 rounded-lg border-2 ${
                      isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Currency Settings */}
            <div
              className={`rounded-lg border-2 p-6 ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <MdAttachMoney className="text-2xl text-green-500" />
                <h2 className={`text-xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                  Currency Settings
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border-2 ${
                      isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                    <option value="JPY">JPY</option>
                    <option value="AUD">AUD</option>
                    <option value="CAD">CAD</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    name="currencySymbol"
                    value={formData.currencySymbol}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border-2 ${
                      isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Symbol Position
                  </label>
                  <select
                    name="currencyPosition"
                    value={formData.currencyPosition}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border-2 ${
                      isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="before">Before ($ 100)</option>
                    <option value="after">After (100 $)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Regional Settings */}
            <div
              className={`rounded-lg border-2 p-6 ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <MdLanguage className="text-2xl text-blue-500" />
                <h2 className={`text-xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                  Regional Settings
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Timezone
                  </label>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border-2 ${
                      isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Asia/Kolkata">India</option>
                    <option value="Asia/Dubai">Dubai</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Language
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border-2 ${
                      isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ar">Arabic</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Date Format
                  </label>
                  <select
                    name="dateFormat"
                    value={formData.dateFormat}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border-2 ${
                      isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Time Format
                  </label>
                  <select
                    name="timeFormat"
                    value={formData.timeFormat}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border-2 ${
                      isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="12h">12 Hour</option>
                    <option value="24h">24 Hour</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div
              className={`rounded-lg border-2 p-6 sticky top-6 ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                Preview
              </h3>
              
              <div className="space-y-3 mb-6">
                <div>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Currency Format</p>
                  <p className={`text-lg font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                    {formData.currencyPosition === "before"
                      ? `${formData.currencySymbol} 99.99`
                      : `99.99 ${formData.currencySymbol}`}
                  </p>
                </div>
                
                <div>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Date Format</p>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{formData.dateFormat}</p>
                </div>
                
                <div>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Time Format</p>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{formData.timeFormat === "12h" ? "12:30 PM" : "12:30"}</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
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
        </div>
      </form>
    </div>
  );
};

export default GeneralSettings;

