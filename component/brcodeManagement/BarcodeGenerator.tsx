"use client";

import { createBarcode, generateBarcode } from "@/app/actions/barcode";
import { useSidebar } from "@/lib/SidebarContext";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { MdAdd, MdQrCode2 } from "react-icons/md";

interface Product {
  _id: string;
  name: string;
  sku: string;
}

interface BarcodeGeneratorProps {
  products: Product[];
}

export default function BarcodeGenerator({ products }: BarcodeGeneratorProps) {
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedProduct, setSelectedProduct] = useState("");
  const [generatedBarcode, setGeneratedBarcode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = async () => {
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }

    setIsGenerating(true);
    const result = await generateBarcode(selectedProduct);

    if (result.success) {
      setGeneratedBarcode(result.data.barcode);
      toast.success("Barcode generated successfully");
    } else {
      toast.error(result.error || "Failed to generate barcode");
    }
    setIsGenerating(false);
  };

  const handleSave = async () => {
    if (!generatedBarcode || !selectedProduct) {
      toast.error("Please generate a barcode first");
      return;
    }

    setIsSaving(true);
    const result = await createBarcode({
      barcode: generatedBarcode,
      productId: selectedProduct,
      type: "EAN13",
    });

    if (result.success) {
      toast.success("Barcode saved successfully");
      setGeneratedBarcode("");
      setSelectedProduct("");
      startTransition(() => {
        router.refresh();
      });
    } else {
      toast.error(result.error || "Failed to save barcode");
    }
    setIsSaving(false);
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
        <MdQrCode2 className="w-5 h-5 text-blue-500" />
        Generate New Barcode
      </h3>

      <div className="space-y-4">
        {/* Product Selection */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Select Product
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
            <option value="">-- Select a product --</option>
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
          <MdQrCode2 className="w-5 h-5" />
          {isGenerating ? "Generating..." : "Generate Barcode"}
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
              Generated Barcode:
            </p>
            <div className="flex items-center justify-center py-6">
              <span
                className={`text-3xl font-mono font-bold ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {generatedBarcode}
              </span>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors mt-4 ${
                isDarkMode
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              <MdAdd className="w-5 h-5" />
              {isSaving ? "Saving..." : "Save Barcode"}
            </button>
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
          <strong>Note:</strong> Generated barcodes are unique EAN13 format with
          automatic check digit calculation. Duplicate barcodes are
          automatically prevented.
        </p>
      </div>
    </div>
  );
}
