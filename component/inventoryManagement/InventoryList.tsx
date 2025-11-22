"use client";
import { useSidebar } from "@/lib/SidebarContext";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  MdSearch,
  MdRefresh,
  MdWarning,
  MdEdit,
  MdAdd,
  MdRemove,
  MdLocationOn,
  MdInventory,
  MdTrendingDown,
  MdTrendingUp,
  MdStore,
} from "react-icons/md";

interface InventoryItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    sku: string;
    barcode: string;
    category: string;
    price: number;
    image?: string;
  };
  storeId: {
    _id: string;
    name: string;
  };
  quantity: number;
  reserved: number;
  minStock: number;
  maxStock: number;
  location: string;
  lastRestocked: string;
  updatedAt: string;
}

const InventoryList = () => {
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalQuantity: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
  });
  const [selectedStore, setSelectedStore] = useState("");
  const [stores, setStores] = useState<any[]>([]);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);
  const [adjustmentQty, setAdjustmentQty] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState("");

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    if (selectedStore) {
      fetchInventory();
      fetchStats();
    }
  }, [selectedStore, filterLowStock]);

  const fetchStores = async () => {
    try {
      const response = await api.get("/stores");
      setStores(response.data || []);
      if (response.data && response.data.length > 0) {
        setSelectedStore(response.data[0]._id);
      }
    } catch (error: any) {
      console.error("Error fetching stores:", error);
      toast.error("Failed to fetch stores");
    }
  };

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        storeId: selectedStore,
      });

      if (filterLowStock) {
        params.append("lowStock", "true");
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await api.get(`/inventory?${params.toString()}`);
      setInventory(response.data.inventories || []);
    } catch (error: any) {
      console.error("Error fetching inventory:", error);
      toast.error(error.response?.data?.message || "Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get(`/inventory/stats/summary?storeId=${selectedStore}`);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSearch = () => {
    fetchInventory();
  };

  const handleAdjustStock = (item: InventoryItem) => {
    setAdjustingItem(item);
    setAdjustmentQty(0);
    setAdjustmentReason("");
    setShowAdjustModal(true);
  };

  const submitAdjustment = async () => {
    if (!adjustingItem || adjustmentQty === 0) {
      toast.error("Please enter an adjustment quantity");
      return;
    }

    try {
      await api.post("/inventory/adjust", {
        productId: adjustingItem.productId._id,
        storeId: adjustingItem.storeId._id,
        adjustment: adjustmentQty,
        reason: adjustmentReason,
        location: adjustingItem.location,
        minStock: adjustingItem.minStock,
        maxStock: adjustingItem.maxStock,
      });

      toast.success(`Stock adjusted successfully (${adjustmentQty > 0 ? '+' : ''}${adjustmentQty})`);
      setShowAdjustModal(false);
      fetchInventory();
      fetchStats();
    } catch (error: any) {
      console.error("Error adjusting stock:", error);
      toast.error(error.response?.data?.message || "Failed to adjust stock");
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) {
      return { label: "Out of Stock", color: "text-red-600 bg-red-100 border-red-300" };
    } else if (item.quantity <= item.minStock) {
      return { label: "Low Stock", color: "text-orange-600 bg-orange-100 border-orange-300" };
    } else if (item.quantity >= item.maxStock) {
      return { label: "Overstock", color: "text-purple-600 bg-purple-100 border-purple-300" };
    } else {
      return { label: "In Stock", color: "text-green-600 bg-green-100 border-green-300" };
    }
  };

  const getAvailable = (item: InventoryItem) => {
    return item.quantity - (item.reserved || 0);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1
          className={`text-3xl font-bold mb-2 ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Inventory Management
        </h1>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
          Track and manage stock levels across all stores
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div
          className={`p-4 rounded-lg border-2 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total Items
              </p>
              <p
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {stats.totalItems}
              </p>
            </div>
            <MdInventory className="text-4xl text-blue-500" />
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border-2 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total Quantity
              </p>
              <p
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
              >
                {stats.totalQuantity}
              </p>
            </div>
            <MdTrendingUp className="text-4xl text-green-500" />
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border-2 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Low Stock
              </p>
              <p
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-orange-400" : "text-orange-600"
                }`}
              >
                {stats.lowStockItems}
              </p>
            </div>
            <MdWarning className="text-4xl text-orange-500" />
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border-2 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Out of Stock
              </p>
              <p
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-red-400" : "text-red-600"
                }`}
              >
                {stats.outOfStockItems}
              </p>
            </div>
            <MdTrendingDown className="text-4xl text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div
        className={`p-4 rounded-lg border-2 mb-4 ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex flex-wrap items-center gap-3">
          {/* Store Selector */}
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-100"
                : "bg-gray-50 border-gray-300 text-gray-900"
            }`}
          >
            <option value="">Select Store</option>
            {stores.map((store) => (
              <option key={store._id} value={store._id}>
                {store.name}
              </option>
            ))}
          </select>

          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product name, SKU, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              />
            </div>
          </div>

          {/* Low Stock Filter */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterLowStock}
              onChange={(e) => setFilterLowStock(e.target.checked)}
              className="w-4 h-4"
            />
            <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
              Show Low Stock Only
            </span>
          </label>

          {/* Action Buttons */}
          <button
            onClick={handleSearch}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
          >
            <MdRefresh />
            Refresh
          </button>

          <button
            onClick={() => router.push("/inventory/adjustments")}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
          >
            <MdAdd />
            Adjustments
          </button>

          <button
            onClick={() => router.push("/inventory/low-stock")}
            className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 flex items-center gap-2"
          >
            <MdWarning />
            Low Stock
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div
        className={`rounded-lg border-2 overflow-hidden ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              className={
                isDarkMode
                  ? "bg-gray-700 text-gray-100"
                  : "bg-gray-100 text-gray-900"
              }
            >
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-center">In Stock</th>
                <th className="px-4 py-3 text-center">Reserved</th>
                <th className="px-4 py-3 text-center">Available</th>
                <th className="px-4 py-3 text-center">Min/Max</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Last Restocked</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  </td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-8">
                    <p
                      className={
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }
                    >
                      No inventory items found
                    </p>
                  </td>
                </tr>
              ) : (
                inventory.map((item) => {
                  const status = getStockStatus(item);
                  const available = getAvailable(item);
                  
                  return (
                    <tr
                      key={item._id}
                      className={`border-t ${
                        isDarkMode
                          ? "border-gray-700 hover:bg-gray-750"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p
                            className={`font-semibold ${
                              isDarkMode ? "text-gray-100" : "text-gray-900"
                            }`}
                          >
                            {item.productId.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.productId.category}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-mono text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {item.productId.sku}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <MdLocationOn className="text-gray-400" />
                          <span
                            className={
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            {item.location || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`font-bold text-lg ${
                            isDarkMode ? "text-indigo-400" : "text-indigo-600"
                          }`}
                        >
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-orange-600">
                          {item.reserved || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`font-semibold ${
                            available <= 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {available}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          {item.minStock || 0} / {item.maxStock || "∞"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {item.lastRestocked
                            ? new Date(item.lastRestocked).toLocaleDateString()
                            : "Never"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleAdjustStock(item)}
                            className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                            title="Adjust Stock"
                          >
                            <MdEdit className="text-xl" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {showAdjustModal && adjustingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`max-w-md w-full rounded-xl shadow-2xl ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="p-6">
              <h2
                className={`text-2xl font-bold mb-4 ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Adjust Stock
              </h2>

              <div className="mb-4">
                <p
                  className={`font-semibold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {adjustingItem.productId.name}
                </p>
                <p className="text-sm text-gray-500">
                  Current Stock: {adjustingItem.quantity}
                </p>
              </div>

              <div className="mb-4">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Adjustment Quantity
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAdjustmentQty(adjustmentQty - 1)}
                    className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  >
                    <MdRemove />
                  </button>
                  <input
                    type="number"
                    value={adjustmentQty}
                    onChange={(e) => setAdjustmentQty(parseInt(e.target.value) || 0)}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 text-center ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  />
                  <button
                    onClick={() => setAdjustmentQty(adjustmentQty + 1)}
                    className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                  >
                    <MdAdd />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  New Stock: {adjustingItem.quantity + adjustmentQty}
                </p>
              </div>

              <div className="mb-6">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Reason (Optional)
                </label>
                <input
                  type="text"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  placeholder="e.g., Damaged items, Stock correction"
                  className={`w-full px-4 py-2 rounded-lg border-2 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAdjustModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-100 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={submitAdjustment}
                  disabled={adjustmentQty === 0}
                  className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply Adjustment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList;

