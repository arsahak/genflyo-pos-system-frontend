import Link from "next/link";
import { MdDelete, MdEdit, MdInventory, MdNavigateBefore, MdNavigateNext, MdWarning } from "react-icons/md";
import { Pagination, Product } from "../types";

interface ProductTableProps {
  isDarkMode: boolean;
  loading: boolean;
  products: Product[];
  pagination: Pagination;
  handlePageChange: (page: number) => void;
  canEditProducts: boolean;
  canDeleteProducts: boolean;
  handleDelete: (id: string, name: string) => void;
}

export const ProductTable = ({
  isDarkMode,
  loading,
  products,
  pagination,
  handlePageChange,
  canEditProducts,
  canDeleteProducts,
  handleDelete,
}: ProductTableProps) => {
  
  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center py-20 rounded-2xl ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed ${
        isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-300"
      }`}>
        <div className={`p-6 rounded-full mb-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
          <MdInventory className={`text-4xl ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} />
        </div>
        <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>No products found</h3>
        <p className={`text-center max-w-sm ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
          Try adjusting your filters or add a new product to get started.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl overflow-hidden shadow-xl border ${
      isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`text-left text-xs font-semibold uppercase tracking-wider ${
              isDarkMode ? "bg-gray-900/50 text-gray-400" : "bg-gray-50/80 text-gray-500"
            }`}>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
            {products.map((product) => (
              <tr 
                key={product._id} 
                className={`group transition-colors ${
                  isDarkMode 
                    ? "hover:bg-gray-700/50" 
                    : "hover:bg-indigo-50/30"
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 ${
                      isDarkMode ? "bg-gray-700" : "bg-slate-100"
                    }`}>
                      {product.mainImage?.url ? (
                        <img
                          src={product.mainImage.url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <MdInventory className={isDarkMode ? "text-gray-500" : "text-gray-400"} size={20} />
                      )}
                    </div>
                    <div>
                      <div className={`font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                        {product.name}
                      </div>
                      <div className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                        {product.sku || product.barcode || "No ID"}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium ${
                    isDarkMode 
                      ? "bg-gray-700 text-gray-300 border border-gray-600" 
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}>
                    {product.category}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className={`font-bold font-mono ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                    ${product.price.toFixed(2)}
                  </div>
                  {product.cost && (
                    <div className="text-xs text-gray-400">
                      Cost: ${product.cost.toFixed(2)}
                    </div>
                  )}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {product.stock} {product.unit}
                    </span>
                    {product.isLowStock && (
                      <MdWarning className="text-orange-500" title="Low Stock" />
                    )}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 items-start">
                    {product.isExpired && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-red-100 text-red-700 rounded-md border border-red-200">
                        Expired
                      </span>
                    )}
                    {!product.isExpired && product.isExpiringSoon && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-orange-100 text-orange-700 rounded-md border border-orange-200">
                        Expiring Soon
                      </span>
                    )}
                    {!product.isExpired && !product.isExpiringSoon && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-green-100 text-green-700 rounded-md border border-green-200">
                        Active
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2 transition-opacity">
                    <Link
                      href={`/products/${product._id}`}
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkMode 
                          ? "hover:bg-gray-600 text-gray-400 hover:text-indigo-400" 
                          : "hover:bg-indigo-50 text-gray-400 hover:text-indigo-600"
                      }`}
                      title="View Details"
                    >
                      <MdInventory size={18} />
                    </Link>
                    
                    {canEditProducts && (
                      <Link
                        href={`/products/${product._id}/edit`}
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode 
                            ? "hover:bg-gray-600 text-gray-400 hover:text-green-400" 
                            : "hover:bg-green-50 text-gray-400 hover:text-green-600"
                        }`}
                        title="Edit"
                      >
                        <MdEdit size={18} />
                      </Link>
                    )}
                    
                    {canDeleteProducts && (
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode 
                            ? "hover:bg-gray-600 text-gray-400 hover:text-red-400" 
                            : "hover:bg-red-50 text-gray-400 hover:text-red-600"
                        }`}
                        title="Delete"
                      >
                        <MdDelete size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination.totalPages > 1 && (
        <div className={`px-6 py-4 border-t flex items-center justify-between ${
          isDarkMode ? "border-gray-700 bg-gray-900/30" : "border-gray-100 bg-gray-50/50"
        }`}>
          <div className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
            Page <span className={`font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>{pagination.page}</span> of {pagination.totalPages}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`p-2 rounded-lg transition-all ${
                isDarkMode 
                  ? "hover:bg-gray-700 text-gray-400 disabled:opacity-30" 
                  : "hover:bg-gray-200 text-gray-600 disabled:opacity-30"
              }`}
            >
              <MdNavigateBefore size={24} />
            </button>
            <div className="flex gap-1">
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                 // Simple logic to show a window of pages could be improved for large numbers
                 // For now, just show first 5 or logic from original
                 let pageNum = i + 1;
                 if (pagination.page > 3 && pagination.totalPages > 5) {
                    pageNum = pagination.page - 2 + i;
                 }
                 if (pageNum > pagination.totalPages) return null;

                 return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                      pagination.page === pageNum
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                        : isDarkMode
                          ? "hover:bg-gray-700 text-gray-400"
                          : "hover:bg-gray-200 text-gray-600"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasMore}
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
      )}
    </div>
  );
};
