interface CategoryListSkeletonProps {
  isDarkMode: boolean;
}

export const CategoryListSkeleton = ({ isDarkMode }: CategoryListSkeletonProps) => {
  return (
    <div className="w-full">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className={`h-8 w-48 rounded-lg mb-2 ${isDarkMode ? "bg-gray-800" : "bg-gray-200"} animate-pulse`} />
          <div className={`h-4 w-72 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-200"} animate-pulse`} />
        </div>
        <div className={`h-10 w-40 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-gray-200"} animate-pulse`} />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`p-5 rounded-2xl ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-sm border ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`h-4 w-24 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
              <div className={`h-10 w-10 rounded-xl ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
            </div>
            <div className={`h-8 w-16 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
          </div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className={`p-4 mb-6 rounded-2xl border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} shadow-sm`}>
        <div className={`h-12 w-full rounded-xl ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
      </div>

      {/* Table Skeleton */}
      <div className={`rounded-2xl overflow-hidden shadow-xl border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
        <div className={`px-6 py-4 border-b ${isDarkMode ? "border-gray-700 bg-gray-900/50" : "border-gray-100 bg-gray-50"}`}>
          <div className="flex items-center gap-4">
            <div className={`h-4 w-14 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
            <div className={`h-4 flex-1 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
            <div className={`h-4 w-24 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
            <div className={`h-4 w-32 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
          </div>
        </div>
        
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`px-6 py-4 border-b last:border-0 ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
              <div className="flex-1">
                <div className={`h-4 w-48 rounded mb-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
                <div className={`h-3 w-32 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
              </div>
              <div className={`h-8 w-24 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
              <div className="flex gap-2 justify-end w-32">
                <div className={`h-8 w-8 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
                <div className={`h-8 w-8 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
                <div className={`h-8 w-8 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
