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
  
  const [isPrinting, setIsPrinting] = useState(false);

  // Monitor for duplicate receipt elements
  useEffect(() => {
    if (showInvoiceModal && lastInvoice) {
      const checkDuplicates = () => {
        const receipts = document.querySelectorAll("#receipt-print-area");
        if (receipts.length > 1) {
          console.error(`🚨 CRITICAL: ${receipts.length} receipt elements detected! Should be 1!`);
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
      
      checkDuplicates();
      setTimeout(checkDuplicates, 100);
    }
  }, [showInvoiceModal, lastInvoice]);

  if (!showInvoiceModal || !lastInvoice) return null;

  const formatCurrency = (amount: number) => `৳${amount.toFixed(2)}`;

  const printInvoice = () => {
    if (isPrinting) {
      console.warn("🛑 Print blocked: Already in progress");
      toast.error("Print already in progress");
      return;
    }

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

    if (!printContent.hasAttribute("data-original-receipt")) {
      console.error("⚠️ Invalid receipt element");
      return;
    }

    try {
      setIsPrinting(true);
      console.log("✅ Starting print job - SINGLE COPY GUARANTEED");
      console.log("📄 Receipt elements found:", allReceiptElements.length);
      
      requestAnimationFrame(() => {
        window.print();
        toast.success("✓ Receipt sent to printer", { duration: 2000 });
        
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

      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.height = 'auto';
      clone.style.overflow = 'visible';
      clone.style.maxHeight = 'none';
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 4,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: clone.scrollWidth,
        windowHeight: clone.scrollHeight
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");
      
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
      {/* OPTIMIZED Print CSS for Deli 581PW Thermal Printer */}
      <style>
        {`
          @media print {
            /* Hide everything except receipt */
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
            
            /* CRITICAL: Optimized positioning for Deli 581PW (58mm thermal printer) */
            #receipt-print-area:first-of-type {
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              
              /* 58mm width with proper margins for Deli 581PW */
              width: 58mm !important;
              max-width: 58mm !important;
              min-width: 58mm !important;
              
              /* Optimized padding for thermal printer */
              padding: 3mm 4mm !important;
              margin: 0 !important;
              
              background: white !important;
              color: #000 !important;
              
              /* BEST font for thermal printers - monospace for clarity */
              font-family: 'Courier New', 'Courier', monospace !important;
              font-size: 11pt !important;
              line-height: 1.3 !important;
              font-weight: 500 !important;
              
              box-sizing: border-box !important;
              
              /* Anti-aliasing for sharper text on thermal printer */
              -webkit-font-smoothing: antialiased !important;
              -moz-osx-font-smoothing: grayscale !important;
              text-rendering: optimizeLegibility !important;
              
              /* Prevent page breaks */
              page-break-after: avoid !important;
              page-break-before: avoid !important;
              page-break-inside: avoid !important;
            }
            
            /* Optimized logo for thermal printer */
            #receipt-print-area:first-of-type img {
              max-width: 35mm !important;
              max-height: 35mm !important;
              height: auto !important;
              width: auto !important;
              
              /* HIGH CONTRAST for thermal printer */
              filter: contrast(1.4) brightness(0.9) grayscale(100%) !important;
              
              /* Force exact color reproduction */
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
              
              /* Sharp rendering */
              image-rendering: -webkit-optimize-contrast !important;
              image-rendering: crisp-edges !important;
            }
            
            /* Enhanced text rendering for thermal printer */
            #receipt-print-area:first-of-type * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
              
              /* Prevent text from being too light */
              color: #000 !important;
              
              /* Better text rendering */
              text-rendering: optimizeLegibility !important;
              -webkit-font-smoothing: antialiased !important;
            }
            
            /* Bold text extra bold for thermal printer */
            #receipt-print-area:first-of-type strong,
            #receipt-print-area:first-of-type .font-bold,
            #receipt-print-area:first-of-type .font-extrabold {
              font-weight: 900 !important;
              color: #000 !important;
            }
            
            /* Headers extra dark and bold */
            #receipt-print-area:first-of-type h1,
            #receipt-print-area:first-of-type h2,
            #receipt-print-area:first-of-type h3,
            #receipt-print-area:first-of-type h4 {
              font-weight: 900 !important;
              color: #000 !important;
              letter-spacing: 0.5px !important;
            }
            
            /* Borders optimized for thermal printer */
            #receipt-print-area:first-of-type .border,
            #receipt-print-area:first-of-type .border-t,
            #receipt-print-area:first-of-type .border-b {
              border-color: #000 !important;
              border-width: 1.5px !important;
            }
            
            /* Dashed borders thicker */
            #receipt-print-area:first-of-type .border-dashed {
              border-width: 1px !important;
              border-color: #333 !important;
            }
            
            /* Remove gray text - make everything black for thermal printer */
            #receipt-print-area:first-of-type .text-gray-400,
            #receipt-print-area:first-of-type .text-gray-500,
            #receipt-print-area:first-of-type .text-gray-600 {
              color: #000 !important;
            }
            
            /* Barcode area darker */
            #receipt-print-area:first-of-type .bg-opacity-20 {
              background-color: rgba(0, 0, 0, 0.15) !important;
            }
            
            /* Page settings for 58mm thermal printer (Deli 581PW) */
            @page {
              margin: 0 !important;
              padding: 0 !important;
              size: 58mm auto !important;
            }
            
            /* Clean body */
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: 58mm !important;
              overflow: hidden !important;
              background: white !important;
            }
          }
          
          /* Screen preview optimization */
          @media screen {
            #receipt-print-area {
              /* Show what it will look like when printed */
              font-family: 'Courier New', 'Courier', monospace !important;
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

        {/* Receipt Preview Area - Optimized for 58mm Deli 581PW */}
        <div className="max-h-[350px] overflow-y-auto p-8 bg-gray-100 flex justify-center">
          <div
            id="receipt-print-area"
            data-original-receipt="true"
            data-print-single="true"
            data-invoice-id={lastInvoice.invoiceNumber}
            className="bg-white p-6 shadow-md text-sm text-gray-900 leading-relaxed relative"
            style={{ 
              fontFamily: "'Courier New', Courier, monospace",
              width: '218px', // 58mm at 96 DPI (58mm ≈ 218px)
              maxWidth: '218px',
              pageBreakAfter: 'avoid',
              pageBreakBefore: 'avoid',
              pageBreakInside: 'avoid'
            }}
          >
            {/* Header - Logo and company info */}
            <div className="text-center mb-4">
              {/* Logo - Optimized for thermal printer */}
              <div className="flex justify-center mb-3">
                <img
                  src="/invoicelogo.png"
                  alt="Logo"
                  className="w-14 h-14 object-contain"
                  style={{
                    imageRendering: '-webkit-optimize-contrast',
                    filter: 'grayscale(100%) contrast(1.3) brightness(0.9)'
                  }}
                />
              </div>

              {/* Company Name - BOLD and LARGE */}
              <h3 className="font-black text-base uppercase tracking-wider border-b-2 border-black pb-2 mb-2">
                {storeName}
              </h3>

              {/* Proprietor & Details */}
              <p className="text-[9px] font-semibold text-gray-800 leading-tight">
                Pro : DMF MD BAYAJID BOSTAMI PRAN
              </p>
              <p className="text-[9px] font-semibold text-gray-800 leading-tight">
                01780516773
              </p>
              <p className="text-[9px] font-semibold text-gray-800 leading-tight">
                F : Bayajid Pharmacy & Surgical
              </p>
              <p className="text-[9px] font-semibold text-gray-800 leading-tight">
                Wahed plaza, Tajmohol more, Birganj, Dinajpur
              </p>
            </div>

            {/* Meta Info */}
            <div className="flex flex-col gap-1 text-[10px] mb-3 font-medium">
              <div className="flex justify-between py-0.5">
                <span className="font-bold">{t("date")}:</span>
                <span className="font-black">
                  {new Date(lastInvoice.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="font-bold">{t("time")}:</span>
                <span className="font-black">
                  {new Date(lastInvoice.date).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="font-bold">{t("invoice")}:</span>
                <span className="font-black">#{lastInvoice.invoiceNumber}</span>
              </div>
              {lastInvoice.customer?.name && (
                <div className="flex justify-between py-0.5">
                  <span className="font-bold">{t("customer")}:</span>
                  <span className="font-black text-right break-words max-w-[130px]">
                    {lastInvoice.customer.name}
                  </span>
                </div>
              )}
            </div>

            {/* Separator - DARKER */}
            <div className="border-b-2 border-dashed border-gray-800 my-3"></div>

            {/* Items Header - BOLD */}
            <div className="grid grid-cols-12 gap-1 text-[9px] font-black uppercase mb-2">
              <div className="col-span-6">{t("item")}</div>
              <div className="col-span-2 text-center">{t("qty")}</div>
              <div className="col-span-4 text-right">{t("price")}</div>
            </div>

            {/* Items List */}
            <div className="space-y-2 mb-3">
              {lastInvoice.items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-1 text-[10px] items-start">
                  <div className="col-span-6 leading-tight">
                    <span className="font-black block mb-0.5 text-[10px]">{item.name}</span>
                    <span className="text-[9px] font-bold text-gray-800">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                  <div className="col-span-2 text-center font-mono font-bold mt-0.5">
                    {item.quantity}
                  </div>
                  <div className="col-span-4 text-right font-mono font-black mt-0.5">
                    {formatCurrency(item.finalPrice)}
                  </div>
                </div>
              ))}
            </div>

            {/* Separator - DARKER */}
            <div className="border-b-2 border-dashed border-gray-800 my-3"></div>

            {/* Totals */}
            <div className="space-y-1 text-[10px] font-medium">
              <div className="flex justify-between">
                <span className="font-bold">{t("subtotal")}</span>
                <span className="font-mono font-bold">
                  {formatCurrency(lastInvoice.subtotal)}
                </span>
              </div>
              
              {lastInvoice.itemDiscounts > 0 && (
                <div className="flex justify-between">
                  <span className="font-bold">{t("itemDiscounts")}</span>
                  <span className="font-mono font-bold">
                    -{formatCurrency(lastInvoice.itemDiscounts)}
                  </span>
                </div>
              )}
              
              {lastInvoice.membershipDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="font-bold">{t("memberDiscount")}</span>
                  <span className="font-mono font-bold">
                    -{formatCurrency(lastInvoice.membershipDiscount)}
                  </span>
                </div>
              )}
              
              <div className="border-t-2 border-black my-2 pt-2"></div>

              <div className="flex justify-between items-center text-[12px]">
                <span className="font-black uppercase">{t("total")}</span>
                <span className="font-black font-mono text-[14px]">
                  {formatCurrency(lastInvoice.grandTotal)}
                </span>
              </div>
              
              {/* Payment Details */}
              <div className="mt-2 pt-2 border-t-2 border-dashed border-gray-700 text-[9px] space-y-0.5 font-medium">
                 <div className="flex justify-between">
                   <span className="font-bold">{t("paymentMethod")}:</span>
                   <span className="uppercase font-black">{lastInvoice.paymentMethod}</span>
                 </div>
                 {lastInvoice.paymentMethod === 'cash' && (
                   <>
                     <div className="flex justify-between">
                       <span className="font-bold">{t("cashReceived")}:</span>
                       <span className="font-mono font-black">{formatCurrency(lastInvoice.receivedAmount)}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="font-bold">{t("changeDue")}:</span>
                       <span className="font-mono font-black">{formatCurrency(lastInvoice.changeAmount)}</span>
                     </div>
                   </>
                 )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-5 text-center">
              <div className="border-t-2 border-dashed border-gray-700 pt-3 pb-2">
                <p className="text-[9px] font-black uppercase tracking-wide mb-1">
                  {t("thankYou")}
                </p>
                <p className="text-[9px] font-bold leading-tight">
                  {storeAddress}
                </p>
              </div>
              
              {/* Barcode - Darker for thermal printer */}
              <div className="h-8 bg-gray-200 mx-auto w-[90%] flex items-center justify-center gap-px overflow-hidden my-2">
                 {Array.from({ length: 45 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-full ${Math.random() > 0.5 ? 'w-px bg-black' : 'w-0.5 bg-transparent'}`}
                    />
                 ))}
              </div>
              <p className="text-[7px] font-mono font-bold tracking-widest uppercase">
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
