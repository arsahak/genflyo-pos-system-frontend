"use client";
import { useSidebar } from "@/lib/SidebarContext";
import { useLanguage } from "@/lib/LanguageContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getTranslation } from "@/lib/translations";
import {
  MdArrowBack,
  MdSave,
  MdPerson,
  MdLocationOn,
  MdPhone,
  MdEmail,
  MdCancel,
  MdBusiness,
} from "react-icons/md";

const AddSuppliers = () => {
  const { isDarkMode } = useSidebar();
  const { language } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    mobile: "",
    address: "",
    city: "",
    country: "",
    taxNumber: "",
    paymentTerms: "30",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.company) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const { createSupplier } = await import("@/app/actions/suppliers");
      const result = await createSupplier(formData);

      if (result.success) {
        toast.success("Supplier created successfully!");
        router.push("/suppliers");
      } else {
        toast.error(result.error || "Failed to create supplier");
      }
    } catch (error: any) {
      console.error("Error creating supplier:", error);
      toast.error("Failed to create supplier");
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
            {getTranslation("backToSuppliers", language)}
          </button>
          <h1
            className={`text-3xl font-bold mb-2 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            {getTranslation("addNewSupplier", language)}
          </h1>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            {getTranslation("createSupplierProfile", language)}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information */}
            <div
              className={`rounded-2xl shadow-xl border p-6 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 shadow-gray-900/20"
                  : "bg-white border-gray-100 shadow-slate-200/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <MdPerson className="text-2xl text-blue-500" />
                <h2
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {getTranslation("basicInformation", language)}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {getTranslation("contactName", language)} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
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
                    {getTranslation("companyName", language)} *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    placeholder="ABC Corporation"
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
                    {getTranslation("taxNumber", language)}
                  </label>
                  <input
                    type="text"
                    name="taxNumber"
                    value={formData.taxNumber}
                    onChange={handleChange}
                    placeholder={getTranslation("taxIdVat", language)}
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
                    {getTranslation("paymentTermsDays", language)}
                  </label>
                  <select
                    name="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                  >
                    <option value="0">{getTranslation("cashOnDelivery", language)}</option>
                    <option value="7">7 {getTranslation("days", language)}</option>
                    <option value="15">15 {getTranslation("days", language)}</option>
                    <option value="30">30 {getTranslation("days", language)}</option>
                    <option value="45">45 {getTranslation("days", language)}</option>
                    <option value="60">60 {getTranslation("days", language)}</option>
                    <option value="90">90 {getTranslation("days", language)}</option>
                  </select>
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
                <MdPhone className="text-2xl text-green-500" />
                <h2
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {getTranslation("contactInformation", language)}
                </h2>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {getTranslation("phoneNumber", language)}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+880 1XXX-XXXXXX"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
                      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                />
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
                <MdLocationOn className="text-2xl text-purple-500" />
                <h2
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {getTranslation("addressInformation", language)}
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {getTranslation("streetAddress", language)}
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
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
                      {getTranslation("city", language)}
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Dhaka"
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
                      {getTranslation("country", language)}
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Bangladesh"
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

            {/* Notes */}
            <div
              className={`rounded-2xl shadow-xl border p-6 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 shadow-gray-900/20"
                  : "bg-white border-gray-100 shadow-slate-200/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <MdBusiness className="text-2xl text-orange-500" />
                <h2
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {getTranslation("additionalNotes", language)}
                </h2>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {getTranslation("notesOptional", language)}
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder={getTranslation("notesPlaceholder", language)}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
                      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                />
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
                {getTranslation("cancel", language)}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {getTranslation("creating", language)}
                  </>
                ) : (
                  <>
                    <MdSave className="text-xl" />
                    {getTranslation("createSupplier", language)}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSuppliers;
