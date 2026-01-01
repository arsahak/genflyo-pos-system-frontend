"use client";

interface SalesListSkeletonProps {
  isDarkMode: boolean;
}

export default function SalesListSkeleton({ isDarkMode }: SalesListSkeletonProps) {
  return (
    <div className="p-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className={`h-8 w-64 rounded-lg mb-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
        <div className={`h-4 w-96 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`p-4 rounded-lg border-2 ${
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className={`h-4 w-20 rounded mb-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                <div className={`h-8 w-24 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
              </div>
              <div className={`h-10 w-10 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div
        className={`p-4 rounded-lg border-2 mb-4 ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className={`flex-1 min-w-[200px] h-10 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
          <div className={`w-32 h-10 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
          <div className={`w-24 h-10 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
          <div className={`w-24 h-10 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
          <div className={`w-24 h-10 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
          <div className={`w-28 h-10 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
        </div>
      </div>

      {/* Table Skeleton */}
      <div
        className={`rounded-lg border-2 overflow-hidden ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-100"}>
              <tr>
                <th className="px-4 py-3 text-left">
                  <div className={`h-4 w-20 rounded ${isDarkMode ? "bg-gray-600" : "bg-gray-300"}`} />
                </th>
                <th className="px-4 py-3 text-left">
                  <div className={`h-4 w-16 rounded ${isDarkMode ? "bg-gray-600" : "bg-gray-300"}`} />
                </th>
                <th className="px-4 py-3 text-left">
                  <div className={`h-4 w-24 rounded ${isDarkMode ? "bg-gray-600" : "bg-gray-300"}`} />
                </th>
                <th className="px-4 py-3 text-left">
                  <div className={`h-4 w-16 rounded ${isDarkMode ? "bg-gray-600" : "bg-gray-300"}`} />
                </th>
                <th className="px-4 py-3 text-right">
                  <div className={`h-4 w-16 rounded ml-auto ${isDarkMode ? "bg-gray-600" : "bg-gray-300"}`} />
                </th>
                <th className="px-4 py-3 text-left">
                  <div className={`h-4 w-16 rounded ${isDarkMode ? "bg-gray-600" : "bg-gray-300"}`} />
                </th>
                <th className="px-4 py-3 text-left">
                  <div className={`h-4 w-20 rounded ${isDarkMode ? "bg-gray-600" : "bg-gray-300"}`} />
                </th>
                <th className="px-4 py-3 text-center">
                  <div className={`h-4 w-20 rounded mx-auto ${isDarkMode ? "bg-gray-600" : "bg-gray-300"}`} />
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <tr
                  key={i}
                  className={`border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <td className="px-4 py-3">
                    <div className={`h-4 w-24 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className={`h-4 w-20 rounded mb-1 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                    <div className={`h-3 w-16 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className={`h-4 w-28 rounded mb-1 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                    <div className={`h-3 w-24 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className={`h-4 w-16 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className={`h-5 w-20 rounded ml-auto ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className={`h-6 w-24 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className={`h-4 w-20 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className={`h-8 w-8 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                      <div className={`h-8 w-8 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                      <div className={`h-8 w-8 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
