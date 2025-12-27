"use client";
import { useSidebar } from "@/lib/SidebarContext";
import { getCustomerReport } from "@/app/actions/reports";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  MdArrowBack,
  MdRefresh,
  MdPeople,
  MdPersonAdd,
  MdRepeat,
  MdStar,
} from "react-icons/md";

interface CustomerReportData {
  summary: {
    totalCustomers: number;
    activeCustomers: number;
    newCustomers: number;
    averageCustomerValue: number;
  };
  membershipBreakdown: Record<string, number>;
  topCustomers: Array<{
    name: string;
    phone: string;
    membershipTier: string;
    totalSpent: number;
    orderCount: number;
    lastPurchase: string;
  }>;
}

const CustomerReport = () => {
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [reportData, setReportData] = useState<CustomerReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const setDefaultDates = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setDateFrom(thirtyDaysAgo.toISOString().split("T")[0]);
    setDateTo(today.toISOString().split("T")[0]);
  };

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCustomerReport({
        from: dateFrom,
        to: dateTo,
      });

      if (result.success && result.data) {
        setReportData(result.data);
      } else {
        toast.error(result.error || "Failed to fetch customer report");
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      toast.error("An unexpected error occurred while fetching report");
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    setDefaultDates();
  }, []);

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
          Customer Report
        </h1>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
          Customer analytics, retention, and insights
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    Total Customers
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {reportData.summary.totalCustomers}
                  </p>
                </div>
                <MdPeople className="text-4xl text-blue-500" />
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
                    Active Customers
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {reportData.summary.activeCustomers}
                  </p>
                </div>
                <MdRepeat className="text-4xl text-green-500" />
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
                    New Customers
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-purple-400" : "text-purple-600"
                    }`}
                  >
                    {reportData.summary.newCustomers}
                  </p>
                </div>
                <MdPersonAdd className="text-4xl text-purple-500" />
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
                    Avg Customer Value
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-orange-400" : "text-orange-600"
                    }`}
                  >
                    {formatCurrency(reportData.summary.averageCustomerValue)}
                  </p>
                </div>
                <MdStar className="text-4xl text-orange-500" />
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Customers */}
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
                  Top Customers
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
                      <th className="px-4 py-2 text-left">Customer</th>
                      <th className="px-4 py-2 text-center">Orders</th>
                      <th className="px-4 py-2 text-right">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.topCustomers.map((customer, index) => (
                      <tr
                        key={index}
                        className={`border-t ${
                          isDarkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <td className="px-4 py-2">
                          <div>
                            <p
                              className={`font-semibold ${
                                isDarkMode ? "text-gray-100" : "text-gray-900"
                              }`}
                            >
                              {customer.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {customer.phone}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center font-semibold text-blue-600">
                          {customer.orderCount}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold text-green-600">
                          {formatCurrency(customer.totalSpent)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Membership Breakdown */}
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
                Membership Breakdown
              </h3>
              <div className="space-y-4">
                {Object.entries(reportData.membershipBreakdown).map(
                  ([tier, count]) => {
                    const total = Object.values(
                      reportData.membershipBreakdown
                    ).reduce((sum, c) => sum + c, 0);
                    const percentage =
                      total > 0 ? ((count / total) * 100).toFixed(1) : 0;

                    const colors: any = {
                      regular: "bg-gray-500",
                      silver: "bg-gray-400",
                      gold: "bg-yellow-500",
                      platinum: "bg-purple-500",
                    };

                    return (
                      <div key={tier}>
                        <div className="flex justify-between mb-2">
                          <span
                            className={`font-medium capitalize ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {tier}
                          </span>
                          <span
                            className={`font-semibold ${
                              isDarkMode ? "text-gray-200" : "text-gray-900"
                            }`}
                          >
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`${
                              colors[tier] || "bg-indigo-600"
                            } h-2 rounded-full transition-all`}
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

export default CustomerReport;

