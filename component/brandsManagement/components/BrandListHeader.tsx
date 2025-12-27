import { MdAdd, MdBusiness } from "react-icons/md";

interface BrandListHeaderProps {
  isDarkMode: boolean;
  onAddNew: () => void;
}

export default function BrandListHeader({
  isDarkMode,
  onAddNew,
}: BrandListHeaderProps) {
  return (
    <div
      className={`sticky top-0 z-30 py-4 shadow-sm border-b transition-colors ${
        isDarkMode
          ? "bg-gray-900/95 border-gray-800 backdrop-blur-md"
          : "bg-white/95 border-slate-200 backdrop-blur-md"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section - Title */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  isDarkMode ? "bg-indigo-900/50" : "bg-indigo-50"
                }`}
              >
                <MdBusiness
                  className={`${
                    isDarkMode ? "text-indigo-400" : "text-indigo-600"
                  }`}
                  size={24}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1
                  className={`text-xl sm:text-2xl font-bold ${
                    isDarkMode ? "text-gray-100" : "text-slate-900"
                  }`}
                >
                  Brand Management
                </h1>
                <p
                  className={`text-xs sm:text-sm mt-0.5 hidden sm:block ${
                    isDarkMode ? "text-gray-400" : "text-slate-500"
                  }`}
                >
                  Manage pharmaceutical brands and manufacturers
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Add Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onAddNew}
              className="px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 flex items-center gap-1.5 sm:gap-2 transition-all transform active:scale-95"
            >
              <MdAdd size={18} /> <span>Add Brand</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
