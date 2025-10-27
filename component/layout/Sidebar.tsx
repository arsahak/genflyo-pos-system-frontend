"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { useSidebar } from "@/lib/SidebarContext";
import { getTranslation } from "@/lib/translations";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  IoIosArrowDown,
  IoMdAnalytics,
  IoMdCard,
  IoMdCube,
  IoMdDocument,
  IoMdHome,
  IoMdMoon,
  IoMdPeople,
  IoMdPerson,
  IoMdSettings,
  IoMdSunny,
  IoMdTrendingUp,
} from "react-icons/io";
import { MdStore } from "react-icons/md";
import { RxDoubleArrowLeft } from "react-icons/rx";

interface MenuItem {
  icon: React.ReactElement;
  label: string;
  path: string;
  expandable?: boolean;
  subItems?: { label: string; path: string }[];
  badge?: string;
}

const getMenuItems = (language: string): MenuItem[] => [
  {
    icon: <IoMdHome className="w-5 h-5" />,
    label: getTranslation("dashboard", language),
    path: "/",
  },
  {
    icon: <IoMdCard className="w-5 h-5" />,
    label: getTranslation("pointOfSale", language),
    path: "/pos",
  },
  {
    icon: <IoMdCube className="w-5 h-5" />,
    label: getTranslation("products", language),
    path: "/products",
    expandable: true,
    subItems: [
      { label: getTranslation("allProducts", language), path: "/products" },
      {
        label: getTranslation("categories", language),
        path: "/products/categories",
      },
      { label: getTranslation("addProduct", language), path: "/products/add" },
    ],
  },
  {
    icon: <IoMdAnalytics className="w-5 h-5" />,
    label: getTranslation("inventory", language),
    path: "/inventory",
    expandable: true,
    subItems: [
      {
        label: getTranslation("stockLevels", language),
        path: "/inventory/stock",
      },
      {
        label: getTranslation("lowStock", language),
        path: "/inventory/low-stock",
      },
      {
        label: getTranslation("stockAdjustments", language),
        path: "/inventory/adjustments",
      },
    ],
  },
  {
    icon: <IoMdTrendingUp className="w-5 h-5" />,
    label: getTranslation("sales", language),
    path: "/sales",
    expandable: true,
    subItems: [
      { label: getTranslation("allSales", language), path: "/sales" },
      { label: getTranslation("todaysSales", language), path: "/sales/today" },
      {
        label: getTranslation("salesHistory", language),
        path: "/sales/history",
      },
    ],
  },
  {
    icon: <IoMdPeople className="w-5 h-5" />,
    label: getTranslation("customers", language),
    path: "/customers",
    expandable: true,
    subItems: [
      { label: getTranslation("allCustomers", language), path: "/customers" },
      {
        label: getTranslation("addCustomer", language),
        path: "/customers/add",
      },
      {
        label: getTranslation("customerGroups", language),
        path: "/customers/groups",
      },
    ],
  },
  {
    icon: <IoMdDocument className="w-5 h-5" />,
    label: getTranslation("reports", language),
    path: "/reports",
    expandable: true,
    subItems: [
      {
        label: getTranslation("salesReport", language),
        path: "/reports/sales",
      },
      {
        label: getTranslation("inventoryReport", language),
        path: "/reports/inventory",
      },
      {
        label: getTranslation("customerReport", language),
        path: "/reports/customers",
      },
      {
        label: getTranslation("financialReport", language),
        path: "/reports/financial",
      },
    ],
  },
  {
    icon: <IoMdPerson className="w-5 h-5" />,
    label: getTranslation("users", language),
    path: "/users",
    expandable: true,
    subItems: [
      { label: getTranslation("allUsers", language), path: "/users" },
      { label: getTranslation("addUser", language), path: "/users/add" },
      {
        label: getTranslation("rolesPermissions", language),
        path: "/users/roles",
      },
    ],
  },
  {
    icon: <MdStore className="w-5 h-5" />,
    label: getTranslation("stores", language),
    path: "/stores",
    expandable: true,
    subItems: [
      { label: getTranslation("allStores", language), path: "/stores" },
      { label: getTranslation("addStore", language), path: "/stores/add" },
      {
        label: getTranslation("storeSettings", language),
        path: "/stores/settings",
      },
    ],
  },
  {
    icon: <IoMdSettings className="w-5 h-5" />,
    label: getTranslation("settings", language),
    path: "/settings",
    expandable: true,
    subItems: [
      {
        label: getTranslation("generalSettings", language),
        path: "/settings/general",
      },
      {
        label: getTranslation("paymentMethods", language),
        path: "/settings/payments",
      },
      { label: getTranslation("taxSettings", language), path: "/settings/tax" },
      {
        label: getTranslation("receiptSettings", language),
        path: "/settings/receipts",
      },
    ],
  },
];

