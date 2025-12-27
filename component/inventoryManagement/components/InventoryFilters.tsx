import {
  MdSearch,
  MdRefresh,
  MdWarning,
  MdAdd,
  MdStore,
} from "react-icons/md";

interface InventoryFiltersProps {
  isDarkMode: boolean;
  selectedStore: string;
  stores: Array<{ _id: string; name: string }>;
  searchQuery: string;
  filterLowStock: boolean;
  onStoreChange: (storeId: string) => void;
  onSearchChange: (query: string) => void;
  onLowStockToggle: (checked: boolean) => void;
  onRefresh: () => void;
  onNavigateToAdjustments: () => void;
  onNavigateToLowStock: () => void;
}

export const InventoryFilters = ({
  isDarkMode,
  selectedStore,
  stores,
  searchQuery,
  filterLowStock,
  onStoreChange,
  onSearchChange,
  onLowStockToggle,
  onRefresh,
  onNavigateToAdjustments,
  onNavigateToLowStock,
}: InventoryFiltersProps) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onRefresh();
    }
  };

  return (
    <div
      className={`p-4 rounded-2xl border mb-6 shadow-sm ${
        isDarkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex flex-wrap items-center gap-3">
        {/* Store Selector */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <MdStore className="text-gray-400" />
          </div>
          <select
            value={selectedStore}
            onChange={(e) => onStoreChange(e.target.value)}
            className={`pl-10 pr-4 py-2.5 rounded-xl border transition-colors ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-100 hover:border-gray-500"
                : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
            } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
          >
            <option value="">Select Store</option>
            {stores.map((store) => (
              <option key={store._id} value={store._id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search by product name, SKU, location..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border transition-colors ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 hover:border-gray-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400"
              } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
            />
          </div>
        </div>

        {/* Low Stock Filter */}
        <label
          className={`flex items-center gap-2 cursor-pointer px-3 py-2.5 rounded-xl transition-colors ${
            filterLowStock
              ? "bg-orange-100 text-orange-700"
              : isDarkMode
              ? "hover:bg-gray-700"
              : "hover:bg-gray-100"
          }`}
        >
          <input
            type="checkbox"
            checked={filterLowStock}
            onChange={(e) => onLowStockToggle(e.target.checked)}
            className="w-4 h-4 accent-orange-600"
          />
          <span className={isDarkMode && !filterLowStock ? "text-gray-300" : filterLowStock ? "text-orange-700 font-medium" : "text-gray-700"}>
            Low Stock Only
          </span>
        </label>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2 font-medium"
          >
            <MdRefresh />
            Refresh
          </button>

          <button
            onClick={onNavigateToAdjustments}
            className="px-4 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all hover:shadow-lg hover:shadow-green-500/30 flex items-center gap-2 font-medium"
          >
            <MdAdd />
            Adjustments
          </button>

          <button
            onClick={onNavigateToLowStock}
            className="px-4 py-2.5 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition-all hover:shadow-lg hover:shadow-orange-500/30 flex items-center gap-2 font-medium"
          >
            <MdWarning />
            Low Stock
          </button>
        </div>
      </div>
    </div>
  );
};
