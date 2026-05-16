"use client";

import {
  DashboardOverviewData,
  DashboardStatsData,
} from "@/app/actions/dashboard";
import { useLanguage } from "@/lib/LanguageContext";
import { useSidebar } from "@/lib/SidebarContext";
import { useMemo, useState } from "react";
import { getTranslation } from "@/lib/translations";
import {
  IoMdAnalytics,
  IoMdCard,
  IoMdDocument,
  IoMdPeople,
  IoMdTrendingDown,
  IoMdTrendingUp,
} from "react-icons/io";
import {
  MdAttachMoney,
  MdInventory,
  MdShoppingCart,
  MdWarning,
} from "react-icons/md";
import SalesPurchaseChart from "./SalesPurchaseChart";

interface DashboardProps {
  data: DashboardOverviewData | null;
  stats: DashboardStatsData | null;
  error?: string;
}

const Dashboard = ({ data, stats, error }: DashboardProps) => {
  const { isDarkMode } = useSidebar();
  const { language } = useLanguage();
  const [topSearch, setTopSearch] = useState("");

  // Format currency — Bangladesh Taka
  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Format compact number for large values
  const formatCompact = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toString();
  };

  // Format date range from API data
  const formatDateRange = () => {
    if (!data?.dateRange) return "";
    const from = new Date(data.dateRange.from).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const to = new Date(data.dateRange.to).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${from} – ${to}`;
  };

  // Format a timestamp as readable time ago
  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const filteredTopProducts = useMemo(() => {
    const products = data?.topProducts;
    if (!products) return [];
    const q = topSearch.trim().toLowerCase();
    const list = q ? products.filter((p) => p.name.toLowerCase().includes(q)) : [...products];
    return list.sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
  }, [data, topSearch]);

  const card = `p-6 rounded-xl shadow-md transition-colors duration-200 ${
    isDarkMode ? "bg-gray-800" : "bg-white"
  }`;

  return (
    <>
      <div
        className={`min-h-screen transition-colors duration-200 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="p-6">
          {/* ─── Header ─── */}
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
                {data?.todaysOrderCount
                  ? `${data.todaysOrderCount} order${data.todaysOrderCount !== 1 ? "s" : ""} today`
                  : "No orders yet today"}
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              {data?.dateRange && (
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isDarkMode
                      ? "bg-gray-800 text-gray-300 border border-gray-700"
                      : "bg-white text-gray-700 border border-gray-200"
                  }`}
                >
                  <IoMdAnalytics className="w-4 h-4 opacity-70" />
                  <span>{formatDateRange()}</span>
                </div>
              )}
            </div>
          </div>

          {/* ─── Error / No-data states ─── */}
          {error ? (
            <div className="text-center py-12">
              <p
                className={`text-lg ${
                  isDarkMode ? "text-red-400" : "text-red-600"
                }`}
              >
                {error}
              </p>
            </div>
          ) : !data ? (
            <div className="text-center py-12">
              <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                No data available
              </p>
            </div>
          ) : (
            <>
              {/* ─── Row 1: Primary KPI cards (coloured) ─── */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Sales */}
                <KpiCard
                  isDarkMode={isDarkMode}
                  color="emerald"
                  label={getTranslation("totalSales", language)}
                  icon={<IoMdDocument className="w-5 h-5 text-white" />}
                  todayValue={formatCurrency(data.todaysSales || 0)}
                  totalValue={formatCurrency(data.totalSales.current)}
                  trend={data.totalSales.trend}
                  change={data.totalSales.change}
                />
                {/* Sales Return */}
                <KpiCard
                  isDarkMode={isDarkMode}
                  color="red"
                  label={getTranslation("totalSalesReturn", language)}
                  icon={<IoMdCard className="w-5 h-5 text-white" />}
                  todayValue={formatCurrency(data.todaysSalesReturn || 0)}
                  totalValue={formatCurrency(data.totalSalesReturn.current)}
                  trend={data.totalSalesReturn.trend}
                  change={data.totalSalesReturn.change}
                />
                {/* Purchase */}
                <KpiCard
                  isDarkMode={isDarkMode}
                  color="purple"
                  label={getTranslation("totalPurchase", language)}
                  icon={<MdShoppingCart className="w-5 h-5 text-white" />}
                  todayValue={formatCurrency(data.todaysPurchase || 0)}
                  totalValue={formatCurrency(data.totalPurchase.current)}
                  trend={data.totalPurchase.trend}
                  change={data.totalPurchase.change}
                  subLabel="Sourced Items Cost"
                />
                {/* Purchase Return */}
                <KpiCard
                  isDarkMode={isDarkMode}
                  color="amber"
                  label={getTranslation("totalPurchaseReturn", language)}
                  icon={<IoMdAnalytics className="w-5 h-5 text-white" />}
                  todayValue={formatCurrency(data.todaysPurchaseReturn || 0)}
                  totalValue={formatCurrency(data.totalPurchaseReturn.current)}
                  trend={data.totalPurchaseReturn.trend}
                  change={data.totalPurchaseReturn.change}
                  subLabel="Coming Soon"
                />
              </div>

              {/* ─── Row 2: Secondary KPI cards (white/dark) ─── */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <SecondaryKpiCard
                  isDarkMode={isDarkMode}
                  label={getTranslation("profit", language)}
                  value={formatCurrency(data.profit.current)}
                  trend={data.profit.trend}
                  change={data.profit.change}
                  icon={<MdAttachMoney className={`w-6 h-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`} />}
                  inverseColors={false}
                />
                <SecondaryKpiCard
                  isDarkMode={isDarkMode}
                  label={getTranslation("invoiceDue", language)}
                  value={formatCurrency(data.invoiceDue.current)}
                  trend={data.invoiceDue.trend}
                  change={data.invoiceDue.change}
                  icon={<IoMdDocument className={`w-6 h-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`} />}
                  inverseColors={true}
                  subLabel="Total Outstanding"
                />
                <SecondaryKpiCard
                  isDarkMode={isDarkMode}
                  label={getTranslation("totalExpenses", language)}
                  value={formatCurrency(data.totalExpenses.current)}
                  trend={data.totalExpenses.trend}
                  change={data.totalExpenses.change}
                  icon={<IoMdAnalytics className={`w-6 h-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`} />}
                  inverseColors={true}
                  subLabel="Sourced + Product Cost"
                />
                <SecondaryKpiCard
                  isDarkMode={isDarkMode}
                  label={getTranslation("totalPaymentReturns", language)}
                  value={formatCurrency(data.totalPaymentReturns.current)}
                  trend={data.totalPaymentReturns.trend}
                  change={data.totalPaymentReturns.change}
                  icon={<IoMdCard className={`w-6 h-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`} />}
                  inverseColors={true}
                />
              </div>

              {/* ─── Row 3: Charts + Overall Info ─── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
                {/* Sales & Purchase Chart — 2/3 */}
                <div className="lg:col-span-2 h-full">
                  {stats?.salesAndPurchaseByDay ? (
                    <SalesPurchaseChart data={stats.salesAndPurchaseByDay} />
                  ) : (
                    <div className={`${card} h-full flex items-center justify-center`}>
                      <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                        No chart data available
                      </p>
                    </div>
                  )}
                </div>

                {/* Overall Info — 1/3 */}
                <div className={`${card} h-full`}>
                  <h3
                    className={`text-base font-semibold mb-4 ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {getTranslation("overallInformation", language)}
                  </h3>
                  <div className="space-y-3">
                    <OverallRow
                      isDarkMode={isDarkMode}
                      icon={<IoMdPeople className="w-5 h-5" />}
                      label={getTranslation("suppliers", language)}
                      value={formatCompact(data.overallInformation.suppliers)}
                    />
                    <OverallRow
                      isDarkMode={isDarkMode}
                      icon={<IoMdPeople className="w-5 h-5" />}
                      label={getTranslation("customer", language)}
                      value={formatCompact(data.overallInformation.customers)}
                    />
                    <OverallRow
                      isDarkMode={isDarkMode}
                      icon={<MdShoppingCart className="w-5 h-5" />}
                      label={getTranslation("orders", language)}
                      value={formatCompact(data.overallInformation.orders)}
                    />
                    <OverallRow
                      isDarkMode={isDarkMode}
                      icon={<MdWarning className="w-5 h-5 text-orange-500" />}
                      label="Low Stock Items"
                      value={formatCompact(data.overallInformation.lowStockItems)}
                      valueColor={
                        data.overallInformation.lowStockItems > 0
                          ? "text-orange-500"
                          : undefined
                      }
                    />
                  </div>
                </div>
              </div>

              {/* ─── Row 4: Recent Sales — full width ─── */}
              <div className={`${card} mb-4`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${isDarkMode ? "bg-emerald-500/20" : "bg-emerald-50"}`}>
                      <IoMdDocument className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className={`text-base font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                        Recent Sales
                      </h3>
                      <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                        Latest transactions across all registers
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${isDarkMode ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
                    {data.recentSales?.length || 0} transactions
                  </span>
                </div>

                {!data.recentSales || data.recentSales.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <MdInventory className={`w-12 h-12 mb-3 ${isDarkMode ? "text-gray-600" : "text-gray-300"}`} />
                    <p className={`text-sm font-medium ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                      No recent sales
                    </p>
                    <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-600" : "text-gray-300"}`}>
                      Sales will appear here once recorded
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`text-xs uppercase tracking-wider border-b ${isDarkMode ? "text-gray-500 border-gray-700" : "text-gray-400 border-gray-100"}`}>
                          <th className="text-left pb-4 font-semibold pl-2">Sale #</th>
                          <th className="text-left pb-4 font-semibold px-4">Customer</th>
                          <th className="text-left pb-4 font-semibold px-4 hidden sm:table-cell">Cashier</th>
                          <th className="text-right pb-4 font-semibold px-4 hidden lg:table-cell">Date</th>
                          <th className="text-right pb-4 font-semibold pr-2">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentSales.map((sale, idx) => {
                          const initials = (sale.customer || "W")
                            .split(" ")
                            .map((w: string) => w[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase();
                          const avatarColors = [
                            "bg-blue-500", "bg-purple-500", "bg-pink-500",
                            "bg-indigo-500", "bg-teal-500", "bg-cyan-500",
                          ];
                          const avatarColor = avatarColors[idx % avatarColors.length];
                          return (
                            <tr
                              key={sale.id}
                              className={`group transition-colors border-b last:border-b-0 ${
                                isDarkMode
                                  ? "border-gray-700/60 hover:bg-gray-700/40"
                                  : "border-gray-50 hover:bg-gray-50/80"
                              }`}
                            >
                              <td className="py-4 pl-2 pr-4">
                                <span className={`font-mono text-xs px-2.5 py-1 rounded-lg font-medium ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                                  {sale.saleNo}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white ${avatarColor}`}>
                                    {initials}
                                  </div>
                                  <div>
                                    <p className={`text-sm font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                                      {sale.customer || "Walk-in"}
                                    </p>
                                    <p className={`text-xs hidden md:block ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                                      {formatTimeAgo(sale.createdAt)}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className={`py-4 px-4 hidden sm:table-cell`}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isDarkMode ? "bg-gray-600 text-gray-300" : "bg-gray-200 text-gray-600"}`}>
                                    {(sale.cashier || "?")[0].toUpperCase()}
                                  </div>
                                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                    {sale.cashier}
                                  </span>
                                </div>
                              </td>
                              <td className={`py-4 px-4 text-right hidden lg:table-cell text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                                {new Date(sale.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                              </td>
                              <td className="py-4 pl-4 pr-2 text-right">
                                <span className={`text-base font-bold font-mono ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                                  {formatCurrency(sale.total)}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* ─── Row 5: Top 100 Products — full width table ─── */}
              <div className={`${card} mb-8`}>
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${isDarkMode ? "bg-purple-500/20" : "bg-purple-50"}`}>
                      <MdShoppingCart className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <h3 className={`text-base font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                        Top Products
                      </h3>
                      <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                        Best performing products by revenue
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Search box */}
                    <div className="relative">
                      <svg
                        className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                      </svg>
                      <input
                        type="text"
                        value={topSearch}
                        onChange={(e) => setTopSearch(e.target.value)}
                        placeholder="Search product…"
                        className={`pl-8 pr-3 py-1.5 text-sm rounded-lg border outline-none w-48 transition-colors ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 focus:border-purple-500"
                            : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-purple-400"
                        }`}
                      />
                    </div>
                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap ${isDarkMode ? "bg-purple-500/15 text-purple-400" : "bg-purple-50 text-purple-600"}`}>
                      {filteredTopProducts.length} / {data.topProducts?.length || 0} products
                    </span>
                  </div>
                </div>

                {!data.topProducts || data.topProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <MdInventory className={`w-12 h-12 mb-3 ${isDarkMode ? "text-gray-600" : "text-gray-300"}`} />
                    <p className={`text-sm font-medium ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                      No product data yet
                    </p>
                  </div>
                ) : filteredTopProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <p className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                      No products match &ldquo;{topSearch}&rdquo;
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    {/* Sticky header + scrollable body */}
                    <div className={`max-h-[580px] overflow-y-auto rounded-lg border ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}>
                      <table className="w-full text-sm">
                        <thead className={`sticky top-0 z-10 ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                          <tr className={`text-xs uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            <th className="text-center py-3 px-3 font-semibold w-12">#</th>
                            <th className="text-left py-3 px-4 font-semibold">Product Name</th>
                            <th className="text-right py-3 px-4 font-semibold w-28">Qty Sold</th>
                            <th className="text-right py-3 px-4 font-semibold w-36">Revenue</th>
                            <th className="py-3 px-4 w-36 hidden lg:table-cell"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTopProducts.map((product, idx) => {
                            const rank = idx + 1;
                            const maxQty = filteredTopProducts[0]?.quantity || 1;
                            const pct = Math.round(((product.quantity || 0) / maxQty) * 100);

                            const rankBadge =
                              rank === 1
                                ? "bg-yellow-400 text-yellow-900"
                                : rank === 2
                                ? "bg-slate-300 text-slate-700"
                                : rank === 3
                                ? "bg-amber-600 text-white"
                                : isDarkMode
                                ? "bg-gray-700 text-gray-400"
                                : "bg-gray-100 text-gray-500";

                            const barColor =
                              rank === 1
                                ? "bg-yellow-400"
                                : rank === 2
                                ? "bg-slate-400"
                                : rank === 3
                                ? "bg-amber-500"
                                : rank <= 10
                                ? "bg-purple-500"
                                : "bg-gray-400";

                            return (
                              <tr
                                key={product.id}
                                className={`border-t transition-colors ${
                                  isDarkMode
                                    ? "border-gray-700/60 hover:bg-gray-700/40"
                                    : "border-gray-50 hover:bg-purple-50/40"
                                }`}
                              >
                                {/* Rank */}
                                <td className="py-3 px-3 text-center">
                                  <span className={`inline-flex items-center justify-center h-7 min-w-7 px-1.5 ${rank <= 9 ? "rounded-full" : "rounded-md"} text-xs font-bold ${rankBadge}`}>
                                    {rank}
                                  </span>
                                </td>
                                {/* Name */}
                                <td className={`py-3 px-4 font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                                  {product.name || "Unknown Product"}
                                </td>
                                {/* Qty */}
                                <td className={`py-3 px-4 text-right font-semibold tabular-nums ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                                  {(product.quantity || 0).toLocaleString()}
                                </td>
                                {/* Revenue */}
                                <td className={`py-3 px-4 text-right font-bold font-mono tabular-nums ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                                  {formatCurrency(product.revenue)}
                                </td>
                                {/* Revenue bar */}
                                <td className="py-3 px-4 hidden lg:table-cell">
                                  <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                                    <div
                                      className={`h-full rounded-full transition-all ${barColor}`}
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* ─── Row 5: Low Stock Alert (only shown if there are items) ─── */}
              {data.lowStockProducts && data.lowStockProducts.length > 0 && (
                <div className={card}>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <MdWarning className="w-4 h-4 text-orange-500" />
                    </div>
                    <h3
                      className={`text-base font-semibold ${
                        isDarkMode ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      Low Stock Alert
                    </h3>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-orange-500 text-white font-semibold">
                      {data.lowStockProducts.length} item{data.lowStockProducts.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {data.lowStockProducts.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          isDarkMode
                            ? "bg-orange-900/10 border-orange-800/30"
                            : "bg-orange-50 border-orange-100"
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-orange-500/10 flex-shrink-0">
                          <MdInventory className="w-4 h-4 text-orange-500" />
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${
                              isDarkMode ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            {item.productName}
                          </p>
                          <p className="text-xs text-orange-500 font-semibold">
                            {item.currentStock} / {item.minStock} min
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const colorMap: Record<string, string> = {
  emerald: "from-emerald-500 to-emerald-600 shadow-emerald-500/30",
  red:     "from-red-500 to-red-600 shadow-red-500/30",
  purple:  "from-purple-500 to-purple-600 shadow-purple-500/30",
  amber:   "from-amber-500 to-amber-600 shadow-amber-500/30",
};
const labelColorMap: Record<string, string> = {
  emerald: "text-emerald-100",
  red:     "text-red-100",
  purple:  "text-purple-100",
  amber:   "text-amber-100",
};

interface KpiCardProps {
  isDarkMode: boolean;
  color: string;
  label: string;
  icon: React.ReactNode;
  todayValue: string;
  totalValue: string;
  trend: "up" | "down" | "neutral";
  change: number;
  subLabel?: string;
}

const KpiCard = ({
  color,
  label,
  icon,
  todayValue,
  totalValue,
  trend,
  change,
  subLabel,
}: KpiCardProps) => (
  <div
    className={`p-6 rounded-xl shadow-lg bg-gradient-to-br ${colorMap[color]} text-white`}
  >
    <div className="flex items-center justify-between mb-3">
      <div>
        <p className={`${labelColorMap[color]} text-xs font-medium uppercase tracking-wide`}>
          {label}
        </p>
        {subLabel && (
          <p className="text-white/50 text-[10px] mt-0.5">{subLabel}</p>
        )}
      </div>
      <div className="bg-white/20 p-2.5 rounded-full">{icon}</div>
    </div>
    <div>
      <div className="mb-2">
        <p className="text-white/70 text-xs mb-0.5">Today</p>
        <p className="text-white text-xl font-bold">{todayValue}</p>
      </div>
      <div className="pt-2 border-t border-white/20 flex items-center justify-between">
        <div>
          <p className="text-white/70 text-xs mb-0.5">Total</p>
          <p className="text-white text-sm font-semibold">{totalValue}</p>
        </div>
        <div className="flex items-center gap-1">
          {trend === "up" ? (
            <IoMdTrendingUp className="w-3.5 h-3.5 text-green-300" />
          ) : trend === "down" ? (
            <IoMdTrendingDown className="w-3.5 h-3.5 text-red-300" />
          ) : null}
          <span
            className={`text-xs font-medium ${
              trend === "up"
                ? "text-green-300"
                : trend === "down"
                ? "text-red-300"
                : "text-white/70"
            }`}
          >
            {change > 0 ? "+" : ""}{change}%
          </span>
        </div>
      </div>
    </div>
  </div>
);

interface SecondaryKpiCardProps {
  isDarkMode: boolean;
  label: string;
  value: string;
  trend: "up" | "down" | "neutral";
  change: number;
  icon: React.ReactNode;
  inverseColors: boolean;
  subLabel?: string;
}

const SecondaryKpiCard = ({
  isDarkMode,
  label,
  value,
  trend,
  change,
  icon,
  inverseColors,
  subLabel,
}: SecondaryKpiCardProps) => {
  const upColor = inverseColors ? "text-red-500" : "text-green-500";
  const downColor = inverseColors ? "text-green-500" : "text-red-500";
  const trendColor =
    trend === "up" ? upColor : trend === "down" ? downColor : "text-gray-500";
  const TrendIcon =
    trend === "up"
      ? IoMdTrendingUp
      : trend === "down"
      ? IoMdTrendingDown
      : null;

  return (
    <div
      className={`p-6 rounded-xl shadow-md transition-colors duration-200 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <p
              className={`text-sm font-medium ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {label}
            </p>
            {subLabel && (
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                isDarkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"
              }`}>
                {subLabel}
              </span>
            )}
          </div>
          <p
            className={`text-2xl font-bold mt-1 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            {value}
          </p>
          <div className="flex items-center mt-2 gap-1">
            {TrendIcon && <TrendIcon className={`w-4 h-4 ${trendColor}`} />}
            <span className={`text-sm font-medium ${trendColor}`}>
              {change > 0 ? "+" : ""}{change}% vs Last Month
            </span>
          </div>
        </div>
        <div
          className={`p-3 rounded-full ${
            isDarkMode ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

interface OverallRowProps {
  isDarkMode: boolean;
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor?: string;
}

const OverallRow = ({ isDarkMode, icon, label, value, valueColor }: OverallRowProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div
        className={`p-2 rounded-lg ${
          isDarkMode ? "bg-gray-700" : "bg-gray-100"
        }`}
      >
        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
          {icon}
        </span>
      </div>
      <span
        className={`font-medium text-sm ${
          isDarkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {label}
      </span>
    </div>
    <span
      className={`text-lg font-bold ${
        valueColor
          ? valueColor
          : isDarkMode
          ? "text-gray-100"
          : "text-gray-900"
      }`}
    >
      {value}
    </span>
  </div>
);

export default Dashboard;
