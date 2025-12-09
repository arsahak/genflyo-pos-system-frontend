"use client";
import {
  MdAdd,
  MdClose,
  MdDelete,
  MdLocalPharmacy,
  MdPayment,
  MdPercent,
  MdRemove,
  MdShoppingCart,
} from "react-icons/md";
import { useLanguage } from "@/lib/LanguageContext";
import { getTranslation } from "@/lib/translations";
import { CartItem } from "./types";

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
  handleCheckout: () => void;
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
  handleCheckout,
}: POSCartProps) => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(key, language);
  const formatCurrency = (amount: number) => `৳${amount.toFixed(2)}`;

  return (
    <div
      className={`w-[420px] flex flex-col border-l z-20 shadow-xl ${
        isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
      }`}
    >
      {/* Cart Header */}
      <div
        className={`flex items-center justify-between px-5 py-4 border-b ${
          isDarkMode ? "border-gray-800" : "border-gray-100"
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg ${
              isDarkMode
                ? "bg-indigo-900/50 text-indigo-400"
                : "bg-indigo-50 text-indigo-600"
            }`}
          >
            <MdShoppingCart className="text-xl" />
          </div>
          <h2
            className={`font-bold text-lg ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            {t("currentOrder")}
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-1">
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              title={t("clearCart")}
            >
              <MdDelete className="text-xl" />
            </button>
          )}
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-50">
            <div
              className={`p-6 rounded-full ${
                isDarkMode ? "bg-gray-800" : "bg-slate-100"
              }`}
            >
              <MdShoppingCart className="text-4xl text-gray-400" />
            </div>
            <p className="text-sm font-medium">{t("emptyCart")}</p>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {cart.map((item) => (
              <div
                key={item.id}
                className={`group relative p-3 rounded-xl border transition-all ${
                  isDarkMode
                    ? "bg-gray-800/40 border-gray-700/50 hover:bg-gray-800"
                    : "bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  <div
                    className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden ${
                      isDarkMode ? "bg-gray-700" : "bg-slate-100"
                    }`}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <MdLocalPharmacy className="text-gray-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4
                        className={`font-semibold text-sm truncate pr-2 ${
                          isDarkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {item.name}
                      </h4>
                      <span
                        className={`font-bold text-sm ${
                          isDarkMode ? "text-indigo-400" : "text-indigo-600"
                        }`}
                      >
                        {formatCurrency(getItemFinalPrice(item))}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(item.price)} / unit
                    </p>
                  </div>
                </div>

                {/* Controls Row - Cleaner */}
                <div
                  className={`flex items-center justify-between mt-3 pt-2 border-t border-dashed ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  {/* Quantity Stepper */}
                  <div
                    className={`flex items-center h-8 rounded-lg ${
                      isDarkMode ? "bg-gray-900" : "bg-slate-100"
                    }`}
                  >
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-full hover:text-red-500 flex items-center justify-center transition-colors"
                    >
                      <MdRemove className="text-xs" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold font-mono">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-full hover:text-green-500 flex items-center justify-center transition-colors"
                    >
                      <MdAdd className="text-xs" />
                    </button>
                  </div>

                  {/* Discount Input */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center h-8 px-2 rounded-lg border focus-within:ring-1 focus-within:ring-indigo-500 ${
                        isDarkMode
                          ? "border-gray-600 bg-gray-900"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <input
                        type="number"
                        className="w-8 text-right text-xs bg-transparent outline-none font-mono"
                        value={itemDiscount[item.id] || ""}
                        placeholder="0"
                        onChange={(e) => {
                          const val = Math.min(
                            100,
                            Math.max(0, parseFloat(e.target.value) || 0)
                          );
                          setItemDiscount({
                            ...itemDiscount,
                            [item.id]: val,
                          });
                        }}
                      />
                      <MdPercent className="text-xs text-gray-400 ml-1" />
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <MdClose className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Summary & Checkout */}
      {cart.length > 0 && (
        <div
          className={`border-t shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-20 ${
            isDarkMode ? "border-gray-800 bg-gray-900" : "border-gray-100 bg-white"
          }`}
        >
          {/* Calculations Block */}
          <div className="px-6 py-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                {t("subtotal")}
              </span>
              <span
                className={`font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-900"
                }`}
              >
                {formatCurrency(calculateSubtotal())}
              </span>
            </div>

            {/* Conditional Discounts */}
            {(calculateItemDiscounts() > 0 ||
              getMembershipDiscount() > 0 ||
              calculateOrderDiscount() > 0) && (
              <div className="space-y-1 pt-2 pb-2 border-y border-dashed border-gray-200 dark:border-gray-700">
                {calculateItemDiscounts() > 0 && (
                  <div className="flex justify-between text-emerald-500">
                    <span>{t("itemDiscounts")}</span>
                    <span>-{formatCurrency(calculateItemDiscounts())}</span>
                  </div>
                )}
                {getMembershipDiscount() > 0 && (
                  <div className="flex justify-between text-emerald-500">
                    <span>{t("memberDiscount")}</span>
                    <span>-{formatCurrency(getMembershipDiscount())}</span>
                  </div>
                )}
                {calculateOrderDiscount() > 0 && (
                  <div className="flex justify-between text-emerald-500">
                    <span>{t("orderDiscount")}</span>
                    <span>-{formatCurrency(calculateOrderDiscount())}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between">
              <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                {t("tax")} (5%)
              </span>
              <span
                className={`font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-900"
                }`}
              >
                {formatCurrency(calculateTax())}
              </span>
            </div>

            <div className="flex justify-between items-end pt-3">
              <span
                className={`text-lg font-bold ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {t("total")}
              </span>
              <span
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              >
                {formatCurrency(calculateGrandTotal())}
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="p-6 pt-0">
            <button
              onClick={handleCheckout}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/30 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <MdPayment className="text-xl" />
              {t("proceedToPayment")}
              <div className="bg-white/20 px-2 py-0.5 rounded text-xs ml-2">
                F8
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
