"use client";
import { useSidebar } from "@/lib/SidebarContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getAllStores } from "@/app/actions/stores";
import { getAllInventory, getInventoryStats, adjustInventory } from "@/app/actions/inventory";
import {
  InventoryListSkeleton,
  InventoryStats,
  InventoryFilters,
  InventoryTable,
  InventoryAdjustModal,
} from "./components";

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
      const result = await getAllStores({});
      if (result.success && result.data?.stores) {
        setStores(result.data.stores);
        if (result.data.stores.length > 0) {
          setSelectedStore(result.data.stores[0]._id);
        }
      } else {
        toast.error(result.error || "Failed to fetch stores");
      }
    } catch (error: any) {
      console.error("Error fetching stores:", error);
      toast.error("Failed to fetch stores");
    }
  };

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const result = await getAllInventory({
        storeId: selectedStore,
        lowStock: filterLowStock || undefined,
        search: searchQuery || undefined,
      });

      if (result.success && result.data?.inventories) {
        setInventory(result.data.inventories);
      } else {
        toast.error(result.error || "Failed to fetch inventory");
        setInventory([]);
      }
    } catch (error: any) {
      console.error("Error fetching inventory:", error);
      toast.error("Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const result = await getInventoryStats(selectedStore);
      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSearch = () => {
    fetchInventory();
  };

  const handleAdjustStock = (item: InventoryItem) => {
    setAdjustingItem(item);
    setShowAdjustModal(true);
  };

  const submitAdjustment = async (adjustmentQty: number, adjustmentReason: string) => {
    if (!adjustingItem || adjustmentQty === 0) {
      toast.error("Please enter an adjustment quantity");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("productId", adjustingItem.productId._id);
      formData.append("storeId", adjustingItem.storeId._id);
      formData.append("adjustment", adjustmentQty.toString());
      formData.append("reason", adjustmentReason);
      formData.append("location", adjustingItem.location || "");
      formData.append("minStock", adjustingItem.minStock?.toString() || "0");
      formData.append("maxStock", adjustingItem.maxStock?.toString() || "0");

      const result = await adjustInventory(formData);

      if (!result.success) {
        toast.error(result.error || "Failed to adjust inventory");
        return;
      }

      toast.success(`Stock adjusted successfully (${adjustmentQty > 0 ? '+' : ''}${adjustmentQty})`);
      setShowAdjustModal(false);
      fetchInventory();
      fetchStats();
    } catch (error: any) {
      console.error("Error adjusting stock:", error);
      toast.error(error.response?.data?.message || "Failed to adjust stock");
    }
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

        {loading && inventory.length === 0 ? (
          <InventoryListSkeleton isDarkMode={isDarkMode} />
        ) : (
          <>
            <InventoryStats
              isDarkMode={isDarkMode}
              stats={stats}
              onLowStockClick={() => setFilterLowStock(true)}
            />

            <InventoryFilters
              isDarkMode={isDarkMode}
              selectedStore={selectedStore}
              stores={stores}
              searchQuery={searchQuery}
              filterLowStock={filterLowStock}
              onStoreChange={setSelectedStore}
              onSearchChange={setSearchQuery}
              onLowStockToggle={setFilterLowStock}
              onRefresh={handleSearch}
              onNavigateToAdjustments={() => router.push("/inventory/adjustments")}
              onNavigateToLowStock={() => router.push("/inventory/low-stock")}
            />

            <InventoryTable
              isDarkMode={isDarkMode}
              inventory={inventory}
              loading={loading}
              onAdjustStock={handleAdjustStock}
            />
          </>
        )}

        <InventoryAdjustModal
          isDarkMode={isDarkMode}
          show={showAdjustModal}
          item={adjustingItem}
          onClose={() => setShowAdjustModal(false)}
          onSubmit={submitAdjustment}
        />
      </div>
    </div>
  );
};

export default InventoryList;

