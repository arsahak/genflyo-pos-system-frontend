interface InventoryListSkeletonProps {
  isDarkMode?: boolean;
}

export const InventoryListSkeleton = ({ isDarkMode = false }: InventoryListSkeletonProps) => {
  const skeletonBase = `animate-pulse rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`;

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`relative overflow-hidden p-5 rounded-2xl ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className={`h-4 w-24 ${skeletonBase}`} />
                <div className={`h-8 w-16 ${skeletonBase}`} />
              </div>
              <div className={`p-3 rounded-xl ${skeletonBase} w-12 h-12`} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className={`p-4 rounded-lg border-2 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className="flex flex-wrap items-center gap-3">
          <div className={`h-10 w-40 rounded-lg ${skeletonBase}`} />
          <div className={`h-10 flex-1 min-w-[200px] rounded-lg ${skeletonBase}`} />
          <div className={`h-10 w-48 rounded-lg ${skeletonBase}`} />
          <div className={`h-10 w-24 rounded-lg ${skeletonBase}`} />
          <div className={`h-10 w-32 rounded-lg ${skeletonBase}`} />
          <div className={`h-10 w-28 rounded-lg ${skeletonBase}`} />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className={`rounded-lg border-2 overflow-hidden ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-100"}>
              <tr>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <th key={i} className="px-4 py-3">
                    <div className={`h-3 w-16 ${skeletonBase}`} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
                <tr
                  key={row}
                  className={`border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className={`h-4 w-32 ${skeletonBase}`} />
                      <div className={`h-3 w-20 ${skeletonBase}`} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`h-4 w-20 ${skeletonBase}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className={`h-4 w-4 rounded ${skeletonBase}`} />
                      <div className={`h-4 w-16 ${skeletonBase}`} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`h-6 w-12 ${skeletonBase}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className={`h-4 w-10 ${skeletonBase}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className={`h-6 w-12 ${skeletonBase}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className={`h-4 w-16 ${skeletonBase}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className={`h-6 w-20 rounded-full ${skeletonBase}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className={`h-4 w-24 ${skeletonBase}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className={`h-8 w-8 rounded-lg ${skeletonBase}`} />
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
