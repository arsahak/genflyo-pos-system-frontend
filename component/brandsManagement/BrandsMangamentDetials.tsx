"use client";

import { useSidebar } from "@/lib/SidebarContext";
import { useStore } from "@/lib/store";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  MdAdd,
  MdBusiness,
  MdDelete,
  MdEdit,
  MdSearch,
  MdClose,
} from "react-icons/md";
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  initializeDefaultBrands as initDefaults,
} from "@/app/(page)/products/brands/actions";

// Default Bangladeshi Pharmacy Brands
const DEFAULT_BRANDS = [
  "Square Pharmaceuticals",
  "Beximco Pharmaceuticals",
  "Incepta Pharmaceuticals",
  "Renata Limited",
  "ACI Limited",
  "Eskayef Pharmaceuticals",
  "Opsonin Pharma",
  "Healthcare Pharmaceuticals",
  "Aristopharma",
  "Drug International",
  "Popular Pharmaceuticals",
  "Orion Pharma",
  "General Pharmaceuticals",
  "Acme Laboratories",
  "Radiant Pharmaceuticals",
  "IBN SINA Pharmaceutical",
  "Novo Pharma",
  "BSRM Pharmaceuticals",
  "Edruc Limited",
  "Sanofi Bangladesh",
];

interface Brand {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
}

