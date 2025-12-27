import {
  MdInventory,
  MdTrendingUp,
  MdWarning,
  MdTrendingDown,
} from "react-icons/md";

interface InventoryStatsProps {
  isDarkMode: boolean;
  stats: {
    totalItems: number;
    totalQuantity: number;
    lowStockItems: number;
    outOfStockItems: number;
  };
  onLowStockClick?: () => void;
  onOutOfStockClick?: () => void;
}

export const InventoryStats = ({
  isDarkMode,
  stats,
  onLowStockClick,
  onOutOfStockClick,
}: InventoryStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Items - Blue Gradient */}
      <div className="relative overflow-hidden p-5 rounded-2xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 text-white">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1 text-blue-100 opacity-90">
              Total Items
            </p>
            <h3 className="text-2xl font-bold text-white">
              {stats.totalItems}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
            <MdInventory className="text-2xl" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Total Quantity - Green Gradient */}
      <div className="relative overflow-hidden p-5 rounded-2xl transition-all duration-300 bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30 text-white">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1 text-green-100 opacity-90">
              Total Quantity
            </p>
            <h3 className="text-2xl font-bold text-white">
              {stats.totalQuantity}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
            <MdTrendingUp className="text-2xl" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Low Stock - Orange Gradient */}
      <div
        onClick={onLowStockClick}
        className={`relative overflow-hidden p-5 rounded-2xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 text-white ${
          onLowStockClick ? "cursor-pointer group hover:-translate-y-1" : ""
        }`}
      >
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1 text-orange-100 opacity-90">
              Low Stock
            </p>
            <h3 className="text-2xl font-bold text-white">
              {stats.lowStockItems}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner group-hover:bg-white/30 transition-colors">
            <MdWarning className="text-2xl" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Out of Stock - Red Gradient */}
      <div
        onClick={onOutOfStockClick}
        className={`relative overflow-hidden p-5 rounded-2xl transition-all duration-300 bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 text-white ${
          onOutOfStockClick ? "cursor-pointer group hover:-translate-y-1" : ""
        }`}
      >
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1 text-red-100 opacity-90">
              Out of Stock
            </p>
            <h3 className="text-2xl font-bold text-white">
              {stats.outOfStockItems}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner group-hover:bg-white/30 transition-colors">
            <MdTrendingDown className="text-2xl" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>
    </div>
  );
};
