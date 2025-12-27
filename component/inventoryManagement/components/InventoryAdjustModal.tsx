import { useState } from "react";
import { MdAdd, MdRemove, MdClose } from "react-icons/md";

interface Product {
  _id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  price: number;
  image?: string;
}

interface Store {
  _id: string;
  name: string;
}

interface InventoryItem {
  _id: string;
  productId: Product;
  storeId: Store;
  quantity: number;
  reserved: number;
  minStock: number;
  maxStock: number;
  location: string;
  lastRestocked: string;
  updatedAt: string;
}

interface InventoryAdjustModalProps {
  isDarkMode: boolean;
  show: boolean;
  item: InventoryItem | null;
  onClose: () => void;
  onSubmit: (adjustment: number, reason: string) => void;
}

export const InventoryAdjustModal = ({
  isDarkMode,
  show,
  item,
  onClose,
  onSubmit,
}: InventoryAdjustModalProps) => {
  const [adjustmentQty, setAdjustmentQty] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState("");

  if (!show || !item) return null;

  const handleSubmit = () => {
    onSubmit(adjustmentQty, adjustmentReason);
    setAdjustmentQty(0);
    setAdjustmentReason("");
  };

  const handleClose = () => {
    setAdjustmentQty(0);
    setAdjustmentReason("");
    onClose();
  };

  const newStock = item.quantity + adjustmentQty;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div
        className={`max-w-md w-full rounded-2xl shadow-2xl transform transition-all ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Adjust Stock
            </h2>
            <button
              onClick={handleClose}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "hover:bg-gray-700 text-gray-400"
                  : "hover:bg-gray-100 text-gray-500"
              }`}
            >
              <MdClose size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Product Info */}
          <div
            className={`p-4 rounded-xl border ${
              isDarkMode
                ? "bg-gray-700/50 border-gray-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <p
              className={`font-semibold text-lg mb-1 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {item.productId.name}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                SKU: {item.productId.sku}
              </p>
              <p
                className={`text-sm font-medium ${
                  isDarkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              >
                Current Stock: {item.quantity}
              </p>
            </div>
          </div>

          {/* Adjustment Input */}
          <div>
            <label
              className={`block text-sm font-medium mb-3 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Adjustment Quantity
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setAdjustmentQty(adjustmentQty - 1)}
                className="p-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all hover:shadow-lg"
              >
                <MdRemove size={20} />
              </button>
              <input
                type="number"
                value={adjustmentQty}
                onChange={(e) =>
                  setAdjustmentQty(parseInt(e.target.value) || 0)
                }
                className={`flex-1 px-4 py-3 rounded-xl border-2 text-center text-lg font-bold transition-colors ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
              />
              <button
                onClick={() => setAdjustmentQty(adjustmentQty + 1)}
                className="p-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all hover:shadow-lg"
              >
                <MdAdd size={20} />
              </button>
            </div>

            {/* New Stock Preview */}
            <div
              className={`mt-3 p-3 rounded-lg text-center ${
                newStock < 0
                  ? "bg-red-100 text-red-700"
                  : newStock > item.quantity
                  ? "bg-green-100 text-green-700"
                  : newStock < item.quantity
                  ? "bg-orange-100 text-orange-700"
                  : isDarkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <p className="text-sm font-medium">
                New Stock: {newStock}{" "}
                {adjustmentQty !== 0 && (
                  <span className="font-bold">
                    ({adjustmentQty > 0 ? "+" : ""}
                    {adjustmentQty})
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Reason Input */}
          <div>
            <label
              className={`block text-sm font-medium mb-3 ${
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
              className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
              } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex gap-3">
          <button
            onClick={handleClose}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
              isDarkMode
                ? "bg-gray-700 text-gray-100 hover:bg-gray-600"
                : "bg-gray-200 text-gray-900 hover:bg-gray-300"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={adjustmentQty === 0}
            className="flex-1 px-4 py-3 rounded-xl font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-green-500/30"
          >
            Apply Adjustment
          </button>
        </div>
      </div>
    </div>
  );
};
