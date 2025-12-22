interface ProductListSkeletonProps {
  isDarkMode?: boolean;
}

export const ProductListSkeleton = ({ isDarkMode = false }: ProductListSkeletonProps) => {
  const cardClass = `rounded-2xl shadow-sm border overflow-hidden ${
    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
  }`;
  
  const headerCellClass = `px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
    isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
  }`;

  const rowClass = `border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`;
  const cellClass = "px-6 py-4 whitespace-nowrap";
  const skeletonText = `h-4 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`;

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`p-6 rounded-2xl ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`h-10 w-10 rounded-xl ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} animate-pulse`} />
              <div className={`h-4 w-12 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} animate-pulse`} />
            </div>
            <div className={`h-8 w-24 rounded mb-1 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
            <div className={`h-4 w-32 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
          </div>
        ))}
      </div>

      {/* Toolbar Skeleton */}
      <div className={`p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
        <div className={`h-10 w-full md:w-64 rounded-xl ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} animate-pulse`} />
        <div className="flex gap-2">
           <div className={`h-10 w-24 rounded-xl ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} animate-pulse`} />
           <div className={`h-10 w-24 rounded-xl ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} animate-pulse`} />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className={cardClass}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <th key={i} className={headerCellClass}>
                    <div className={`h-3 w-16 rounded ${isDarkMode ? "bg-gray-600" : "bg-gray-300"} animate-pulse`} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row} className={rowClass}>
                  <td className={cellClass}>
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
                      <div className="space-y-1">
                        <div className={`${skeletonText} w-32`} />
                        <div className={`${skeletonText} w-20 h-3`} />
                      </div>
                    </div>
                  </td>
                  <td className={cellClass}><div className={`${skeletonText} w-24`} /></td>
                  <td className={cellClass}><div className={`${skeletonText} w-16`} /></td>
                  <td className={cellClass}><div className={`${skeletonText} w-16`} /></td>
                  <td className={cellClass}><div className={`${skeletonText} w-20`} /></td>
                  <td className={cellClass}>
                     <div className="flex gap-2">
                        <div className={`h-8 w-8 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
                        <div className={`h-8 w-8 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
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
};
