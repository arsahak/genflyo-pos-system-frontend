"use client";
import { useSidebar } from "@/lib/SidebarContext";
import { getAllSales, getSalesStats } from "@/app/actions/sales";
import { getAllStores } from "@/app/actions/stores";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  MdSearch,
  MdRefresh,
  MdVisibility,
  MdEdit,
  MdDelete,
  MdFileDownload,
  MdAttachMoney,
  MdPerson,
  MdStore,
  MdCalendarToday,
  MdCheckCircle,
  MdCancel,
  MdWarning,
  MdShoppingCart,
} from "react-icons/md";
import { SalesListSkeleton } from "./components/SalesListSkeleton";

interface Sale {
  _id: string;
  saleNo: string;
  total: number;
  subtotal: number;
  discount: number;
  tax: number;
  status: string;
  createdAt: string;
  customerId?: {
    name: string;
    phone: string;
    membershipType?: string;
  };
  cashierId?: {
    name: string;
  };
  storeId?: {
    name: string;
  };
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  payments: Array<{
    method: string;
    amount: number;
  }>;
}

const TodaysSales = () => {
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalDiscount: 0,
    completedSales: 0,
  });

  // Get today's date range
  const getTodayDateRange = () => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
    return { startOfDay, endOfDay };
  };

  const fetchStores = useCallback(async () => {
    try {
      const result = await getAllStores({ limit: 1000 });
      if (result.success && result.data) {
        setStores(result.data.stores || []);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  }, []);

  const fetchTodaysSales = useCallback(async () => {
    setLoading(true);
    try {
      const { startOfDay, endOfDay } = getTodayDateRange();

      const result = await getAllSales({
        startDate: startOfDay,
        endDate: endOfDay,
        search: searchQuery || undefined,
        storeId: selectedStore || undefined,
        limit: 1000,
      });

      if (result.success && result.data) {
        setSales(result.data.sales || []);
      } else {
        toast.error(result.error || "Failed to fetch today's sales");
      }
    } catch (error) {
      console.error("Error fetching today's sales:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedStore]);

  const fetchTodaysStats = useCallback(async () => {
    try {
      const { startOfDay, endOfDay } = getTodayDateRange();

      const result = await getSalesStats({
        startDate: startOfDay,
        endDate: endOfDay,
        storeId: selectedStore || undefined,
      });

      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Error fetching today's stats:", error);
    }
  }, [selectedStore]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  useEffect(() => {
    fetchTodaysSales();
    fetchTodaysStats();
  }, [fetchTodaysSales, fetchTodaysStats]);

  const exportToCSV = () => {
    const csv = [
      ["Sale No", "Date", "Time", "Customer", "Total", "Status", "Cashier"],
      ...sales.map((sale) => [
        sale.saleNo,
        new Date(sale.createdAt).toLocaleDateString(),
        new Date(sale.createdAt).toLocaleTimeString(),
        sale.customerId?.name || "Walk-in",
        `$${sale.total.toFixed(2)}`,
        sale.status,
        sale.cashierId?.name || "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `todays-sales-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Today's sales exported successfully");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <MdCheckCircle className="text-green-500" />;
      case "refunded":
        return <MdCancel className="text-red-500" />;
      case "partially_refunded":
        return <MdWarning className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-300";
      case "refunded":
        return "bg-red-100 text-red-700 border-red-300";
      case "partially_refunded":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  // Show skeleton while loading
  if (loading) {
    return <SalesListSkeleton isDarkMode={isDarkMode} />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1
          className={`text-3xl font-bold mb-2 ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Today's Sales
        </h1>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div
          className={`p-4 rounded-2xl shadow-sm ${
            isDarkMode
              ? "bg-gray-800 shadow-lg shadow-gray-900/20"
              : "bg-white shadow-xl shadow-slate-200/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total Sales
              </p>
              <p
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {stats.totalSales}
              </p>
            </div>
            <MdShoppingCart className="text-4xl text-blue-500" />
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl shadow-sm ${
            isDarkMode
              ? "bg-gray-800 shadow-lg shadow-gray-900/20"
              : "bg-white shadow-xl shadow-slate-200/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total Revenue
              </p>
              <p
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
              >
                ${stats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <MdAttachMoney className="text-4xl text-green-500" />
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl shadow-sm ${
            isDarkMode
              ? "bg-gray-800 shadow-lg shadow-gray-900/20"
              : "bg-white shadow-xl shadow-slate-200/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total Discount
              </p>
              <p
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-orange-400" : "text-orange-600"
                }`}
              >
                ${stats.totalDiscount.toFixed(2)}
              </p>
            </div>
            <MdAttachMoney className="text-4xl text-orange-500" />
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl shadow-sm ${
            isDarkMode
              ? "bg-gray-800 shadow-lg shadow-gray-900/20"
              : "bg-white shadow-xl shadow-slate-200/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Completed
              </p>
              <p
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              >
                {stats.completedSales}
              </p>
            </div>
            <MdCheckCircle className="text-4xl text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div
        className={`p-6 rounded-2xl shadow-sm mb-6 ${
          isDarkMode
            ? "bg-gray-800 shadow-lg shadow-gray-900/20"
            : "bg-white shadow-xl shadow-slate-200/50"
        }`}
      >
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by sale number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              />
            </div>
          </div>

          {/* Store Filter */}
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

          {/* Action Buttons */}
          <button
            onClick={() => {
              fetchTodaysSales();
              fetchTodaysStats();
            }}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
          >
            <MdRefresh />
            Refresh
          </button>

          <button
            onClick={exportToCSV}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
          >
            <MdFileDownload />
            Export
          </button>
        </div>
      </div>

      {/* Sales Table */}
      <div
        className={`rounded-2xl shadow-sm overflow-hidden ${
          isDarkMode
            ? "bg-gray-800 shadow-lg shadow-gray-900/20"
            : "bg-white shadow-xl shadow-slate-200/50"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              className={
                isDarkMode ? "bg-gray-700 text-gray-100" : "bg-gray-100 text-gray-900"
              }
            >
              <tr>
                <th className="px-4 py-3 text-left">Sale No</th>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Store</th>
                <th className="px-4 py-3 text-left">Items</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <p
                      className={
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }
                    >
                      No sales found for today
                    </p>
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr
                    key={sale._id}
                    className={`border-t ${
                      isDarkMode
                        ? "border-gray-700 hover:bg-gray-750"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`font-semibold ${
                          isDarkMode ? "text-indigo-400" : "text-indigo-600"
                        }`}
                      >
                        {sale.saleNo}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MdCalendarToday className="text-gray-400" />
                        <span
                          className={
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }
                        >
                          {new Date(sale.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {sale.customerId ? (
                        <div>
                          <div className="flex items-center gap-2">
                            <MdPerson className="text-gray-400" />
                            <span
                              className={
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }
                            >
                              {sale.customerId.name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {sale.customerId.phone}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">Walk-in</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MdStore className="text-gray-400" />
                        <span
                          className={
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }
                        >
                          {sale.storeId?.name || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }
                      >
                        {sale.items.length} item(s)
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-bold text-lg ${
                          isDarkMode ? "text-green-400" : "text-green-600"
                        }`}
                      >
                        ${sale.total.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          sale.status
                        )}`}
                      >
                        {getStatusIcon(sale.status)}
                        {sale.status.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => router.push(`/sales/${sale._id}`)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="View"
                        >
                          <MdVisibility className="text-xl" />
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/sales/edit-sale/${sale._id}`)
                          }
                          className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                          title="Edit"
                        >
                          <MdEdit className="text-xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TodaysSales;
