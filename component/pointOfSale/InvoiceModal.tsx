"use client";
import {
  MdAdd,
  MdCheck,
  MdDownload,
  MdLocalPharmacy,
  MdPrint,
} from "react-icons/md";
import { useLanguage } from "@/lib/LanguageContext";
import { getTranslation } from "@/lib/translations";
import { Invoice } from "./types";
import toast from "react-hot-toast";

interface InvoiceModalProps {
  showInvoiceModal: boolean;
  lastInvoice: Invoice | null;
  storeName: string;
  startNewSale: () => void;
}

export const InvoiceModal = ({
  showInvoiceModal,
  lastInvoice,
  storeName,
  startNewSale,
}: InvoiceModalProps) => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(key, language);

  if (!showInvoiceModal || !lastInvoice) return null;

  const formatCurrency = (amount: number) => `৳${amount.toFixed(2)}`;

  const printInvoice = () => {
    const printContent = document.getElementById("receipt-print-area");
    if (printContent) {
      window.print();
      toast.success("Receipt sent to printer");
    } else {
      toast.error("Unable to print receipt");
    }
  };

  const downloadReceipt = async () => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const element = document.getElementById("receipt-print-area");
      if (!element) {
        toast.error("Receipt element not found");
        return;
      }

      toast.loading("Generating PDF...", { id: "download" });

      // Create a clone to ensure full height capture
      const clone = element.cloneNode(true) as HTMLElement;
      // Reset some styles on the clone to ensure it renders fully
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.height = 'auto';
      clone.style.overflow = 'visible';
      clone.style.maxHeight = 'none'; // Override any max-height
      document.body.appendChild(clone);

      // High quality capture
      const canvas = await html2canvas(clone, {
        scale: 4, // Very high resolution for crisp text
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: clone.scrollWidth,
        windowHeight: clone.scrollHeight
      });

      document.body.removeChild(clone); // Cleanup

      const imgData = canvas.toDataURL("image/png");
      
      // Calculate dimensions to fit PDF (80mm width)
      const pdfWidth = 80;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Receipt_${lastInvoice.invoiceNumber}.pdf`);

      toast.success("Receipt PDF downloaded!", { id: "download" });
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to generate PDF", { id: "download" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      {/* Print CSS */}
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            #receipt-print-area, #receipt-print-area * { visibility: visible; }
            #receipt-print-area {
              position: absolute;
              left: 50%;
              top: 0;
              transform: translateX(-50%);
              width: 80mm; /* Standard Receipt Width */
              padding: 0;
              margin: 0;
              background: white !important;
              color: black !important;
              font-family: 'Courier New', Courier, monospace; /* Monospace for receipts */
            }
            /* Hide URL/Date headers in some browsers */
            @page { margin: 0; size: auto; }
          }
        `}
      </style>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Success Header */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-center relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-full bg-white/10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, white 2px, transparent 2px)",
              backgroundSize: "20px 20px",
              opacity: 0.2,
            }}
          ></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-lg">
              <MdCheck className="text-4xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {t("paymentSuccessful")}
            </h2>
            <p className="text-emerald-100">{t("transactionCompleted")}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 grid grid-cols-2 gap-3 bg-gray-50 border-b">
          <button
            onClick={printInvoice}
            className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 shadow-sm hover:border-gray-300 hover:shadow-md transition-all"
          >
            <MdPrint className="text-lg" /> {t("printReceipt")}
          </button>
          <button
            onClick={downloadReceipt}
            className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 shadow-sm hover:border-gray-300 hover:shadow-md transition-all"
          >
            <MdDownload className="text-lg" /> {t("downloadPdf")}
          </button>
        </div>

        {/* Receipt Preview Area - Professional Design */}
        <div className="max-h-[350px] overflow-y-auto p-8 bg-gray-100 flex justify-center">
          <div
            id="receipt-print-area"
            className="bg-[#ffffff] p-8 shadow-md text-sm text-[#1f2937] w-[300px] leading-relaxed relative h-auto min-h-min"
            style={{ fontFamily: "'Courier New', Courier, monospace" }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-2">
                <MdLocalPharmacy className="text-3xl text-[#1f2937]" />
              </div>
              <h3 className="font-extrabold text-xl uppercase tracking-widest border-b-2 border-[#000000] pb-2 mb-2">
                {storeName}
              </h3>
              <p className="text-[10px] uppercase tracking-wide text-[#4b5563]">
                {t("professionalHealthcare")}
              </p>
            </div>

            {/* Meta Info */}
            <div className="flex flex-col gap-1 text-xs mb-6">
              <div className="flex justify-between py-0.5">
                <span className="text-[#6b7280]">{t("date")}:</span>
                <span className="font-bold">
                  {new Date(lastInvoice.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#6b7280]">{t("time")}:</span>
                <span className="font-bold">
                  {new Date(lastInvoice.date).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#6b7280]">{t("invoice")}:</span>
                <span className="font-bold">#{lastInvoice.invoiceNumber}</span>
              </div>
              {lastInvoice.customer?.name && (
                <div className="flex justify-between py-0.5">
                  <span className="text-[#6b7280]">{t("customer")}:</span>
                  <span className="font-bold text-right max-w-[150px] truncate">
                    {lastInvoice.customer.name}
                  </span>
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="border-b-2 border-dashed border-[#d1d5db] my-4"></div>

            {/* Items Header */}
            <div className="grid grid-cols-12 gap-1 text-[10px] font-bold uppercase text-[#6b7280] mb-3">
              <div className="col-span-6">{t("item")}</div>
              <div className="col-span-2 text-center">{t("qty")}</div>
              <div className="col-span-4 text-right">{t("price")}</div>
            </div>

            {/* Items List */}
            <div className="space-y-3 mb-6">
              {lastInvoice.items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-1 text-xs items-start">
                  <div className="col-span-6 leading-tight">
                    <span className="font-bold block mb-0.5">{item.name}</span>
                    <span className="text-[10px] text-[#6b7280]">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                  <div className="col-span-2 text-center font-mono mt-0.5">
                    {item.quantity}
                  </div>
                  <div className="col-span-4 text-right font-mono font-bold mt-0.5">
                    {formatCurrency(item.finalPrice)}
                  </div>
                </div>
              ))}
            </div>

            {/* Separator */}
            <div className="border-b-2 border-dashed border-[#d1d5db] my-4"></div>

            {/* Totals */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6b7280]">{t("subtotal")}</span>
                <span className="font-mono">
                  {formatCurrency(lastInvoice.subtotal)}
                </span>
              </div>
              
              {lastInvoice.itemDiscounts > 0 && (
                <div className="flex justify-between text-[#6b7280]">
                  <span>{t("itemDiscounts")}</span>
                  <span className="font-mono">
                    -{formatCurrency(lastInvoice.itemDiscounts)}
                  </span>
                </div>
              )}
              
              {lastInvoice.membershipDiscount > 0 && (
                <div className="flex justify-between text-[#6b7280]">
                  <span>{t("memberDiscount")}</span>
                  <span className="font-mono">
                    -{formatCurrency(lastInvoice.membershipDiscount)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-[#6b7280]">{t("tax")} (5%)</span>
                <span className="font-mono">
                  {formatCurrency(lastInvoice.tax)}
                </span>
              </div>

              <div className="border-t-2 border-[#000000] my-2"></div>

              <div className="flex justify-between items-center text-sm">
                <span className="font-extrabold uppercase">{t("total")}</span>
                <span className="font-extrabold font-mono text-lg">
                  {formatCurrency(lastInvoice.grandTotal)}
                </span>
              </div>
              
              {/* Payment Details */}
              <div className="mt-2 pt-2 border-t border-dashed border-[#e5e7eb] text-[10px] text-[#6b7280]">
                 <div className="flex justify-between">
                   <span>{t("paymentMethod")}:</span>
                   <span className="uppercase font-bold">{lastInvoice.paymentMethod}</span>
                 </div>
                 {lastInvoice.paymentMethod === 'cash' && (
                   <>
                     <div className="flex justify-between mt-1">
                       <span>{t("cashReceived")}:</span>
                       <span className="font-mono">{formatCurrency(lastInvoice.receivedAmount)}</span>
                     </div>
                     <div className="flex justify-between">
                       <span>{t("changeDue")}:</span>
                       <span className="font-mono">{formatCurrency(lastInvoice.changeAmount)}</span>
                     </div>
                   </>
                 )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-[10px] text-[#9ca3af] mb-2">
                {t("thankYou")}
              </p>
              {/* Barcode Simulation */}
              <div className="h-8 bg-[rgba(0,0,0,0.1)] mx-auto w-3/4 flex items-center justify-center gap-0.5 overflow-hidden opacity-50">
                 {Array.from({ length: 40 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-full ${Math.random() > 0.5 ? 'w-0.5 bg-[#000000]' : 'w-1 bg-transparent'}`} 
                    />
                 ))}
              </div>
              <p className="text-[8px] text-[#d1d5db] mt-1 font-mono tracking-widest">
                {lastInvoice.invoiceNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white">
          <button
            onClick={startNewSale}
            className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2"
          >
            <MdAdd className="text-xl" /> {t("startNewSale")}
          </button>
        </div>
      </div>
    </div>
  );
};
