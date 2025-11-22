"use client";
import { useSidebar } from "@/lib/SidebarContext";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  MdArrowBack,
  MdSearch,
  MdAdd,
  MdRemove,
  MdSave,
  MdLocationOn,
  MdSettings,
} from "react-icons/md";

interface Product {
  _id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  stock: number;
  price: number;
}

const StockAdjustments = () => {
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedStore, setSelectedStore] = useState("");
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add");
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState("");
  const [location, setLocation] = useState("");
  const [minStock, setMinStock] = useState(10);
  const [maxStock, setMaxStock] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

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

  const searchProducts = async () => {
    if (!searchQuery || searchQuery.length < 2) return;

    setSearchLoading(true);
    try {
      const response = await api.get(`/products?search=${searchQuery}&limit=10`);
      setProducts(response.data.products || []);
    } catch (error: any) {
      console.error("Error searching products:", error);
      toast.error("Failed to search products");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setProducts([]);
    setSearchQuery("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct || !selectedStore || quantity === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const adjustmentQty = adjustmentType === "add" ? quantity : -quantity;

      await api.post("/inventory/adjust", {
        productId: selectedProduct._id,
        storeId: selectedStore,
        adjustment: adjustmentQty,
        reason,
        location,
        minStock,
        maxStock,
      });

      toast.success(`Stock ${adjustmentType === "add" ? "added" : "removed"} successfully!`);
      
      // Reset form
      setSelectedProduct(null);
      setQuantity(0);
      setReason("");
      setLocation("");
      setMinStock(10);
      setMaxStock(1000);
    } catch (error: any) {
      console.error("Error adjusting stock:", error);
      toast.error(error.response?.data?.message || "Failed to adjust stock");
    } finally {
      setLoading(false);
    }
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
          Stock Adjustments
        </h1>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
          Manually adjust inventory levels
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Adjustment Form */}
        <div
          className={`rounded-lg border-2 p-6 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-bold mb-4 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Create Adjustment
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Store Selection */}
            <div className="mb-4">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Store *
              </label>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                required
                className={`w-full px-4 py-2 rounded-lg border-2 ${
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
            </div>

            {/* Product Search */}
            <div className="mb-4">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Search Product *
              </label>
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, SKU, or barcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), searchProducts())}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                />
                {searchLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  </div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {products.length > 0 && (
                <div
                  className={`mt-2 border rounded-lg overflow-hidden ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {products.map((product) => (
                    <button
                      key={product._id}
                      type="button"
                      onClick={() => handleProductSelect(product)}
                      className={`w-full px-4 py-3 text-left hover:bg-opacity-80 ${
                        isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-50"
                      }`}
                    >
                      <p
                        className={`font-semibold ${
                          isDarkMode ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        SKU: {product.sku} | Current Stock: {product.stock || 0}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Product Display */}
            {selectedProduct && (
              <div
                className={`p-4 rounded-lg mb-4 ${
                  isDarkMode ? "bg-gray-700" : "bg-indigo-50"
                }`}
              >
                <p className="text-sm text-indigo-600 font-semibold mb-1">
                  Selected Product
                </p>
                <p
                  className={`font-bold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {selectedProduct.name}
                </p>
                <p className="text-xs text-gray-500">
                  SKU: {selectedProduct.sku} | Current Stock: {selectedProduct.stock || 0}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="text-xs text-red-600 hover:text-red-700 mt-2"
                >
                  Remove Selection
                </button>
              </div>
            )}

            {/* Adjustment Type */}
            <div className="mb-4">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Adjustment Type *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustmentType("add")}
                  className={`px-4 py-3 rounded-lg border-2 font-semibold flex items-center justify-center gap-2 ${
                    adjustmentType === "add"
                      ? "bg-green-600 border-green-600 text-white"
                      : isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-300"
                      : "bg-gray-50 border-gray-300 text-gray-700"
                  }`}
                >
                  <MdAdd className="text-xl" />
                  Add Stock
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustmentType("remove")}
                  className={`px-4 py-3 rounded-lg border-2 font-semibold flex items-center justify-center gap-2 ${
                    adjustmentType === "remove"
                      ? "bg-red-600 border-red-600 text-white"
                      : isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-300"
                      : "bg-gray-50 border-gray-300 text-gray-700"
                  }`}
                >
                  <MdRemove className="text-xl" />
                  Remove Stock
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Quantity *
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.abs(parseInt(e.target.value) || 0))}
                min="0"
                required
                className={`w-full px-4 py-2 rounded-lg border-2 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              />
            </div>

            {/* Location */}
            <div className="mb-4">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Storage Location
              </label>
              <div className="relative">
                <MdLocationOn className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g., Shelf A1, Warehouse 2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                />
              </div>
            </div>

            {/* Min/Max Stock */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Min Stock
                </label>
                <input
                  type="number"
                  value={minStock}
                  onChange={(e) => setMinStock(parseInt(e.target.value) || 0)}
                  min="0"
                  className={`w-full px-4 py-2 rounded-lg border-2 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Max Stock
                </label>
                <input
                  type="number"
                  value={maxStock}
                  onChange={(e) => setMaxStock(parseInt(e.target.value) || 0)}
                  min="0"
                  className={`w-full px-4 py-2 rounded-lg border-2 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                />
              </div>
            </div>

            {/* Reason */}
            <div className="mb-6">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Reason for Adjustment
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Damaged goods, Theft, Count correction, Returned items"
                rows={3}
                className={`w-full px-4 py-2 rounded-lg border-2 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !selectedProduct}
              className={`w-full px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                loading || !selectedProduct
                  ? "bg-gray-400 cursor-not-allowed"
                  : adjustmentType === "add"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <MdSave />
                  {adjustmentType === "add" ? "Add Stock" : "Remove Stock"}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Information Panel */}
        <div className="space-y-6">
          {/* Quick Guide */}
          <div
            className={`rounded-lg border-2 p-6 ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h3
              className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              <MdSettings className="text-indigo-500" />
              Quick Guide
            </h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-green-600 mb-1">Add Stock</p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Use when receiving new inventory, returns, or corrections for
                  undercount.
                </p>
              </div>
              <div>
                <p className="font-semibold text-red-600 mb-1">Remove Stock</p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Use for damaged items, theft, spoilage, or corrections for
                  overcount.
                </p>
              </div>
              <div>
                <p className="font-semibold text-orange-600 mb-1">
                  Min/Max Stock
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Set minimum and maximum stock levels to trigger alerts.
                </p>
              </div>
            </div>
          </div>

          {/* Common Reasons */}
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
              Common Reasons
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Damaged",
                "Expired",
                "Theft",
                "Lost",
                "Count Correction",
                "Return to Supplier",
                "Customer Return",
                "Stock Transfer",
                "Initial Stock",
                "Promotion",
              ].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    reason === r
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : isDarkMode
                      ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockAdjustments;

