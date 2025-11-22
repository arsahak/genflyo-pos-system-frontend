"use client";
import { useSidebar } from "@/lib/SidebarContext";
import { useRouter } from "next/navigation";
import {
  MdTrendingUp,
  MdPeople,
  MdInventory,
  MdAttachMoney,
  MdAssessment,
  MdShowChart,
  MdArrowForward,
} from "react-icons/md";

const ReportsDashboard = () => {
  const { isDarkMode } = useSidebar();
  const router = useRouter();

  const reportCategories = [
    {
      id: "sales",
      title: "Sales Reports",
      description: "Track sales performance, trends, and top products",
      icon: MdTrendingUp,
      color: "blue",
      route: "/reports/sales",
      metrics: [
        "Sales Overview",
        "Sales by Product",
        "Daily/Weekly/Monthly Trends",
        "Payment Methods Analysis",
      ],
    },
    {
      id: "financial",
      title: "Financial Reports",
      description: "Revenue, profit & loss, and financial analytics",
      icon: MdAttachMoney,
      color: "green",
      route: "/reports/financial",
      metrics: [
        "Revenue & Profit",
        "Profit & Loss Statement",
        "Cost Analysis",
        "Payment Breakdown",
      ],
    },
    {
      id: "customers",
      title: "Customer Reports",
      description: "Customer analytics, retention, and insights",
      icon: MdPeople,
      color: "purple",
      route: "/reports/customers",
      metrics: [
        "Customer Overview",
        "Top Customers",
        "Retention Analysis",
        "Membership Breakdown",
      ],
    },
    {
      id: "inventory",
      title: "Inventory Reports",
      description: "Stock levels, movements, and inventory analytics",
      icon: MdInventory,
      color: "orange",
      route: "/reports/inventory",
      metrics: [
        "Stock Overview",
        "Low Stock Alerts",
        "Stock Movement",
        "Category Breakdown",
      ],
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: any = {
      blue: {
        bg: "bg-blue-50",
        bgDark: "bg-blue-900/20",
        icon: "text-blue-600",
        iconDark: "text-blue-400",
        border: "border-blue-200",
        borderDark: "border-blue-800",
        hover: "hover:bg-blue-100",
        hoverDark: "hover:bg-blue-900/30",
      },
      green: {
        bg: "bg-green-50",
        bgDark: "bg-green-900/20",
        icon: "text-green-600",
        iconDark: "text-green-400",
        border: "border-green-200",
        borderDark: "border-green-800",
        hover: "hover:bg-green-100",
        hoverDark: "hover:bg-green-900/30",
      },
      purple: {
        bg: "bg-purple-50",
        bgDark: "bg-purple-900/20",
        icon: "text-purple-600",
        iconDark: "text-purple-400",
        border: "border-purple-200",
        borderDark: "border-purple-800",
        hover: "hover:bg-purple-100",
        hoverDark: "hover:bg-purple-900/30",
      },
      orange: {
        bg: "bg-orange-50",
        bgDark: "bg-orange-900/20",
        icon: "text-orange-600",
        iconDark: "text-orange-400",
        border: "border-orange-200",
        borderDark: "border-orange-800",
        hover: "hover:bg-orange-100",
        hoverDark: "hover:bg-orange-900/30",
      },
    };
    return colors[color];
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MdAssessment
            className={`text-4xl ${
              isDarkMode ? "text-indigo-400" : "text-indigo-600"
            }`}
          />
          <h1
            className={`text-3xl font-bold ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Reports & Analytics
          </h1>
        </div>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
          Comprehensive business insights and performance metrics
        </p>
      </div>

      {/* Quick Stats Banner */}
      <div
        className={`p-6 rounded-lg border-2 mb-8 ${
          isDarkMode
            ? "bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-indigo-800"
            : "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2
              className={`text-xl font-bold mb-2 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Business Intelligence Dashboard
            </h2>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Generate detailed reports across sales, finance, customers, and
              inventory
            </p>
          </div>
          <MdShowChart
            className={`text-6xl ${
              isDarkMode ? "text-indigo-400/50" : "text-indigo-300"
            }`}
          />
        </div>
      </div>

      {/* Report Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportCategories.map((category) => {
          const Icon = category.icon;
          const colors = getColorClasses(category.color);

          return (
            <div
              key={category.id}
              onClick={() => router.push(category.route)}
              className={`rounded-lg border-2 p-6 cursor-pointer transition-all ${
                isDarkMode
                  ? `${colors.bgDark} ${colors.borderDark} ${colors.hoverDark}`
                  : `${colors.bg} ${colors.border} ${colors.hover}`
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-lg ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <Icon
                      className={`text-3xl ${
                        isDarkMode ? colors.iconDark : colors.icon
                      }`}
                    />
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-bold ${
                        isDarkMode ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {category.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {category.description}
                    </p>
                  </div>
                </div>
                <MdArrowForward
                  className={`text-xl ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
              </div>

              {/* Metrics List */}
              <div className="space-y-2">
                {category.metrics.map((metric, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        isDarkMode ? colors.iconDark : colors.icon
                      }`}
                    />
                    {metric}
                  </div>
                ))}
              </div>

              {/* View Button */}
              <button
                className={`w-full mt-4 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  isDarkMode
                    ? `${colors.iconDark} bg-gray-800 hover:bg-gray-700`
                    : `${colors.icon} bg-white hover:bg-gray-50`
                }`}
              >
                View {category.title}
              </button>
            </div>
          );
        })}
      </div>

      {/* Info Section */}
      <div
        className={`mt-8 p-6 rounded-lg border-2 ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <h3
          className={`text-lg font-bold mb-3 ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          📊 Report Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p
              className={`font-semibold mb-1 ${
                isDarkMode ? "text-indigo-400" : "text-indigo-600"
              }`}
            >
              Date Range Filtering
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Filter reports by custom date ranges to analyze specific periods
            </p>
          </div>
          <div>
            <p
              className={`font-semibold mb-1 ${
                isDarkMode ? "text-green-400" : "text-green-600"
              }`}
            >
              Multi-Store Support
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Generate reports for specific stores or view consolidated data
            </p>
          </div>
          <div>
            <p
              className={`font-semibold mb-1 ${
                isDarkMode ? "text-purple-400" : "text-purple-600"
              }`}
            >
              Visual Analytics
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Charts, graphs, and visual representations of your data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;

