interface UserDetailsSkeletonProps {
  isDarkMode?: boolean;
}

export const UserDetailsSkeleton = ({ isDarkMode = false }: UserDetailsSkeletonProps) => {
  const skeletonBase = `animate-pulse rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Profile Info */}
      <div className="lg:col-span-1 space-y-6">
        {/* Profile Card */}
        <div className={`rounded-2xl shadow-sm border p-6 ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <div className="flex flex-col items-center">
            <div className={`w-32 h-32 rounded-full mb-4 ${skeletonBase}`} />
            <div className={`h-7 w-40 mb-2 ${skeletonBase}`} />
            <div className={`h-6 w-24 mb-4 rounded-full ${skeletonBase}`} />
            <div className={`h-8 w-20 rounded-full ${skeletonBase}`} />
          </div>
        </div>

        {/* Contact Information */}
        <div className={`rounded-2xl shadow-sm border p-6 ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <div className={`h-5 w-40 mb-4 ${skeletonBase}`} />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded mt-0.5 ${skeletonBase}`} />
                <div className="flex-1">
                  <div className={`h-3 w-16 mb-2 ${skeletonBase}`} />
                  <div className={`h-4 w-full ${skeletonBase}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className={`rounded-2xl shadow-sm border p-6 ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <div className={`h-5 w-48 mb-4 ${skeletonBase}`} />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className={`h-3 w-24 mb-2 ${skeletonBase}`} />
                <div className={`h-4 w-full ${skeletonBase}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Permissions */}
      <div className="lg:col-span-2">
        <div className={`rounded-2xl shadow-sm border p-6 ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <div className={`h-5 w-32 mb-6 ${skeletonBase}`} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border-2 ${
                  isDarkMode ? "border-gray-600" : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`h-4 w-32 ${skeletonBase}`} />
                  <div className={`h-6 w-16 rounded-full ${skeletonBase}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
