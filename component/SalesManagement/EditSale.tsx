"use client";
import { useSidebar } from "@/lib/SidebarContext";
import { getSaleById, updateSale } from "@/app/actions/sales";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { EditSaleSkeleton } from "./components/EditSaleSkeleton";
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdReceipt,
} from "react-icons/md";

interface EditSaleProps {
  saleId: string;
}

const EditSale = ({ saleId }: EditSaleProps) => {
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sale, setSale] = useState<any>(null);
  const [formData, setFormData] = useState({
    status: "",
    notes: "",
  });

  useEffect(() => {
    fetchSaleDetails();
  }, [saleId]);

  const fetchSaleDetails = async () => {
    setLoading(true);
    try {
      const result = await getSaleById(saleId);

      if (result.success && result.data) {
        setSale(result.data);
        setFormData({
          status: result.data.status,
          notes: result.data.notes || "",
        });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = new FormData();
      data.append("saleData", JSON.stringify(formData));

      const result = await updateSale(saleId, data);

      if (result.success) {
        toast.success(result.message || "Sale updated successfully");
        router.push(`/sales/${saleId}`);
      } else {
        toast.error(result.error || "Failed to update sale");
      }
    } catch (error) {
      console.error("Error updating sale:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <EditSaleSkeleton isDarkMode={isDarkMode} />;
  }

  if (!sale) {
    return (
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
    );
  }

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${
      isDarkMode ? "bg-gray-950" : "bg-slate-50"
    }`}>
      <div className="max-w-[1920px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className={`flex items-center gap-2 mb-4 ${
            isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <MdArrowBack className="text-xl" />
          Back
        </button>
        <h1
          className={`text-3xl font-bold mb-2 ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Edit Sale
        </h1>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
          {sale.saleNo}
        </p>
      </div>

      {/* Sale Information (Read-only) */}
      <div
        className={`p-6 rounded-2xl shadow-xl border mb-6 ${
          isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
        }`}
      >
        <h2
          className={`text-xl font-semibold mb-4 ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Sale Information (Read-only)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className={`text-sm mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Sale Number
            </p>
            <p className={`font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
              {sale.saleNo}
            </p>
          </div>
          <div>
            <p className={`text-sm mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Total Amount
            </p>
            <p className={`font-semibold ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
              ${sale.total.toFixed(2)}
            </p>
          </div>
          <div>
            <p className={`text-sm mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Date
            </p>
            <p className={`font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
              {new Date(sale.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit}>
        <div
          className={`p-6 rounded-2xl shadow-xl border mb-6 ${
            isDarkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/20" : "bg-white border-gray-100 shadow-slate-200/50"
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-4 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Editable Fields
          </h2>

          <div className="space-y-4">
            {/* Status */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100 hover:border-gray-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
                required
              >
                <option value="completed">Completed</option>
                <option value="refunded">Refunded</option>
                <option value="partially_refunded">Partially Refunded</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={4}
                placeholder="Add any notes about this sale..."
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 hover:border-gray-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400"
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 border-2 transition-all ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-100 hover:bg-gray-600"
                : "bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200"
            }`}
          >
            <MdCancel />
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <MdSave />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default EditSale;

