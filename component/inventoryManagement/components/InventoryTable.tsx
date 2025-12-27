import { MdEdit, MdLocationOn, MdInventory } from "react-icons/md";

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

interface InventoryTableProps {
  isDarkMode: boolean;
  inventory: InventoryItem[];
  loading: boolean;
  onAdjustStock: (item: InventoryItem) => void;
}

const getStockStatus = (item: InventoryItem) => {
  if (item.quantity === 0) {
    return {
      label: "Out of Stock",
      color: "bg-red-100 text-red-700 border-red-200",
    };
  } else if (item.quantity <= item.minStock) {
    return {
      label: "Low Stock",
      color: "bg-orange-100 text-orange-700 border-orange-200",
    };
  } else if (item.quantity >= item.maxStock) {
    return {
      label: "Overstock",
      color: "bg-purple-100 text-purple-700 border-purple-200",
    };
  } else {
    return {
      label: "In Stock",
      color: "bg-green-100 text-green-700 border-green-200",
    };
  }
};

const getAvailable = (item: InventoryItem) => {
  return item.quantity - (item.reserved || 0);
};

export const InventoryTable = ({
  isDarkMode,
  inventory,
  loading,
  onAdjustStock,
}: InventoryTableProps) => {
  if (loading) {
    return (
      <div
        className={`flex flex-col items-center justify-center py-20 rounded-2xl ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
          Loading inventory...
        </p>
      </div>
    );
  }

  if (inventory.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed ${
          isDarkMode
            ? "bg-gray-800/50 border-gray-700"
            : "bg-white border-gray-300"
        }`}
      >
        <div
          className={`p-6 rounded-full mb-4 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <MdInventory
            className={`text-4xl ${
              isDarkMode ? "text-gray-600" : "text-gray-400"
            }`}
          />
        </div>
        <h3
          className={`text-xl font-bold mb-2 ${
            isDarkMode ? "text-gray-200" : "text-gray-800"
          }`}
        >
          No inventory items found
        </h3>
        <p
          className={`text-center max-w-sm ${
            isDarkMode ? "text-gray-500" : "text-gray-500"
          }`}
        >
          Try adjusting your filters or select a different store.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-xl border ${
        isDarkMode
          ? "bg-gray-800 border-gray-700 shadow-gray-900/20"
          : "bg-white border-gray-100 shadow-slate-200/50"
      }`}
    >
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
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4 text-center">In Stock</th>
              <th className="px-6 py-4 text-center">Reserved</th>
              <th className="px-6 py-4 text-center">Available</th>
              <th className="px-6 py-4 text-center">Min/Max</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Restocked</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              isDarkMode ? "divide-gray-700" : "divide-gray-100"
            }`}
          >
            {inventory.map((item) => {
              const status = getStockStatus(item);
              const available = getAvailable(item);

              return (
                <tr
                  key={item._id}
                  className={`group transition-colors ${
                    isDarkMode
                      ? "hover:bg-gray-700/50"
                      : "hover:bg-indigo-50/30"
                  }`}
                >
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
                          {item.productId.category}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`font-mono text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {item.productId.sku}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <MdLocationOn className="text-gray-400 text-sm" />
                      <span
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {item.location || "N/A"}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`font-bold text-lg ${
                        isDarkMode ? "text-indigo-400" : "text-indigo-600"
                      }`}
                    >
                      {item.quantity}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="text-orange-600 font-medium">
                      {item.reserved || 0}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`font-semibold ${
                        available <= 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {available}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {item.minStock || 0} / {item.maxStock || "∞"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold uppercase border ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </td>

                  <td className="px-6 py-4">
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

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => onAdjustStock(item)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode
                            ? "hover:bg-gray-600 text-gray-400 hover:text-green-400"
                            : "hover:bg-green-50 text-gray-400 hover:text-green-600"
                        }`}
                        title="Adjust Stock"
                      >
                        <MdEdit size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
