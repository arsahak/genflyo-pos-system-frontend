"use client";
import { useSidebar } from "@/lib/SidebarContext";
import { getAllStores } from "@/app/actions/stores";
import { getSalesReport } from "@/app/actions/reports";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  MdArrowBack,
  MdRefresh,
  MdTrendingUp,
  MdShoppingCart,
  MdAttachMoney,
  MdInventory,
  MdPayment,
  MdDownload,
} from "react-icons/md";

interface SalesReportData {
  summary: {
    totalSales: number;
    totalDiscount: number;
    totalTax: number;
    subtotal: number;
    totalOrders: number;
    totalItems: number;
    averageOrderValue: number;
  };
  groupedData: Array<{
    period: string;
    sales: number;
    orders: number;
    items: number;
  }>;
  paymentMethods: Record<string, { count: number; total: number }>;
  topProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
}

const SalesReport = () => {
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [reportData, setReportData] = useState<SalesReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [groupBy, setGroupBy] = useState("day");

  const setDefaultDates = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setDateFrom(thirtyDaysAgo.toISOString().split("T")[0]);
    setDateTo(today.toISOString().split("T")[0]);
  };

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

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getSalesReport({
        from: dateFrom,
        to: dateTo,
        groupBy,
        storeId: selectedStore || undefined,
      });

      if (result.success && result.data) {
        setReportData(result.data);
      } else {
        toast.error(result.error || "Failed to fetch report");
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo, groupBy, selectedStore]);

  useEffect(() => {
    fetchStores();
    setDefaultDates();
  }, [fetchStores]);

  useEffect(() => {
    if (dateFrom && dateTo) {
      fetchReport();
    }
  }, [dateFrom, dateTo, fetchReport]);

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "$0.00";
    }
    return `$${Number(amount).toFixed(2)}`;
  };

  const exportReport = () => {
    if (!reportData) return;
    
    // Simple CSV export
    const csv = [
      ["Sales Report"],
      ["Period", `${dateFrom} to ${dateTo}`],
      [""],
      ["Summary"],
      ["Total Sales", reportData.summary.totalSales],
      ["Total Orders", reportData.summary.totalOrders],
      ["Average Order Value", reportData.summary.averageOrderValue],
      [""],
      ["Top Products"],
      ["Product", "Quantity Sold", "Revenue"],
      ...reportData.topProducts.map(p => [p.name, p.quantity, p.revenue])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-report-${dateFrom}-to-${dateTo}.csv`;
    a.click();
    toast.success("Report exported successfully!");
  };

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
          Back to Reports
        </button>
        <h1
          className={`text-3xl font-bold mb-2 ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Sales Report
        </h1>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
          Comprehensive sales analysis and trends
        </p>
      </div>

      {/* Filters */}
      <div
        className={`p-4 rounded-lg border-2 mb-6 ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              className={`w-full px-3 py-2 rounded-lg border ${
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
              className={`w-full px-3 py-2 rounded-lg border ${
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
              Store
            </label>
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
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
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Group By
            </label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
            >
              <option value="hour">Hourly</option>
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={fetchReport}
              className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <MdRefresh />
              Refresh
            </button>
            <button
              onClick={exportReport}
              disabled={!reportData}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              <MdDownload />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : reportData ? (
        <>
          {/* Summary Cards */}
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
                      isDarkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {formatCurrency(reportData.summary.totalSales)}
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
                    Total Orders
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {reportData.summary.totalOrders}
                  </p>
                </div>
                <MdShoppingCart className="text-4xl text-blue-500" />
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
                    Avg Order Value
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-purple-400" : "text-purple-600"
                    }`}
                  >
                    {formatCurrency(reportData.summary.averageOrderValue)}
                  </p>
                </div>
                <MdTrendingUp className="text-4xl text-purple-500" />
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
                    Total Items Sold
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-orange-400" : "text-orange-600"
                    }`}
                  >
                    {reportData.summary.totalItems}
                  </p>
                </div>
                <MdInventory className="text-4xl text-orange-500" />
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <div
              className={`rounded-lg border-2 overflow-hidden ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="p-4 border-b border-gray-700">
                <h3
                  className={`text-lg font-bold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Top Selling Products
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead
                    className={
                      isDarkMode
                        ? "bg-gray-700 text-gray-100"
                        : "bg-gray-100 text-gray-900"
                    }
                  >
                    <tr>
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-center">Qty Sold</th>
                      <th className="px-4 py-2 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.topProducts.map((product, index) => (
                      <tr
                        key={index}
                        className={`border-t ${
                          isDarkMode
                            ? "border-gray-700"
                            : "border-gray-200"
                        }`}
                      >
                        <td
                          className={`px-4 py-2 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {product.name}
                        </td>
                        <td className="px-4 py-2 text-center font-semibold text-blue-600">
                          {product.quantity}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold text-green-600">
                          {formatCurrency(product.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Methods */}
            <div
              className={`rounded-lg border-2 p-6 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <MdPayment className="text-2xl text-indigo-500" />
                <h3
                  className={`text-lg font-bold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Payment Methods
                </h3>
              </div>
              <div className="space-y-3">
                {Object.entries(reportData.paymentMethods).map(
                  ([method, data]) => {
                    const total = Object.values(reportData.paymentMethods).reduce(
                      (sum, m) => sum + m.total,
                      0
                    );
                    const percentage = total > 0 ? (data.total / total) * 100 : 0;

                    return (
                      <div key={method}>
                        <div className="flex justify-between mb-1">
                          <span
                            className={`font-medium capitalize ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {method}
                          </span>
                          <span
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {formatCurrency(data.total)} ({data.count} orders)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          {/* Sales Trend */}
          {reportData.groupedData.length > 0 && (
            <div
              className={`mt-6 rounded-lg border-2 p-6 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-bold mb-4 ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Sales Trend ({groupBy})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead
                    className={
                      isDarkMode
                        ? "bg-gray-700 text-gray-100"
                        : "bg-gray-100 text-gray-900"
                    }
                  >
                    <tr>
                      <th className="px-4 py-2 text-left">Period</th>
                      <th className="px-4 py-2 text-center">Orders</th>
                      <th className="px-4 py-2 text-center">Items</th>
                      <th className="px-4 py-2 text-right">Sales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.groupedData.map((period, index) => (
                      <tr
                        key={index}
                        className={`border-t ${
                          isDarkMode
                            ? "border-gray-700"
                            : "border-gray-200"
                        }`}
                      >
                        <td
                          className={`px-4 py-2 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {period.period}
                        </td>
                        <td className="px-4 py-2 text-center text-blue-600">
                          {period.orders}
                        </td>
                        <td className="px-4 py-2 text-center text-purple-600">
                          {period.items}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold text-green-600">
                          {formatCurrency(period.sales)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            No data available for the selected period
          </p>
        </div>
      )}
    </div>
  );
};

export default SalesReport;

