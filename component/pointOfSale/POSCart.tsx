"use client";
import { useLanguage } from "@/lib/LanguageContext";
import { getTranslation } from "@/lib/translations";
import { useState } from "react";
import { IoMdCash } from "react-icons/io";
import {
    MdAdd,
    MdCheck,
    MdClose,
    MdCreditCard,
    MdDelete,
    MdLocalPharmacy,
    MdPerson,
    MdRemove,
    MdShoppingCart,
} from "react-icons/md";
import { CartItem, Customer } from "./types";

interface POSCartProps {
  isDarkMode: boolean;
  cart: CartItem[];
  itemDiscount: { [key: string]: number };
  setItemDiscount: (val: { [key: string]: number }) => void;
  clearCart: () => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  getItemFinalPrice: (item: CartItem) => number;
  calculateSubtotal: () => number;
  calculateItemDiscounts: () => number;
  getMembershipDiscount: () => number;
  calculateOrderDiscount: () => number;
  calculateTax: () => number;
  calculateGrandTotal: () => number;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  customerPhone: string;
  handlePhoneInput: (value: string) => void;
  customerName: string;
  setCustomerName: (val: string) => void;
  customerEmail: string;
  setCustomerEmail: (val: string) => void;
  isSearchingCustomer: boolean;
  showSuggestions: boolean;
  customerSuggestions: Customer[];
  selectCustomer: (customer: Customer) => void;
  paymentMethod: "cash" | "card";
  setPaymentMethod: (method: "cash" | "card") => void;
  receivedAmount: string;
  setReceivedAmount: (val: string) => void;
  getChangeAmount: () => number;
  processPayment: () => void;
  phoneInputRef: React.RefObject<HTMLInputElement | null>;
  appliedDiscount: number;
  setAppliedDiscount: (val: number) => void;
  discountType: "percent" | "fixed";
  setDiscountType: (val: "percent" | "fixed") => void;
  isProcessing: boolean;
  showInvoiceAfterSale: boolean;
  setShowInvoiceAfterSale: (val: boolean) => void;
}

