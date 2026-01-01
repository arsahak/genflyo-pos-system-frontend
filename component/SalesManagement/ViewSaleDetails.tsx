"use client";
import { useSidebar } from "@/lib/SidebarContext";
import { getSaleById } from "@/app/actions/sales";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useStore } from "@/lib/store";
import ProtectedRoute from "@/component/ProtectedRoute";
import { ViewSaleDetailsSkeleton } from "./components/ViewSaleDetailsSkeleton";
import {
  MdArrowBack,
  MdPrint,
  MdEdit,
  MdReceipt,
  MdPerson,
  MdStore,
  MdAttachMoney,
  MdCalendarToday,
  MdPayment,
  MdShoppingCart,
  MdDiscount,
  MdPercent,
  MdCheckCircle,
} from "react-icons/md";

interface ViewSaleDetailsProps {
  saleId: string;
}

const ViewSaleDetails = ({ saleId }: ViewSaleDetailsProps) => {
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [sale, setSale] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Wait for client-side hydration
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchSaleDetails();
    }
  }, [saleId, mounted]);

  const fetchSaleDetails = async () => {
    setLoading(true);
    try {
      const result = await getSaleById(saleId);

      if (result.success && result.data) {
        setSale(result.data);
      } else {
        toast.error(result.error || "Failed to fetch sale details");
        router.push("/sales");
      }
    } catch (error) {
      console.error("Error fetching sale details:", error);
      toast.error("An unexpected error occurred");
      router.push("/sales");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
    toast.success("Printing invoice...");
  };

  // Show loading while hydrating or fetching
  if (!mounted || loading) {
    return (
      <ProtectedRoute requiredPermission="canViewSales">
        <ViewSaleDetailsSkeleton isDarkMode={isDarkMode} />
      </ProtectedRoute>
    );
  }

  if (!sale) {
    return (
      <ProtectedRoute requiredPermission="canViewSales">
        <div className={`min-h-screen flex items-center justify-center p-6 ${
          isDarkMode ? "bg-gray-950" : "bg-slate-50"
        }`}>
          <div className={`text-center p-8 rounded-2xl border ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
            <MdReceipt className={`text-6xl mx-auto mb-4 ${
              isDarkMode ? "text-gray-600" : "text-gray-400"
            }`} />
            <p className={`text-xl font-semibold ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Sale not found
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredPermission="canViewSales">
      <div className={`min-h-screen p-6 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-950" : "bg-slate-50"
      }`}>
      <div className="max-w-[1920px] mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className={`flex items-center gap-2 mb-4 ${
              isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <MdArrowBack className="text-xl" />
            Back to Sales
          </button>
          <h1
            className={`text-3xl font-bold mb-2 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Sale Details
          </h1>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            {sale.saleNo}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
          >
            <MdPrint className="text-lg" />
            Print
          </button>
          <button
            onClick={() => router.push(`/sales/edit-sale/${sale._id}`)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
          >
            <MdEdit className="text-lg" />
            Edit
          </button>
        </div>
      </div>

      {/* Sale Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Customer Info */}
        <div
          className={`p-6 rounded-2xl shadow-xl border ${
            isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <MdPerson className="text-3xl text-indigo-600" />
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Customer
            </h2>
          </div>
          {sale.customerId ? (
            <div className="space-y-2">
              <p
                className={`font-semibold ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {sale.customerId.name}
              </p>
              <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                {sale.customerId.phone}
              </p>
              {sale.customerId.email && (
                <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  {sale.customerId.email}
                </p>
              )}
              {sale.customerId.membershipType && sale.customerId.membershipType !== "none" && (
                <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                  {sale.customerId.membershipType.toUpperCase()} MEMBER
                </span>
              )}
            </div>
          ) : (
            <p className="text-gray-500 italic">Walk-in Customer</p>
          )}
        </div>

        {/* Store Info */}
        <div
          className={`p-6 rounded-2xl shadow-xl border ${
            isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <MdStore className="text-3xl text-green-600" />
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Store
            </h2>
          </div>
          {sale.storeId && (
            <div className="space-y-2">
              <p
                className={`font-semibold ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {sale.storeId.name}
              </p>
              {sale.storeId.address && typeof sale.storeId.address === 'object' && (
                <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  {[
                    sale.storeId.address.street,
                    sale.storeId.address.city,
                    sale.storeId.address.state,
                    sale.storeId.address.zipCode,
                    sale.storeId.address.country
                  ].filter(Boolean).join(', ')}
                </p>
              )}
              {sale.storeId.address && typeof sale.storeId.address === 'string' && (
                <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  {sale.storeId.address}
                </p>
              )}
              {sale.storeId.phone && (
                <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  {sale.storeId.phone}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Sale Info */}
        <div
          className={`p-6 rounded-2xl shadow-xl border ${
            isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <MdReceipt className="text-3xl text-orange-600" />
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Sale Info
            </h2>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MdCalendarToday className="text-gray-400" />
              <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                {new Date(sale.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full ${
                  sale.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : sale.status === "refunded"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                } text-xs font-semibold`}
              >
                {sale.status.replace("_", " ").toUpperCase()}
              </span>
            </div>
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              Cashier: {sale.cashierId?.name || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div
        className={`p-6 rounded-2xl shadow-xl border mb-6 ${
          isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <MdShoppingCart className="text-2xl text-indigo-600" />
          <h2
            className={`text-xl font-semibold ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Sale Items
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              className={
                isDarkMode ? "bg-gray-700 text-gray-100" : "bg-gray-100 text-gray-900"
              }
            >
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-center">Quantity</th>
                <th className="px-4 py-3 text-right">Unit Price</th>
                <th className="px-4 py-3 text-right">Discount</th>
                <th className="px-4 py-3 text-right">Tax</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {sale.items.map((item: any, index: number) => (
                <tr
                  key={index}
                  className={`border-t ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <td className="px-4 py-3">
                    <p
                      className={`font-semibold ${
                        isDarkMode ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {item.productName}
                    </p>
                    {item.productId?.sku && (
                      <p className="text-xs text-gray-500">
                        SKU: {item.productId.sku}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`font-semibold ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    ${item.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-green-600">
                    {item.discount > 0 ? `-$${item.discount.toFixed(2)}` : "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    ${item.tax.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`font-bold ${
                        isDarkMode ? "text-indigo-400" : "text-indigo-600"
                      }`}
                    >
                      ${item.total.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Information */}
        <div
          className={`p-6 rounded-2xl shadow-xl border ${
            isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <MdPayment className="text-2xl text-green-600" />
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Payment Details
            </h2>
          </div>
          <div className="space-y-3">
            {sale.payments.map((payment: any, index: number) => (
              <div
                key={index}
                className={`p-3 rounded-lg flex justify-between items-center ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <div>
                  <p
                    className={`font-semibold ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {payment.method.replace("_", " ").toUpperCase()}
                  </p>
                  {payment.reference && (
                    <p className="text-xs text-gray-500">
                      Ref: {payment.reference}
                    </p>
                  )}
                </div>
                <span
                  className={`font-bold text-lg ${
                    isDarkMode ? "text-green-400" : "text-green-600"
                  }`}
                >
                  ${payment.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sale Summary */}
        <div
          className={`p-6 rounded-2xl shadow-xl border ${
            isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <MdAttachMoney className="text-2xl text-purple-600" />
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Summary
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                Subtotal:
              </span>
              <span
                className={`font-semibold ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                ${sale.subtotal.toFixed(2)}
              </span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-green-600">Discount:</span>
                <span className="text-green-600 font-semibold">
                  -${sale.discount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                Tax:
              </span>
              <span
                className={`font-semibold ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                ${sale.tax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-700">
              <span
                className={`text-lg font-bold ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Grand Total:
              </span>
              <span
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              >
                ${sale.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {sale.notes && (
        <div
          className={`p-6 rounded-2xl shadow-xl border mt-6 ${
            isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-2 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Notes
          </h3>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            {sale.notes}
          </p>
        </div>
      )}
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default ViewSaleDetails;

