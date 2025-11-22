"use client";
import { useSidebar } from "@/lib/SidebarContext";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
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
    name: string;
    sku: string;
    category: string;
    price: number;
  };
  storeId: {
    name: string;
  };
  quantity: number;
  minStock: number;
  maxStock: number;
  location: string;
}

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
      const response = await api.get("/stores");
      setStores(response.data || []);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const fetchLowStock = async () => {
    setLoading(true);
    try {
      const params = selectedStore ? `?storeId=${selectedStore}` : "";
      const response = await api.get(`/inventory/alerts/low-stock${params}`);
      setLowStockItems(response.data || []);
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className={`flex items-center gap-2 mb-4 ${
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

      {/* Summary Card */}
      <div
        className={`p-6 rounded-lg border-2 mb-6 ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <MdWarning className="text-4xl text-orange-500" />
              <div>
                <h2
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-orange-400" : "text-orange-600"
                  }`}
                >
                  {lowStockItems.length}
                </h2>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Items Below Minimum Stock
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
            >
              <option value="">All Stores</option>
              {stores.map((store) => (
                <option key={store._id} value={store._id}>
                  {store.name}
                </option>
              ))}
            </select>
            <button
              onClick={fetchLowStock}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
            >
              <MdRefresh />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Low Stock Table */}
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
                <th className="px-4 py-3 text-left">Priority</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Store</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-center">Current</th>
                <th className="px-4 py-3 text-center">Min Stock</th>
                <th className="px-4 py-3 text-center">Need to Order</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  </td>
                </tr>
              ) : lowStockItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center">
                      <MdInventory className="text-6xl text-gray-400 mb-2" />
                      <p
                        className={
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }
                      >
                        🎉 Great! No low stock items
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                lowStockItems.map((item) => {
                  const severity = getSeverity(item);
                  const needToOrder = Math.max(0, item.maxStock - item.quantity);

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
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-white text-xs font-semibold ${severity.color}`}
                        >
                          {severity.label}
                        </span>
                      </td>
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
                            SKU: {item.productId.sku}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <MdStore className="text-gray-400" />
                          <span
                            className={
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            {item.storeId.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          {item.location || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
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
                      <td className="px-4 py-3 text-center">
                        <span
                          className={
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }
                        >
                          {item.minStock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold text-green-600">
                          {needToOrder}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => router.push("/inventory/adjustments")}
                          className="px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm flex items-center gap-1 mx-auto"
                        >
                          <MdAdd />
                          Restock
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LowStockAlerts;

