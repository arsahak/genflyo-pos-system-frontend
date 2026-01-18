"use client";
import { useLanguage } from "@/lib/LanguageContext";
import { getTranslation } from "@/lib/translations";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  MdAdd,
  MdCheck,
  MdDownload,
  MdPrint
} from "react-icons/md";
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
  
  // State hooks must be called before any early returns
  const [isPrinting, setIsPrinting] = useState(false);

  // CRITICAL: Monitor for duplicate receipt elements
  useEffect(() => {
    if (showInvoiceModal && lastInvoice) {
      // Check for duplicates after component renders
      const checkDuplicates = () => {
        const receipts = document.querySelectorAll("#receipt-print-area");
        if (receipts.length > 1) {
          console.error(`🚨 CRITICAL: ${receipts.length} receipt elements detected! Should be 1!`);
          // Remove duplicates if found
          receipts.forEach((receipt, index) => {
            if (index > 0) {
              console.warn(`Removing duplicate receipt element #${index + 1}`);
              receipt.remove();
            }
          });
        } else if (receipts.length === 1) {
          console.log("✅ Verified: Only ONE receipt element exists");
        }
      };
      
      // Check immediately and after a short delay
      checkDuplicates();
      setTimeout(checkDuplicates, 100);
    }
  }, [showInvoiceModal, lastInvoice]);

  if (!showInvoiceModal || !lastInvoice) return null;

  const formatCurrency = (amount: number) => `৳${amount.toFixed(2)}`;

  const printInvoice = () => {
    // STRONGEST PROTECTION: Prevent multiple rapid print calls
    if (isPrinting) {
      console.warn("🛑 Print blocked: Already in progress");
      toast.error("Print already in progress");
      return;
    }

    // Verify ONLY ONE receipt element exists
    const allReceiptElements = document.querySelectorAll("#receipt-print-area");
    if (allReceiptElements.length > 1) {
      console.error("⚠️ DUPLICATE DETECTED: Multiple receipt elements found!");
      toast.error("Error: Duplicate receipt detected");
      return;
    }

    const printContent = document.getElementById("receipt-print-area");
    if (!printContent) {
      toast.error("Unable to find receipt");
      return;
    }

    // Verify it's the original, not a clone
    if (!printContent.hasAttribute("data-original-receipt")) {
      console.error("⚠️ Invalid receipt element");
      return;
    }

    try {
      setIsPrinting(true);
      console.log("✅ Starting print job - SINGLE COPY GUARANTEED");
      console.log("📄 Receipt elements found:", allReceiptElements.length);
      
      // Use requestAnimationFrame for better timing
      requestAnimationFrame(() => {
        // Trigger print dialog - SINGLE TRIGGER ONLY
        window.print();
        
        toast.success("✓ Receipt sent to printer", { duration: 2000 });
        
        // Reset printing flag after dialog closes
        setTimeout(() => {
          setIsPrinting(false);
          console.log("✅ Print job complete, ready for next print");
        }, 3000);
      });
    } catch (error) {
      console.error("❌ Print error:", error);
      toast.error("Failed to print receipt");
      setIsPrinting(false);
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
      
      // Calculate dimensions to fit PDF (70mm width for POS printer)
      const pdfWidth = 70;
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
      {/* Print CSS - Show Preview + Prevent Duplicates */}
      <style>
        {`
          @media print {
            /* Hide everything except receipt - Use visibility, NOT display */
            body * {
              visibility: hidden;
            }
            
            /* Show ONLY the first receipt area and all its children */
            #receipt-print-area:first-of-type,
            #receipt-print-area:first-of-type * {
              visibility: visible !important;
            }
            
            /* Hide any duplicate receipt areas */
            #receipt-print-area:not(:first-of-type) {
              display: none !important;
              visibility: hidden !important;
            }
            
            /* Position receipt - 70mm POS Printer */
            #receipt-print-area:first-of-type {
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              width: 70mm !important;
              max-width: 70mm !important;
              padding: 2mm 3mm !important;
              margin: 0 !important;
              background: white !important;
              color: black !important;
              font-family: 'Courier New', Courier, monospace !important;
              font-size: 10pt !important;
              line-height: 1.4 !important;
              box-sizing: border-box !important;
              
              /* Prevent page breaks */
              page-break-after: avoid !important;
              page-break-before: avoid !important;
              page-break-inside: avoid !important;
            }
            
            /* Optimize images */
            #receipt-print-area:first-of-type img {
              max-width: 40px !important;
              max-height: 40px !important;
              filter: contrast(1.2) brightness(0.95);
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            /* Crisp text */
            #receipt-print-area:first-of-type * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            /* Single page only */
            @page {
              margin: 0 !important;
              size: 70mm auto !important;
            }
            
            /* Clean body */
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: 70mm !important;
              overflow: hidden !important;
            }
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
            disabled={isPrinting}
            className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 shadow-sm hover:border-gray-300 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPrinting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                <span>Printing...</span>
              </>
            ) : (
              <>
                <MdPrint className="text-lg" /> {t("printReceipt")}
              </>
            )}
          </button>
          <button
            onClick={downloadReceipt}
            className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 shadow-sm hover:border-gray-300 hover:shadow-md transition-all"
          >
            <MdDownload className="text-lg" /> {t("downloadPdf")}
          </button>
        </div>

        {/* Receipt Preview Area - 70mm POS Printer - ABSOLUTELY NO DUPLICATES */}
        <div className="max-h-[350px] overflow-y-auto p-8 bg-gray-100 flex justify-center">
          <div
            id="receipt-print-area"
            data-original-receipt="true"
            data-print-single="true"
            data-invoice-id={lastInvoice.invoiceNumber}
            className="bg-[#ffffff] p-6 shadow-md text-sm text-[#1f2937] leading-relaxed relative h-auto min-h-min"
            style={{ 
              fontFamily: "'Courier New', Courier, monospace",
              width: '264px', // 70mm at 96 DPI (70mm ≈ 264px)
              maxWidth: '264px',
              pageBreakAfter: 'avoid',
              pageBreakBefore: 'avoid',
              pageBreakInside: 'avoid'
            }}
          >
            {/* Header - Compact for 70mm */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-2">
                <img 
                  src="/invoicelogo.png" 
                  alt="Logo" 
                  className="w-10 h-10 object-contain"
                  style={{ imageRendering: '-webkit-optimize-contrast' }}
                />
              </div>
              <h3 className="font-extrabold text-lg uppercase tracking-wide border-b-2 border-[#000000] pb-1.5 mb-1.5">
                {storeName}
              </h3>
              <p className="text-[9px] uppercase tracking-wide text-[#4b5563] mb-0.5 leading-tight">
                {t("professionalHealthcare")}
              </p>
              <p className="text-[10px] font-semibold text-[#1f2937] leading-tight">
                {storeAddress}
              </p>
            </div>

            {/* Meta Info - Compact */}
            <div className="flex flex-col gap-0.5 text-[11px] mb-4">
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
                  <span className="font-bold text-right break-words max-w-[150px]">
                    {lastInvoice.customer.name}
                  </span>
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="border-b border-dashed border-[#d1d5db] my-3"></div>

            {/* Items Header */}
            <div className="grid grid-cols-12 gap-1 text-[9px] font-bold uppercase text-[#6b7280] mb-2">
              <div className="col-span-6">{t("item")}</div>
              <div className="col-span-2 text-center">{t("qty")}</div>
              <div className="col-span-4 text-right">{t("price")}</div>
            </div>

            {/* Items List */}
            <div className="space-y-2.5 mb-4">
              {lastInvoice.items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-1 text-[11px] items-start">
                  <div className="col-span-6 leading-tight">
                    <span className="font-bold block mb-0.5 text-[11px]">{item.name}</span>
                    <span className="text-[9px] text-[#6b7280]">
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
            <div className="border-b border-dashed border-[#d1d5db] my-3"></div>

            {/* Totals - Compact */}
            <div className="space-y-1.5 text-[11px]">
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
              
              <div className="border-t-2 border-[#000000] my-2 pt-2"></div>

              <div className="flex justify-between items-center text-[13px]">
                <span className="font-extrabold uppercase">{t("total")}</span>
                <span className="font-extrabold font-mono text-base">
                  {formatCurrency(lastInvoice.grandTotal)}
                </span>
              </div>
              
              {/* Payment Details */}
              <div className="mt-2 pt-2 border-t border-dashed border-[#e5e7eb] text-[10px] text-[#6b7280] space-y-0.5">
                 <div className="flex justify-between">
                   <span>{t("paymentMethod")}:</span>
                   <span className="uppercase font-bold text-[#1f2937]">{lastInvoice.paymentMethod}</span>
                 </div>
                 {lastInvoice.paymentMethod === 'cash' && (
                   <>
                     <div className="flex justify-between">
                       <span>{t("cashReceived")}:</span>
                       <span className="font-mono text-[#1f2937]">{formatCurrency(lastInvoice.receivedAmount)}</span>
                     </div>
                     <div className="flex justify-between">
                       <span>{t("changeDue")}:</span>
                       <span className="font-mono font-bold text-[#1f2937]">{formatCurrency(lastInvoice.changeAmount)}</span>
                     </div>
                   </>
                 )}
              </div>
            </div>

            {/* Footer - Compact for 70mm */}
            <div className="mt-6 text-center">
              <div className="border-t border-dashed border-[#d1d5db] pt-3 pb-2">
                <p className="text-[9px] text-[#9ca3af] mb-0.5 uppercase tracking-wide">
                  {t("thankYou")}
                </p>
                <p className="text-[9px] font-semibold text-[#4b5563] leading-tight">
                  {storeAddress}
                </p>
              </div>
              {/* Barcode Simulation - Optimized for thermal printer */}
              <div className="h-7 bg-[rgba(0,0,0,0.08)] mx-auto w-[85%] flex items-center justify-center gap-px overflow-hidden opacity-60 my-2">
                 {Array.from({ length: 50 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-full ${Math.random() > 0.5 ? 'w-px bg-[#000000]' : 'w-0.5 bg-transparent'}`} 
                    />
                 ))}
              </div>
              <p className="text-[7px] text-[#d1d5db] mt-1 font-mono tracking-widest uppercase">
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
