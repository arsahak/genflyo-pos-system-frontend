"use client";
import { MdLocalPharmacy, MdPause } from "react-icons/md";
import { useLanguage } from "@/lib/LanguageContext";
import { getTranslation } from "@/lib/translations";

interface POSHeaderProps {
  isDarkMode: boolean;
  storeName: string;
  heldOrdersCount: number;
  onOpenHeldOrders: () => void;
}

export const POSHeader = ({
  isDarkMode,
  storeName,
  heldOrdersCount,
  onOpenHeldOrders,
}: POSHeaderProps) => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(key, language);

  return (
    <div
      className={`sticky top-0 z-20 flex items-center justify-between px-6 py-3 border-b backdrop-blur-xl transition-all ${
        isDarkMode
          ? "bg-gray-900/80 border-gray-800"
          : "bg-white/80 border-white/40 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl shadow-lg ${
              isDarkMode
                ? "bg-indigo-900/30 text-indigo-400"
                : "bg-indigo-600 text-white shadow-indigo-200"
            }`}
          >
            <MdLocalPharmacy className="text-2xl" />
          </div>
          <div>
            <h1
              className={`text-xl font-bold tracking-tight ${
                isDarkMode ? "text-gray-100" : "text-slate-800"
              }`}
            >
              {storeName || "Pharmacy"}
            </h1>
            <p
              className={`text-xs font-medium ${
                isDarkMode ? "text-gray-500" : "text-slate-500"
              }`}
            >
              {t("posSystem")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Held Orders Button */}
        <button
          onClick={onOpenHeldOrders}
          className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all active:scale-95 ${
            isDarkMode
              ? "bg-gray-800 hover:bg-gray-700 text-amber-400 border border-gray-700"
              : "bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-100 shadow-sm"
          }`}
        >
          <MdPause className="text-lg" />
          <span className="text-sm font-semibold">{t("held")}</span>
          {heldOrdersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full bg-amber-500 text-white shadow-md">
              {heldOrdersCount}
            </span>
          )}
        </button>

        {/* Keyboard Shortcuts Info - Pill Style */}
        <div
          className={`hidden lg:flex items-center gap-3 px-4 py-2 rounded-full text-xs font-medium border ${
            isDarkMode
              ? "bg-gray-900 border-gray-700 text-gray-500"
              : "bg-white border-slate-200 text-slate-500 shadow-sm"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-sans">
              F2
            </kbd>{" "}
            {t("searchShort")}
          </span>
          <span className="w-px h-3 bg-gray-300 dark:bg-gray-700" />
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-sans">
              F8
            </kbd>{" "}
            {t("payShort")}
          </span>
        </div>
      </div>
    </div>
  );
};
