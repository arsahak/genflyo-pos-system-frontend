import { MdInventory, MdWarning } from "react-icons/md";

interface ProductStatsProps {
  isDarkMode: boolean;
  totalProducts: number;
  currentProducts: number;
  lowStockCount: number;
  expiringCount: number;
  expiredCount: number;
  activeFilter: string;
  handleStockFilter: (val: string) => void;
}

export const ProductStats = ({
  isDarkMode,
  totalProducts,
  currentProducts,
  lowStockCount,
  expiringCount,
  expiredCount,
  activeFilter,
  handleStockFilter,
}: ProductStatsProps) => {
  const isLowActive      = activeFilter === "low";
  const isExpiringActive = activeFilter === "expiring";
  const isExpiredActive  = activeFilter === "expired";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">

      {/* Total Products — Blue */}
      <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 text-white">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1 text-blue-100 opacity-90">Total Products</p>
            <h3 className="text-2xl font-bold">{totalProducts}</h3>
          </div>
          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm shadow-inner">
            <MdInventory className="text-2xl" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Showing — Purple */}
      <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30 text-white">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1 text-purple-100 opacity-90">Showing</p>
            <h3 className="text-2xl font-bold">{currentProducts}</h3>
          </div>
          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm shadow-inner">
            <MdInventory className="text-2xl" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Low Stock — Orange */}
      <div
        onClick={() => handleStockFilter(isLowActive ? "" : "low")}
        className={`relative overflow-hidden p-5 rounded-2xl transition-all duration-200 cursor-pointer group hover:-translate-y-1 bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg text-white ${
          isLowActive
            ? "ring-4 ring-white/60 shadow-orange-500/70 -translate-y-1"
            : "shadow-orange-500/30 hover:shadow-orange-500/50"
        }`}
      >
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1 text-orange-100 opacity-90">Low Stock</p>
            <h3 className="text-2xl font-bold">{lowStockCount}</h3>
            {isLowActive && <p className="text-xs text-orange-100 mt-1 opacity-80">Click to clear</p>}
          </div>
          <div className={`p-3 rounded-xl backdrop-blur-sm shadow-inner transition-colors ${isLowActive ? "bg-white/40" : "bg-white/20 group-hover:bg-white/30"}`}>
            <MdWarning className="text-2xl" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Expiring Soon — Amber (not yet expired, within 90 days) */}
      <div
        onClick={() => handleStockFilter(isExpiringActive ? "" : "expiring")}
        className={`relative overflow-hidden p-5 rounded-2xl transition-all duration-200 cursor-pointer group hover:-translate-y-1 bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg text-white ${
          isExpiringActive
            ? "ring-4 ring-white/60 shadow-amber-400/70 -translate-y-1"
            : "shadow-amber-400/30 hover:shadow-amber-400/50"
        }`}
      >
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1 text-amber-50 opacity-90">Expiring Soon</p>
            <h3 className="text-2xl font-bold">{expiringCount}</h3>
            {isExpiringActive && <p className="text-xs text-amber-50 mt-1 opacity-80">Click to clear</p>}
          </div>
          <div className={`p-3 rounded-xl backdrop-blur-sm shadow-inner transition-colors ${isExpiringActive ? "bg-white/40" : "bg-white/20 group-hover:bg-white/30"}`}>
            <MdWarning className="text-2xl" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Expired — Dark Red (already past expiry date) */}
      <div
        onClick={() => handleStockFilter(isExpiredActive ? "" : "expired")}
        className={`relative overflow-hidden p-5 rounded-2xl transition-all duration-200 cursor-pointer group hover:-translate-y-1 bg-gradient-to-br from-red-600 to-red-700 shadow-lg text-white ${
          isExpiredActive
            ? "ring-4 ring-white/60 shadow-red-600/70 -translate-y-1"
            : "shadow-red-600/30 hover:shadow-red-600/50"
        }`}
      >
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1 text-red-100 opacity-90">Expired</p>
            <h3 className="text-2xl font-bold">{expiredCount}</h3>
            {isExpiredActive && <p className="text-xs text-red-100 mt-1 opacity-80">Click to clear</p>}
          </div>
          <div className={`p-3 rounded-xl backdrop-blur-sm shadow-inner transition-colors ${isExpiredActive ? "bg-white/40" : "bg-white/20 group-hover:bg-white/30"}`}>
            <MdWarning className="text-2xl" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>

    </div>
  );
};
