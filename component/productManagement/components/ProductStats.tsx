import { MdInventory, MdWarning } from "react-icons/md";

interface ProductStatsProps {
  isDarkMode: boolean;
  totalProducts: number;
  currentProducts: number;
  lowStockCount: number;
  expiringCount: number;
  handleStockFilter: (val: string) => void;
}

export const ProductStats = ({
  isDarkMode,
  totalProducts,
  currentProducts,
  lowStockCount,
  expiringCount,
  handleStockFilter,
}: ProductStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Products - Blue Gradient */}
      <div
        className="relative overflow-hidden p-5 rounded-2xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 text-white"
      >
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1 text-blue-100 opacity-90">
              Total Products
            </p>
            <h3 className="text-2xl font-bold text-white">
              {totalProducts}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
            <MdInventory className="text-2xl" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Showing - Purple Gradient */}
      <div
        className="relative overflow-hidden p-5 rounded-2xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30 text-white"
      >
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1 text-purple-100 opacity-90">
              Showing
            </p>
            <h3 className="text-2xl font-bold text-white">
              {currentProducts}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
            <MdInventory className="text-2xl" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Low Stock - Orange Gradient */}
      <div
        onClick={() => handleStockFilter("low")}
        className="relative overflow-hidden p-5 rounded-2xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 text-white"
      >
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1 text-orange-100 opacity-90">
              Low Stock
            </p>
            <h3 className="text-2xl font-bold text-white">
              {lowStockCount}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner group-hover:bg-white/30 transition-colors">
            <MdWarning className="text-2xl" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Expiring Soon - Red Gradient */}
      <div
        className="relative overflow-hidden p-5 rounded-2xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 text-white"
      >
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1 text-red-100 opacity-90">
              Expiring Soon
            </p>
            <h3 className="text-2xl font-bold text-white">
              {expiringCount}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner group-hover:bg-white/30 transition-colors">
            <MdWarning className="text-2xl" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>
    </div>
  );
};
