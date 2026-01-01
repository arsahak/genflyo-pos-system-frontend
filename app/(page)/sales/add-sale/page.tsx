"use client";
import { useSidebar } from "@/lib/SidebarContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  MdPointOfSale,
  MdArrowForward,
  MdShoppingCart,
  MdInfo,
} from "react-icons/md";

const AddSalePage = () => {
  const { isDarkMode } = useSidebar();
  const router = useRouter();

  return (
    <div className="p-6 flex items-center justify-center min-h-screen">
      <div
        className={`max-w-2xl w-full p-8 rounded-2xl border-2 text-center ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <div
              className={`p-6 rounded-full ${
                isDarkMode ? "bg-indigo-900" : "bg-indigo-100"
              }`}
            >
              <MdPointOfSale className="text-6xl text-indigo-600" />
            </div>
          </div>
          <h1
            className={`text-3xl font-bold mb-3 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Create New Sale
          </h1>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Use the Point of Sale system to create new sales transactions
          </p>
        </div>

        <div
          className={`p-6 rounded-xl mb-6 ${
            isDarkMode ? "bg-gray-700" : "bg-blue-50"
          }`}
        >
          <div className="flex items-start gap-3 mb-4">
            <MdInfo
              className={`text-2xl flex-shrink-0 ${
                isDarkMode ? "text-blue-400" : "text-blue-600"
              }`}
            />
            <div className="text-left">
              <h3
                className={`font-semibold mb-2 ${
                  isDarkMode ? "text-blue-400" : "text-blue-700"
                }`}
              >
                How to Create a Sale:
              </h3>
              <ul
                className={`space-y-2 text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Add products to cart using search or barcode scanner</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Apply discounts and coupons if needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Enter customer details (optional)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Select payment method and complete transaction</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push("/sales")}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
              isDarkMode
                ? "bg-gray-700 text-gray-100 hover:bg-gray-600"
                : "bg-gray-200 text-gray-900 hover:bg-gray-300"
            }`}
          >
            Back to Sales List
          </button>
          <button
            onClick={() => router.push("/pos")}
            className="flex-1 px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-semibold flex items-center justify-center gap-2"
          >
            <MdShoppingCart />
            Go to POS System
            <MdArrowForward />
          </button>
        </div>

        <p
          className={`mt-4 text-sm ${
            isDarkMode ? "text-gray-500" : "text-gray-500"
          }`}
        >
          💡 Tip: Use the POS system for faster checkout and real-time inventory updates
        </p>
      </div>
    </div>
  );
};

export default AddSalePage;

