"use client";

import {
  DashboardOverviewData,
  DashboardStatsData,
} from "@/app/actions/dashboard";
import { useLanguage } from "@/lib/LanguageContext";
import { useSidebar } from "@/lib/SidebarContext";
import { getTranslation } from "@/lib/translations";
import {
  IoMdAnalytics,
  IoMdCalendar,
  IoMdCard,
  IoMdDocument,
  IoMdPeople,
  IoMdSettings,
  IoMdTrendingDown,
  IoMdTrendingUp,
} from "react-icons/io";
import { MdAttachMoney, MdShoppingCart } from "react-icons/md";
import CustomerOverviewChart from "./CustomerOverviewChart";
import SalesPurchaseChart from "./SalesPurchaseChart";

interface DashboardProps {
  data: DashboardOverviewData | null;
  stats: DashboardStatsData | null;
  error?: string;
}

const Dashboard = ({ data, stats, error }: DashboardProps) => {
  const { isDarkMode } = useSidebar();
  const { language } = useLanguage();

  // Format currency - Bangladesh Taka
  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Format number with abbreviation
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <>
      <div
        className={`min-h-screen transition-colors duration-200 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="p-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1
                className={`text-3xl font-bold transition-colors duration-200 ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {getTranslation("welcomeAdmin", language)}
              </h1>
              <p
                className={`text-sm mt-1 transition-colors duration-200 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                You have {data?.todaysOrderCount || 0}+ Orders, Today.
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-300 border border-gray-700"
                    : "bg-white text-gray-700 border border-gray-200"
                }`}
              >
                <IoMdCalendar className="w-4 h-4" />
                <span className="text-sm font-medium">
                  10/20/2025 - 10/26/2025
                </span>
              </div>
              <button
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <IoMdSettings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {error ? (
            <div className="text-center py-12">
              <p
                className={`text-lg transition-colors duration-200 ${
                  isDarkMode ? "text-red-400" : "text-red-600"
                }`}
              >
                {error}
              </p>
            </div>
          ) : !data ? (
            <div className="text-center py-12">
              <p
                className={`transition-colors duration-200 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                No data available
              </p>
            </div>
          ) : (
            <>
              {/* Main KPI Cards - Combined Today's + Total */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Sales Card - Combined */}
                <div
                  className={`p-6 rounded-xl shadow-lg transition-colors duration-200 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-emerald-600 to-emerald-700"
                      : "bg-gradient-to-br from-emerald-500 to-emerald-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-emerald-100 text-xs font-medium uppercase tracking-wide">
                        {getTranslation("totalSales", language)}
                      </p>
                    </div>
                    <div className="bg-white/20 p-2.5 rounded-full">
                      <IoMdDocument className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-2">
                      <p className="text-white/70 text-xs mb-0.5">Today</p>
                      <p className="text-white text-xl font-bold">
                        {formatCurrency(data.todaysSales || 0)}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-white/20">
                      <p className="text-white/70 text-xs mb-0.5">Total</p>
                      <div className="flex items-center justify-between">
                        <p className="text-white text-sm font-semibold">
                          {formatCurrency(data.totalSales.current)}
                        </p>
                        <div className="flex items-center">
                          {data.totalSales.trend === "up" ? (
                            <IoMdTrendingUp className="w-3.5 h-3.5 text-green-300 mr-1" />
                          ) : data.totalSales.trend === "down" ? (
                            <IoMdTrendingDown className="w-3.5 h-3.5 text-red-300 mr-1" />
                          ) : null}
                          <span className={`text-xs font-medium ${
                            data.totalSales.trend === "up"
                              ? "text-green-300"
                              : data.totalSales.trend === "down"
                              ? "text-red-300"
                              : "text-white/70"
                          }`}>
                            {data.totalSales.change > 0 ? "+" : ""}{data.totalSales.change}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sales Return Card - Combined */}
                <div
                  className={`p-6 rounded-xl shadow-lg transition-colors duration-200 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-red-600 to-red-700"
                      : "bg-gradient-to-br from-red-500 to-red-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-red-100 text-xs font-medium uppercase tracking-wide">
                        {getTranslation("totalSalesReturn", language)}
                      </p>
                    </div>
                    <div className="bg-white/20 p-2.5 rounded-full">
                      <IoMdCard className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-2">
                      <p className="text-white/70 text-xs mb-0.5">Today</p>
                      <p className="text-white text-xl font-bold">
                        {formatCurrency(data.todaysSalesReturn || 0)}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-white/20">
                      <p className="text-white/70 text-xs mb-0.5">Total</p>
                      <div className="flex items-center justify-between">
                        <p className="text-white text-sm font-semibold">
                          {formatCurrency(data.totalSalesReturn.current)}
                        </p>
                        <div className="flex items-center">
                          {data.totalSalesReturn.trend === "up" ? (
                            <IoMdTrendingUp className="w-3.5 h-3.5 text-green-300 mr-1" />
                          ) : data.totalSalesReturn.trend === "down" ? (
                            <IoMdTrendingDown className="w-3.5 h-3.5 text-red-300 mr-1" />
                          ) : null}
                          <span className={`text-xs font-medium ${
                            data.totalSalesReturn.trend === "up"
                              ? "text-green-300"
                              : data.totalSalesReturn.trend === "down"
                              ? "text-red-300"
                              : "text-white/70"
                          }`}>
                            {data.totalSalesReturn.change > 0 ? "+" : ""}{data.totalSalesReturn.change}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Purchase Card - Combined */}
                <div
                  className={`p-6 rounded-xl shadow-lg transition-colors duration-200 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-purple-600 to-purple-700"
                      : "bg-gradient-to-br from-purple-500 to-purple-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-purple-100 text-xs font-medium uppercase tracking-wide">
                        {getTranslation("totalPurchase", language)}
                      </p>
                    </div>
                    <div className="bg-white/20 p-2.5 rounded-full">
                      <MdShoppingCart className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-2">
                      <p className="text-white/70 text-xs mb-0.5">Today</p>
                      <p className="text-white text-xl font-bold">
                        {formatCurrency(data.todaysPurchase || 0)}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-white/20">
                      <p className="text-white/70 text-xs mb-0.5">Total</p>
                      <div className="flex items-center justify-between">
                        <p className="text-white text-sm font-semibold">
                          {formatCurrency(data.totalPurchase.current)}
                        </p>
                        <div className="flex items-center">
                          {data.totalPurchase.trend === "up" ? (
                            <IoMdTrendingUp className="w-3.5 h-3.5 text-green-300 mr-1" />
                          ) : data.totalPurchase.trend === "down" ? (
                            <IoMdTrendingDown className="w-3.5 h-3.5 text-red-300 mr-1" />
                          ) : null}
                          <span className={`text-xs font-medium ${
                            data.totalPurchase.trend === "up"
                              ? "text-green-300"
                              : data.totalPurchase.trend === "down"
                              ? "text-red-300"
                              : "text-white/70"
                          }`}>
                            {data.totalPurchase.change > 0 ? "+" : ""}{data.totalPurchase.change}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Purchase Return Card - Combined */}
                <div
                  className={`p-6 rounded-xl shadow-lg transition-colors duration-200 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-amber-600 to-amber-700"
                      : "bg-gradient-to-br from-amber-500 to-amber-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-amber-100 text-xs font-medium uppercase tracking-wide">
                        {getTranslation("totalPurchaseReturn", language)}
                      </p>
                    </div>
                    <div className="bg-white/20 p-2.5 rounded-full">
                      <IoMdAnalytics className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-2">
                      <p className="text-white/70 text-xs mb-0.5">Today</p>
                      <p className="text-white text-xl font-bold">
                        {formatCurrency(data.todaysPurchaseReturn || 0)}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-white/20">
                      <p className="text-white/70 text-xs mb-0.5">Total</p>
                      <div className="flex items-center justify-between">
                        <p className="text-white text-sm font-semibold">
                          {formatCurrency(data.totalPurchaseReturn.current)}
                        </p>
                        <div className="flex items-center">
                          {data.totalPurchaseReturn.trend === "up" ? (
                            <IoMdTrendingUp className="w-3.5 h-3.5 text-green-300 mr-1" />
                          ) : data.totalPurchaseReturn.trend === "down" ? (
                            <IoMdTrendingDown className="w-3.5 h-3.5 text-red-300 mr-1" />
                          ) : null}
                          <span className={`text-xs font-medium ${
                            data.totalPurchaseReturn.trend === "up"
                              ? "text-green-300"
                              : data.totalPurchaseReturn.trend === "down"
                              ? "text-red-300"
                              : "text-white/70"
                          }`}>
                            {data.totalPurchaseReturn.change > 0 ? "+" : ""}{data.totalPurchaseReturn.change}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div
                  className={`p-6 rounded-xl shadow-md transition-colors duration-200 ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-sm font-medium transition-colors duration-200 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {getTranslation("profit", language)}
                      </p>
                      <p
                        className={`text-2xl font-bold mt-1 transition-colors duration-200 ${
                          isDarkMode ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {formatCurrency(data.profit.current)}
                      </p>
                      <div className="flex items-center mt-2">
                        {data.profit.trend === "up" ? (
                          <IoMdTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : data.profit.trend === "down" ? (
                          <IoMdTrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        ) : null}
                        <span
                          className={`text-sm font-medium ${
                            data.profit.trend === "up"
                              ? "text-green-500"
                              : data.profit.trend === "down"
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {data.profit.change > 0 ? "+" : ""}
                          {data.profit.change}% vs Last Month
                        </span>
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-full transition-colors duration-200 ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <MdAttachMoney
                        className={`w-6 h-6 transition-colors duration-200 ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className={`p-6 rounded-xl shadow-md transition-colors duration-200 ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-sm font-medium transition-colors duration-200 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {getTranslation("invoiceDue", language)}
                      </p>
                      <p
                        className={`text-2xl font-bold mt-1 transition-colors duration-200 ${
                          isDarkMode ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {formatCurrency(data.invoiceDue.current)}
                      </p>
                      <div className="flex items-center mt-2">
                        {data.invoiceDue.trend === "up" ? (
                          <IoMdTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : data.invoiceDue.trend === "down" ? (
                          <IoMdTrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        ) : null}
                        <span
                          className={`text-sm font-medium ${
                            data.invoiceDue.trend === "up"
                              ? "text-green-500"
                              : data.invoiceDue.trend === "down"
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {data.invoiceDue.change > 0 ? "+" : ""}
                          {data.invoiceDue.change}% vs Last Month
                        </span>
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-full transition-colors duration-200 ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <IoMdDocument
                        className={`w-6 h-6 transition-colors duration-200 ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className={`p-6 rounded-xl shadow-md transition-colors duration-200 ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-sm font-medium transition-colors duration-200 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {getTranslation("totalExpenses", language)}
                      </p>
                      <p
                        className={`text-2xl font-bold mt-1 transition-colors duration-200 ${
                          isDarkMode ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {formatCurrency(data.totalExpenses.current)}
                      </p>
                      <div className="flex items-center mt-2">
                        {data.totalExpenses.trend === "up" ? (
                          <IoMdTrendingUp className="w-4 h-4 text-red-500 mr-1" />
                        ) : data.totalExpenses.trend === "down" ? (
                          <IoMdTrendingDown className="w-4 h-4 text-green-500 mr-1" />
                        ) : null}
                        <span
                          className={`text-sm font-medium ${
                            data.totalExpenses.trend === "down"
                              ? "text-green-500"
                              : data.totalExpenses.trend === "up"
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {data.totalExpenses.change > 0 ? "+" : ""}
                          {data.totalExpenses.change}% vs Last Month
                        </span>
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-full transition-colors duration-200 ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <IoMdAnalytics
                        className={`w-6 h-6 transition-colors duration-200 ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className={`p-6 rounded-xl shadow-md transition-colors duration-200 ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-sm font-medium transition-colors duration-200 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {getTranslation("totalPaymentReturns", language)}
                      </p>
                      <p
                        className={`text-2xl font-bold mt-1 transition-colors duration-200 ${
                          isDarkMode ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {formatCurrency(data.totalPaymentReturns.current)}
                      </p>
                      <div className="flex items-center mt-2">
                        {data.totalPaymentReturns.trend === "down" ? (
                          <IoMdTrendingDown className="w-4 h-4 text-green-500 mr-1" />
                        ) : data.totalPaymentReturns.trend === "up" ? (
                          <IoMdTrendingUp className="w-4 h-4 text-red-500 mr-1" />
                        ) : null}
                        <span
                          className={`text-sm font-medium ${
                            data.totalPaymentReturns.trend === "down"
                              ? "text-green-500"
                              : data.totalPaymentReturns.trend === "up"
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {data.totalPaymentReturns.change > 0 ? "+" : ""}
                          {data.totalPaymentReturns.change}% vs Last Month
                        </span>
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-full transition-colors duration-200 ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <IoMdCard
                        className={`w-6 h-6 transition-colors duration-200 ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts and Additional Info */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Sales & Purchase Chart - 2/3 width */}
                <div className="lg:col-span-2">
                  {stats?.salesAndPurchaseByDay ? (
                    <SalesPurchaseChart data={stats.salesAndPurchaseByDay} />
                  ) : (
                    <div
                      className={`p-6 rounded-xl shadow-md transition-colors duration-200 ${
                        isDarkMode ? "bg-gray-800" : "bg-white"
                      }`}
                    >
                      <div className="h-64 flex items-center justify-center">
                        <p
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }
                        >
                          No chart data available
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Overall Information and Customer Overview - 1/3 width */}
                <div className="flex flex-col gap-6 h-full">
                  {/* Overall Info Cards */}
                  <div
                    className={`p-6 rounded-xl shadow-md transition-colors duration-200 flex-1 ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <h3
                      className={`text-lg font-semibold mb-4 transition-colors duration-200 ${
                        isDarkMode ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {getTranslation("overallInformation", language)}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                              isDarkMode ? "bg-gray-700" : "bg-gray-100"
                            }`}
                          >
                            <IoMdPeople
                              className={`w-5 h-5 transition-colors duration-200 ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            />
                          </div>
                          <span
                            className={`font-medium transition-colors duration-200 ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {getTranslation("suppliers", language)}
                          </span>
                        </div>
                        <span
                          className={`text-lg font-bold transition-colors duration-200 ${
                            isDarkMode ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {data.overallInformation.suppliers}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                              isDarkMode ? "bg-gray-700" : "bg-gray-100"
                            }`}
                          >
                            <IoMdPeople
                              className={`w-5 h-5 transition-colors duration-200 ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            />
                          </div>
                          <span
                            className={`font-medium transition-colors duration-200 ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {getTranslation("customer", language)}
                          </span>
                        </div>
                        <span
                          className={`text-lg font-bold transition-colors duration-200 ${
                            isDarkMode ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {data.overallInformation.customers}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                              isDarkMode ? "bg-gray-700" : "bg-gray-100"
                            }`}
                          >
                            <MdShoppingCart
                              className={`w-5 h-5 transition-colors duration-200 ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            />
                          </div>
                          <span
                            className={`font-medium transition-colors duration-200 ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {getTranslation("orders", language)}
                          </span>
                        </div>
                        <span
                          className={`text-lg font-bold transition-colors duration-200 ${
                            isDarkMode ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {data.overallInformation.orders}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customers Overview */}
                  <div className="flex-1 flex flex-col">
                    {stats?.customerOverviewByDay ? (
                      <CustomerOverviewChart
                        data={stats.customerOverviewByDay}
                        firstTime={data.customerOverview.firstTime}
                        firstTimeChange={data.customerOverview.firstTimeChange}
                        returning={data.customerOverview.return}
                        returningChange={data.customerOverview.returnChange}
                      />
                    ) : (
                      <div
                        className={`p-6 rounded-xl shadow-md transition-colors duration-200 h-full ${
                          isDarkMode ? "bg-gray-800" : "bg-white"
                        }`}
                      >
                        <div className="h-full flex items-center justify-center">
                          <p
                            className={
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }
                          >
                            No customer data available
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default Dashboard;
