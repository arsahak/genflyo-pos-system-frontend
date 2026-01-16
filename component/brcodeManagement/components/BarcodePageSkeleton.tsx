interface BarcodePageSkeletonProps {
  isDarkMode?: boolean;
}

export const BarcodePageSkeleton = ({ isDarkMode = false }: BarcodePageSkeletonProps) => {
  const skeletonBase = `animate-pulse ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`;

  return (
    <div className="p-6 animate-fadeIn">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-lg ${skeletonBase} w-10 h-10`} />
          <div>
            <div className={`h-7 w-48 rounded ${skeletonBase} mb-2`} />
            <div className={`h-4 w-64 rounded ${skeletonBase}`} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generator Skeleton - Left side */}
        <div className="lg:col-span-1">
          <div className={`rounded-lg border p-6 ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
            {/* Title */}
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-5 h-5 rounded ${skeletonBase}`} />
              <div className={`h-5 w-40 rounded ${skeletonBase}`} />
            </div>

            {/* Product Selection */}
            <div className="space-y-4">
              <div>
                <div className={`h-4 w-28 rounded ${skeletonBase} mb-2`} />
                <div className={`h-10 w-full rounded-lg ${skeletonBase}`} />
              </div>

              {/* Generate Button */}
              <div className={`h-12 w-full rounded-lg ${skeletonBase}`} />

              {/* Info Box */}
              <div className={`p-4 rounded-lg ${isDarkMode ? "bg-blue-900/20" : "bg-blue-50"}`}>
                <div className={`h-4 w-full rounded ${skeletonBase}`} />
                <div className={`h-4 w-3/4 rounded ${skeletonBase} mt-2`} />
              </div>
            </div>
          </div>
        </div>

        {/* List Skeleton - Right side */}
        <div className="lg:col-span-2">
          {/* Search Bar */}
          <div className="mb-6">
            <div className={`h-12 w-full rounded-lg ${skeletonBase}`} />
          </div>

          {/* Stats */}
          <div className="mb-4">
            <div className={`h-4 w-48 rounded ${skeletonBase}`} />
          </div>

          {/* Table */}
          <div className={`rounded-lg border overflow-hidden ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDarkMode ? "bg-gray-800" : "bg-gray-50"}>
                  <tr>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <th key={i} className="px-6 py-3 text-left">
                        <div className={`h-3 w-16 rounded ${skeletonBase}`} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
                  {[1, 2, 3, 4, 5].map((row) => (
                    <tr key={row} className={isDarkMode ? "bg-gray-800/50" : "bg-white"}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded ${skeletonBase}`} />
                          <div className={`h-4 w-28 rounded ${skeletonBase}`} />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`h-4 w-32 rounded ${skeletonBase} mb-1`} />
                        <div className={`h-3 w-20 rounded ${skeletonBase}`} />
                      </td>
                      <td className="px-6 py-4">
                        <div className={`h-5 w-14 rounded-full ${skeletonBase}`} />
                      </td>
                      <td className="px-6 py-4">
                        <div className={`h-4 w-24 rounded ${skeletonBase}`} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <div className={`h-8 w-8 rounded-md ${skeletonBase}`} />
                          <div className={`h-8 w-8 rounded-md ${skeletonBase}`} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Skeleton */}
          <div className={`mt-6 px-6 py-4 rounded-xl border flex items-center justify-between ${
            isDarkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-100 bg-gray-50/50"
          }`}>
            <div className={`h-4 w-24 rounded ${skeletonBase}`} />
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-lg ${skeletonBase}`} />
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`h-8 w-8 rounded-lg ${skeletonBase}`} />
                ))}
              </div>
              <div className={`h-8 w-8 rounded-lg ${skeletonBase}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
