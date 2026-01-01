"use client";

import { useSidebar } from "@/lib/SidebarContext";
import { useLanguage } from "@/lib/LanguageContext";
import { getTranslation } from "@/lib/translations";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState, useMemo } from "react";
import { MdShoppingCart } from "react-icons/md";

interface SalesPurchaseData {
  date: string;
  sales: number;
  purchases: number;
  salesCount: number;
  purchaseCount: number;
}

interface SalesPurchaseChartProps {
  data: SalesPurchaseData[];
}

const SalesPurchaseChart = ({ data }: SalesPurchaseChartProps) => {
  const { isDarkMode } = useSidebar();
  const { language } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState(30); // days

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Format currency for tooltips
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Filter data based on selected period
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Sort data by date (newest first)
    const sorted = [...data].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Take only the selected number of days
    return sorted.slice(0, selectedPeriod).reverse();
  }, [data, selectedPeriod]);

  // Prepare chart data with formatted dates
  const chartData = filteredData.map((item) => ({
    ...item,
    date: formatDate(item.date),
  }));

  // Calculate summary stats for selected period
  const stats = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      return { totalSales: 0, totalPurchases: 0, profit: 0 };
    }

    const totalSales = filteredData.reduce((sum, item) => sum + item.sales, 0);
    const totalPurchases = filteredData.reduce((sum, item) => sum + item.purchases, 0);
    const profit = totalSales - totalPurchases;

    return { totalSales, totalPurchases, profit };
  }, [filteredData]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-3 rounded-lg shadow-lg border ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <p
            className={`font-medium mb-2 ${
              isDarkMode ? "text-gray-200" : "text-gray-900"
            }`}
          >
            {payload[0].payload.date}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span
                className={isDarkMode ? "text-gray-300" : "text-gray-700"}
              >
                {entry.name}:
              </span>
              <span
                className={`font-semibold ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const periods = [
    { label: "7 Days", value: 7 },
    { label: "15 Days", value: 15 },
    { label: "30 Days", value: 30 },
    { label: "60 Days", value: 60 },
    { label: "90 Days", value: 90 },
  ];

  return (
    <div
      className={`p-6 rounded-xl shadow-md transition-colors duration-200 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isDarkMode ? "bg-orange-500/20" : "bg-orange-500/10"
            }`}
          >
            <MdShoppingCart className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3
              className={`text-lg font-semibold transition-colors duration-200 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {getTranslation("salesPurchase", language)}
            </h3>
            <p
              className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Last {selectedPeriod} days performance
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                period.value === selectedPeriod
                  ? "bg-orange-500 text-white shadow-md"
                  : isDarkMode
                  ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700 border border-gray-700"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div
          className={`p-3 rounded-lg ${
            isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
          }`}
        >
          <p
            className={`text-xs font-medium mb-1 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Total Sales
          </p>
          <p
            className={`text-lg font-bold ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            {formatCurrency(stats.totalSales)}
          </p>
        </div>
        <div
          className={`p-3 rounded-lg ${
            isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
          }`}
        >
          <p
            className={`text-xs font-medium mb-1 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Total Purchases
          </p>
          <p
            className={`text-lg font-bold ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            {formatCurrency(stats.totalPurchases)}
          </p>
        </div>
        <div
          className={`p-3 rounded-lg ${
            isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
          }`}
        >
          <p
            className={`text-xs font-medium mb-1 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Net Profit
          </p>
          <p
            className={`text-lg font-bold ${
              stats.profit >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {formatCurrency(stats.profit)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        {data.length === 0 ? (
          <div
            className={`h-full flex items-center justify-center ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDarkMode ? "#374151" : "#e5e7eb"}
              />
              <XAxis
                dataKey="date"
                stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                style={{ fontSize: "12px" }}
                tickFormatter={(value) =>
                  value >= 1000 ? `$${(value / 1000).toFixed(0)}k` : `$${value}`
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                  fontSize: "14px",
                }}
                iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="sales"
                name="Sales"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ fill: "#f97316", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="purchases"
                name="Purchases"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SalesPurchaseChart;
