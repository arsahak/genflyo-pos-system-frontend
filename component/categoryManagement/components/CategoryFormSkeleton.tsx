interface CategoryFormSkeletonProps {
  isDarkMode: boolean;
}

export const CategoryFormSkeleton = ({ isDarkMode }: CategoryFormSkeletonProps) => {
  const cardClass = `rounded-2xl shadow-sm p-6 mb-6 ${
    isDarkMode ? "bg-gray-800 shadow-lg shadow-gray-900/20" : "bg-white shadow-xl shadow-slate-200/50"
  }`;
  
  const labelClass = `h-4 w-32 rounded mb-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`;
  const inputClass = `h-12 w-full rounded-xl ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`;

  return (
    <div className="max-w-full mx-auto animate-fadeIn">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className={`h-8 w-64 rounded-lg mb-2 ${isDarkMode ? "bg-gray-800" : "bg-gray-200"} animate-pulse`} />
        <div className={`h-4 w-96 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-200"} animate-pulse`} />
      </div>

      <div className="space-y-6">
        {/* Basic Information Skeleton */}
        <div className={cardClass}>
          <div className={`h-6 w-48 rounded mb-6 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <div className={labelClass} />
              <div className={inputClass} />
            </div>

            <div className="md:col-span-2">
              <div className={labelClass} />
              <div className={`h-24 w-full rounded-xl ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
            </div>

            <div>
              <div className={labelClass} />
              <div className={inputClass} />
            </div>

            <div>
              <div className={labelClass} />
              <div className={inputClass} />
            </div>
          </div>
        </div>

        {/* Image Skeleton */}
        <div className={cardClass}>
          <div className={`h-6 w-48 rounded mb-6 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
          <div className={`h-48 w-full rounded-2xl ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
        </div>

        {/* SEO Skeleton */}
        <div className={cardClass}>
          <div className={`h-6 w-48 rounded mb-6 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
          <div className="space-y-4">
            <div>
              <div className={labelClass} />
              <div className={inputClass} />
            </div>
            <div>
              <div className={labelClass} />
              <div className={inputClass} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
