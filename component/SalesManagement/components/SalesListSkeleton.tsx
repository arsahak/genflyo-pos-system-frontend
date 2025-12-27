interface SalesListSkeletonProps {
  isDarkMode?: boolean;
}

export const SalesListSkeleton = ({ isDarkMode = false }: SalesListSkeletonProps) => {
  const cardClass = `rounded-2xl shadow-sm p-6 mb-6 ${
    isDarkMode ? "bg-gray-800 shadow-lg shadow-gray-900/20" : "bg-white shadow-xl shadow-slate-200/50"
  }`;

  const statCardClass = `rounded-2xl shadow-sm p-4 ${
    isDarkMode ? "bg-gray-800 shadow-lg shadow-gray-900/20" : "bg-white shadow-xl shadow-slate-200/50"
  }`;

  return (
    <div className="animate-fadeIn p-6">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className={`h-10 w-64 rounded-lg mb-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
        <div className={`h-4 w-96 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={statCardClass}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className={`h-4 w-24 rounded mb-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
                <div className={`h-8 w-20 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
              </div>
              <div className={`h-10 w-10 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className={cardClass}>
        <div className="flex flex-wrap items-center gap-3">
          <div className={`h-10 flex-1 min-w-[200px] rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
          <div className={`h-10 w-40 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
          <div className={`h-10 w-32 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
          <div className={`h-10 w-32 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className={cardClass}>
        <div className="overflow-x-auto">
          {/* Table Header */}
          <div className={`flex gap-4 p-4 mb-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} rounded-lg`}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className={`h-4 ${i === 1 ? 'w-24' : i === 5 ? 'w-20' : 'w-32'} rounded ${isDarkMode ? "bg-gray-600" : "bg-gray-200"} animate-pulse`} />
            ))}
          </div>

          {/* Table Rows */}
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
              <div key={row} className={`flex gap-4 p-4 rounded-lg ${isDarkMode ? "bg-gray-750" : "bg-gray-50"}`}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((col) => (
                  <div key={col} className={`h-6 ${col === 1 ? 'w-24' : col === 5 ? 'w-20' : 'w-32'} rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
