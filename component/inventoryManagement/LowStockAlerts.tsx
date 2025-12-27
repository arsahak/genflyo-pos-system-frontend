"use client";
import { useSidebar } from "@/lib/SidebarContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getAllStores } from "@/app/actions/stores";
import { getLowStockItems } from "@/app/actions/inventory";
import {
  MdArrowBack,
  MdWarning,
  MdRefresh,
  MdStore,
  MdInventory,
  MdAdd,
} from "react-icons/md";

interface LowStockItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    sku: string;
    category: string;
    price: number;
    image?: string;
  };
  storeId: {
    _id: string;
    name: string;
  };
  quantity: number;
  minStock: number;
  maxStock: number;
  location: string;
}

// Skeleton Component
const LowStockSkeleton = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const skeletonBase = `animate-pulse rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`;

  return (
    <div className="space-y-6">
      {/* Summary Skeleton */}
      <div className={`p-6 rounded-2xl ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${skeletonBase}`} />
            <div className="space-y-2">
              <div className={`h-8 w-20 ${skeletonBase}`} />
              <div className={`h-4 w-40 ${skeletonBase}`} />
            </div>
          </div>
          <div className="flex gap-3">
            <div className={`h-10 w-32 rounded-xl ${skeletonBase}`} />
            <div className={`h-10 w-24 rounded-xl ${skeletonBase}`} />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className={`rounded-2xl overflow-hidden ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-xl`}>
        <div className="p-6">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="flex items-center gap-4 py-4 border-b border-gray-700">
              <div className={`h-10 w-10 rounded-lg ${skeletonBase}`} />
              <div className="flex-1 space-y-2">
                <div className={`h-4 w-48 ${skeletonBase}`} />
                <div className={`h-3 w-32 ${skeletonBase}`} />
              </div>
              <div className={`h-6 w-16 rounded ${skeletonBase}`} />
              <div className={`h-8 w-20 rounded-lg ${skeletonBase}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LowStockAlerts = () => {
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState("");

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    fetchLowStock();
  }, [selectedStore]);

  const fetchStores = async () => {
    try {
      const result = await getAllStores({});
      if (result.success && result.data?.stores) {
        setStores(result.data.stores);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const fetchLowStock = async () => {
    setLoading(true);
    try {
      const result = await getLowStockItems(selectedStore || undefined);
      if (result.success && result.data) {
        setLowStockItems(result.data);
      } else {
        toast.error(result.error || "Failed to fetch low stock items");
        setLowStockItems([]);
      }
    } catch (error: any) {
      console.error("Error fetching low stock items:", error);
      toast.error("Failed to fetch low stock items");
    } finally {
      setLoading(false);
    }
  };

  const getSeverity = (item: LowStockItem) => {
    const ratio = item.quantity / (item.minStock || 1);
    if (item.quantity === 0) return { label: "Critical", color: "bg-red-600" };
    if (ratio <= 0.5) return { label: "High", color: "bg-orange-600" };
    return { label: "Medium", color: "bg-yellow-600" };
  };

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 font-sans ${
        isDarkMode ? "bg-gray-950 text-gray-100" : "bg-slate-50 text-gray-900"
      }`}
    >
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className={`flex items-center gap-2 mb-4 transition-colors ${
              isDarkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <MdArrowBack className="text-xl" />
            Back to Inventory
          </button>
          <h1
            className={`text-3xl font-bold mb-2 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Low Stock Alerts
          </h1>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            Items that need restocking
          </p>
        </div>

        {loading ? (
          <LowStockSkeleton isDarkMode={isDarkMode} />
        ) : (
          <>
            {/* Summary Card */}
            <div className="relative overflow-hidden p-6 rounded-2xl mb-6 transition-all duration-300 bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 text-white">
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm shadow-inner">
                    <MdWarning className="text-4xl" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{lowStockItems.length}</h2>
                    <p className="text-orange-100 opacity-90">Items Below Minimum Stock</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <MdStore className="text-white/70" />
                    </div>
                    <select
                      value={selectedStore}
                      onChange={(e) => setSelectedStore(e.target.value)}
                      className="pl-10 pr-4 py-2.5 rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white transition-colors focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none"
                    >
                      <option value="" className="text-gray-900">All Stores</option>
                      {stores.map((store) => (
                        <option key={store._id} value={store._id} className="text-gray-900">
                          {store.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={fetchLowStock}
                    className="px-4 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all flex items-center gap-2 font-medium border border-white/30"
                  >
                    <MdRefresh />
                    Refresh
                  </button>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            </div>

            {/* Low Stock Table */}
            <div
              className={`rounded-2xl overflow-hidden shadow-xl border ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 shadow-gray-900/20"
                  : "bg-white border-gray-100 shadow-slate-200/50"
              }`}
            >
              {lowStockItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div
                    className={`p-6 rounded-full mb-4 ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <MdInventory
                      className={`text-6xl ${
                        isDarkMode ? "text-gray-600" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    No Low Stock Items
                  </h3>
                  <p
                    className={`text-center max-w-sm ${
                      isDarkMode ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    Great! All items are above minimum stock levels.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr
                        className={`text-left text-xs font-semibold uppercase tracking-wider ${
                          isDarkMode
                            ? "bg-gray-900/50 text-gray-400"
                            : "bg-gray-50/80 text-gray-500"
                        }`}
                      >
                        <th className="px-6 py-4">Priority</th>
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Store</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4 text-center">Current</th>
                        <th className="px-6 py-4 text-center">Min Stock</th>
                        <th className="px-6 py-4 text-center">Need to Order</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        isDarkMode ? "divide-gray-700" : "divide-gray-100"
                      }`}
                    >
                      {lowStockItems.map((item) => {
                        const severity = getSeverity(item);
                        const needToOrder = Math.max(0, item.maxStock - item.quantity);

                        return (
                          <tr
                            key={item._id}
                            className={`group transition-colors ${
                              isDarkMode
                                ? "hover:bg-gray-700/50"
                                : "hover:bg-orange-50/30"
                            }`}
                          >
                            <td className="px-6 py-4">
                              <span
                                className={`inline-block px-3 py-1.5 rounded-lg text-white text-xs font-bold uppercase shadow-sm ${severity.color}`}
                              >
                                {severity.label}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 ${
                                    isDarkMode ? "bg-gray-700" : "bg-slate-100"
                                  }`}
                                >
                                  {item.productId.image ? (
                                    <img
                                      src={item.productId.image}
                                      alt={item.productId.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <MdInventory
                                      className={
                                        isDarkMode ? "text-gray-500" : "text-gray-400"
                                      }
                                      size={18}
                                    />
                                  )}
                                </div>
                                <div>
                                  <div
                                    className={`font-semibold ${
                                      isDarkMode ? "text-gray-200" : "text-gray-900"
                                    }`}
                                  >
                                    {item.productId.name}
                                  </div>
                                  <div
                                    className={`text-xs ${
                                      isDarkMode ? "text-gray-500" : "text-gray-500"
                                    }`}
                                  >
                                    SKU: {item.productId.sku}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1">
                                <MdStore className="text-gray-400 text-sm" />
                                <span
                                  className={`text-sm ${
                                    isDarkMode ? "text-gray-300" : "text-gray-700"
                                  }`}
                                >
                                  {item.storeId.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`text-sm ${
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                {item.location || "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span
                                className={`font-bold text-lg ${
                                  item.quantity === 0
                                    ? "text-red-600"
                                    : "text-orange-600"
                                }`}
                              >
                                {item.quantity}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span
                                className={`font-medium ${
                                  isDarkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {item.minStock}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="font-bold text-green-600">
                                {needToOrder}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => router.push(`/inventory/adjustments?productId=${item.productId._id}&storeId=${item.storeId._id}`)}
                                className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm flex items-center gap-1 mx-auto transition-all hover:shadow-lg hover:shadow-green-500/30"
                              >
                                <MdAdd />
                                Restock
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LowStockAlerts;
