"use client";

import { useSidebar } from "@/lib/SidebarContext";
import { useLanguage } from "@/lib/LanguageContext";
import { getTranslation } from "@/lib/translations";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { IoMdTrendingUp } from "react-icons/io";

interface CustomerOverviewData {
  date: string;
  newCustomers: number;
  returningCustomers: number;
}

interface CustomerOverviewChartProps {
  data: CustomerOverviewData[];
  firstTime: number;
  firstTimeChange: number;
  returning: number;
  returningChange: number;
}

const CustomerOverviewChart = ({
  data,
  firstTime,
  firstTimeChange,
  returning,
  returningChange,
}: CustomerOverviewChartProps) => {
  const { isDarkMode } = useSidebar();
  const { language } = useLanguage();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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

  // Prepare chart data
  const chartData = data.map((item) => ({
    ...item,
    date: formatDate(item.date),
    total: item.newCustomers + item.returningCustomers,
  }));

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
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`p-6 rounded-xl shadow-md transition-colors duration-200 h-full flex flex-col ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3
            className={`text-lg font-semibold transition-colors duration-200 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            {getTranslation("customersOverview", language)}
          </h3>
          <p
            className={`text-xs mt-1 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            New vs Returning Customers
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 mb-6 min-h-48">
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
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorReturning" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDarkMode ? "#374151" : "#e5e7eb"}
              />
              <XAxis
                dataKey="date"
                stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                style={{ fontSize: "10px" }}
                hide
              />
              <YAxis
                stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                style={{ fontSize: "10px" }}
                hide
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="newCustomers"
                name="New Customers"
                stackId="1"
                stroke="#14b8a6"
                fillOpacity={1}
                fill="url(#colorNew)"
              />
              <Area
                type="monotone"
                dataKey="returningCustomers"
                name="Returning"
                stackId="1"
                stroke="#f97316"
                fillOpacity={1}
                fill="url(#colorReturning)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Summary Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-teal-500"></div>
            <span
              className={`text-sm font-medium transition-colors duration-200 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {getTranslation("firstTime", language)}
            </span>
          </div>
          <div className="text-right">
            <span
              className={`text-lg font-bold transition-colors duration-200 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {formatNumber(firstTime)}
            </span>
            <div className="flex items-center justify-end">
              {firstTimeChange > 0 ? (
                <IoMdTrendingUp className="w-3 h-3 text-green-500 mr-1" />
              ) : firstTimeChange < 0 ? (
                <IoMdTrendingUp className="w-3 h-3 text-red-500 mr-1 rotate-180" />
              ) : null}
              <span
                className={`text-xs ${
                  firstTimeChange > 0
                    ? "text-green-500"
                    : firstTimeChange < 0
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {firstTimeChange > 0 ? "+" : ""}
                {firstTimeChange}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span
              className={`text-sm font-medium transition-colors duration-200 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {getTranslation("return", language)}
            </span>
          </div>
          <div className="text-right">
            <span
              className={`text-lg font-bold transition-colors duration-200 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {formatNumber(returning)}
            </span>
            <div className="flex items-center justify-end">
              {returningChange > 0 ? (
                <IoMdTrendingUp className="w-3 h-3 text-green-500 mr-1" />
              ) : returningChange < 0 ? (
                <IoMdTrendingUp className="w-3 h-3 text-red-500 mr-1 rotate-180" />
              ) : null}
              <span
                className={`text-xs ${
                  returningChange > 0
                    ? "text-green-500"
                    : returningChange < 0
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {returningChange > 0 ? "+" : ""}
                {returningChange}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOverviewChart;
