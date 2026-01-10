"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { PermissionKey } from "@/lib/permissions";
import { useSidebar } from "@/lib/SidebarContext";
import { useStore } from "@/lib/store";
import { getTranslation } from "@/lib/translations";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaTruck } from "react-icons/fa";
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
import { MdQrCode2, MdStore, MdShoppingCart } from "react-icons/md";
import { RxDoubleArrowLeft } from "react-icons/rx";

interface MenuItem {
  icon: React.ReactElement;
  label: string;
  path: string;
  expandable?: boolean;
  subItems?: { label: string; path: string; permission?: PermissionKey }[];
  badge?: string;
  permission?: PermissionKey;
}

const getMenuItems = (language: string): MenuItem[] => [
  {
    icon: <IoMdHome className="w-5 h-5" />,
    label: getTranslation("dashboard", language),
    path: "/",
    permission: "canViewDashboard",
  },
  {
    icon: <IoMdCard className="w-5 h-5" />,
    label: getTranslation("pointOfSale", language),
    path: "/pos",
    permission: "canCreateSales",
  },
  {
    icon: <IoMdCube className="w-5 h-5" />,
    label: getTranslation("products", language),
    path: "/products",
    permission: "canViewProducts",
    expandable: true,
    subItems: [
      {
        label: getTranslation("allProducts", language),
        path: "/products",
        permission: "canViewProducts",
      },
      {
        label: getTranslation("categories", language),
        path: "/products/categories",
        permission: "canManageCategories",
      },
      {
        label: getTranslation("addProduct", language),
        path: "/products/add-new-product",
        permission: "canAddProducts",
      },
      {
        label: getTranslation("brands", language),
        path: "/products/brands",
        permission: "canManageCategories",
      },
    ],
  },
  {
    icon: <FaTruck className="w-5 h-5" />,
    label: getTranslation("suppliers", language),
    path: "/suppliers",
    permission: "canViewSuppliers",
    expandable: true,
    subItems: [
      {
        label: getTranslation("allSuppliers", language),
        path: "/suppliers",
        permission: "canViewSuppliers",
      },
      {
        label: getTranslation("addSupplier", language),
        path: "/suppliers/add",
        permission: "canAddSuppliers",
      },
    ],
  },
  {
    icon: <IoMdAnalytics className="w-5 h-5" />,
    label: getTranslation("inventory", language),
    path: "/inventory",
    permission: "canViewInventory",
    expandable: true,
    subItems: [
      {
        label: getTranslation("stockLevels", language),
        path: "/inventory/stock",
        permission: "canViewInventory",
      },
      {
        label: getTranslation("lowStock", language),
        path: "/inventory/low-stock",
        permission: "canViewInventory",
      },
      {
        label: getTranslation("stockAdjustments", language),
        path: "/inventory/adjustments",
        permission: "canAdjustStock",
      },
    ],
  },
  {
    icon: <IoMdTrendingUp className="w-5 h-5" />,
    label: getTranslation("sales", language),
    path: "/sales",
    permission: "canViewSales",
    expandable: true,
    subItems: [
      {
        label: getTranslation("allSales", language),
        path: "/sales",
        permission: "canViewSales",
      },
      {
        label: getTranslation("todaysSales", language),
        path: "/sales/today",
        permission: "canViewSales",
      },
      {
        label: getTranslation("salesHistory", language),
        path: "/sales/history",
        permission: "canViewSales",
      },
    ],
  },
  {
    icon: <MdShoppingCart className="w-5 h-5" />,
    label: getTranslation("orders", language),
    path: "/orders",
    permission: "canViewOrders",
    expandable: true,
    subItems: [
      {
        label: getTranslation("allOrders", language),
        path: "/orders",
        permission: "canViewOrders",
      },
      {
        label: getTranslation("pendingOrders", language),
        path: "/orders/pending",
        permission: "canViewOrders",
      },
      {
        label: getTranslation("completedOrders", language),
        path: "/orders/completed",
        permission: "canViewOrders",
      },
    ],
  },
  {
    icon: <IoMdPeople className="w-5 h-5" />,
    label: getTranslation("customers", language),
    path: "/customers",
    permission: "canViewCustomers",
    expandable: true,
    subItems: [
      {
        label: getTranslation("allCustomers", language),
        path: "/customers",
        permission: "canViewCustomers",
      },
      {
        label: getTranslation("addCustomer", language),
        path: "/customers/create-customer",
        permission: "canAddCustomers",
      },
      {
        label: getTranslation("customerGroups", language),
        path: "/customers/groups",
        permission: "canViewCustomers",
      },
    ],
  },
  {
    icon: <IoMdDocument className="w-5 h-5" />,
    label: getTranslation("reports", language),
    path: "/reports",
    permission: "canViewReports",
    expandable: true,
    subItems: [
      {
        label: getTranslation("salesReport", language),
        path: "/reports/sales",
        permission: "canViewReports",
      },
      {
        label: getTranslation("inventoryReport", language),
        path: "/reports/inventory",
        permission: "canViewReports",
      },
      {
        label: getTranslation("customerReport", language),
        path: "/reports/customers",
        permission: "canViewReports",
      },
      {
        label: getTranslation("financialReport", language),
        path: "/reports/financial",
        permission: "canViewReports",
      },
    ],
  },
  {
    icon: <IoMdPerson className="w-5 h-5" />,
    label: getTranslation("users", language),
    path: "/users",
    permission: "canViewUsers",
    expandable: true,
    subItems: [
      {
        label: getTranslation("allUsers", language),
        path: "/users",
        permission: "canViewUsers",
      },
      {
        label: getTranslation("addUser", language),
        path: "/users/create-user",
        permission: "canAddUsers",
      },
    ],
  },
  {
    icon: <MdStore className="w-5 h-5" />,
    label: getTranslation("stores", language),
    path: "/stores",
    permission: "canViewStores",
    expandable: true,
    subItems: [
      {
        label: getTranslation("allStores", language),
        path: "/stores",
        permission: "canViewStores",
      },
      {
        label: getTranslation("addStore", language),
        path: "/stores/add",
        permission: "canAddStores",
      },
      {
        label: getTranslation("storeSettings", language),
        path: "/stores/settings",
        permission: "canManageStoreSettings",
      },
    ],
  },
  {
    icon: <MdQrCode2 className="w-5 h-5" />,
    label: getTranslation("barcode", language),
    path: "/barcode",
    permission: "canViewBarcodes",
    expandable: true,
    subItems: [
      {
        label: getTranslation("allBarcodes", language),
        path: "/barcode",
        permission: "canViewBarcodes",
      },
      {
        label: getTranslation("addBarcode", language),
        path: "/barcode/add",
        permission: "canGenerateBarcodes",
      },
    ],
  },
  {
    icon: <IoMdSettings className="w-5 h-5" />,
    label: getTranslation("settings", language),
    path: "/settings",
    permission: "canManageSettings",
    expandable: true,
    // subItems: [
    //   {
    //     label: getTranslation("generalSettings", language),
    //     path: "/settings/general",
    //   },
    //   {
    //     label: getTranslation("paymentMethods", language),
    //     path: "/settings/payments",
    //   },
    //   { label: getTranslation("taxSettings", language), path: "/settings/tax" },
    //   {
    //     label: getTranslation("receiptSettings", language),
    //     path: "/settings/receipts",
    //   },
    // ],
  },
];

