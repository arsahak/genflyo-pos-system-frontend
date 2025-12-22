interface ProductFormSkeletonProps {
  isDarkMode?: boolean;
}

export const ProductFormSkeleton = ({ isDarkMode = false }: ProductFormSkeletonProps) => {
  const cardClass = `rounded-2xl shadow-sm p-6 mb-6 ${
    isDarkMode ? "bg-gray-800 shadow-lg shadow-gray-900/20" : "bg-white shadow-xl shadow-slate-200/50"
  }`;
  
  const labelClass = `h-4 w-32 rounded mb-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`;
  const inputClass = `h-10 w-full rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`;
  const headerClass = `h-6 w-48 rounded mb-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`;

  return (
    <div className="animate-fadeIn">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className={`h-8 w-64 rounded-lg mb-2 ${isDarkMode ? "bg-gray-800" : "bg-gray-200"} animate-pulse`} />
        <div className={`h-4 w-96 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-200"} animate-pulse`} />
      </div>

      <div className="space-y-6">
        {/* Basic Information Skeleton */}
        <div className={cardClass}>
          <div className={headerClass} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-1">
              <div className={labelClass} />
              <div className={inputClass} />
            </div>
            <div className="md:col-span-1">
              <div className={labelClass} />
              <div className={inputClass} />
            </div>
            <div className="md:col-span-1">
              <div className={labelClass} />
              <div className={inputClass} />
            </div>
            <div className="md:col-span-1">
              <div className={labelClass} />
              <div className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <div className={labelClass} />
              <div className={`h-24 w-full rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
            </div>
          </div>
        </div>

        {/* Pricing Skeleton */}
        <div className={cardClass}>
          <div className={headerClass} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i}>
                <div className={labelClass} />
                <div className={inputClass} />
              </div>
            ))}
          </div>
        </div>

        {/* Stock Management Skeleton */}
        <div className={cardClass}>
          <div className={headerClass} />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className={labelClass} />
                <div className={inputClass} />
              </div>
            ))}
          </div>
        </div>

        {/* Product Images Skeleton */}
        <div className={cardClass}>
          <div className={headerClass} />
          <div className="space-y-6">
            <div>
              <div className={`h-4 w-40 rounded mb-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
              <div className={`h-48 w-full rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
            </div>
             <div>
              <div className={`h-4 w-40 rounded mb-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
              <div className={`h-32 w-full rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
