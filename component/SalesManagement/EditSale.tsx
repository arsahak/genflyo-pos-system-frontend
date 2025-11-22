"use client";
import { useSidebar } from "@/lib/SidebarContext";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  MdArrowBack,
  MdSave,
  MdCancel,
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
      const response = await api.get(`/sales/${saleId}`);
      setSale(response.data);
      setFormData({
        status: response.data.status,
        notes: response.data.notes || "",
      });
    } catch (error: any) {
      console.error("Error fetching sale details:", error);
      toast.error(error.response?.data?.message || "Failed to fetch sale details");
      router.push("/sales");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put(`/sales/${saleId}`, formData);
      toast.success("Sale updated successfully");
      router.push(`/sales/${saleId}`);
    } catch (error: any) {
      console.error("Error updating sale:", error);
      toast.error(error.response?.data?.message || "Failed to update sale");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
          Sale not found
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
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
        className={`p-6 rounded-xl border-2 mb-6 ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
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
          className={`p-6 rounded-xl border-2 mb-6 ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
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
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
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
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
              isDarkMode
                ? "bg-gray-700 text-gray-100 hover:bg-gray-600"
                : "bg-gray-200 text-gray-900 hover:bg-gray-300"
            }`}
          >
            <MdCancel />
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
};

export default EditSale;