export const POSCart = ({
  isDarkMode,
  cart,
  itemDiscount,
  setItemDiscount,
  clearCart,
  updateQuantity,
  removeFromCart,
  getItemFinalPrice,
  calculateSubtotal,
  calculateItemDiscounts,
  getMembershipDiscount,
  calculateOrderDiscount,
  calculateTax,
  calculateGrandTotal,
  selectedCustomer,
  setSelectedCustomer,
  customerPhone,
  handlePhoneInput,
  customerName,
  setCustomerName,
  customerEmail,
  setCustomerEmail,
  isSearchingCustomer,
  showSuggestions,
  customerSuggestions,
  selectCustomer,
  paymentMethod,
  setPaymentMethod,
  receivedAmount,
  setReceivedAmount,
  getChangeAmount,
  processPayment,
  phoneInputRef,
  appliedDiscount,
  setAppliedDiscount,
  discountType,
  setDiscountType,
  isProcessing,
  showInvoiceAfterSale,
  setShowInvoiceAfterSale,
}: POSCartProps) => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(key, language);
  const formatCurrency = (amount: number) => `৳${amount.toFixed(2)}`;

  const [showCustomerInput, setShowCustomerInput] = useState(false);

  return (
    <div
      className={`w-[420px] flex flex-col border-l z-20 shadow-xl ${
        isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
      }`}
    >
      {/* Header with Payment Icons */}
      <div
        className={`flex items-center justify-between px-5 py-3 border-b ${
          isDarkMode ? "border-gray-800" : "border-gray-100"
        }`}
      >
        <div className="flex items-center gap-2">
          <MdShoppingCart className={`text-xl ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
          <h2 className={`font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
            Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          {cart.length > 0 && (
            <>
              {/* Payment Icons */}
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`p-2 rounded-lg transition-all ${
                  paymentMethod === "cash"
                    ? "bg-green-600 text-white shadow-md"
                    : isDarkMode
                    ? "bg-gray-700 text-gray-400 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title="Cash"
              >
                <IoMdCash className="text-xl" />
              </button>
              <button
                onClick={() => setPaymentMethod("card")}
                className={`p-2 rounded-lg transition-all ${
                  paymentMethod === "card"
                    ? "bg-indigo-600 text-white shadow-md"
                    : isDarkMode
                    ? "bg-gray-700 text-gray-400 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title="Card"
              >
                <MdCreditCard className="text-xl" />
              </button>
              
              {/* Invoice Toggle */}
              <button
                onClick={() => setShowInvoiceAfterSale(!showInvoiceAfterSale)}
                className={`p-2 rounded-lg transition-all ${
                  showInvoiceAfterSale
                    ? "bg-blue-600 text-white shadow-md"
                    : isDarkMode
                    ? "bg-gray-700 text-gray-400 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title={showInvoiceAfterSale ? "Invoice: ON" : "Invoice: OFF"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </button>
              
              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Clear Cart"
              >
                <MdDelete className="text-lg" />
              </button>
            </>
          )}
        </div>
      </div>

      {cart.length > 0 ? (
        <>
          {/* Customer (Optional) */}
          <div className={`px-4 py-2.5 border-b ${isDarkMode ? "border-gray-800" : "border-gray-100"}`}>
            <button
              onClick={() => setShowCustomerInput(!showCustomerInput)}
              className={`w-full flex items-center justify-between py-1 px-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? "hover:bg-gray-800 text-gray-400 hover:text-gray-300" 
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="text-xs font-semibold">Customer (Optional)</span>
              <span className={`text-2xl font-light ${showCustomerInput ? "text-gray-400" : "text-indigo-500"}`}>
                {showCustomerInput ? "−" : "+"}
              </span>
            </button>
            
            {showCustomerInput && (
              <div className="mt-2">
                {!selectedCustomer ? (
                  <div className="relative">
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => handlePhoneInput(e.target.value)}
                      placeholder="Phone"
                      className={`w-full px-3 py-1.5 text-sm rounded border outline-none ${
                        isDarkMode
                          ? "bg-gray-900 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                    {showSuggestions && customerSuggestions.length > 0 && (
                      <div className={`absolute z-10 w-full mt-1 rounded shadow-lg border max-h-24 overflow-y-auto ${
                        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                      }`}>
                        {customerSuggestions.map((cust) => (
                          <button
                            key={cust.id || cust._id}
                            onClick={() => selectCustomer(cust)}
                            className={`w-full text-left px-2 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700`}
                          >
                            <p className="font-medium">{cust.name}</p>
                            <p className="text-gray-500">{cust.phone}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`flex items-center justify-between p-2 rounded ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-100"
                  }`}>
                    <div className="flex items-center gap-2">
                      <MdPerson className="text-indigo-500" />
                      <div>
                        <p className="text-sm font-semibold">{selectedCustomer.name}</p>
                        <p className="text-xs text-gray-500">{selectedCustomer.phone}</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedCustomer(null)} className="text-red-500">
                      <MdClose className="text-sm" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-4 py-2">
            {cart.map((item) => (
              <div
                key={item.id}
                className={`mb-2 p-2 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-800/40 border-gray-700/50"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex gap-2">
                  <div className={`w-10 h-10 rounded flex-shrink-0 flex items-center justify-center ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}>
                    {item.image ? (
                      <img src={item.image} alt="" className="w-full h-full object-cover rounded" />
                    ) : (
                      <MdLocalPharmacy className="text-gray-400 text-sm" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className={`text-sm font-semibold truncate ${
                        isDarkMode ? "text-gray-200" : "text-gray-800"
                      }`}>
                        {item.name}
                      </h4>
                      <span className={`text-sm font-bold ml-2 ${
                        isDarkMode ? "text-indigo-400" : "text-indigo-600"
                      }`}>
                        {formatCurrency(getItemFinalPrice(item))}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{formatCurrency(item.price)} / unit</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-1.5">
                      <div className={`flex items-center rounded ${
                        isDarkMode ? "bg-gray-900" : "bg-gray-100"
                      }`}>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 hover:text-red-500 flex items-center justify-center"
                        >
                          <MdRemove className="text-xs" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 hover:text-green-500 flex items-center justify-center"
                        >
                          <MdAdd className="text-xs" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <MdClose className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className={`border-t px-4 py-3 ${isDarkMode ? "border-gray-800 bg-gray-900" : "border-gray-100 bg-white"}`}>
            <div className="space-y-1.5 text-sm mb-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className={isDarkMode ? "text-gray-200" : "text-gray-900"}>
                  {formatCurrency(calculateSubtotal())}
                </span>
              </div>

              {/* Discount */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Discount</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={appliedDiscount || ""}
                      onChange={(e) => setAppliedDiscount(parseFloat(e.target.value) || 0)}
                      className={`w-14 px-2 py-1 text-xs rounded border text-right ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-300"
                      }`}
                      placeholder="0"
                    />
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as "percent" | "fixed")}
                      className={`px-1.5 py-1 text-xs rounded border ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <option value="percent">%</option>
                      <option value="fixed">৳</option>
                    </select>
                  </div>
                </div>
                {calculateOrderDiscount() > 0 && (
                  <span className={`text-xs font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                    -{formatCurrency(calculateOrderDiscount())}
                  </span>
                )}
              </div>

              {/* Cash Received */}
              {paymentMethod === "cash" && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Cash</span>
                    <input
                      type="number"
                      value={receivedAmount}
                      onChange={(e) => setReceivedAmount(e.target.value)}
                      className={`w-24 px-2 py-1 text-xs rounded border ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder="Enter"
                    />
                  </div>
                  {receivedAmount && parseFloat(receivedAmount) >= calculateGrandTotal() && (
                    <span className="text-xs text-green-500 font-medium">
                      Change: {formatCurrency(getChangeAmount())}
                    </span>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-300 dark:border-gray-700">
                <span className={`font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>Total</span>
                <span className={`text-xl font-bold ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                  {formatCurrency(calculateGrandTotal())}
                </span>
              </div>
            </div>

            {/* Complete Sale Button */}
            <button
              onClick={processPayment}
              disabled={isProcessing}
              className={`w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg flex items-center justify-center gap-2 ${
                isProcessing ? "opacity-75 cursor-not-allowed" : "active:scale-[0.98]"
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <MdCheck className="text-lg" />
                  Complete Sale (F8)
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center opacity-50">
          <div className={`p-6 rounded-full ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
            <MdShoppingCart className="text-4xl text-gray-400" />
          </div>
          <p className="text-sm font-medium mt-4">Cart is empty</p>
        </div>
      )}
    </div>
  );
};
