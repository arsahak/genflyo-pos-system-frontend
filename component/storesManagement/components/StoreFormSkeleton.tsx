interface StoreFormSkeletonProps {
  isDarkMode?: boolean;
}

export const StoreFormSkeleton = ({ isDarkMode = false }: StoreFormSkeletonProps) => {
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
          <div className={`h-4 w-80 ${skeletonBase}`} />
        </div>

        {/* Form Card */}
        <div
          className={`rounded-2xl shadow-xl border max-w-4xl p-6 ${
            isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
          }`}
        >
          {/* Basic Information */}
          <div className="mb-6">
            <div className={`h-6 w-48 mb-4 ${skeletonBase}`} />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i}>
                  <div className={`h-4 w-32 mb-2 ${skeletonBase}`} />
                  <div className={`h-12 w-full rounded-xl ${skeletonBase}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Location Section */}
          <div className="mb-6 pt-6 border-t border-gray-600">
            <div className={`h-6 w-48 mb-4 ${skeletonBase}`} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <div className={`h-4 w-24 mb-2 ${skeletonBase}`} />
                <div className={`h-12 w-full rounded-xl ${skeletonBase}`} />
              </div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className={`h-4 w-20 mb-2 ${skeletonBase}`} />
                  <div className={`h-12 w-full rounded-xl ${skeletonBase}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="mb-6 pt-6 border-t border-gray-600">
            <div className={`h-6 w-48 mb-4 ${skeletonBase}`} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i}>
                  <div className={`h-4 w-32 mb-2 ${skeletonBase}`} />
                  <div className={`h-12 w-full rounded-xl ${skeletonBase}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-600">
            <div className={`h-12 flex-1 rounded-xl ${skeletonBase}`} />
            <div className={`h-12 flex-1 rounded-xl ${skeletonBase}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
