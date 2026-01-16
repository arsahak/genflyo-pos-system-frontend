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
  setQuantity?: (id: string, quantity: number) => void;
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
  setQuantity,
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
      {/* Header - Simplified */}
      <div
        className={`flex items-center justify-between px-4 py-2.5 border-b ${
          isDarkMode ? "border-gray-800" : "border-gray-100"
        }`}
      >
        <div className="flex items-center gap-2">
          <MdShoppingCart className={`text-lg ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
          <h2 className={`font-bold text-sm ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
            Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </h2>
        </div>
        
        {cart.length > 0 && (
          <div className="flex items-center gap-1.5">
            {/* Payment Method Icons */}
            <button
              onClick={() => setPaymentMethod("cash")}
              className={`p-1.5 rounded-lg transition-all ${
                paymentMethod === "cash"
                  ? "bg-green-600 text-white shadow-md"
                  : isDarkMode
                  ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title="Cash"
            >
              <IoMdCash className="text-base" />
            </button>
            <button
              onClick={() => setPaymentMethod("card")}
              className={`p-1.5 rounded-lg transition-all ${
                paymentMethod === "card"
                  ? "bg-indigo-600 text-white shadow-md"
                  : isDarkMode
                  ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title="Card"
            >
              <MdCreditCard className="text-base" />
            </button>
            
            {/* Invoice Toggle */}
            <button
              onClick={() => setShowInvoiceAfterSale(!showInvoiceAfterSale)}
              className={`p-1.5 rounded-lg transition-all ${
                showInvoiceAfterSale
                  ? "bg-blue-600 text-white shadow-md"
                  : isDarkMode
                  ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title={showInvoiceAfterSale ? "Invoice: ON" : "Invoice: OFF"}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>
            
            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className={`p-1.5 rounded-lg transition-all ${
                isDarkMode 
                  ? "text-gray-400 hover:text-red-400 hover:bg-red-900/20" 
                  : "text-gray-400 hover:text-red-500 hover:bg-red-50"
              }`}
              title="Clear Cart"
            >
              <MdDelete className="text-base" />
            </button>
          </div>
        )}
      </div>

      {cart.length > 0 ? (
        <>
          {/* Customer (Optional) - Enhanced */}
          <div className={`px-4 py-2.5 border-b ${isDarkMode ? "border-gray-800" : "border-gray-100"}`}>
            <button
              onClick={() => setShowCustomerInput(!showCustomerInput)}
              className={`w-full flex items-center justify-between py-1 px-2 rounded-lg transition-all duration-200 ${
                isDarkMode 
                  ? "hover:bg-gray-800 text-gray-400 hover:text-gray-300" 
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <MdPerson className={`text-sm transition-colors ${showCustomerInput ? "text-indigo-500" : ""}`} />
                <span className="text-xs font-semibold">Customer (Optional)</span>
              </div>
              <span className={`text-2xl font-light transition-all duration-200 ${showCustomerInput ? "text-gray-400 rotate-180" : "text-indigo-500"}`}>
                {showCustomerInput ? "−" : "+"}
              </span>
            </button>
            
            {showCustomerInput && (
              <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
                {!selectedCustomer ? (
                  <div className="space-y-2">
                    {/* Phone Input - Primary */}
                    <div className="relative">
                      <div className="relative">
                        <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                          customerPhone ? "text-indigo-500" : "text-gray-400"
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <input
                          ref={phoneInputRef}
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => handlePhoneInput(e.target.value)}
                          placeholder="Enter phone number..."
                          className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border-2 outline-none transition-all duration-200 ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500 focus:bg-gray-750"
                              : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-indigo-50/30"
                          }`}
                        />
                        {/* Loading Spinner */}
                        {isSearchingCustomer && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                        {/* Clear Button */}
                        {customerPhone && !isSearchingCustomer && (
                          <button
                            onClick={() => {
                              handlePhoneInput("");
                              setCustomerName("");
                              setCustomerEmail("");
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <MdClose className="text-lg" />
                          </button>
                        )}
                      </div>
                      
                      {/* Customer Suggestions Dropdown */}
                      {showSuggestions && customerSuggestions.length > 0 && (
                        <div className={`absolute z-10 w-full mt-1 rounded-lg shadow-xl border overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 ${
                          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                        }`}>
                          <div className="max-h-48 overflow-y-auto custom-scrollbar">
                            {customerSuggestions.map((cust, index) => (
                              <button
                                key={cust.id || cust._id}
                                onClick={() => selectCustomer(cust)}
                                className={`w-full text-left px-3 py-2.5 transition-all duration-150 ${
                                  isDarkMode 
                                    ? "hover:bg-gray-700 border-gray-700" 
                                    : "hover:bg-indigo-50 border-gray-100"
                                } ${index !== customerSuggestions.length - 1 ? "border-b" : ""}`}
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    isDarkMode ? "bg-indigo-900/30" : "bg-indigo-100"
                                  }`}>
                                    <MdPerson className="text-indigo-500 text-sm" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`font-semibold text-sm truncate ${
                                      isDarkMode ? "text-gray-100" : "text-gray-900"
                                    }`}>{cust.name}</p>
                                    <p className="text-xs text-gray-500">{cust.phone}</p>
                                    {cust.membershipType && cust.membershipType !== "regular" && (
                                      <span className={`inline-block px-1.5 py-0.5 text-[10px] font-medium rounded mt-0.5 ${
                                        cust.membershipType === "platinum" 
                                          ? "bg-purple-100 text-purple-700" 
                                          : cust.membershipType === "gold"
                                          ? "bg-yellow-100 text-yellow-700"
                                          : "bg-gray-100 text-gray-700"
                                      }`}>
                                        {cust.membershipType}
                                      </span>
                                    )}
                                  </div>
                                  <MdCheck className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Conditional Name & Email Fields - Only show when phone entered but no customer found */}
                    {customerPhone.length >= 3 && !isSearchingCustomer && customerSuggestions.length === 0 && (
                      <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-300">
                        {/* Info Message */}
                        <p className="text-xs text-gray-500 flex items-center gap-1.5 px-1">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          No customer found. Add details (optional)
                        </p>
                        
                        {/* Name Input */}
                        <div className="relative">
                          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Customer name (optional)"
                            className={`w-full pl-10 pr-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                              isDarkMode
                                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500"
                                : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500"
                            }`}
                          />
                        </div>
                        
                        {/* Email Input */}
                        <div className="relative">
                          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <input
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="Email (optional)"
                            className={`w-full pl-10 pr-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                              isDarkMode
                                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500"
                                : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500"
                            }`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Selected Customer Card */
                  <div className={`p-3 rounded-lg border-2 animate-in fade-in zoom-in-95 duration-200 ${
                    isDarkMode 
                      ? "bg-gradient-to-br from-gray-800 to-gray-800/50 border-indigo-500/30" 
                      : "bg-gradient-to-br from-indigo-50 to-white border-indigo-200"
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isDarkMode ? "bg-indigo-900/40" : "bg-indigo-100"
                        }`}>
                          <MdPerson className="text-indigo-500 text-lg" />
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                            {selectedCustomer.name}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            {selectedCustomer.phone}
                          </p>
                          {selectedCustomer.membershipType && selectedCustomer.membershipType !== "regular" && (
                            <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full mt-1 ${
                              selectedCustomer.membershipType === "platinum" 
                                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white" 
                                : selectedCustomer.membershipType === "gold"
                                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900"
                                : "bg-gray-200 text-gray-700"
                            }`}>
                              ⭐ {selectedCustomer.membershipType.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedCustomer(null);
                          handlePhoneInput("");
                        }} 
                        className={`p-1.5 rounded-lg transition-all hover:scale-110 ${
                          isDarkMode 
                            ? "text-gray-400 hover:text-red-400 hover:bg-red-900/20" 
                            : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                        }`}
                      >
                        <MdClose className="text-base" />
                      </button>
                    </div>
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
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQty = parseInt(e.target.value) || 1;
                            if (newQty > 0) {
                              if (setQuantity) {
                                setQuantity(item.id, newQty);
                              } else {
                                const delta = newQty - item.quantity;
                                updateQuantity(item.id, delta);
                              }
                            }
                          }}
                          onFocus={(e) => e.target.select()}
                          className={`w-10 text-center text-xs font-bold outline-none border-0 bg-transparent ${
                            isDarkMode ? "text-gray-100" : "text-gray-900"
                          } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                        />
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

          {/* Summary - Minimized */}
          <div className={`border-t px-3 py-2 ${isDarkMode ? "border-gray-800 bg-gray-900" : "border-gray-100 bg-white"}`}>
            <div className="space-y-1 text-xs mb-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className={isDarkMode ? "text-gray-200" : "text-gray-900"}>
                  {formatCurrency(calculateSubtotal())}
                </span>
              </div>

              {/* Discount Card - Compact */}
              <div className={`p-1.5 rounded-lg border ${
                isDarkMode 
                  ? "bg-gray-800/50 border-gray-700" 
                  : "bg-gray-50 border-gray-200"
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[11px] font-medium text-gray-500">Discount</span>
                  </div>
                  {calculateOrderDiscount() > 0 && (
                    <span className="text-[11px] font-bold text-orange-500">
                      -{formatCurrency(calculateOrderDiscount())}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={appliedDiscount || ""}
                    onChange={(e) => setAppliedDiscount(parseFloat(e.target.value) || 0)}
                    className={`flex-1 px-2 py-1 text-xs rounded border outline-none transition-all ${
                      isDarkMode
                        ? "bg-gray-900 border-gray-700 text-white focus:border-orange-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-orange-500"
                    }`}
                    placeholder="0"
                  />
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as "percent" | "fixed")}
                    className={`px-2 py-1 text-xs rounded border font-medium outline-none transition-all ${
                      isDarkMode
                        ? "bg-gray-900 border-gray-700 text-white focus:border-orange-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-orange-500"
                    }`}
                  >
                    <option value="percent">%</option>
                    <option value="fixed">৳</option>
                  </select>
                </div>
              </div>

              {/* Cash Payment Card - Compact */}
              {paymentMethod === "cash" && (
                <div className={`p-1.5 rounded-lg border ${
                  isDarkMode 
                    ? "bg-green-900/20 border-green-700/50" 
                    : "bg-green-50 border-green-200"
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <IoMdCash className="text-xs text-green-600" />
                      <span className="text-[11px] font-medium text-gray-500">Cash Received</span>
                    </div>
                    {receivedAmount && parseFloat(receivedAmount) >= calculateGrandTotal() && (
                      <span className="text-[11px] font-bold text-green-600">
                        Change: {formatCurrency(getChangeAmount())}
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    value={receivedAmount}
                    onChange={(e) => setReceivedAmount(e.target.value)}
                    className={`w-full px-2 py-1 text-xs rounded border outline-none transition-all ${
                      isDarkMode
                        ? "bg-gray-900 border-green-700 text-white focus:border-green-500"
                        : "bg-white border-green-300 text-gray-900 focus:border-green-500"
                    }`}
                    placeholder="0"
                  />
                </div>
              )}

              <div className="flex justify-between items-center pt-1.5 border-t border-dashed border-gray-300 dark:border-gray-700">
                <span className={`font-bold text-sm ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>Total</span>
                <span className={`text-lg font-bold ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
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
