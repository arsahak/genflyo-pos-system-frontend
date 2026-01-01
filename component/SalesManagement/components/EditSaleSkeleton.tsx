interface EditSaleSkeletonProps {
  isDarkMode?: boolean;
}

export const EditSaleSkeleton = ({ isDarkMode = false }: EditSaleSkeletonProps) => {
  const skeletonBase = `animate-pulse rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`;

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${
      isDarkMode ? "bg-gray-950" : "bg-slate-50"
    }`}>
      <div className="max-w-[1920px] mx-auto">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className={`h-6 w-32 mb-4 ${skeletonBase}`} />
          <div className={`h-10 w-64 mb-2 ${skeletonBase}`} />
          <div className={`h-4 w-40 ${skeletonBase}`} />
        </div>

        {/* Sale Info Card */}
        <div
          className={`p-6 rounded-2xl shadow-xl border mb-6 ${
            isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
          }`}
        >
          <div className={`h-6 w-48 mb-6 ${skeletonBase}`} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className={`h-4 w-24 mb-2 ${skeletonBase}`} />
                <div className={`h-6 w-full ${skeletonBase}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Edit Form Card */}
        <div
          className={`p-6 rounded-2xl shadow-xl border mb-6 ${
            isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
          }`}
        >
          <div className={`h-6 w-32 mb-6 ${skeletonBase}`} />

          <div className="space-y-6">
            {/* Status field */}
            <div>
              <div className={`h-4 w-20 mb-2 ${skeletonBase}`} />
              <div className={`h-12 w-full rounded-xl ${skeletonBase}`} />
            </div>

            {/* Notes field */}
            <div>
              <div className={`h-4 w-16 mb-2 ${skeletonBase}`} />
              <div className={`h-32 w-full rounded-xl ${skeletonBase}`} />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-6">
            <div className={`h-12 w-32 rounded-xl ${skeletonBase}`} />
            <div className={`h-12 w-32 rounded-xl ${skeletonBase}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
