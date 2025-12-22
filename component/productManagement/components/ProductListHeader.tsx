import Link from "next/link";
import { MdAdd, MdDescription, MdFileDownload, MdFileUpload } from "react-icons/md";

interface ProductListHeaderProps {
  isDarkMode: boolean;
  canAddProducts: boolean;
  setShowImportModal: (show: boolean) => void;
  handleExportCSV: () => void;
  handleDownloadTemplate: () => void;
}

export const ProductListHeader = ({
  isDarkMode,
  canAddProducts,
  setShowImportModal,
  handleExportCSV,
  handleDownloadTemplate,
}: ProductListHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className={`text-3xl font-bold mb-1 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
          Products
        </h1>
        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          Manage your inventory, track stock, and organize products.
        </p>
      </div>
      
      <div className="flex items-center gap-3 flex-wrap">
        <div className={`flex items-center p-1 rounded-xl border ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <button
            onClick={handleDownloadTemplate}
            className={`p-2 rounded-lg transition-all ${
              isDarkMode 
                ? "text-gray-400 hover:bg-gray-700 hover:text-gray-200" 
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
            title="Download Template"
          >
            <MdDescription size={20} />
          </button>
          <div className={`w-px h-6 mx-1 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
          <button
            onClick={handleExportCSV}
            className={`p-2 rounded-lg transition-all ${
              isDarkMode 
                ? "text-gray-400 hover:bg-gray-700 hover:text-green-400" 
                : "text-gray-500 hover:bg-gray-100 hover:text-green-600"
            }`}
            title="Export CSV"
          >
            <MdFileDownload size={20} />
          </button>
          {canAddProducts && (
            <>
              <div className={`w-px h-6 mx-1 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
              <button
                onClick={() => setShowImportModal(true)}
                className={`p-2 rounded-lg transition-all ${
                  isDarkMode 
                    ? "text-gray-400 hover:bg-gray-700 hover:text-blue-400" 
                    : "text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                }`}
                title="Import CSV"
              >
                <MdFileUpload size={20} />
              </button>
            </>
          )}
        </div>

        {canAddProducts && (
          <Link
            href="/products/add-new-product"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
          >
            <MdAdd size={20} />
            Add Product
          </Link>
        )}
      </div>
    </div>
  );
};
