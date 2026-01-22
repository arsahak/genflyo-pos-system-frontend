"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { getTranslation } from "@/lib/translations";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdAdd, MdCheck, MdDownload, MdPrint } from "react-icons/md";
import { Invoice } from "./types";

interface InvoiceModalProps {
  showInvoiceModal: boolean;
  lastInvoice: Invoice | null;
  storeName: string;
  storeAddress?: string;
  startNewSale: () => void;
}

export const InvoiceModal = ({
  showInvoiceModal,
  lastInvoice,
  storeName,
  storeAddress = "Birganj, Dinajpur",
  startNewSale,
}: InvoiceModalProps) => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(key, language);

  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    if (showInvoiceModal && lastInvoice) {
      const receipts = document.querySelectorAll("#receipt-print-area");
      if (receipts.length > 1) {
        receipts.forEach((el, i) => i > 0 && el.remove());
      }
    }
  }, [showInvoiceModal, lastInvoice]);

  if (!showInvoiceModal || !lastInvoice) return null;

  const formatCurrency = (n: number) => `৳${n.toFixed(2)}`;

  const printInvoice = () => {
    if (isPrinting) return;
    setIsPrinting(true);
    requestAnimationFrame(() => {
      window.print();
      setTimeout(() => setIsPrinting(false), 3000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">

      {/* ================= PRINT CSS – DELI 581PW ================= */}
      <style>{`
        @media print {

          /* Hide everything */
          body * {
            visibility: hidden;
          }

          /* Show ONLY receipt */
          #receipt-print-area,
          #receipt-print-area * {
            visibility: visible !important;
          }

          /* Page size EXACT for DELI 581PW */
          @page {
            size: 48mm 300mm;
            margin: 0 !important;
          }

          html, body {
            width: 48mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            zoom: 1 !important;
            transform: scale(1) !important;
          }

          /* Receipt box */
          #receipt-print-area {
            position: fixed !important;
            top: 0;
            left: 0;
            width: 48mm !important;
            max-width: 48mm !important;
            padding: 2mm 2mm !important;
            background: white !important;
            color: black !important;
            font-family: "Courier New", monospace !important;
            font-size: 9pt !important;
            line-height: 1.35 !important;
            box-sizing: border-box !important;
            page-break-inside: avoid !important;
          }

          /* FORCE SHARP TEXT (WINDOWS FIX) */
          * {
            text-rendering: geometricPrecision !important;
            -webkit-font-smoothing: none !important;
            font-smooth: never !important;
            font-weight: 600 !important;
            letter-spacing: 0.02em !important;
          }

          /* Monochrome + contrast */
          body {
            filter: grayscale(100%) contrast(1.3) !important;
          }

          /* Images (logo/barcode) */
          img {
            image-rendering: pixelated !important;
            image-rendering: crisp-edges !important;
            filter: grayscale(100%) contrast(1.4) !important;
            max-width: 32px !important;
          }
        }
      `}</style>
      {/* ========================================================== */}

      <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden">

        {/* HEADER */}
        <div className="bg-emerald-600 text-white text-center p-5">
          <MdCheck className="text-3xl mx-auto mb-2" />
          <h2 className="font-bold">{t("paymentSuccessful")}</h2>
        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50">
          <button
            onClick={printInvoice}
            disabled={isPrinting}
            className="bg-white border rounded-lg py-2 flex items-center justify-center gap-2"
          >
            <MdPrint /> Print
          </button>

          <button className="bg-white border rounded-lg py-2 flex items-center justify-center gap-2">
            <MdDownload /> PDF
          </button>
        </div>

        {/* ================= RECEIPT ================= */}
        <div className="p-4 bg-gray-100 flex justify-center">
          <div
            id="receipt-print-area"
            className="bg-white text-[9px]"
            style={{
              width: "181px", // 48mm @ 96dpi
              fontFamily: "Courier New, monospace",
            }}
          >
            {/* LOGO */}
            <div className="text-center mb-2">
              <img src="/invoicelogo.png" alt="logo" />
              <h3 className="font-bold uppercase border-b mt-1">
                {storeName}
              </h3>
              <p className="text-[8px]">{storeAddress}</p>
            </div>

            {/* META */}
            <div className="mb-2">
              <div>Date: {new Date(lastInvoice.date).toLocaleDateString()}</div>
              <div>Invoice: #{lastInvoice.invoiceNumber}</div>
            </div>

            <div className="border-b my-1"></div>

            {/* ITEMS */}
            {lastInvoice.items.map(i => (
              <div key={i.id} className="flex justify-between">
                <span>{i.name} x{i.quantity}</span>
                <span>{formatCurrency(i.finalPrice)}</span>
              </div>
            ))}

            <div className="border-t my-1"></div>

            {/* TOTAL */}
            <div className="flex justify-between font-bold text-[10px]">
              <span>TOTAL</span>
              <span>{formatCurrency(lastInvoice.grandTotal)}</span>
            </div>

            {/* FOOTER */}
            <div className="text-center mt-3 text-[8px]">
              THANK YOU
            </div>
          </div>
        </div>
        {/* ========================================== */}

        <div className="p-3">
          <button
            onClick={startNewSale}
            className="w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <MdAdd /> New Sale
          </button>
        </div>
      </div>
    </div>
  );
};
