"use client";
import { useSidebar } from "@/lib/SidebarContext";
import { useRouter } from "next/navigation";
import {
  MdSettings,
  MdBusiness,
  MdPayment,
  MdReceipt,
  MdNotifications,
  MdInventory,
  MdPeople,
  MdSecurity,
  MdComputer,
  MdPercent,
  MdArrowForward,
} from "react-icons/md";

const SettingsDashboard = () => {
  const { isDarkMode } = useSidebar();
  const router = useRouter();

  const settingsSections = [
    {
      id: "general",
      title: "General Settings",
      description: "Business info, currency, timezone, and regional settings",
      icon: MdBusiness,
      color: "blue",
      route: "/settings/general",
    },
    {
      id: "tax",
      title: "Tax Configuration",
      description: "Tax rules, rates, and tax-inclusive pricing",
      icon: MdPercent,
      color: "green",
    route: "/settings/tax",
    },
    {
      id: "payment",
      title: "Payment Methods",
      description: "Configure payment options and gateway settings",
      icon: MdPayment,
      color: "purple",
      route: "/settings/payment",
    },
    {
      id: "receipt",
      title: "Receipt & Invoice",
      description: "Receipt templates, invoice numbering, and branding",
      icon: MdReceipt,
      color: "orange",
      route: "/settings/receipt",
    },
    {
      id: "inventory",
      title: "Inventory Settings",
      description: "Stock alerts, auto-reorder, and inventory rules",
      icon: MdInventory,
      color: "red",
      route: "/settings/inventory",
    },
    {
      id: "customer",
      title: "Customer Settings",
      description: "Loyalty program, points, and customer preferences",
      icon: MdPeople,
      color: "pink",
      route: "/settings/customer",
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Email, SMS, and push notification configuration",
      icon: MdNotifications,
      color: "indigo",
      route: "/settings/notifications",
    },
    {
      id: "security",
      title: "Security",
      description: "Password policies, session timeout, 2FA",
      icon: MdSecurity,
      color: "gray",
      route: "/settings/security",
    },
    {
      id: "pos",
      title: "POS Settings",
      description: "Sound, printer, barcode scanner, and touch mode",
      icon: MdComputer,
      color: "teal",
      route: "/settings/pos",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: any = {
      blue: {
        bg: "bg-blue-50",
        bgDark: "bg-blue-900/20",
        icon: "text-blue-600",
        iconDark: "text-blue-400",
        border: "border-blue-200",
        borderDark: "border-blue-800",
      },
      green: {
        bg: "bg-green-50",
        bgDark: "bg-green-900/20",
        icon: "text-green-600",
        iconDark: "text-green-400",
        border: "border-green-200",
        borderDark: "border-green-800",
      },
      purple: {
        bg: "bg-purple-50",
        bgDark: "bg-purple-900/20",
        icon: "text-purple-600",
        iconDark: "text-purple-400",
        border: "border-purple-200",
        borderDark: "border-purple-800",
      },
      orange: {
        bg: "bg-orange-50",
        bgDark: "bg-orange-900/20",
        icon: "text-orange-600",
        iconDark: "text-orange-400",
        border: "border-orange-200",
        borderDark: "border-orange-800",
      },
      red: {
        bg: "bg-red-50",
        bgDark: "bg-red-900/20",
        icon: "text-red-600",
        iconDark: "text-red-400",
        border: "border-red-200",
        borderDark: "border-red-800",
      },
      pink: {
        bg: "bg-pink-50",
        bgDark: "bg-pink-900/20",
        icon: "text-pink-600",
        iconDark: "text-pink-400",
        border: "border-pink-200",
        borderDark: "border-pink-800",
      },
      indigo: {
        bg: "bg-indigo-50",
        bgDark: "bg-indigo-900/20",
        icon: "text-indigo-600",
        iconDark: "text-indigo-400",
        border: "border-indigo-200",
        borderDark: "border-indigo-800",
      },
      gray: {
        bg: "bg-gray-50",
        bgDark: "bg-gray-900/20",
        icon: "text-gray-600",
        iconDark: "text-gray-400",
        border: "border-gray-200",
        borderDark: "border-gray-800",
      },
      teal: {
        bg: "bg-teal-50",
        bgDark: "bg-teal-900/20",
        icon: "text-teal-600",
        iconDark: "text-teal-400",
        border: "border-teal-200",
        borderDark: "border-teal-800",
      },
    };
    return colors[color];
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MdSettings
            className={`text-4xl ${
              isDarkMode ? "text-indigo-400" : "text-indigo-600"
            }`}
          />
          <h1
            className={`text-3xl font-bold ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Settings
          </h1>
        </div>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
          Configure your POS system settings and preferences
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          const colors = getColorClasses(section.color);

          return (
            <div
              key={section.id}
              onClick={() => router.push(section.route)}
              className={`rounded-lg border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${
                isDarkMode
                  ? `${colors.bgDark} ${colors.borderDark} hover:${colors.borderDark}`
                  : `${colors.bg} ${colors.border} hover:${colors.border}`
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <Icon
                    className={`text-3xl ${
                      isDarkMode ? colors.iconDark : colors.icon
                    }`}
                  />
                </div>
                <MdArrowForward
                  className={`text-xl ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
              </div>

              <h3
                className={`text-lg font-bold mb-2 ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {section.title}
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {section.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Info Section */}
      <div
        className={`mt-8 p-6 rounded-lg border-2 ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <h3
          className={`text-lg font-bold mb-3 ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          ⚙️ Configuration Guide
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p
              className={`font-semibold mb-1 ${
                isDarkMode ? "text-indigo-400" : "text-indigo-600"
              }`}
            >
              Required Settings
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              General settings and payment methods must be configured first
            </p>
          </div>
          <div>
            <p
              className={`font-semibold mb-1 ${
                isDarkMode ? "text-green-400" : "text-green-600"
              }`}
            >
              Optional Features
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Enable loyalty programs, notifications, and advanced features as needed
            </p>
          </div>
          <div>
            <p
              className={`font-semibold mb-1 ${
                isDarkMode ? "text-purple-400" : "text-purple-600"
              }`}
            >
              Save Changes
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Changes are saved immediately when you update each section
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsDashboard;

