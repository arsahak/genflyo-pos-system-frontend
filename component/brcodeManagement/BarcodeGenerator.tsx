"use client";

import { createBarcode, generateBarcode } from "@/app/actions/barcode";
import { printBarcode } from "@/lib/printUtils";
import { useSidebar } from "@/lib/SidebarContext";
import { getTranslation } from "@/lib/translations";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { MdAdd, MdPrint } from "react-icons/md";
import { BiBarcodeReader } from "react-icons/bi";

interface Product {
  _id: string;
  name: string;
  sku: string;
  price: number;
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

    setIsSaving(true);
    const result = await createBarcode({
      barcode: generatedBarcode,
      productId: selectedProduct,
      type: "EAN13",
    });

    if (result.success) {
      toast.success(getTranslation("barcodeSavedSuccess", language));
      setGeneratedBarcode("");
      setSelectedProduct("");
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
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {getTranslation("selectProduct", language)}
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border transition-colors ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-100"
                : "bg-white border-gray-300 text-gray-900"
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
          >
            <option value="">{getTranslation("selectAProduct", language)}</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name} (SKU: {product.sku})
              </option>
            ))}
          </select>
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
          {isGenerating ? getTranslation("generating", language) : getTranslation("generateBarcode", language)}
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
              className={`text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {getTranslation("generatedBarcode", language)}
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
                disabled={isSaving}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDarkMode
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                <MdAdd className="w-5 h-5" />
                {isSaving ? getTranslation("saving", language) : getTranslation("saveBarcode", language)}
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
