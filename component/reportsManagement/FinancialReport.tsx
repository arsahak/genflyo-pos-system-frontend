"use client";
import { useSidebar } from "@/lib/SidebarContext";
import { getFinancialReport } from "@/app/actions/reports";
import { getAllStores } from "@/app/actions/stores";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  MdArrowBack,
  MdRefresh,
  MdAttachMoney,
  MdTrendingUp,
  MdTrendingDown,
  MdAccountBalance,
  MdDownload,
} from "react-icons/md";

interface FinancialData {
  summary: {
    totalRevenue: number;
    grossRevenue: number;
    totalCost: number;
    grossProfit: number;
    netProfit: number;
    profitMargin: number;
    totalDiscount: number;
    totalTax: number;
    totalOrders: number;
  };
  paymentBreakdown: Record<string, number>;
  revenueTrend: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

const FinancialReport = () => {
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [reportData, setReportData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

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
      } else {
        toast.error(result.error || "Failed to fetch stores");
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast.error("An unexpected error occurred while fetching stores");
    }
  }, []);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getFinancialReport({
        from: dateFrom,
        to: dateTo,
        storeId: selectedStore || undefined,
      });

      if (result.success && result.data) {
        setReportData(result.data);
      } else {
        toast.error(result.error || "Failed to fetch financial report");
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      toast.error("An unexpected error occurred while fetching report");
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo, selectedStore]);

  useEffect(() => {
    fetchStores();
    setDefaultDates();
  }, [fetchStores]);

  useEffect(() => {
    if (dateFrom && dateTo) {
      fetchReport();
    }
  }, [selectedStore, dateFrom, dateTo, fetchReport]);

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "$0.00";
    }
    return `$${Number(amount).toFixed(2)}`;
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
          Financial Report
        </h1>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
          Revenue, profit & loss, and financial analytics
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          <div className="flex items-end">
            <button
              onClick={fetchReport}
              className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <MdRefresh />
              Refresh
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
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div
              className={`p-6 rounded-lg border-2 ${
                isDarkMode
                  ? "bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-800"
                  : "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <p
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-green-400" : "text-green-700"
                  }`}
                >
                  Total Revenue
                </p>
                <MdAttachMoney className="text-3xl text-green-500" />
              </div>
              <p
                className={`text-3xl font-bold ${
                  isDarkMode ? "text-green-300" : "text-green-600"
                }`}
              >
                {formatCurrency(reportData.summary.totalRevenue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                From {reportData.summary.totalOrders} orders
              </p>
            </div>

            <div
              className={`p-6 rounded-lg border-2 ${
                isDarkMode
                  ? "bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-800"
                  : "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <p
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-blue-400" : "text-blue-700"
                  }`}
                >
                  Net Profit
                </p>
                <MdTrendingUp className="text-3xl text-blue-500" />
              </div>
              <p
                className={`text-3xl font-bold ${
                  isDarkMode ? "text-blue-300" : "text-blue-600"
                }`}
              >
                {formatCurrency(reportData.summary.netProfit)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Margin: {reportData.summary.profitMargin}%
              </p>
            </div>

            <div
              className={`p-6 rounded-lg border-2 ${
                isDarkMode
                  ? "bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-800"
                  : "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <p
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-purple-400" : "text-purple-700"
                  }`}
                >
                  Total Costs
                </p>
                <MdTrendingDown className="text-3xl text-purple-500" />
              </div>
              <p
                className={`text-3xl font-bold ${
                  isDarkMode ? "text-purple-300" : "text-purple-600"
                }`}
              >
                {formatCurrency(reportData.summary.totalCost)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Cost of goods sold
              </p>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Income & Expenses */}
            <div
              className={`rounded-lg border-2 p-6 ${
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
                Income & Expenses
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    Gross Revenue
                  </span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(reportData.summary.grossRevenue)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    Discounts
                  </span>
                  <span className="font-semibold text-red-600">
                    -{formatCurrency(reportData.summary.totalDiscount)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    Cost of Goods
                  </span>
                  <span className="font-semibold text-red-600">
                    -{formatCurrency(reportData.summary.totalCost)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    Tax Collected
                  </span>
                  <span className="font-semibold text-blue-600">
                    {formatCurrency(reportData.summary.totalTax)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300 dark:border-gray-600">
                  <span
                    className={`font-bold text-lg ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    Net Profit
                  </span>
                  <span
                    className={`font-bold text-lg ${
                      reportData.summary.netProfit >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(reportData.summary.netProfit)}
                  </span>
                </div>
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
              <h3
                className={`text-lg font-bold mb-4 ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Payment Method Breakdown
              </h3>
              <div className="space-y-4">
                {Object.entries(reportData.paymentBreakdown).map(
                  ([method, amount]) => {
                    const total = Object.values(
                      reportData.paymentBreakdown
                    ).reduce((sum, amt) => sum + amt, 0);
                    const percentage =
                      total > 0 ? ((amount / total) * 100).toFixed(1) : 0;

                    return (
                      <div key={method}>
                        <div className="flex justify-between mb-2">
                          <span
                            className={`font-medium capitalize ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {method}
                          </span>
                          <span
                            className={`font-semibold ${
                              isDarkMode ? "text-gray-200" : "text-gray-900"
                            }`}
                          >
                            {formatCurrency(amount)} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all"
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

          {/* Revenue Trend */}
          {reportData.revenueTrend.length > 0 && (
            <div
              className={`rounded-lg border-2 p-6 ${
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
                Daily Revenue Trend
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
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-center">Orders</th>
                      <th className="px-4 py-2 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.revenueTrend.map((day, index) => (
                      <tr
                        key={index}
                        className={`border-t ${
                          isDarkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <td
                          className={`px-4 py-2 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {new Date(day.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-center text-blue-600">
                          {day.orders}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold text-green-600">
                          {formatCurrency(day.revenue)}
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

export default FinancialReport;

