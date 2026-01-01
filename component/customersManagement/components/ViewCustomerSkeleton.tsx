interface ViewCustomerSkeletonProps {
  isDarkMode?: boolean;
}

export const ViewCustomerSkeleton = ({ isDarkMode = false }: ViewCustomerSkeletonProps) => {
  const skeletonBase = `animate-pulse rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`;

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${
      isDarkMode ? "bg-gray-950" : "bg-slate-50"
    }`}>
      <div className="max-w-[1920px] mx-auto">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className={`h-6 w-32 mb-4 ${skeletonBase}`} />
          <div className="flex items-start justify-between">
            <div>
              <div className={`h-10 w-64 mb-2 ${skeletonBase}`} />
              <div className={`h-4 w-40 ${skeletonBase}`} />
            </div>
            <div className="flex gap-2">
              <div className={`h-10 w-24 rounded-lg ${skeletonBase}`} />
              <div className={`h-10 w-24 rounded-lg ${skeletonBase}`} />
              <div className={`h-10 w-24 rounded-lg ${skeletonBase}`} />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <div
            className={`lg:col-span-2 rounded-2xl shadow-xl border p-6 ${
              isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
            }`}
          >
            <div className={`h-6 w-48 mb-6 ${skeletonBase}`} />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`h-6 w-6 rounded ${skeletonBase}`} />
                  <div className="flex-1">
                    <div className={`h-3 w-20 mb-2 ${skeletonBase}`} />
                    <div className={`h-4 w-full max-w-xs ${skeletonBase}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side Cards */}
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className={`rounded-2xl shadow-xl border p-6 ${
                  isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
                }`}
              >
                <div className={`h-6 w-32 mb-4 ${skeletonBase}`} />
                <div className="space-y-4">
                  <div className={`h-8 w-32 mx-auto rounded-full ${skeletonBase}`} />
                  <div className={`h-10 w-20 mx-auto ${skeletonBase}`} />
                  <div className={`h-3 w-24 mx-auto ${skeletonBase}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
