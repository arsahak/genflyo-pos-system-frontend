import { IoMdSearch } from "react-icons/io";

interface ProductFiltersProps {
  isDarkMode: boolean;
  searchTerm: string;
  handleSearch: (val: string) => void;
  categoryFilter: string;
  handleCategoryFilter: (val: string) => void;
  stockFilter: string;
  handleStockFilter: (val: string) => void;
  categories: string[];
  clearAllFilters: () => void;
}

export const ProductFilters = ({
  isDarkMode,
  searchTerm,
  handleSearch,
  categoryFilter,
  handleCategoryFilter,
  stockFilter,
  handleStockFilter,
  categories,
  clearAllFilters,
}: ProductFiltersProps) => {
  const hasActiveFilters = searchTerm || categoryFilter || stockFilter;

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
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDarkMode
                ? "bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20 focus:ring-offset-gray-800"
                : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500/20"
            }`}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          <div className="min-w-[150px]">
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border appearance-none cursor-pointer transition-all focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-gray-900 border-gray-700 text-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                  : "bg-gray-50 border-gray-200 text-gray-700 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500/20"
              }`}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[150px]">
            <select
              value={stockFilter}
              onChange={(e) => handleStockFilter(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border appearance-none cursor-pointer transition-all focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-gray-900 border-gray-700 text-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                  : "bg-gray-50 border-gray-200 text-gray-700 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500/20"
              }`}
            >
              <option value="">All Stock</option>
              <option value="in">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-gray-700">
          <span className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
            Active Filters:
          </span>
          
          {searchTerm && (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              isDarkMode ? "bg-indigo-900/30 text-indigo-300 border border-indigo-800" : "bg-indigo-50 text-indigo-700 border border-indigo-100"
            }`}>
              Search: {searchTerm}
              <button onClick={() => handleSearch("")} className="ml-2 hover:opacity-75">×</button>
            </span>
          )}

          {categoryFilter && (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              isDarkMode ? "bg-purple-900/30 text-purple-300 border border-purple-800" : "bg-purple-50 text-purple-700 border border-purple-100"
            }`}>
              Category: {categoryFilter}
              <button onClick={() => handleCategoryFilter("")} className="ml-2 hover:opacity-75">×</button>
            </span>
          )}

          {stockFilter && (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              isDarkMode ? "bg-orange-900/30 text-orange-300 border border-orange-800" : "bg-orange-50 text-orange-700 border border-orange-100"
            }`}>
              Stock: {stockFilter}
              <button onClick={() => handleStockFilter("")} className="ml-2 hover:opacity-75">×</button>
            </span>
          )}

          <button
            onClick={clearAllFilters}
            className={`text-xs font-medium underline hover:no-underline ml-2 ${
              isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};
