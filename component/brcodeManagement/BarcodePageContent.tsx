"use client";

import { Barcode } from "@/app/actions/barcode";
import BarcodeGenerator from "@/component/brcodeManagement/BarcodeGenerator";
import BarcodeList from "@/component/brcodeManagement/BarcodeList";
import { useLanguage } from "@/lib/LanguageContext";
import { getTranslation } from "@/lib/translations";
import { MdQrCode2 } from "react-icons/md";

interface Product {
  _id: string;
  name: string;
  sku: string;
}

interface BarcodePageContentProps {
  barcodes: Barcode[];
  totalPages: number;
  currentPage: number;
  total: number;
  products: any[];
}

export default function BarcodePageContent({
  barcodes,
  totalPages,
  currentPage,
  total,
  products,
}: BarcodePageContentProps) {
  const { language } = useLanguage();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500 rounded-lg">
            <MdQrCode2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {getTranslation("barcodeManagement", language)}
            </h1>
            <p className="text-sm text-gray-500">
              {getTranslation("generateAndManageBarcodes", language)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generator - Left side */}
        <div className="lg:col-span-1">
          <BarcodeGenerator
            products={products.map((p: any) => ({
              _id: p._id,
              name: p.name,
              sku: p.sku,
            }))}
            language={language as "en" | "bn"}
          />
        </div>

        {/* List - Right side */}
        <div className="lg:col-span-2">
          <BarcodeList
            initialBarcodes={barcodes}
            totalPages={totalPages}
            currentPage={currentPage}
            total={total}
            language={language as "en" | "bn"}
          />
        </div>
      </div>
    </div>
  );
}
