interface Props {
  isDarkMode: boolean;
}

export const SourcedItemSkeleton = ({ isDarkMode }: Props) => {
  const shimmer = `animate-pulse ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`;
  const headerCell = `px-6 py-4`;
  const rowClass = `border-b ${isDarkMode ? "border-gray-700" : "border-gray-100"}`;

  return (
    <div className="w-full">
      <div className={`w-full h-12 border-b ${isDarkMode ? "border-gray-700 bg-gray-900/50" : "border-gray-100 bg-gray-50/80"}`} />
      <div className="w-full">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`flex items-center w-full ${rowClass}`}>
            <div className={`${headerCell} w-32`}>
              <div className={`h-4 w-20 rounded ${shimmer}`} />
              <div className={`h-3 w-16 rounded mt-2 ${shimmer}`} />
            </div>
            <div className={`${headerCell} flex-1`}>
              <div className={`h-5 w-48 rounded ${shimmer}`} />
              <div className={`h-3 w-24 rounded mt-2 ${shimmer}`} />
            </div>
            <div className={`${headerCell} w-24`}>
              <div className={`h-6 w-12 rounded mx-auto ${shimmer}`} />
            </div>
            <div className={`${headerCell} w-32 text-right`}>
              <div className={`h-5 w-20 rounded ml-auto ${shimmer}`} />
            </div>
            <div className={`${headerCell} w-32 text-right`}>
              <div className={`h-5 w-20 rounded ml-auto ${shimmer}`} />
            </div>
            <div className={`${headerCell} w-32 text-right`}>
              <div className={`h-5 w-20 rounded ml-auto ${shimmer}`} />
            </div>
            <div className={`${headerCell} w-24 text-right`}>
              <div className={`h-8 w-8 rounded ml-auto ${shimmer}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
