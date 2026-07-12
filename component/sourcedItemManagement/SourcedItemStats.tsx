import { MdAttachMoney, MdPublic, MdTrendingUp } from "react-icons/md";
import { Stats } from "./types";

interface SourcedItemStatsProps {
  stats: Stats;
}

export const SourcedItemStats = ({ stats }: SourcedItemStatsProps) => {
  const formatCurrency = (amount: number) => `৳${amount.toFixed(2)}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Items - Blue Gradient */}
      <div className="relative overflow-hidden p-6 rounded-2xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 text-white">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1 text-blue-100 opacity-90">Total Sourced Items</p>
            <h3 className="text-3xl font-bold text-white">{stats.totalItems}</h3>
          </div>
          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
            <MdPublic className="text-2xl" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Total Cost - Orange Gradient */}
      <div className="relative overflow-hidden p-6 rounded-2xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 text-white">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1 text-orange-100 opacity-90">Total Cost</p>
            <h3 className="text-3xl font-bold text-white">{formatCurrency(stats.totalCost)}</h3>
          </div>
          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
            <MdAttachMoney className="text-2xl" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Total Profit - Green Gradient */}
      <div className="relative overflow-hidden p-6 rounded-2xl transition-all duration-300 bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30 text-white">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1 text-green-100 opacity-90">Total Profit</p>
            <h3 className="text-3xl font-bold text-white">{formatCurrency(stats.totalProfit)}</h3>
          </div>
          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
            <MdTrendingUp className="text-2xl" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      </div>
    </div>
  );
};
