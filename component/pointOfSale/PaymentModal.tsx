"use client";
import { IoMdCash } from "react-icons/io";
import {
  MdAccountBalanceWallet,
  MdAttachMoney,
  MdCheck,
  MdClose,
  MdCreditCard,
  MdPerson,
} from "react-icons/md";
import { useLanguage } from "@/lib/LanguageContext";
import { getTranslation } from "@/lib/translations";
import { Customer } from "./types";

interface PaymentModalProps {
  isDarkMode: boolean;
  showPaymentModal: boolean;
  closePaymentModal: () => void;
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
  paymentMethod: "cash" | "card" | "wallet";
  setPaymentMethod: (method: "cash" | "card" | "wallet") => void;
  receivedAmount: string;
  setReceivedAmount: (val: string) => void;
  calculateGrandTotal: () => number;
  getChangeAmount: () => number;
  processPayment: () => void;
  phoneInputRef: React.RefObject<HTMLInputElement | null>;
  quickCashAmounts: number[];
}

export const PaymentModal = ({
  isDarkMode,
  showPaymentModal,
  closePaymentModal,
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
  calculateGrandTotal,
  getChangeAmount,
  processPayment,
  phoneInputRef,
  quickCashAmounts,
}: PaymentModalProps) => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(key, language);

  if (!showPaymentModal) return null;

  const formatCurrency = (amount: number) => `৳${amount.toFixed(2)}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div
        className={`max-w-xl w-full rounded-3xl shadow-2xl overflow-hidden ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`p-6 border-b flex justify-between items-center ${
            isDarkMode ? "border-gray-800" : "border-gray-100"
          }`}
        >
          <div>
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {t("checkout")}
            </h2>
            <p className="text-sm text-gray-500">
              {t("completeTransactionDetails")}
            </p>
          </div>
          <button
            onClick={closePaymentModal}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Customer Section */}
          <div
            className={`p-4 rounded-2xl border ${
              isDarkMode
                ? "bg-gray-800/50 border-gray-700"
                : "bg-slate-50 border-slate-100"
            }`}
          >
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 block">
              {t("customerDetails")}
            </label>

            {!selectedCustomer ? (
              <div className="relative">
                <input
                  ref={phoneInputRef}
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => handlePhoneInput(e.target.value)}
                  placeholder={t("enterPhonePlaceholder")}
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${
                    isDarkMode
                      ? "bg-gray-900 border-gray-700 text-white"
                      : "bg-white border-gray-200 text-gray-900"
                  }`}
                />
                {isSearchingCustomer && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {/* Suggestions Dropdown */}
                {showSuggestions && customerSuggestions.length > 0 && (
                  <div
                    className={`absolute z-10 w-full mt-2 rounded-xl shadow-xl border overflow-hidden ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-100"
                    }`}
                  >
                    {customerSuggestions.map((cust) => (
                      <button
                        key={cust.id || cust._id}
                        onClick={() => selectCustomer(cust)}
                        className={`w-full text-left px-4 py-3 flex justify-between items-center transition-colors ${
                          isDarkMode
                            ? "hover:bg-gray-700 border-b border-gray-700 last:border-0"
                            : "hover:bg-slate-50 border-b border-slate-100 last:border-0"
                        }`}
                      >
                        <div>
                          <p
                            className={`font-medium ${
                              isDarkMode ? "text-gray-200" : "text-gray-900"
                            }`}
                          >
                            {cust.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {cust.phone}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-bold">
                          Select
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* New Customer Fields */}
                {customerPhone.length >= 10 && (
                  <div className="grid grid-cols-2 gap-3 mt-3 animate-in fade-in slide-in-from-top-2">
                    <input
                      type="text"
                      placeholder={t("customerName")}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className={`px-4 py-3 rounded-xl border outline-none ${
                        isDarkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                      }`}
                    />
                    <input
                      type="email"
                      placeholder={t("emailOptional")}
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className={`px-4 py-3 rounded-xl border outline-none ${
                        isDarkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                      }`}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`flex items-center justify-between p-3 rounded-xl ${
                  isDarkMode ? "bg-gray-900" : "bg-white shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDarkMode
                        ? "bg-indigo-900/50 text-indigo-400"
                        : "bg-indigo-100 text-indigo-600"
                    }`}
                  >
                    <MdPerson className="text-xl" />
                  </div>
                  <div>
                    <p className="font-bold">{selectedCustomer.name}</p>
                    <p className="text-xs text-gray-500">
                      {selectedCustomer.phone}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                >
                  <MdClose />
                </button>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 block">
              {t("paymentMethod")}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "cash", icon: IoMdCash, label: t("cash") },
                { id: "card", icon: MdCreditCard, label: t("card") },
                {
                  id: "wallet",
                  icon: MdAccountBalanceWallet,
                  label: t("wallet"),
                },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    paymentMethod === method.id
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                      : isDarkMode
                      ? "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600"
                      : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                  }`}
                >
                  <method.icon className="text-2xl" />
                  <span className="font-semibold text-sm">
                    {method.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Cash Input */}
          {paymentMethod === "cash" && (
            <div className="animate-in fade-in slide-in-from-top-4">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 block">
                {t("cashReceived")}
              </label>
              <div className="relative mb-3">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400 font-bold">৳</span>
                <input
                  type="number"
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(e.target.value)}
                  className={`w-full pl-10 pr-4 py-4 text-xl font-bold rounded-xl border outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-200 text-gray-900"
                  }`}
                  placeholder="0.00"
                />
              </div>

              <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                {quickCashAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setReceivedAmount(amt.toString())}
                    className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                      isDarkMode
                        ? "bg-gray-800 hover:bg-gray-700 border border-gray-700"
                        : "bg-white border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    ৳{amt}
                  </button>
                ))}
              </div>

              {/* Change Calculation */}
              {receivedAmount &&
                parseFloat(receivedAmount) >= calculateGrandTotal() && (
                  <div
                    className={`p-4 rounded-xl flex justify-between items-center ${
                      isDarkMode
                        ? "bg-green-900/20 border border-green-900/50"
                        : "bg-green-50 border border-green-100"
                    }`}
                  >
                    <span
                      className={
                        isDarkMode ? "text-green-400" : "text-green-700"
                      }
                    >
                      {t("changeDue")}
                    </span>
                    <span
                      className={`text-xl font-bold ${
                        isDarkMode ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      {formatCurrency(getChangeAmount())}
                    </span>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-6 border-t ${
            isDarkMode ? "border-gray-800" : "border-gray-100"
          }`}
        >
          <button
            onClick={processPayment}
            className="w-full py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <MdCheck className="text-2xl" />
            {t("completeSale")} {formatCurrency(calculateGrandTotal())}
          </button>
        </div>
      </div>
    </div>
  );
};
