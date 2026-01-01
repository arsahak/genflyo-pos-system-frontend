interface ViewSaleDetailsSkeletonProps {
  isDarkMode?: boolean;
}

export const ViewSaleDetailsSkeleton = ({ isDarkMode = false }: ViewSaleDetailsSkeletonProps) => {
  const skeletonBase = `animate-pulse rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`;

  return (
    <div className="p-6">
      {/* Header Skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className={`h-6 w-32 mb-4 ${skeletonBase}`} />
          <div className={`h-10 w-64 mb-2 ${skeletonBase}`} />
          <div className={`h-4 w-40 ${skeletonBase}`} />
        </div>
        <div className="flex gap-3">
          <div className={`h-10 w-24 rounded-lg ${skeletonBase}`} />
          <div className={`h-10 w-24 rounded-lg ${skeletonBase}`} />
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`p-6 rounded-xl border-2 ${
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`h-8 w-8 rounded-full ${skeletonBase}`} />
              <div className={`h-6 w-32 ${skeletonBase}`} />
            </div>
            <div className="space-y-2">
              <div className={`h-5 w-full ${skeletonBase}`} />
              <div className={`h-4 w-3/4 ${skeletonBase}`} />
              <div className={`h-4 w-1/2 ${skeletonBase}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Items Table Skeleton */}
      <div
        className={`p-6 rounded-xl border-2 mb-6 ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`h-6 w-6 rounded ${skeletonBase}`} />
          <div className={`h-6 w-32 ${skeletonBase}`} />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4">
              <div className={`h-12 flex-1 rounded ${skeletonBase}`} />
              <div className={`h-12 w-24 rounded ${skeletonBase}`} />
              <div className={`h-12 w-24 rounded ${skeletonBase}`} />
              <div className={`h-12 w-24 rounded ${skeletonBase}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Payment & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className={`p-6 rounded-xl border-2 ${
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`h-6 w-6 rounded ${skeletonBase}`} />
              <div className={`h-6 w-40 ${skeletonBase}`} />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className={`h-16 rounded-lg ${skeletonBase}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
