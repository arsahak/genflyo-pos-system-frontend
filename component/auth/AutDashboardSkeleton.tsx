"use client";

import { useSidebar } from "@/lib/SidebarContext";

const AutDashboardSkeleton = () => {
  const { isDarkMode } = useSidebar();

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="p-6">
        {/* Header Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <div
              className={`h-9 w-64 rounded-lg animate-pulse ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`h-5 w-48 rounded-lg mt-2 animate-pulse ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            ></div>
          </div>
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <div
              className={`h-10 w-48 rounded-lg animate-pulse ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`h-10 w-10 rounded-lg animate-pulse ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            ></div>
          </div>
        </div>

        {/* Main KPI Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`p-6 rounded-xl shadow-lg transition-colors duration-200 ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div
                    className={`h-4 w-24 rounded animate-pulse ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`h-8 w-32 rounded mt-2 animate-pulse ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`h-4 w-20 rounded mt-2 animate-pulse ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-300"
                    }`}
                  ></div>
                </div>
                <div
                  className={`w-12 h-12 rounded-full animate-pulse ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-300"
                  }`}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary KPI Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`p-6 rounded-xl shadow-md transition-colors duration-200 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div
                    className={`h-4 w-20 rounded animate-pulse ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-7 w-28 rounded mt-2 animate-pulse ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-4 w-24 rounded mt-2 animate-pulse ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  ></div>
                </div>
                <div
                  className={`w-10 h-10 rounded-full animate-pulse ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Additional Info Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sales & Purchase Chart Skeleton */}
          <div
            className={`lg:col-span-2 p-6 rounded-xl shadow-md transition-colors duration-200 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div
                className={`h-6 w-40 rounded animate-pulse ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              ></div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className={`w-10 h-7 rounded-lg animate-pulse ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  ></div>
                ))}
              </div>
            </div>
            <div
              className={`h-64 rounded-lg animate-pulse ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            ></div>
          </div>

          {/* Overall Information Skeleton */}
          <div className="space-y-6">
            <div
              className={`p-6 rounded-xl shadow-md transition-colors duration-200 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div
                className={`h-6 w-40 rounded mb-4 animate-pulse ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              ></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div
                      className={`h-5 w-24 rounded animate-pulse ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`h-6 w-16 rounded animate-pulse ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    ></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customers Overview Skeleton */}
            <div
              className={`p-6 rounded-xl shadow-md transition-colors duration-200 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`h-6 w-40 rounded animate-pulse ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`h-8 w-24 rounded animate-pulse ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                ></div>
              </div>
              <div
                className={`h-32 rounded-lg mb-4 animate-pulse ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              ></div>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div
                      className={`h-5 w-20 rounded animate-pulse ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`h-6 w-16 rounded animate-pulse ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutDashboardSkeleton;
