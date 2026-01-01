"use client";
import { useSidebar } from "@/lib/SidebarContext";
import { getAllSales, getSalesStats, deleteSale } from "@/app/actions/sales";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProtectedRoute from "@/component/ProtectedRoute";
import PermissionGuard from "@/component/PermissionGuard";
import SalesListSkeleton from "./SalesListSkeleton";
import {
  MdSearch,
  MdFilterList,
  MdVisibility,
  MdEdit,
  MdDelete,
  MdFileDownload,
  MdRefresh,
  MdAttachMoney,
  MdPerson,
  MdStore,
  MdCalendarToday,
  MdClose,
  MdCheckCircle,
  MdCancel,
  MdWarning,
} from "react-icons/md";

interface Sale {
  _id: string;
  saleNo: string;
  total: number;
  subtotal: number;
  discount: number;
  tax: number;
  status: string;
  createdAt: string;
  customerId?: {
    name: string;
    phone: string;
    membershipType?: string;
  };
  cashierId?: {
    name: string;
  };
  storeId?: {
    name: string;
  };
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  payments: Array<{
    method: string;
    amount: number;
  }>;
}

const SalesList = () => {
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalDiscount: 0,
    completedSales: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  // Wait for client-side hydration
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllSales({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        startDate: dateFrom || undefined,
        endDate: dateTo || undefined,
      });

      if (result.success && result.data) {
        setSales(result.data.sales || []);
        if (result.data.pagination) {
          setPagination(result.data.pagination);
        }
      } else {
        toast.error(result.error || "Failed to fetch sales");
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchQuery, dateFrom, dateTo]);

  const fetchStats = useCallback(async () => {
    try {
      const result = await getSalesStats({
        startDate: dateFrom || undefined,
        endDate: dateTo || undefined,
      });

      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    if (mounted) {
      fetchSales();
      fetchStats();
    }
  }, [fetchSales, fetchStats, mounted]);

  const handleSearch = () => {
    setPagination({ ...pagination, page: 1 });
    fetchSales();
  };

  const handleDelete = async (id: string, saleNo: string) => {
    if (!confirm(`Are you sure you want to cancel sale ${saleNo}?`)) {
      return;
    }

    try {
      const result = await deleteSale(id);

      if (result.success) {
        toast.success(result.message || "Sale cancelled successfully");
        fetchSales();
        fetchStats();
      } else {
        toast.error(result.error || "Failed to cancel sale");
      }
    } catch (error) {
      console.error("Error deleting sale:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const exportToCSV = () => {
    const csv = [
      ["Sale No", "Date", "Customer", "Total", "Status", "Cashier"],
      ...sales.map((sale) => [
        sale.saleNo,
        new Date(sale.createdAt).toLocaleString(),
        sale.customerId?.name || "Walk-in",
        `$${sale.total.toFixed(2)}`,
        sale.status,
        sale.cashierId?.name || "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Sales exported successfully");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <MdCheckCircle className="text-green-500" />;
      case "refunded":
        return <MdCancel className="text-red-500" />;
      case "partially_refunded":
        return <MdWarning className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-300";
      case "refunded":
        return "bg-red-100 text-red-700 border-red-300";
      case "partially_refunded":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  // Show skeleton while hydrating or initial load
  if (!mounted || loading) {
    return <SalesListSkeleton isDarkMode={isDarkMode} />;
  }

  return (
    <ProtectedRoute requiredPermission="canViewSales">
    <div className={`min-h-screen p-6 transition-colors duration-300 ${
      isDarkMode ? "bg-gray-950" : "bg-slate-50"
    }`}>
      <div className="max-w-[1920px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1
          className={`text-3xl font-bold mb-2 ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Sales Management
        </h1>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
          View, manage, and track all sales transactions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative overflow-hidden p-5 rounded-2xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 text-white">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-1 text-blue-100 opacity-90">
                Total Sales
              </p>
              <h3 className="text-2xl font-bold text-white">
                {stats.totalSales}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
              <MdAttachMoney className="text-2xl" />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        </div>

        <div className="relative overflow-hidden p-5 rounded-2xl transition-all duration-300 bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30 text-white">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-1 text-green-100 opacity-90">
                Total Revenue
              </p>
              <h3 className="text-2xl font-bold text-white">
                ${stats.totalRevenue.toFixed(2)}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
              <MdAttachMoney className="text-2xl" />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        </div>

        <div className="relative overflow-hidden p-5 rounded-2xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 text-white">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-1 text-orange-100 opacity-90">
                Total Discount
              </p>
              <h3 className="text-2xl font-bold text-white">
                ${stats.totalDiscount.toFixed(2)}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
              <MdAttachMoney className="text-2xl" />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        </div>

        <div className="relative overflow-hidden p-5 rounded-2xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30 text-white">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-1 text-purple-100 opacity-90">
                Completed
              </p>
              <h3 className="text-2xl font-bold text-white">
                {stats.completedSales}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
              <MdCheckCircle className="text-2xl" />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        </div>
      </div>

      {/* Filters & Search */}
      <div
        className={`p-4 rounded-2xl border mb-6 shadow-sm ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by sale number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border-2 transition-colors ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 hover:border-gray-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400"
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            className={`px-4 py-2.5 rounded-xl border-2 transition-colors ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-100 hover:border-gray-500"
                : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
            } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="refunded">Refunded</option>
            <option value="partially_refunded">Partially Refunded</option>
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-xl border-2 flex items-center gap-2 transition-all ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-100 hover:bg-gray-600"
                : "bg-gray-50 border-gray-300 text-gray-900 hover:bg-gray-100"
            }`}
          >
            <MdFilterList />
            Filters
          </button>

          {/* Action Buttons */}
          <button
            onClick={handleSearch}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
          >
            <MdRefresh />
            Refresh
          </button>

          <button
            onClick={exportToCSV}
            className="px-4 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
          >
            <MdFileDownload />
            Export
          </button>

          <button
            onClick={() => router.push("/sales/add-sale")}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
          >
            + Add Sale
          </button>
        </div>

        {/* Date Range Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
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
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Sales Table */}
      <div
        className={`rounded-2xl overflow-hidden shadow-xl border ${
          isDarkMode
            ? "bg-gray-800 border-gray-700 shadow-gray-900/20"
            : "bg-white border-gray-100 shadow-slate-200/50"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode
                    ? "bg-gray-900/50 text-gray-400"
                    : "bg-gray-50/80 text-gray-500"
                }`}
              >
                <th className="px-6 py-4">Sale No</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Cashier</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDarkMode ? "divide-gray-700" : "divide-gray-100"
              }`}
            >
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <p
                      className={
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }
                    >
                      No sales found
                    </p>
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr
                    key={sale._id}
                    className={`group transition-colors ${
                      isDarkMode
                        ? "hover:bg-gray-700/50"
                        : "hover:bg-indigo-50/30"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span
                        className={`font-semibold ${
                          isDarkMode ? "text-indigo-400" : "text-indigo-600"
                        }`}
                      >
                        {sale.saleNo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MdCalendarToday className="text-gray-400" />
                        <span
                          className={
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }
                        >
                          {new Date(sale.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(sale.createdAt).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {sale.customerId ? (
                        <div>
                          <div className="flex items-center gap-2">
                            <MdPerson className="text-gray-400" />
                            <span
                              className={
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }
                            >
                              {sale.customerId.name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {sale.customerId.phone}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">Walk-in</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }
                      >
                        {sale.items.length} item(s)
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`font-bold text-lg ${
                          isDarkMode ? "text-green-400" : "text-green-600"
                        }`}
                      >
                        ${sale.total.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          sale.status
                        )}`}
                      >
                        {getStatusIcon(sale.status)}
                        {sale.status.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }
                      >
                        {sale.cashierId?.name || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => router.push(`/sales/${sale._id}`)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkMode
                              ? "hover:bg-gray-600 text-gray-400 hover:text-blue-400"
                              : "hover:bg-blue-50 text-gray-400 hover:text-blue-600"
                          }`}
                          title="View"
                        >
                          <MdVisibility size={18} />
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/sales/edit-sale/${sale._id}`)
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkMode
                              ? "hover:bg-gray-600 text-gray-400 hover:text-green-400"
                              : "hover:bg-green-50 text-gray-400 hover:text-green-600"
                          }`}
                          title="Edit"
                        >
                          <MdEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(sale._id, sale.saleNo)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkMode
                              ? "hover:bg-gray-600 text-gray-400 hover:text-red-400"
                              : "hover:bg-red-50 text-gray-400 hover:text-red-600"
                          }`}
                          title="Cancel"
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div
            className={`px-6 py-4 border-t flex items-center justify-between ${
              isDarkMode
                ? "bg-gray-900/50 border-gray-700"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-700"
            }`}>
              Showing <span className="font-semibold">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
              <span className="font-semibold">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{" "}
              <span className="font-semibold">{pagination.total}</span> results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page - 1 })
                }
                disabled={pagination.page === 1}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  isDarkMode
                    ? "border-gray-600 hover:bg-gray-700 disabled:opacity-50"
                    : "border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                } disabled:cursor-not-allowed`}
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page + 1 })
                }
                disabled={pagination.page === pagination.pages}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  isDarkMode
                    ? "border-gray-600 hover:bg-gray-700 disabled:opacity-50"
                    : "border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                } disabled:cursor-not-allowed`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default SalesList;

