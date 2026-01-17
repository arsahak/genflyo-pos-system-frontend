"use client";
import { useLanguage } from "@/lib/LanguageContext";
import { getTranslation } from "@/lib/translations";
import {
  FaCapsules,
  FaFlask,
  FaPills,
  FaSyringe,
  FaTablets,
} from "react-icons/fa";
import {
  MdAdd,
  MdCategory,
  MdInventory,
  MdMedicalServices,
  MdQrCodeScanner,
  MdSearch,
} from "react-icons/md";
import { Product } from "./types";

interface POSProductsProps {
  isDarkMode: boolean;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  barcodeInput: string;
  setBarcodeInput: (val: string) => void;
  handleBarcodeScanned: (val: string) => void;
  scannerActive: boolean;
  setScannerActive: (val: boolean) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  barcodeInputRef: React.RefObject<HTMLInputElement | null>;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  isLoadingProducts: boolean;
  filteredProducts: Product[];
  addToCart: (product: Product) => void;
}

export const POSProducts = ({
  isDarkMode,
  searchQuery,
  setSearchQuery,
  barcodeInput,
  setBarcodeInput,
  handleBarcodeScanned,
  scannerActive,
  setScannerActive,
  searchInputRef,
  barcodeInputRef,
  categories,
  selectedCategory,
  setSelectedCategory,
  isLoadingProducts,
  filteredProducts,
  addToCart,
}: POSProductsProps) => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(key, language);

  const getCategoryIcon = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes("tablet") || lower.includes("pill"))
      return <FaTablets />;
    if (lower.includes("capsule")) return <FaCapsules />;
    if (lower.includes("injection") || lower.includes("syringe"))
      return <FaSyringe />;
    if (lower.includes("syrup") || lower.includes("liquid")) return <FaFlask />;
    return <FaPills />;
  };

  const isExpired = (product: Product) => {
    if (!product.hasExpiry || !product.expiryDate) return false;
    return new Date(product.expiryDate) < new Date();
  };

  const formatCurrency = (amount: number) => `৳${amount.toFixed(2)}`;

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0 relative overflow-hidden">
      {/* Search & Barcode - Floating Bar */}
      <div className="p-4 pb-0 z-10">
        <div
          className={`flex gap-3 p-2 rounded-2xl border shadow-sm ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100 shadow-slate-200/50"
          }`}
        >
          {/* Search */}
          <div className="flex-1 relative group">
            <MdSearch
              className={`absolute left-3 top-1/2 -translate-y-1/2 text-xl transition-colors ${
                isDarkMode
                  ? "text-gray-500 group-focus-within:text-indigo-400"
                  : "text-gray-400 group-focus-within:text-indigo-500"
              }`}
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={t("searchMedicinePlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-transparent focus:outline-none transition-all placeholder:text-gray-400 ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              }`}
            />
          </div>

          {/* Barcode Scanner */}
          <div className="w-64 relative group border-l border-gray-200 dark:border-gray-700 pl-3">
            <MdQrCodeScanner
              className={`absolute left-6 top-1/2 -translate-y-1/2 text-xl transition-all duration-300 ${
                scannerActive
                  ? "text-indigo-500 animate-pulse scale-110"
                  : isDarkMode
                  ? "text-gray-500 group-focus-within:text-indigo-400"
                  : "text-gray-400 group-focus-within:text-indigo-500"
              }`}
            />
            <input
              ref={barcodeInputRef}
              type="text"
              placeholder={t("scanBarcodePlaceholder")}
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && barcodeInput.trim()) {
                  handleBarcodeScanned(barcodeInput);
                }
              }}
              onFocus={() => setScannerActive(true)}
              onBlur={() => setScannerActive(false)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-transparent focus:outline-none transition-all duration-300 placeholder:text-gray-400 border-2 border-transparent ${
                scannerActive 
                  ? "border-indigo-500/30 bg-indigo-500/5" 
                  : "hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
              } ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Categories - Pill Tabs */}
      <div className="px-4 py-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all transform active:scale-95 ${
              selectedCategory === "all"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-600 ring-offset-2 ring-offset-slate-50 dark:ring-offset-gray-900"
                : isDarkMode
                ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                : "bg-white text-gray-600 shadow-sm hover:bg-white hover:text-indigo-600 hover:shadow-md"
            }`}
          >
            <MdCategory /> {t("allProducts")}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all transform active:scale-95 ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-600 ring-offset-2 ring-offset-slate-50 dark:ring-offset-gray-900"
                  : isDarkMode
                  ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  : "bg-white text-gray-600 shadow-sm hover:bg-white hover:text-indigo-600 hover:shadow-md"
              }`}
            >
              {getCategoryIcon(category)}
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 min-h-0 px-4 pb-4 overflow-y-auto custom-scrollbar">
        {isLoadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className={`p-3 rounded-2xl animate-pulse flex flex-col ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                {/* Image Skeleton */}
                <div
                  className={`w-full aspect-[4/3] rounded-xl mb-3 ${
                    isDarkMode ? "bg-gray-700" : "bg-slate-200"
                  }`}
                />
                
                {/* Content Skeleton */}
                <div className="flex-1 flex flex-col gap-2">
                  <div
                    className={`h-4 w-3/4 rounded ${
                      isDarkMode ? "bg-gray-700" : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`h-3 w-1/2 rounded ${
                      isDarkMode ? "bg-gray-700" : "bg-slate-200"
                    }`}
                  />
                  
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div
                      className={`h-6 w-1/3 rounded ${
                        isDarkMode ? "bg-gray-700" : "bg-slate-200"
                      }`}
                    />
                    <div
                      className={`w-8 h-8 rounded-full ${
                        isDarkMode ? "bg-gray-700" : "bg-slate-200"
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex items-center justify-center h-full opacity-60">
            <div className="text-center">
              <div
                className={`p-6 rounded-full mb-4 inline-block ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                }`}
              >
                <MdInventory className="text-4xl text-gray-400" />
              </div>
              <p
                className={`text-lg font-medium ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {t("noProductsFound")}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => !isExpired(product) && addToCart(product)}
                className={`group relative flex flex-col p-3 rounded-2xl transition-all duration-300 ease-out cursor-pointer overflow-hidden ${
                  isExpired(product)
                    ? "opacity-60 grayscale"
                    : isDarkMode
                    ? "bg-gray-800 hover:bg-gray-750 hover:shadow-xl hover:shadow-indigo-900/10"
                    : "bg-white hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1"
                }`}
              >
                {/* Image Area */}
                <div
                  className={`relative w-full aspect-[4/3] rounded-xl mb-3 overflow-hidden flex items-center justify-center ${
                    product.image
                      ? "bg-transparent"
                      : isDarkMode
                      ? "bg-gray-700"
                      : "bg-slate-100"
                  }`}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <MdMedicalServices
                      className={`text-4xl ${
                        isDarkMode ? "text-gray-600" : "text-indigo-200"
                      }`}
                    />
                  )}

                  {/* Stock Badge - Floating */}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`px-2 py-1 text-[10px] font-bold rounded-full backdrop-blur-md shadow-sm border border-white/10 ${
                        product.stock <= 0
                          ? "bg-red-500/90 text-white"
                          : product.isLowStock
                          ? "bg-amber-500/90 text-white"
                          : isDarkMode
                          ? "bg-black/40 text-white"
                          : "bg-white/90 text-slate-700"
                      }`}
                    >
                      {product.stock} {product.unit}
                    </span>
                  </div>

                  {/* RX Badge */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {product.isPrescription && (
                      <span
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-red-50 text-red-600 border border-red-100 shadow-sm text-xs font-bold font-serif"
                        title="Prescription Required"
                      >
                        Rx
                      </span>
                    )}
                  </div>

                  {/* Shelf/Rack Badge - Bottom Left */}
                  {product.shelf && (
                    <div className="absolute bottom-2 left-2">
                      <span
                        className={`px-2 py-1 text-[10px] font-bold rounded-full backdrop-blur-md shadow-sm border border-white/10 ${
                          isDarkMode
                            ? "bg-indigo-600/90 text-white"
                            : "bg-indigo-500/90 text-white"
                        }`}
                      >
                        📍 {product.shelf}
                      </span>
                    </div>
                  )}

                  {/* Expired Overlay */}
                  {isExpired(product) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[1px]">
                      <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg shadow-lg rotate-12 transform">
                        {t("expired")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <h3
                    className={`font-semibold text-sm leading-snug line-clamp-2 mb-1 ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-1">
                    {product.genericName && (
                      <span className="text-[10px] text-gray-400 truncate max-w-[70%]">
                        {product.genericName}
                      </span>
                    )}
                    {product.strength && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          isDarkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {product.strength}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <span
                      className={`text-lg font-bold ${
                        isDarkMode ? "text-indigo-400" : "text-indigo-600"
                      }`}
                    >
                      {formatCurrency(product.price)}
                    </span>

                    {/* Hover Add Button */}
                    <button
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isDarkMode
                          ? "bg-gray-700 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white"
                          : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
                      }`}
                    >
                      <MdAdd />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
