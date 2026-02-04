import { MdDelete, MdNavigateBefore, MdNavigateNext, MdPublic } from "react-icons/md";
import { SourcedItemSkeleton } from "./SourcedItemSkeleton";
import { Pagination, SourcedItem } from "./types";

interface Props {
  isDarkMode: boolean;
  loading: boolean;
  items: SourcedItem[];
  pagination: Pagination;
  setPage: (func: (p: number) => number) => void;
  onDelete: (id: string) => void;
}

export const SourcedItemTable = ({ isDarkMode, loading, items, pagination, setPage, onDelete }: Props) => {
  const formatCurrency = (amount: number) => `৳${amount.toFixed(2)}`;

  const containerClass = `rounded-2xl overflow-hidden shadow-xl border ${
    isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
  }`;

  if (loading) {
    return (
      <div className={containerClass}>
        <SourcedItemSkeleton isDarkMode={isDarkMode} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={containerClass}>
        <div className="flex flex-col items-center justify-center py-20">
          <div className={`p-6 rounded-full mb-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
            <MdPublic className={`text-4xl ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
          </div>
          <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>No items found</h3>
          <p className={isDarkMode ? "text-gray-500" : "text-gray-500"}>Try adjusting search or add new sourced items in POS.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`text-left text-xs font-semibold uppercase tracking-wider ${
              isDarkMode ? "bg-gray-900/50 text-gray-400" : "bg-gray-50/80 text-gray-500"
            }`}>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Product Info</th>
              <th className="px-6 py-4 text-center">Quantity</th>
              <th className="px-6 py-4 text-right">Cost</th>
              <th className="px-6 py-4 text-right">Selling Price</th>
              <th className="px-6 py-4 text-right">Profit</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
            {items.map((item) => (
              <tr key={item._id} className={`group transition-colors ${
                isDarkMode ? "hover:bg-gray-700/50" : "hover:bg-indigo-50/30"
              }`}>
                <td className="px-6 py-4">
                  <div className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">{new Date(item.date).toLocaleTimeString()}</div>
                </td>
                <td className="px-6 py-4">
                  <div className={`font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                    {item.productName}
                  </div>
                  {item.saleId && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        isDarkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-600"
                      }`}>
                        {item.saleId.saleNo}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center justify-center px-3 py-1 rounded-lg text-sm font-bold ${
                    isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
                  }`}>
                    {item.quantity}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className={`font-mono font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {formatCurrency(item.sourcingCost)}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className={`font-mono font-medium ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                    {formatCurrency(item.salePrice)}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className={`font-mono font-bold ${item.profit > 0 ? "text-green-500" : "text-red-500"}`}>
                    +{formatCurrency(item.profit)}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onDelete(item._id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode
                        ? "hover:bg-gray-600 text-gray-400 hover:text-red-400"
                        : "hover:bg-red-50 text-gray-400 hover:text-red-600"
                    }`}
                    title="Delete Record"
                  >
                    <MdDelete size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={`px-6 py-4 border-t flex items-center justify-between ${
        isDarkMode ? "border-gray-700 bg-gray-900/30" : "border-gray-100 bg-gray-50/50"
      }`}>
        <div className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
          Page <span className={`font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>{pagination.page}</span> of {pagination.pages}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={pagination.page === 1}
            className={`p-2 rounded-lg transition-all ${
              isDarkMode
                ? "hover:bg-gray-700 text-gray-400 disabled:opacity-30"
                : "hover:bg-gray-200 text-gray-600 disabled:opacity-30"
            }`}
          >
            <MdNavigateBefore size={24} />
          </button>

          <button
            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
            disabled={pagination.page >= pagination.pages}
            className={`p-2 rounded-lg transition-all ${
              isDarkMode
                ? "hover:bg-gray-700 text-gray-400 disabled:opacity-30"
                : "hover:bg-gray-200 text-gray-600 disabled:opacity-30"
            }`}
          >
            <MdNavigateNext size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
