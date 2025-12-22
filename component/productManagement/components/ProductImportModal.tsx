import { MdClose, MdDescription, MdFileUpload } from "react-icons/md";

interface ProductImportModalProps {
  isDarkMode: boolean;
  showImportModal: boolean;
  setShowImportModal: (val: boolean) => void;
  importFile: File | null;
  setImportFile: (file: File | null) => void;
  importing: boolean;
  handleImportCSV: () => void;
  handleDownloadTemplate: () => void;
}

export const ProductImportModal = ({
  isDarkMode,
  showImportModal,
  setShowImportModal,
  importFile,
  setImportFile,
  importing,
  handleImportCSV,
  handleDownloadTemplate,
}: ProductImportModalProps) => {
  if (!showImportModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl transition-all scale-100 ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        {/* Header */}
        <div className="relative p-6 pb-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl ${
                  isDarkMode
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "bg-indigo-50 text-indigo-600"
                }`}
              >
                <MdFileUpload className="text-2xl" />
              </div>
              <div>
                <h2
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Import Products
                </h2>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Upload CSV file to bulk import products
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowImportModal(false);
                setImportFile(null);
              }}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode
                  ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
              }`}
            >
              <MdClose size={24} />
            </button>
          </div>
          <div
            className={`h-px w-full mt-4 ${
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
          />
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div
            className={`p-4 rounded-2xl border ${
              isDarkMode
                ? "bg-blue-900/10 border-blue-900/30 text-blue-200"
                : "bg-blue-50 border-blue-100 text-blue-800"
            }`}
          >
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <MdDescription size={20} />
              Instructions
            </h3>
            <ul className="text-sm space-y-1 ml-6 list-disc opacity-80">
              <li>Download the CSV template to see the required format</li>
              <li>Fill in your product data following the template structure</li>
              <li>Required fields: Name, Category, Price, Stock, Unit</li>
              <li>
                Use TRUE/FALSE for boolean fields (HasExpiry, IsFeatured,
                IsActive)
              </li>
              <li>Date format for ExpiryDate: YYYY-MM-DD</li>
              <li>Maximum file size: 5MB</li>
            </ul>
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <label
              className={`block text-sm font-semibold ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Select CSV File
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer group">
                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                    importFile
                      ? isDarkMode
                        ? "border-green-500/50 bg-green-500/10"
                        : "border-green-500 bg-green-50"
                      : isDarkMode
                      ? "border-gray-700 hover:border-indigo-500/50 hover:bg-gray-800"
                      : "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50/30"
                  }`}
                >
                  {importFile ? (
                    <div className="space-y-2">
                      <MdDescription className="mx-auto text-green-500 text-4xl" />
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-green-400" : "text-green-700"
                        }`}
                      >
                        {importFile.name}
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-green-500/70" : "text-green-600"
                        }`}
                      >
                        {(importFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <MdFileUpload
                        className={`mx-auto text-4xl transition-colors ${
                          isDarkMode
                            ? "text-gray-600 group-hover:text-indigo-400"
                            : "text-gray-400 group-hover:text-indigo-500"
                        }`}
                      />
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Click to select CSV file or drag and drop
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        CSV files only (max 5MB)
                      </p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImportFile(file);
                    }
                  }}
                  className="hidden"
                  disabled={importing}
                />
              </label>
            </div>

            {importFile && (
              <div className="flex justify-end">
                <button
                  onClick={() => setImportFile(null)}
                  className="text-sm text-red-500 hover:text-red-600 font-medium"
                  disabled={importing}
                >
                  Remove file
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div
            className={`flex items-center justify-between pt-6 border-t ${
              isDarkMode ? "border-gray-800" : "border-gray-100"
            }`}
          >
            <button
              onClick={handleDownloadTemplate}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isDarkMode
                  ? "text-indigo-400 hover:text-indigo-300"
                  : "text-indigo-600 hover:text-indigo-800"
              }`}
              disabled={importing}
            >
              <MdDescription size={18} />
              Download Template
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                }}
                className={`px-6 py-2.5 rounded-xl font-medium transition-colors ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                disabled={importing}
              >
                Cancel
              </button>
              <button
                onClick={handleImportCSV}
                disabled={!importFile || importing}
                className="px-6 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {importing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Importing...
                  </>
                ) : (
                  <>
                    <MdFileUpload size={18} />
                    Import Products
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
