interface StoresListSkeletonProps {
  isDarkMode?: boolean;
}

export const StoresListSkeleton = ({ isDarkMode = false }: StoresListSkeletonProps) => {
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

        {/* Stats Card Skeleton */}
        <div className="mb-6">
          <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-green-500 to-green-600">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className={`h-4 w-32 mb-2 bg-white/20 ${skeletonBase}`} />
                <div className={`h-8 w-20 bg-white/30 ${skeletonBase}`} />
              </div>
              <div className={`h-12 w-12 rounded-xl bg-white/20 ${skeletonBase}`} />
            </div>
          </div>
        </div>

        {/* Search Bar Skeleton */}
        <div
          className={`p-6 rounded-2xl shadow-xl border mb-6 ${
            isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
          }`}
        >
          <div className={`h-12 w-full rounded-xl ${skeletonBase}`} />
        </div>

        {/* Stores Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl shadow-xl border ${
                isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
              }`}
            >
              {/* Store Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className={`h-6 w-40 mb-2 ${skeletonBase}`} />
                  <div className={`h-4 w-32 ${skeletonBase}`} />
                </div>
                <div className={`h-8 w-20 rounded-full ${skeletonBase}`} />
              </div>

              {/* Store Details */}
              <div className="space-y-3 mb-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className={`h-5 w-5 rounded ${skeletonBase}`} />
                    <div className={`h-4 flex-1 ${skeletonBase}`} />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-gray-600">
                <div className={`h-10 flex-1 rounded-xl ${skeletonBase}`} />
                <div className={`h-10 flex-1 rounded-xl ${skeletonBase}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
