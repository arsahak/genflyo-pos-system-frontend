"use client";
import { useSidebar } from "@/lib/SidebarContext";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  MdArrowBack,
  MdRefresh,
  MdInventory,
  MdWarning,
  MdTrendingDown,
  MdCategory,
} from "react-icons/md";

interface InventoryReportData {
  summary: {
    totalItems: number;
    totalQuantity: number;
    totalValue: number;
    lowStockCount: number;
    outOfStockCount: number;
    overstockCount: number;
  };
  stockStatus: {
    inStock: number;
    lowStock: number;
    outOfStock: number;
    overstock: number;
  };
  categoryBreakdown: Record<
    string,
    { items: number; quantity: number; value: number }
  >;
  lowStockItems: Array<{
    productId: { name: string; sku: string; category: string };
    quantity: number;
    minStock: number;
  }>;
}

const InventoryReport = () => {
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [reportData, setReportData] = useState<InventoryReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState("");

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    fetchReport();
  }, [selectedStore]);

  const fetchStores = async () => {
    try {
      const response = await api.get("/stores");
      setStores(response.data || []);
      if (response.data && response.data.length > 0) {
        setSelectedStore(response.data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const fetchReport = async () => {
    if (!selectedStore) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        storeId: selectedStore,
      });

      const response = await api.get(`/reports/inventory?${params.toString()}`);
      setReportData(response.data);
    } catch (error: any) {
      console.error("Error fetching report:", error);
      toast.error(error.response?.data?.message || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
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
          Back to Reports
        </button>
        <h1
          className={`text-3xl font-bold mb-2 ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Inventory Report
        </h1>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
          Stock levels, movements, and inventory analytics
        </p>
      </div>

      {/* Filters */}
      <div
        className={`p-4 rounded-lg border-2 mb-6 ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Store
            </label>
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
            >
              {stores.map((store) => (
                <option key={store._id} value={store._id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchReport}
              className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <MdRefresh />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : reportData ? (
        <>
          {/* Summary Cards */}
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
                    {reportData.summary.totalItems}
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
                    Total Value
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {formatCurrency(reportData.summary.totalValue)}
                  </p>
                </div>
                <MdCategory className="text-4xl text-green-500" />
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
                    {reportData.summary.lowStockCount}
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
                    {reportData.summary.outOfStockCount}
                  </p>
                </div>
                <MdTrendingDown className="text-4xl text-red-500" />
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <div
              className={`rounded-lg border-2 p-6 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-bold mb-4 ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Category Breakdown
              </h3>
              <div className="space-y-3">
                {Object.entries(reportData.categoryBreakdown).map(
                  ([category, data]) => (
                    <div
                      key={category}
                      className={`p-3 rounded-lg ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span
                          className={`font-semibold ${
                            isDarkMode ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {category}
                        </span>
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {data.items} items
                        </span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Qty: {data.quantity}
                        </span>
                        <span className="text-sm font-semibold text-green-600">
                          {formatCurrency(data.value)}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Low Stock Items */}
            <div
              className={`rounded-lg border-2 overflow-hidden ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="p-4 border-b border-gray-700">
                <h3
                  className={`text-lg font-bold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Low Stock Alerts
                </h3>
              </div>
              <div className="overflow-y-auto max-h-96">
                {reportData.lowStockItems.length > 0 ? (
                  <table className="w-full">
                    <tbody>
                      {reportData.lowStockItems.map((item, index) => (
                        <tr
                          key={index}
                          className={`border-t ${
                            isDarkMode ? "border-gray-700" : "border-gray-200"
                          }`}
                        >
                          <td className="px-4 py-2">
                            <div>
                              <p
                                className={`font-semibold ${
                                  isDarkMode ? "text-gray-100" : "text-gray-900"
                                }`}
                              >
                                {item.productId.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.productId.sku}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-2 text-right">
                            <p className="text-sm font-semibold text-orange-600">
                              {item.quantity} / {item.minStock}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-4 text-center">
                    <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                      No low stock items
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            No data available
          </p>
        </div>
      )}
    </div>
  );
};

export default InventoryReport;

