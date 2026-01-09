"use client";

import { Barcode, deleteBarcode } from "@/app/actions/barcode";
import { printBarcode } from "@/lib/printUtils";
import { useSidebar } from "@/lib/SidebarContext";
import { getTranslation } from "@/lib/translations";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { MdDelete, MdPrint, MdQrCode2, MdSearch } from "react-icons/md";

interface BarcodeListProps {
  initialBarcodes: Barcode[];
  totalPages: number;
  currentPage: number;
  total: number;
  language: "en" | "bn";
}

export default function BarcodeList({
  initialBarcodes,
  totalPages,
  currentPage,
  total,
  language,
}: BarcodeListProps) {
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, barcode: string) => {
    if (!confirm(getTranslation("areYouSure", language) + ` ${barcode}?`)) {
      return;
    }

    setDeletingId(id);
    const result = await deleteBarcode(id);

    if (result.success) {
      toast.success(getTranslation("barcodeDeletedSuccess", language));
      startTransition(() => {
        router.refresh();
      });
    } else {
      toast.error(result.error || getTranslation("failedToDeleteBarcode", language));
    }
    setDeletingId(null);
  };

  const handlePrint = (barcode: string, productName: string, sku: string) => {
    printBarcode(barcode, productName, sku);
  };

  const filteredBarcodes = initialBarcodes.filter(
    (b) =>
      b.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.productId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.productId.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <MdSearch
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <input
            type="text"
            placeholder={getTranslation("searchByBarcode", language)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 flex items-center justify-between">
        <p
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {getTranslation("showing", language)} {filteredBarcodes.length} {getTranslation("of", language)} {total} {getTranslation("allBarcodes", language).toLowerCase()}
        </p>
      </div>

      {/* Barcode List */}
      {filteredBarcodes.length === 0 ? (
        <div
          className={`text-center py-12 rounded-lg border-2 border-dashed ${
            isDarkMode
              ? "border-gray-700 bg-gray-800/50"
              : "border-gray-300 bg-gray-50"
          }`}
        >
          <MdQrCode2
            className={`w-16 h-16 mx-auto mb-4 ${
              isDarkMode ? "text-gray-600" : "text-gray-400"
            }`}
          />
          <p
            className={`text-lg font-medium ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {getTranslation("noBarcodesFound", language)}
          </p>
          <p
            className={`text-sm mt-1 ${
              isDarkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            {searchQuery
              ? getTranslation("tryAdjustingSearch", language)
              : getTranslation("generateFirstBarcode", language)}
          </p>
        </div>
      ) : (
        <div
          className={`rounded-lg border overflow-hidden ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                className={`${
                  isDarkMode ? "bg-gray-800" : "bg-gray-50"
                } border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
              >
                <tr>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {getTranslation("barcodeManagement", language).split(" ")[0]}
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {getTranslation("selectProduct", language).split(" ")[1] || "Product"}
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {getTranslation("type", language)}
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {getTranslation("created", language)}
                  </th>
                  <th
                    className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {getTranslation("actions", language)}
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDarkMode ? "divide-gray-700" : "divide-gray-200"
                }`}
              >
                {filteredBarcodes.map((barcode) => (
                  <tr
                    key={barcode._id}
                    className={`${
                      isDarkMode
                        ? "bg-gray-800/50 hover:bg-gray-800"
                        : "bg-white hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <td
                      className={`px-6 py-4 whitespace-nowrap ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MdQrCode2 className="w-5 h-5 text-blue-500" />
                        <span className="font-mono text-sm font-medium">
                          {barcode.barcode}
                        </span>
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      <div>
                        <p className="font-medium">{barcode.productId.name}</p>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          SKU: {barcode.productId.sku}
                        </p>
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isDarkMode
                            ? "bg-blue-900/50 text-blue-300"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {barcode.type}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {new Date(barcode.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handlePrint(barcode.barcode, barcode.productId.name, barcode.productId.sku)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            isDarkMode
                              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          title={getTranslation("print", language)}
                        >
                          <MdPrint className="w-4 h-4" />
                          <span className="sr-only">{getTranslation("print", language)}</span>
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(barcode._id, barcode.barcode)
                          }
                          disabled={deletingId === barcode._id}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            isDarkMode
                              ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                              : "bg-red-50 text-red-600 hover:bg-red-100"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                          title={getTranslation("delete", language)}
                        >
                          <MdDelete className="w-4 h-4" />
                          <span className="sr-only">{getTranslation("delete", language)}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => router.push(`/barcode?page=${currentPage - 1}`)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:bg-gray-800/50"
                : "bg-white text-gray-700 hover:bg-gray-50 disabled:bg-gray-100"
            } border ${
              isDarkMode ? "border-gray-700" : "border-gray-300"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            Previous
          </button>

          <span
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => router.push(`/barcode?page=${currentPage + 1}`)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:bg-gray-800/50"
                : "bg-white text-gray-700 hover:bg-gray-50 disabled:bg-gray-100"
            } border ${
              isDarkMode ? "border-gray-700" : "border-gray-300"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
