interface CustomersListSkeletonProps {
  isDarkMode?: boolean;
}

export const CustomersListSkeleton = ({ isDarkMode = false }: CustomersListSkeletonProps) => {
  const skeletonBase = `animate-pulse rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`;

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${
      isDarkMode ? "bg-gray-950" : "bg-slate-50"
    }`}>
      <div className="max-w-[1920px] mx-auto">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className={`h-10 w-80 mb-2 ${skeletonBase}`} />
          <div className={`h-4 w-96 ${skeletonBase}`} />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl shadow-xl border ${
                isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className={`h-4 w-32 mb-3 ${skeletonBase}`} />
                  <div className={`h-8 w-20 ${skeletonBase}`} />
                </div>
                <div className={`h-12 w-12 rounded-full ${skeletonBase}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter Skeleton */}
        <div
          className={`p-6 rounded-2xl shadow-xl border mb-6 ${
            isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className={`h-10 flex-1 rounded-lg ${skeletonBase}`} />
            <div className={`h-10 w-40 rounded-lg ${skeletonBase}`} />
          </div>
        </div>

        {/* Table Skeleton */}
        <div
          className={`rounded-2xl shadow-xl border overflow-hidden ${
            isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
          }`}
        >
          {/* Table Header */}
          <div className={`p-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className={`h-4 ${i === 1 ? 'w-40' : i === 6 ? 'w-32' : 'w-24'} ${skeletonBase}`} />
              ))}
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-700">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
              <div key={row} className="p-4">
                <div className="flex gap-4 items-center">
                  <div className={`h-10 w-10 rounded-full ${skeletonBase}`} />
                  <div className="flex-1 space-y-2">
                    <div className={`h-4 w-32 ${skeletonBase}`} />
                    <div className={`h-3 w-24 ${skeletonBase}`} />
                  </div>
                  <div className={`h-4 w-24 ${skeletonBase}`} />
                  <div className={`h-6 w-20 rounded-full ${skeletonBase}`} />
                  <div className={`h-4 w-16 ${skeletonBase}`} />
                  <div className={`h-6 w-16 rounded-full ${skeletonBase}`} />
                  <div className="flex gap-2">
                    <div className={`h-8 w-8 rounded-lg ${skeletonBase}`} />
                    <div className={`h-8 w-8 rounded-lg ${skeletonBase}`} />
                    <div className={`h-8 w-8 rounded-lg ${skeletonBase}`} />
                    <div className={`h-8 w-8 rounded-lg ${skeletonBase}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
