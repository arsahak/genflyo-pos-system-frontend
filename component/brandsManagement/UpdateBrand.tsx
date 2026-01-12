"use client";

import { useSidebar } from "@/lib/SidebarContext";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getBrandById, updateBrand } from "@/app/actions/brands";
import {
  MdArrowBack,
  MdBusiness,
  MdSave,
  MdDescription,
  MdPublic,
  MdPhone,
} from "react-icons/md";

interface UpdateBrandProps {
  brandId: string;
}

export default function UpdateBrand({ brandId }: UpdateBrandProps) {
  const { user } = useStore();
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    country: "",
    contact: "",
    isActive: true,
  });

  useEffect(() => {
    const loadBrand = async () => {
      try {
        setFetching(true);
        const result = await getBrandById(brandId);

        if (!result.success || !result.data) {
          toast.error(result.error || "Failed to load brand");
          router.push("/products/brands");
          return;
        }

        const brand = result.data;

        setFormData({
          name: brand.name || "",
          description: brand.description || "",
          country: brand.country || "",
          contact: brand.contact || "",
          isActive: brand.isActive ?? true,
        });
      } catch (error: any) {
        toast.error(error?.message || "Failed to load brand");
        router.push("/products/brands");
      } finally {
        setFetching(false);
      }
    };

    loadBrand();
  }, [brandId, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Brand name is required");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      // Append all fields including empty strings (backend expects them)
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value !== null && value !== undefined ? value.toString() : "");
      });

      console.log("📦 Updating brand data:");
      for (let [key, value] of data.entries()) {
        console.log(`  ${key}:`, value);
      }

      const result = await updateBrand(brandId, data);

      if (result.success) {
        toast.success(result.message || "Brand updated successfully!");
        router.push("/products/brands");
      } else {
        toast.error(result.error || "Failed to update brand");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to update brand");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (fetching) {
    return (
      <div
        className={`min-h-screen pb-20 ${
          isDarkMode ? "bg-gray-950 text-gray-100" : "bg-slate-50 text-gray-900"
        }`}
      >
        <div className="py-6">
          <div className="max-w-[800px] mx-auto px-6">
            <div className="animate-pulse space-y-6">
              <div
                className={`rounded-2xl shadow-sm border p-6 ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-800"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
                <div className="space-y-4">
                  <div className="h-11 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pb-20 ${
        isDarkMode ? "bg-gray-950 text-gray-100" : "bg-slate-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`sticky top-0 z-30 py-4 shadow-sm border-b transition-colors ${
          isDarkMode
            ? "bg-gray-900/95 border-gray-800 backdrop-blur-md"
            : "bg-white/95 border-slate-200 backdrop-blur-md"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            {/* Left Section - Back Button + Title */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <button
                onClick={() => router.back()}
                className={`p-2 rounded-full transition-colors shrink-0 ${
                  isDarkMode
                    ? "hover:bg-gray-800 text-gray-400"
                    : "hover:bg-slate-100 text-slate-500"
                }`}
              >
                <MdArrowBack size={24} />
              </button>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    isDarkMode ? "bg-indigo-900/50" : "bg-indigo-50"
                  }`}
                >
                  <MdBusiness
                    className={`${
                      isDarkMode ? "text-indigo-400" : "text-indigo-600"
                    }`}
                    size={24}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h1
                    className={`text-xl sm:text-2xl font-bold ${
                      isDarkMode ? "text-gray-100" : "text-slate-900"
                    }`}
                  >
                    Edit Brand
                  </h1>
                  <p
                    className={`text-xs sm:text-sm mt-0.5 hidden sm:block ${
                      isDarkMode ? "text-gray-400" : "text-slate-500"
                    }`}
                  >
                    Update brand information
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section - Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={() => router.back()}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-colors border ${
                  isDarkMode
                    ? "border-gray-700 hover:bg-gray-800 text-gray-300"
                    : "border-slate-300 hover:bg-slate-50 text-slate-700"
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 disabled:opacity-70 flex items-center gap-1.5 sm:gap-2 transition-all transform active:scale-95"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <MdSave size={18} /> <span>Update Brand</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6">
        <div className="max-w-[800px] mx-auto px-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <section
              className={`rounded-2xl shadow-sm border p-6 ${
                isDarkMode
                  ? "bg-gray-900 border-gray-800"
                  : "bg-white border-slate-200"
              }`}
            >
              <h2
                className={`text-lg font-bold mb-6 flex items-center gap-2 pb-3 border-b ${
                  isDarkMode
                    ? "text-gray-100 border-gray-800"
                    : "text-slate-800 border-slate-100"
                }`}
              >
                <MdBusiness className="text-indigo-500 text-xl" /> Brand
                Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1.5 ${
                      isDarkMode ? "text-gray-300" : "text-slate-700"
                    }`}
                  >
                    Brand Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full h-11 px-4 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition-all ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                    }`}
                    placeholder="e.g. Square Pharmaceuticals"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1.5 ${
                      isDarkMode ? "text-gray-300" : "text-slate-700"
                    }`}
                  >
                    Description
                  </label>
                  <div className="relative">
                    <MdDescription
                      className={`absolute left-3.5 top-3.5 text-lg ${
                        isDarkMode ? "text-gray-500" : "text-slate-400"
                      }`}
                    />
                    <textarea
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition-all resize-none ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                      }`}
                      placeholder="Brief description about the brand..."
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-1.5 ${
                      isDarkMode ? "text-gray-300" : "text-slate-700"
                    }`}
                  >
                    Country
                  </label>
                  <div className="relative">
                    <MdPublic
                      className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-lg ${
                        isDarkMode ? "text-gray-500" : "text-slate-400"
                      }`}
                    />
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={`w-full h-11 pl-10 pr-4 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition-all ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                      }`}
                      placeholder="e.g. Bangladesh, USA, India"
                    />
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-1.5 ${
                      isDarkMode ? "text-gray-300" : "text-slate-700"
                    }`}
                  >
                    Contact
                  </label>
                  <div className="relative">
                    <MdPhone
                      className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-lg ${
                        isDarkMode ? "text-gray-500" : "text-slate-400"
                      }`}
                    />
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      className={`w-full h-11 pl-10 pr-4 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition-all ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                      }`}
                      placeholder="e.g. +880-1234567890"
                    />
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-300" : "text-slate-700"
                        }`}
                      >
                        Brand Status
                      </span>
                      <p
                        className={`text-xs mt-0.5 ${
                          isDarkMode ? "text-gray-500" : "text-slate-500"
                        }`}
                      >
                        Enable or disable this brand
                      </p>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div
                        className={`w-11 h-6 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600"
                            : "bg-gray-200"
                        } ${formData.isActive ? "bg-indigo-600" : ""}`}
                      ></div>
                    </div>
                  </label>
                </div>
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}
