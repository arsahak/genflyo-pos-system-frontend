"use client";

import { createBarcode, generateBarcode } from "@/app/actions/barcode";
import { printBarcode } from "@/lib/printUtils";
import { useSidebar } from "@/lib/SidebarContext";
import { getTranslation } from "@/lib/translations";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { BiBarcodeReader } from "react-icons/bi";
import { MdAdd, MdClose, MdPrint, MdSearch } from "react-icons/md";

interface Product {
  _id: string;
  name: string;
  sku: string;
  price: number;
  barcode?: string;
}

interface BarcodeGeneratorProps {
  products: Product[];
  language: "en" | "bn";
}

export default function BarcodeGenerator({ products, language }: BarcodeGeneratorProps) {
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedProduct, setSelectedProduct] = useState("");
  const [generatedBarcode, setGeneratedBarcode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Auto-load existing barcode
  useEffect(() => {
    if (selectedProduct) {
      const product = products.find(p => p._id === selectedProduct);
      if (product?.barcode) {
        setGeneratedBarcode(product.barcode);
      } else {
        setGeneratedBarcode("");
      }
    } else {
      setGeneratedBarcode("");
    }
  }, [selectedProduct, products]);

  const selectedProductObj = products.find(p => p._id === selectedProduct);
  const isExistingBarcode = selectedProductObj?.barcode === generatedBarcode && !!generatedBarcode;

  const handleGenerate = async () => {
    if (!selectedProduct) {
      toast.error(getTranslation("pleaseSelectProduct", language));
      return;
    }

    setIsGenerating(true);
    const result = await generateBarcode(selectedProduct);

    if (result.success) {
      setGeneratedBarcode(result.data.barcode);
      toast.success(getTranslation("barcodeGeneratedSuccess", language));
    } else {
      toast.error(result.error || getTranslation("failedToGenerateBarcode", language));
    }
    setIsGenerating(false);
  };

  const handleSave = async () => {
    if (!generatedBarcode || !selectedProduct) {
      toast.error(getTranslation("pleaseGenerateFirst", language));
      return;
    }

    // Prevent saving if it's the same existing barcode
    if (isExistingBarcode) {
        toast.error("This barcode is already saved for this product.");
        return;
    }

    setIsSaving(true);
    const result = await createBarcode({
      barcode: generatedBarcode,
      productId: selectedProduct,
      type: "EAN13",
    });

    if (result.success) {
      toast.success(getTranslation("barcodeSavedSuccess", language));
      // update effectively happens via router refresh
      startTransition(() => {
        router.refresh();
      });
    } else {
      toast.error(result.error || getTranslation("failedToSaveBarcode", language));
    }
    setIsSaving(false);
  };

  const handlePrint = () => {
    const product = products.find((p) => p._id === selectedProduct);
    if (product && generatedBarcode) {
      printBarcode(generatedBarcode, product.name, product.price);
    }
  };

  return (
    <div
      className={`rounded-lg border p-6 ${
        isDarkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <h3
        className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
          isDarkMode ? "text-gray-100" : "text-gray-900"
        }`}
      >
        <BiBarcodeReader className="w-5 h-5 text-blue-500" />
        {getTranslation("generateNewBarcode", language)}
      </h3>

      <div className="space-y-4">
        {/* Product Selection */}
          <div className="relative">
             <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {getTranslation("selectProduct", language)}
            </label>
            
            <div className="relative">
              <MdSearch className={`absolute left-3 top-1/2 -translate-y-1/2 text-lg ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedProduct(""); // Clear selection on type
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder={getTranslation("searchByBarcode", language) || "Search product by name or SKU..."}
                className={`w-full pl-10 pr-10 py-2 rounded-lg border transition-colors ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
              />
              {selectedProduct && (
                 <button 
                   onClick={() => {
                     setSearchTerm("");
                     setSelectedProduct("");
                   }}
                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
                 >
                   <MdClose />
                 </button>
              )}
            </div>

            {/* Dropdown Suggestions */}
            {isDropdownOpen && searchTerm && !selectedProduct && (
              <div className={`absolute z-20 w-full mt-1 rounded-lg border shadow-lg max-h-60 overflow-y-auto ${
                 isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}>
                 {products
                   .filter(p => 
                      (p.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
                      (p.sku?.toLowerCase() || "").includes(searchTerm.toLowerCase())
                   )
                   .map(product => (
                     <button
                       key={product._id}
                       onClick={() => {
                         setSelectedProduct(product._id);
                         setSearchTerm(product.name);
                         setIsDropdownOpen(false);
                       }}
                       className={`w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-b last:border-0 ${
                         isDarkMode ? "border-gray-700 text-gray-200" : "border-gray-100 text-gray-800"
                       }`}
                     >
                       <div className="font-medium">{product.name}</div>
                       <div className="text-xs text-gray-500">
                           sku: {product.sku || "N/A"}
                           {product.barcode && <span className="ml-2 text-green-500 font-bold text-[10px]">(Has Barcode)</span>}
                       </div>
                     </button>
                   ))}
                   {/* Empty State */}
                   {products.filter(p => 
                      (p.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
                      (p.sku?.toLowerCase() || "").includes(searchTerm.toLowerCase())
                   ).length === 0 && (
                      <div className="p-4 text-center text-sm text-gray-500">
                         No products found
                      </div>
                   )}
              </div>
            )}
          </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!selectedProduct || isGenerating}
          className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
        >
          <BiBarcodeReader className="w-5 h-5" />
          {isGenerating ? getTranslation("generating", language) : (isExistingBarcode ? "Regenerate Barcode" : getTranslation("generateBarcode", language))}
        </button>

        {/* Generated Barcode Display */}
        {generatedBarcode && (
          <div
            className={`mt-6 p-4 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700/50 border-gray-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <p
              className={`text-sm font-medium mb-2 flex justify-between ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <span>{getTranslation("generatedBarcode", language)}</span>
              {isExistingBarcode && <span className="text-green-500 font-bold bg-green-100 dark:bg-green-900/30 px-2 rounded text-xs py-0.5">Already Saved</span>}
            </p>
            <div className="flex items-center justify-center py-6 bg-white rounded-lg border">
              <div className="text-center">
                 <p className="text-xs text-gray-500 mb-1">Print to see barcode bars</p>
                 <span className="text-3xl font-mono font-bold tracking-widest text-black">
                  {generatedBarcode}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={isSaving || isExistingBarcode}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDarkMode
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                <MdAdd className="w-5 h-5" />
                {isSaving ? getTranslation("saving", language) : (isExistingBarcode ? "Saved" : getTranslation("saveBarcode", language))}
              </button>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDarkMode
                    ? "bg-gray-600 hover:bg-gray-500 text-white"
                    : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
                } flex items-center justify-center gap-2`}
                title={getTranslation("print", language)}
              >
                <MdPrint className="w-5 h-5" />
                {getTranslation("print", language)}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div
        className={`mt-6 p-4 rounded-lg ${
          isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
        }`}
      >
        <p
          className={`text-sm ${
            isDarkMode ? "text-blue-300" : "text-blue-800"
          }`}
        >
          <strong>{getTranslation("note", language) || "Note"}:</strong> {getTranslation("barcodeNote", language)}
        </p>
      </div>
    </div>
  );
}
