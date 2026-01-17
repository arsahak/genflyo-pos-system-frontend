"use client";
import { useSidebar } from "@/lib/SidebarContext";
import { useLanguage } from "@/lib/LanguageContext";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getTranslation } from "@/lib/translations";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdRefresh,
  MdSearch,
  MdPerson,
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdBusiness,
} from "react-icons/md";
import { FaTruck } from "react-icons/fa";
import { SuppliersListSkeleton } from "./components/SuppliersListSkeleton";

interface Supplier {
  _id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  mobile: string;
  address: string;
  city: string;
  country: string;
  taxNumber: string;
  paymentTerms: string;
  notes: string;
  totalPurchases?: number;
  lastPurchaseDate?: string;
  isActive: boolean;
}

const Viewsuppliers = () => {
  const { isDarkMode } = useSidebar();
  const { language } = useLanguage();
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const { getAllSuppliers } = await import("@/app/actions/suppliers");
      const result = await getAllSuppliers({ q: searchTerm, isActive: true });

      if (result.success && result.data) {
        setSuppliers(result.data);
      } else {
        toast.error(result.error || "Failed to fetch suppliers");
        setSuppliers([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast.error("Failed to fetch suppliers");
      setSuppliers([]);
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchSuppliers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [fetchSuppliers]);

  const handleDelete = async (supplierId: string, supplierName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${supplierName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const { deleteSupplier } = await import("@/app/actions/suppliers");
      const result = await deleteSupplier(supplierId);

      if (result.success) {
        toast.success("Supplier deleted successfully");
        fetchSuppliers();
      } else {
        toast.error(result.error || "Failed to delete supplier");
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
      toast.error("Failed to delete supplier");
    }
  };

  // Server-side filtering is now done in fetchSuppliers
  const filteredSuppliers = suppliers;

  const activeSuppliers = suppliers.filter((s) => s.isActive).length;
  const totalPurchaseAmount = suppliers.reduce((sum, s) => sum + (s.totalPurchases || 0), 0);

  if (loading) {
    return <SuppliersListSkeleton isDarkMode={isDarkMode} />;
  }

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${
      isDarkMode ? "bg-gray-950" : "bg-slate-50"
    }`}>
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1
                className={`text-3xl font-bold mb-2 ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {getTranslation("supplierManagement", language)}
              </h1>
              <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                {getTranslation("manageSuppliers", language)}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchSuppliers}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
              >
                <MdRefresh />
                {getTranslation("refresh", language)}
              </button>
              <button
                onClick={() => router.push("/suppliers/add")}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
              >
                <MdAdd />
                {getTranslation("addSupplier", language)}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Suppliers */}
          <div className="relative overflow-hidden p-6 rounded-2xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 text-white">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1 text-blue-100 opacity-90">
                  {getTranslation("totalSuppliers", language)}
                </p>
                <h3 className="text-3xl font-bold text-white">
                  {suppliers.length}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
                <FaTruck className="text-2xl" />
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          </div>

          {/* Active Suppliers */}
          <div className="relative overflow-hidden p-6 rounded-2xl transition-all duration-300 bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30 text-white">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1 text-green-100 opacity-90">
                  {getTranslation("activeSuppliers", language)}
                </p>
                <h3 className="text-3xl font-bold text-white">
                  {activeSuppliers}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
                <MdBusiness className="text-2xl" />
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          </div>

          {/* Total Purchase Amount */}
          <div className="relative overflow-hidden p-6 rounded-2xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30 text-white">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1 text-purple-100 opacity-90">
                  {getTranslation("totalPurchases", language)}
                </p>
                <h3 className="text-3xl font-bold text-white">
                  ৳{totalPurchaseAmount.toLocaleString()}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
                <MdBusiness className="text-2xl" />
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          </div>

          {/* Average Payment Terms */}
          <div className="relative overflow-hidden p-6 rounded-2xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 text-white">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1 text-orange-100 opacity-90">
                  {getTranslation("avgPaymentTerms", language)}
                </p>
                <h3 className="text-3xl font-bold text-white">
                  30 {getTranslation("days", language)}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
                <MdBusiness className="text-2xl" />
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          </div>
        </div>

        {/* Search Bar */}
        <div
          className={`p-6 rounded-2xl shadow-xl border mb-6 ${
            isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
          }`}
        >
          <div className="relative">
            <MdSearch className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`} />
            <input
              type="text"
              placeholder={getTranslation("searchSuppliersPlaceholder", language)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-colors ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
            />
          </div>
        </div>

        {/* Suppliers Table */}
        {filteredSuppliers.length === 0 ? (
          <div
            className={`text-center py-12 rounded-2xl shadow-xl border ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 shadow-gray-900/20"
                : "bg-white border-gray-100 shadow-slate-200/50"
            }`}
          >
            <FaTruck className="text-6xl text-gray-400 mx-auto mb-4" />
            <p
              className={`text-xl font-semibold mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {getTranslation("noSuppliersFound", language)}
            </p>
            <p
              className={`mb-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {getTranslation("addFirstSupplier", language)}
            </p>
            <button
              onClick={() => router.push("/suppliers/add")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2 font-medium"
            >
              <MdAdd />
              {getTranslation("addFirstSupplierBtn", language)}
            </button>
          </div>
        ) : (
          <div
            className={`rounded-2xl shadow-xl border overflow-hidden ${
              isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      {getTranslation("supplierInfo", language)}
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      {getTranslation("contact", language)}
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      {getTranslation("location", language)}
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      {getTranslation("paymentTerms", language)}
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      {getTranslation("totalPurchases", language)}
                    </th>
                    <th className={`px-6 py-4 text-center text-sm font-semibold ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      {getTranslation("actions", language)}
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
                  {filteredSuppliers.map((supplier) => (
                    <tr
                      key={supplier._id}
                      className={`transition-colors ${
                        isDarkMode ? "hover:bg-gray-750" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            isDarkMode ? "bg-blue-900/30" : "bg-blue-50"
                          }`}>
                            <MdPerson className="text-xl text-blue-500" />
                          </div>
                          <div>
                            <div className={`font-semibold ${
                              isDarkMode ? "text-gray-100" : "text-gray-900"
                            }`}>
                              {supplier.name}
                            </div>
                            <div className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}>
                              {supplier.company}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className={`flex items-center gap-2 text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}>
                            <MdEmail className="text-gray-500" />
                            {supplier.email}
                          </div>
                          <div className={`flex items-center gap-2 text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}>
                            <MdPhone className="text-gray-500" />
                            {supplier.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}>
                          <MdLocationOn className="text-gray-500" />
                          <div>
                            <div>{supplier.city}</div>
                            <div className={`text-xs ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}>
                              {supplier.country}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isDarkMode
                            ? "bg-purple-900/30 text-purple-400 border border-purple-800"
                            : "bg-purple-100 text-purple-800 border border-purple-300"
                        }`}>
                          {supplier.paymentTerms} {getTranslation("days", language)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`font-semibold ${
                          isDarkMode ? "text-gray-100" : "text-gray-900"
                        }`}>
                          ৳{(supplier.totalPurchases || 0).toLocaleString()}
                        </div>
                        <div className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}>
                          {getTranslation("last", language)}: {supplier.lastPurchaseDate}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => router.push(`/suppliers/edit/${supplier._id}`)}
                            className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
                            title="Edit"
                          >
                            <MdEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(supplier._id, supplier.name)}
                            className="p-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl"
                            title="Delete"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Viewsuppliers;
