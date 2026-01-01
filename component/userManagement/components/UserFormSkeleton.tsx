interface UserFormSkeletonProps {
  isDarkMode?: boolean;
}

export const UserFormSkeleton = ({ isDarkMode = false }: UserFormSkeletonProps) => {
  const skeletonBase = `animate-pulse rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Main Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Profile Image Section */}
        <div className={`rounded-2xl border p-6 shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className={`h-5 w-32 mb-4 ${skeletonBase}`} />
          <div className="flex items-center gap-6">
            <div className={`w-24 h-24 rounded-full ${skeletonBase}`} />
            <div className="space-y-2">
              <div className={`h-4 w-40 ${skeletonBase}`} />
              <div className={`h-3 w-32 ${skeletonBase}`} />
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className={`rounded-2xl border p-6 shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className={`h-5 w-40 mb-6 ${skeletonBase}`} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={i === 1 || i === 4 ? "md:col-span-2" : ""}>
                <div className={`h-4 w-24 mb-2 ${skeletonBase}`} />
                <div className={`h-12 w-full rounded-xl ${skeletonBase}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Security Information */}
        <div className={`rounded-2xl border p-6 shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className={`h-5 w-40 mb-2 ${skeletonBase}`} />
          <div className={`h-3 w-48 mb-6 ${skeletonBase}`} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i}>
                <div className={`h-4 w-24 mb-2 ${skeletonBase}`} />
                <div className={`h-12 w-full rounded-xl ${skeletonBase}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Role & Permissions */}
      <div className="space-y-6">
        {/* Role Selection */}
        <div className={`rounded-2xl border p-6 shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className={`h-5 w-32 mb-6 ${skeletonBase}`} />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`p-4 rounded-xl border-2 ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${skeletonBase}`} />
                  <div className="flex-1 space-y-2">
                    <div className={`h-4 w-20 ${skeletonBase}`} />
                    <div className={`h-3 w-32 ${skeletonBase}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions */}
        <div className={`rounded-2xl border p-6 shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className={`h-5 w-40 mb-6 ${skeletonBase}`} />
          <div className="space-y-4">
            {[1, 2, 3].map((section) => (
              <div key={section} className={`rounded-xl border p-4 ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                <div className={`h-4 w-32 mb-3 ${skeletonBase}`} />
                <div className="space-y-2">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center justify-between">
                      <div className={`h-3 w-24 ${skeletonBase}`} />
                      <div className={`h-5 w-9 rounded-full ${skeletonBase}`} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`rounded-2xl border p-6 shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className="space-y-4">
            <div className={`h-12 w-full rounded-xl ${skeletonBase}`} />
            <div className={`h-12 w-full rounded-xl ${skeletonBase}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
