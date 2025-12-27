"use client";
import { useSidebar } from "@/lib/SidebarContext";
import { getAllSales, getSalesStats, deleteSale } from "@/app/actions/sales";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
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
    fetchSales();
    fetchStats();
  }, [fetchSales, fetchStats]);

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

  return (
    <div className="p-6">
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
        <div
          className={`p-4 rounded-lg border-2 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total Sales
              </p>
              <p
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {stats.totalSales}
              </p>
            </div>
            <MdAttachMoney className="text-4xl text-blue-500" />
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border-2 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total Revenue
              </p>
              <p
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
              >
                ${stats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <MdAttachMoney className="text-4xl text-green-500" />
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border-2 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total Discount
              </p>
              <p
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-orange-400" : "text-orange-600"
                }`}
              >
                ${stats.totalDiscount.toFixed(2)}
              </p>
            </div>
            <MdAttachMoney className="text-4xl text-orange-500" />
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border-2 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Completed
              </p>
              <p
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              >
                {stats.completedSales}
              </p>
            </div>
            <MdCheckCircle className="text-4xl text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div
        className={`p-4 rounded-lg border-2 mb-4 ${
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
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
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
            onClick={handleSearch}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
          >
            <MdRefresh />
            Refresh
          </button>

          <button
            onClick={exportToCSV}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
          >
            <MdFileDownload />
            Export
          </button>

          <button
            onClick={() => router.push("/sales/add-sale")}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-2"
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
        className={`rounded-lg border-2 overflow-hidden ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
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
                <th className="px-4 py-3 text-left">Items</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Cashier</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
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
                      <span
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }
                      >
                        {sale.cashierId?.name || "N/A"}
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
                        <button
                          onClick={() => handleDelete(sale._id, sale.saleNo)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Cancel"
                        >
                          <MdDelete className="text-xl" />
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
  );
};

export default SalesList;

