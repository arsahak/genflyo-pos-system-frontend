"use client";
import { useSidebar } from "@/lib/SidebarContext";
import { getAllSales, getSalesStats } from "@/app/actions/sales";
import { getAllStores } from "@/app/actions/stores";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  MdSearch,
  MdFilterList,
  MdRefresh,
  MdVisibility,
  MdEdit,
  MdFileDownload,
  MdAttachMoney,
  MdPerson,
  MdStore,
  MdCalendarToday,
  MdCheckCircle,
  MdCancel,
  MdWarning,
  MdShoppingCart,
} from "react-icons/md";
import { SalesListSkeleton } from "./components/SalesListSkeleton";

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

const SalesHistory = () => {
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
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
    limit: 50,
    total: 0,
    pages: 1,
  });

  // Set default date range (last 30 days)
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setDateFrom(thirtyDaysAgo.toISOString().split("T")[0]);
    setDateTo(today.toISOString().split("T")[0]);
  }, []);

  const fetchStores = useCallback(async () => {
    try {
      const result = await getAllStores({ limit: 1000 });
      if (result.success && result.data) {
        setStores(result.data.stores || []);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  }, []);

  const fetchSalesHistory = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllSales({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        startDate: dateFrom || undefined,
        endDate: dateTo || undefined,
        storeId: selectedStore || undefined,
      });

      if (result.success && result.data) {
        setSales(result.data.sales || []);
        if (result.data.pagination) {
          setPagination(result.data.pagination);
        }
      } else {
        toast.error(result.error || "Failed to fetch sales history");
      }
    } catch (error) {
      console.error("Error fetching sales history:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchQuery, dateFrom, dateTo, selectedStore]);

  const fetchStats = useCallback(async () => {
    try {
      const result = await getSalesStats({
        startDate: dateFrom || undefined,
        endDate: dateTo || undefined,
        storeId: selectedStore || undefined,
      });

      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, [dateFrom, dateTo, selectedStore]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  useEffect(() => {
    if (dateFrom && dateTo) {
      fetchSalesHistory();
      fetchStats();
    }
  }, [fetchSalesHistory, fetchStats, dateFrom, dateTo]);

  const exportToCSV = () => {
    const csv = [
      ["Sale No", "Date", "Time", "Customer", "Store", "Total", "Status", "Cashier"],
      ...sales.map((sale) => [
        sale.saleNo,
        new Date(sale.createdAt).toLocaleDateString(),
        new Date(sale.createdAt).toLocaleTimeString(),
        sale.customerId?.name || "Walk-in",
        sale.storeId?.name || "N/A",
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
    a.download = `sales-history-${dateFrom}-to-${dateTo}.csv`;
    a.click();
    toast.success("Sales history exported successfully");
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

  // Show skeleton while loading
  if (loading) {
    return <SalesListSkeleton isDarkMode={isDarkMode} />;
  }

  return (
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
          Sales History
        </h1>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
          View and analyze historical sales data
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
              <MdShoppingCart className="text-2xl" />
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
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              />
            </div>
          </div>

          {/* Store Filter */}
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-100"
                : "bg-gray-50 border-gray-300 text-gray-900"
            }`}
          >
            <option value="">All Stores</option>
            {stores.map((store) => (
              <option key={store._id} value={store._id}>
                {store.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-100"
                : "bg-gray-50 border-gray-300 text-gray-900"
            }`}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="refunded">Refunded</option>
            <option value="partially_refunded">Partially Refunded</option>
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg border-2 flex items-center gap-2 ${
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
            onClick={() => {
              fetchSalesHistory();
              fetchStats();
            }}
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
            <thead
              className={
                isDarkMode ? "bg-gray-700 text-gray-100" : "bg-gray-100 text-gray-900"
              }
            >
              <tr>
                <th className="px-4 py-3 text-left">Sale No</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Store</th>
                <th className="px-4 py-3 text-left">Items</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <p
                      className={
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }
                    >
                      No sales found for the selected period
                    </p>
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr
                    key={sale._id}
                    className={`border-t ${
                      isDarkMode
                        ? "border-gray-700 hover:bg-gray-750"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`font-semibold ${
                          isDarkMode ? "text-indigo-400" : "text-indigo-600"
                        }`}
                      >
                        {sale.saleNo}
                      </span>
                    </td>
                    <td className="px-4 py-3">
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
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MdStore className="text-gray-400" />
                        <span
                          className={
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }
                        >
                          {sale.storeId?.name || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }
                      >
                        {sale.items.length} item(s)
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-bold text-lg ${
                          isDarkMode ? "text-green-400" : "text-green-600"
                        }`}
                      >
                        ${sale.total.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          sale.status
                        )}`}
                      >
                        {getStatusIcon(sale.status)}
                        {sale.status.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => router.push(`/sales/${sale._id}`)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="View"
                        >
                          <MdVisibility className="text-xl" />
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/sales/edit-sale/${sale._id}`)
                          }
                          className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                          title="Edit"
                        >
                          <MdEdit className="text-xl" />
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
            className={`px-4 py-3 border-t flex items-center justify-between ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page - 1 })
                }
                disabled={pagination.page === 1}
                className={`px-4 py-2 rounded-lg ${
                  pagination.page === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page + 1 })
                }
                disabled={pagination.page === pagination.pages}
                className={`px-4 py-2 rounded-lg ${
                  pagination.page === pagination.pages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default SalesHistory;
