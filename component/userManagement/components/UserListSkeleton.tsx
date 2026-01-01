interface UserListSkeletonProps {
  isDarkMode?: boolean;
}

export const UserListSkeleton = ({ isDarkMode = false }: UserListSkeletonProps) => {
  const skeletonBase = `animate-pulse rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`;

  return (
    <div className="space-y-6">
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

      {/* Search/Filter Skeleton */}
      <div
        className={`p-4 rounded-2xl border ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`h-10 flex-1 rounded-xl ${skeletonBase}`} />
          <div className={`h-10 w-32 rounded-xl ${skeletonBase}`} />
        </div>
      </div>

      {/* Table Skeleton */}
      <div
        className={`rounded-2xl overflow-hidden border ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
        } shadow-xl`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-100"}>
              <tr>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <th key={i} className="px-6 py-4">
                    <div className={`h-3 w-20 ${skeletonBase}`} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
                <tr
                  key={row}
                  className={`border-t ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full ${skeletonBase}`} />
                      <div className="space-y-2">
                        <div className={`h-4 w-32 ${skeletonBase}`} />
                        <div className={`h-3 w-20 ${skeletonBase}`} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`h-4 w-40 ${skeletonBase}`} />
                  </td>
                  <td className="px-6 py-4">
                    <div className={`h-6 w-20 rounded-full ${skeletonBase}`} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className={`h-4 w-24 ${skeletonBase}`} />
                      <div className={`h-3 w-32 ${skeletonBase}`} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`h-6 w-16 rounded-full ${skeletonBase}`} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`h-8 w-12 rounded-lg ${skeletonBase}`} />
                      <div className={`h-8 w-12 rounded-lg ${skeletonBase}`} />
                      <div className={`h-8 w-16 rounded-lg ${skeletonBase}`} />
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