export default function Sidebar() {
  const { isOpen, setIsOpen, isMobile, isDarkMode, setIsDarkMode } =
    useSidebar();
  const { language } = useLanguage();
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const menuItems = getMenuItems(language);

  return (
    <div className="relative">
      <aside
        className={`fixed left-0 top-0 transition-all duration-200 h-screen shadow-sm z-50 flex flex-col ${
          isOpen ? "w-64 md:w-64 sm:w-56" : "w-16 md:w-16 sm:w-14"
        } ${isMobile && !isOpen ? "hidden" : ""} ${
          isDarkMode
            ? "bg-gray-900 text-gray-100 border-r border-gray-700"
            : "bg-white text-gray-800 border-r border-gray-200"
        }`}
      >
        {/* Logo */}
        <div
          className={`p-4 pb-5 mt-2 transition-colors duration-200 ${
            isDarkMode ? "border-b border-gray-700" : "border-b border-gray-200"
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                isDarkMode ? "bg-blue-600" : "bg-gray-800"
              }`}
            >
              <span className="text-white font-bold text-lg">G</span>
            </div>
            {isOpen && (
              <div>
                <h1
                  className={`text-lg font-semibold transition-colors duration-200 ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  GENFLYO POS
                </h1>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const isExpanded = expandedSections[item.label];

            return (
              <div key={item.path}>
                <div className="flex items-center">
                  <Link
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 flex-1 ${
                      isActive
                        ? isDarkMode
                          ? "bg-blue-900 text-blue-300"
                          : "bg-blue-50 text-blue-600"
                        : isDarkMode
                        ? "text-gray-300 hover:bg-gray-800"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`transition-colors duration-200 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {item.icon}
                    </span>
                    {isOpen && (
                      <span className="font-medium text-sm">{item.label}</span>
                    )}
                  </Link>

                  {/* Badge */}
                  {isOpen && item.badge && (
                    <div
                      className={`text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2 transition-colors duration-200 ${
                        isDarkMode ? "bg-blue-600" : "bg-gray-600"
                      }`}
                    >
                      {item.badge}
                    </div>
                  )}

                  {/* Chevron for expandable sections */}
                  {isOpen && item.expandable && (
                    <button
                      onClick={() => toggleSection(item.label)}
                      className={`p-1 rounded transition-colors duration-200 ${
                        isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                      }`}
                    >
                      <IoIosArrowDown
                        className={`w-4 h-4 transition-all duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        } ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                      />
                    </button>
                  )}
                </div>

                {/* Sub-items */}
                {isOpen && item.expandable && isExpanded && item.subItems && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.path}
                        href={subItem.path}
                        className={`block px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                          pathname === subItem.path
                            ? isDarkMode
                              ? "text-blue-300 bg-blue-900"
                              : "text-blue-600 bg-blue-50"
                            : isDarkMode
                            ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <div
          className={`p-3 transition-colors duration-200 ${
            isDarkMode ? "border-t border-gray-700" : "border-t border-gray-200"
          }`}
        >
          {isOpen ? (
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                isDarkMode
                  ? "text-gray-300 hover:bg-gray-800"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {isDarkMode ? (
                <IoMdSunny className="w-5 h-5" />
              ) : (
                <IoMdMoon className="w-5 h-5" />
              )}
              <span className="font-medium text-sm">
                {isDarkMode
                  ? getTranslation("lightMode", language)
                  : getTranslation("darkMode", language)}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {language === "en" ? "EN" : "বাংলা"}
              </span>
            </button>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`w-full flex items-center justify-center px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {isDarkMode ? (
                  <IoMdSunny className="w-5 h-5" />
                ) : (
                  <IoMdMoon className="w-5 h-5" />
                )}
              </button>
              <span
                className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {language === "en" ? "EN" : "বাংলা"}
              </span>
            </div>
          )}
        </div>
      </aside>

      {/* Toggle Button - Responsive positioning */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1/2 rounded-full flex items-center justify-center shadow-sm transition-all duration-200 z-50 w-6 h-6 md:w-7 md:h-7 sm:w-5 sm:h-5 ${
          isDarkMode
            ? "bg-gray-800 border border-gray-600 hover:bg-gray-700"
            : "bg-white border border-gray-300 hover:bg-gray-50"
        }`}
        style={{
          transform: "translateY(-50%)",
          left: isOpen ? "calc(16rem - 16px)" : "calc(4rem - 16px)",
        }}
      >
        <RxDoubleArrowLeft
          className={`w-3 h-3 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        />
      </button>
    </div>
  );
}