export default function BrandsMangamentDetials() {
  const { user } = useStore();
  const { isDarkMode } = useSidebar();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  const loadBrands = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getBrands({ limit: 100 });

      if (result.success && result.data && result.data.brands.length > 0) {
        setBrands(result.data.brands);
      } else {
        // If no brands exist, create default brands
        await initializeDefaultBrands();
      }
    } catch (error: unknown) {
      console.error("Failed to load brands:", error);
      toast.error("Failed to load brands");
    } finally {
      setLoading(false);
    }
  }, []);

  const initializeDefaultBrands = async () => {
    try {
      const result = await initDefaults();

      if (result.success && result.data) {
        setBrands(result.data);
        toast.success(`Initialized ${result.data.length} default brands`);
      } else {
        toast.error(result.error || "Failed to initialize brands");
      }
    } catch (error) {
      console.error("Failed to initialize default brands:", error);
      toast.error("Failed to initialize brands");
    }
  };

  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  const handleAddBrand = async () => {
    if (!formData.name.trim()) {
      toast.error("Brand name is required");
      return;
    }

    try {
      setSaving(true);
      const result = await createBrand({
        name: formData.name,
        description: formData.description,
        isActive: true,
      });

      if (result.success && result.data) {
        setBrands([...brands, result.data]);
        toast.success("Brand added successfully");
        setShowAddModal(false);
        setFormData({ name: "", description: "" });
      } else {
        toast.error(result.error || "Failed to add brand");
      }
    } catch (error: unknown) {
      toast.error("Failed to add brand");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateBrand = async () => {
    if (!editingBrand || !formData.name.trim()) {
      toast.error("Brand name is required");
      return;
    }

    try {
      setSaving(true);
      const result = await updateBrand(editingBrand._id, {
        name: formData.name,
        description: formData.description,
      });

      if (result.success && result.data) {
        setBrands(
          brands.map((brand) =>
            brand._id === editingBrand._id ? result.data! : brand
          )
        );
        toast.success("Brand updated successfully");
        setShowEditModal(false);
        setEditingBrand(null);
        setFormData({ name: "", description: "" });
      } else {
        toast.error(result.error || "Failed to update brand");
      }
    } catch (error: unknown) {
      toast.error("Failed to update brand");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBrand = async (brandId: string) => {
    try {
      const result = await deleteBrand(brandId);

      if (result.success) {
        setBrands(brands.filter((brand) => brand._id !== brandId));
        toast.success("Brand deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete brand");
      }
    } catch (error: unknown) {
      toast.error("Failed to delete brand");
    }
  };

  const openEditModal = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || "",
    });
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingBrand(null);
    setFormData({ name: "", description: "" });
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) return null;

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
            {/* Left Section - Title */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
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
                    Brand Management
                  </h1>
                  <p
                    className={`text-xs sm:text-sm mt-0.5 hidden sm:block ${
                      isDarkMode ? "text-gray-400" : "text-slate-500"
                    }`}
                  >
                    Manage pharmaceutical brands and manufacturers
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section - Add Button */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 flex items-center gap-1.5 sm:gap-2 transition-all transform active:scale-95"
              >
                <MdAdd size={18} /> <span>Add Brand</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-6">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div
              className={`rounded-2xl shadow-sm border p-6 ${
                isDarkMode
                  ? "bg-gray-900 border-gray-800"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-gray-400" : "text-slate-500"
                    }`}
                  >
                    Total Brands
                  </p>
                  <h3
                    className={`text-3xl font-bold mt-2 ${
                      isDarkMode ? "text-gray-100" : "text-slate-900"
                    }`}
                  >
                    {brands.length}
                  </h3>
                </div>
                <div className="p-4 bg-indigo-500/10 rounded-xl">
                  <MdBusiness className="text-indigo-500 text-3xl" />
                </div>
              </div>
            </div>

            <div
              className={`rounded-2xl shadow-sm border p-6 ${
                isDarkMode
                  ? "bg-gray-900 border-gray-800"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-gray-400" : "text-slate-500"
                    }`}
                  >
                    Active Brands
                  </p>
                  <h3
                    className={`text-3xl font-bold mt-2 ${
                      isDarkMode ? "text-gray-100" : "text-slate-900"
                    }`}
                  >
                    {brands.filter((b) => b.isActive).length}
                  </h3>
                </div>
                <div className="p-4 bg-green-500/10 rounded-xl">
                  <MdBusiness className="text-green-500 text-3xl" />
                </div>
              </div>
            </div>

            <div
              className={`rounded-2xl shadow-sm border p-6 ${
                isDarkMode
                  ? "bg-gray-900 border-gray-800"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-gray-400" : "text-slate-500"
                    }`}
                  >
                    Default Brands
                  </p>
                  <h3
                    className={`text-3xl font-bold mt-2 ${
                      isDarkMode ? "text-gray-100" : "text-slate-900"
                    }`}
                  >
                    {DEFAULT_BRANDS.length}
                  </h3>
                </div>
                <div className="p-4 bg-blue-500/10 rounded-xl">
                  <MdBusiness className="text-blue-500 text-3xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <MdSearch
                className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                  isDarkMode ? "text-gray-500" : "text-slate-400"
                }`}
                size={20}
              />
              <input
                type="text"
                placeholder="Search brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full h-12 pl-12 pr-4 rounded-xl border focus:ring-2 focus:ring-indigo-500 transition-all ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-800 text-white placeholder-gray-500"
                    : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                }`}
              />
            </div>
          </div>

          {/* Brands Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`rounded-2xl shadow-sm border p-6 animate-pulse ${
                    isDarkMode
                      ? "bg-gray-900 border-gray-800"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : filteredBrands.length === 0 ? (
            <div
              className={`rounded-2xl shadow-sm border p-12 text-center ${
                isDarkMode
                  ? "bg-gray-900 border-gray-800"
                  : "bg-white border-slate-200"
              }`}
            >
              <MdBusiness
                className={`mx-auto mb-4 ${
                  isDarkMode ? "text-gray-600" : "text-slate-300"
                }`}
                size={64}
              />
              <h3
                className={`text-lg font-semibold mb-2 ${
                  isDarkMode ? "text-gray-400" : "text-slate-600"
                }`}
              >
                No brands found
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-500" : "text-slate-500"
                }`}
              >
                {searchTerm
                  ? "Try a different search term"
                  : "Click 'Add Brand' to create your first brand"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBrands.map((brand) => (
                <div
                  key={brand._id}
                  className={`rounded-2xl shadow-sm border p-6 transition-all hover:shadow-lg ${
                    isDarkMode
                      ? "bg-gray-900 border-gray-800 hover:border-gray-700"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isDarkMode ? "bg-indigo-900/30" : "bg-indigo-50"
                        }`}
                      >
                        <MdBusiness
                          className={`${
                            isDarkMode ? "text-indigo-400" : "text-indigo-600"
                          }`}
                          size={20}
                        />
                      </div>
                      <h3
                        className={`font-semibold text-lg ${
                          isDarkMode ? "text-gray-100" : "text-slate-900"
                        }`}
                      >
                        {brand.name}
                      </h3>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        brand.isActive
                          ? isDarkMode
                            ? "bg-green-900/30 text-green-400"
                            : "bg-green-50 text-green-600"
                          : isDarkMode
                          ? "bg-gray-800 text-gray-400"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {brand.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {brand.description && (
                    <p
                      className={`text-sm mb-4 line-clamp-2 ${
                        isDarkMode ? "text-gray-400" : "text-slate-600"
                      }`}
                    >
                      {brand.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <button
                      onClick={() => openEditModal(brand)}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                        isDarkMode
                          ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      <MdEdit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBrand(brand._id)}
                      className="flex-1 px-3 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <MdDelete size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className={`w-full max-w-md rounded-2xl shadow-xl border ${
              isDarkMode
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h2
                className={`text-xl font-bold ${
                  isDarkMode ? "text-gray-100" : "text-slate-900"
                }`}
              >
                Add New Brand
              </h2>
              <button
                onClick={closeModals}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "hover:bg-gray-800 text-gray-400"
                    : "hover:bg-slate-100 text-slate-500"
                }`}
              >
                <MdClose size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
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
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
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
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition-all resize-none ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                  placeholder="Brief description about the brand..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={closeModals}
                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors border ${
                  isDarkMode
                    ? "border-gray-700 hover:bg-gray-800 text-gray-300"
                    : "border-slate-300 hover:bg-slate-50 text-slate-700"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddBrand}
                disabled={saving}
                className="flex-1 px-4 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <MdAdd size={18} /> Add Brand
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className={`w-full max-w-md rounded-2xl shadow-xl border ${
              isDarkMode
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h2
                className={`text-xl font-bold ${
                  isDarkMode ? "text-gray-100" : "text-slate-900"
                }`}
              >
                Edit Brand
              </h2>
              <button
                onClick={closeModals}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "hover:bg-gray-800 text-gray-400"
                    : "hover:bg-slate-100 text-slate-500"
                }`}
              >
                <MdClose size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
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
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
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
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition-all resize-none ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                  placeholder="Brief description about the brand..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={closeModals}
                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors border ${
                  isDarkMode
                    ? "border-gray-700 hover:bg-gray-800 text-gray-300"
                    : "border-slate-300 hover:bg-slate-50 text-slate-700"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBrand}
                disabled={saving}
                className="flex-1 px-4 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <MdEdit size={18} /> Update Brand
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
