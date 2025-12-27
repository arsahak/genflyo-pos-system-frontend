export function BrandListSkeleton({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div
      className={`rounded-2xl shadow-sm border overflow-hidden ${
        isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-slate-200"
      }`}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-slate-50"
            } border-b ${isDarkMode ? "border-gray-700" : "border-slate-200"}`}
          >
            <tr>
              <th className="px-6 py-4 text-left">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
              </th>
              <th className="px-6 py-4 text-right">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20 ml-auto"></div>
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              isDarkMode ? "divide-gray-800" : "divide-slate-200"
            }`}
          >
            {[...Array(10)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-40"></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-28"></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-full w-16"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                    <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
