import { useLanguage } from "@/lib/LanguageContext";
import { getTranslation } from "@/lib/translations";
import { IoMdSearch } from "react-icons/io";

interface CategoryFiltersProps {
  isDarkMode: boolean;
  searchTerm: string;
  handleSearch: (val: string) => void;
}

export const CategoryFilters = ({
  isDarkMode,
  searchTerm,
  handleSearch,
}: CategoryFiltersProps) => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(key, language);

  return (
    <div
      className={`p-4 mb-6 rounded-2xl border transition-all ${
        isDarkMode
          ? "bg-gray-800 border-gray-700 shadow-lg shadow-gray-900/20"
          : "bg-white border-gray-100 shadow-xl shadow-slate-200/50"
      }`}
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative group">
          <IoMdSearch
            className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl transition-colors ${
              isDarkMode
                ? "text-gray-500 group-focus-within:text-indigo-400"
                : "text-gray-400 group-focus-within:text-indigo-500"
            }`}
          />
          <input
            type="text"
            placeholder={t("searchCategoriesPlaceholder")}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDarkMode
                ? "bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20 focus:ring-offset-gray-800"
                : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500/20"
            }`}
          />
        </div>
      </div>

      {/* Active Filters Tag */}
      {searchTerm && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-gray-700">
          <span className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
            {t("activeFilter")}:
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            isDarkMode ? "bg-indigo-900/30 text-indigo-300 border border-indigo-800" : "bg-indigo-50 text-indigo-700 border border-indigo-100"
          }`}>
            {t("searchShort")}: {searchTerm}
            <button onClick={() => handleSearch("")} className="ml-2 hover:opacity-75">×</button>
          </span>
        </div>
      )}
    </div>
  );
};