export default function Sidebar() {
  const { isOpen, setIsOpen, isMobile, isDarkMode, setIsDarkMode } =
    useSidebar();
  const { language } = useLanguage();
  const pathname = usePathname();
  const { user, hasPermission } = useStore();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [mounted, setMounted] = useState(false);
  const [languageMounted, setLanguageMounted] = useState(false);

  // Wait for client-side hydration before filtering
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Wait for language to be loaded from localStorage to prevent hydration mismatch
  useEffect(() => {
    setLanguageMounted(true);
  }, []);

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const allMenuItems = getMenuItems(language);

  // Only filter menu items after client-side hydration to prevent mismatch
  const menuItems = mounted
    ? allMenuItems
        .filter((item) => {
          if (!item.permission) return true;
          return hasPermission(item.permission);
        })
        .map((item) => {
          // Filter subItems based on permissions
          if (item.subItems) {
            const filteredSubItems = item.subItems.filter((subItem) => {
              if (!subItem.permission) return true;
              return hasPermission(subItem.permission);
            });
            return { ...item, subItems: filteredSubItems };
          }
          return item;
        })
        // Remove parent items that have no accessible sub-items
        .filter((item) => {
          if (item.expandable && item.subItems) {
            return item.subItems.length > 0;
          }
          return true;
        })
    : allMenuItems; // Show all items during initial render to match SSR

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
                      <span className="font-medium text-sm" suppressHydrationWarning>
                        {item.label}
                      </span>
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
                        suppressHydrationWarning
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
              <span className="font-medium text-sm" suppressHydrationWarning>
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
                suppressHydrationWarning
              >
                {languageMounted ? (language === "en" ? "EN" : "বাংলা") : "EN"}
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
                suppressHydrationWarning
              >
                {languageMounted ? (language === "en" ? "EN" : "বাংলা") : "EN"}
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
