"use client";
import { useSidebar } from "@/lib/SidebarContext";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  MdStore,
  MdAdd,
  MdEdit,
  MdDelete,
  MdSettings,
  MdLocationOn,
  MdPhone,
  MdEmail,
  MdRefresh,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";

interface Store {
  _id: string;
  name: string;
  code: string;
  type: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: string;
  email: string;
  timezone: string;
  settings: {
    currency: string;
    locale?: string;
    receiptHeader: string;
    receiptFooter: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const StoresList = () => {
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await api.get("/stores");
      setStores(response.data || []);
    } catch (error: any) {
      console.error("Error fetching stores:", error);
      toast.error(error.response?.data?.message || "Failed to fetch stores");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (storeId: string) => {
    try {
      await api.delete(`/stores/${storeId}`);
      toast.success("Store deleted successfully");
      fetchStores();
      setDeleteConfirm(null);
    } catch (error: any) {
      console.error("Error deleting store:", error);
      toast.error(error.response?.data?.message || "Failed to delete store");
    }
  };

  const getStoreTypeColor = (type: string) => {
    const colors: any = {
      restaurant: "bg-orange-100 text-orange-800 border-orange-300",
      pharmacy: "bg-green-100 text-green-800 border-green-300",
      electronics: "bg-blue-100 text-blue-800 border-blue-300",
      supershop: "bg-purple-100 text-purple-800 border-purple-300",
    };
    return colors[type] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getStoreTypeColorDark = (type: string) => {
    const colors: any = {
      restaurant: "bg-orange-900/30 text-orange-400 border-orange-800",
      pharmacy: "bg-green-900/30 text-green-400 border-green-800",
      electronics: "bg-blue-900/30 text-blue-400 border-blue-800",
      supershop: "bg-purple-900/30 text-purple-400 border-purple-800",
    };
    return colors[type] || "bg-gray-900/30 text-gray-400 border-gray-800";
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1
              className={`text-3xl font-bold mb-2 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Store Management
            </h1>
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              Manage your store locations and settings
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchStores}
              className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 flex items-center gap-2"
            >
              <MdRefresh />
              Refresh
            </button>
            <button
              onClick={() => router.push("/stores/add")}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
            >
              <MdAdd />
              Add Store
            </button>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div
        className={`p-6 rounded-lg border-2 mb-6 ${
          isDarkMode
            ? "bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-indigo-800"
            : "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total Active Stores
            </p>
            <p
              className={`text-4xl font-bold ${
                isDarkMode ? "text-indigo-400" : "text-indigo-600"
              }`}
            >
              {stores.length}
            </p>
          </div>
          <MdStore
            className={`text-6xl ${
              isDarkMode ? "text-indigo-400/50" : "text-indigo-300"
            }`}
          />
        </div>
      </div>

      {/* Stores Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : stores.length === 0 ? (
        <div
          className={`text-center py-12 rounded-lg border-2 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <MdStore className="text-6xl text-gray-400 mx-auto mb-4" />
          <p
            className={`text-xl font-semibold mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            No stores found
          </p>
          <p
            className={`mb-4 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Add your first store to get started
          </p>
          <button
            onClick={() => router.push("/stores/add")}
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 inline-flex items-center gap-2"
          >
            <MdAdd />
            Add First Store
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store._id}
              className={`rounded-lg border-2 overflow-hidden transition-all hover:shadow-lg ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              {/* Store Header */}
              <div
                className={`p-4 border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-lg ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <MdStore className="text-2xl text-indigo-600" />
                    </div>
                    <div>
                      <h3
                        className={`text-lg font-bold ${
                          isDarkMode ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {store.name}
                      </h3>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {store.code}
                      </p>
                    </div>
                  </div>
                  {store.isActive ? (
                    <MdCheckCircle className="text-2xl text-green-500" />
                  ) : (
                    <MdCancel className="text-2xl text-red-500" />
                  )}
                </div>

                {/* Store Type Badge */}
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border capitalize ${
                    isDarkMode
                      ? getStoreTypeColorDark(store.type)
                      : getStoreTypeColor(store.type)
                  }`}
                >
                  {store.type}
                </span>
              </div>

              {/* Store Details */}
              <div className="p-4 space-y-3">
                {/* Address */}
                <div className="flex items-start gap-2">
                  <MdLocationOn
                    className={`text-lg mt-0.5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {store.address.street}
                    </p>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {store.address.city}, {store.address.state}{" "}
                      {store.address.zipCode}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                {store.phone && (
                  <div className="flex items-center gap-2">
                    <MdPhone
                      className={`text-lg ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {store.phone}
                    </p>
                  </div>
                )}

                {/* Email */}
                {store.email && (
                  <div className="flex items-center gap-2">
                    <MdEmail
                      className={`text-lg ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {store.email}
                    </p>
                  </div>
                )}

                {/* Settings Info */}
                <div
                  className={`pt-3 border-t ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }
                    >
                      Currency: {store.settings.currency}
                    </span>
                    <span
                      className={
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }
                    >
                      Timezone: {store.timezone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className={`p-4 border-t flex gap-2 ${
                  isDarkMode
                    ? "bg-gray-750 border-gray-700"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <button
                  onClick={() => router.push(`/stores/settings/${store._id}`)}
                  className="flex-1 px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center gap-2 text-sm"
                >
                  <MdSettings />
                  Settings
                </button>
                <button
                  onClick={() => router.push(`/stores/settings/${store._id}`)}
                  className="px-3 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
                  title="Edit"
                >
                  <MdEdit />
                </button>
                <button
                  onClick={() => setDeleteConfirm(store._id)}
                  className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  title="Delete"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`max-w-md w-full rounded-xl shadow-2xl ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="p-6">
              <h2
                className={`text-2xl font-bold mb-4 ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Delete Store?
              </h2>
              <p
                className={`mb-6 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Are you sure you want to delete this store? This action will
                deactivate the store and it won't be available for operations.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className={`flex-1 px-4 py-2 rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-100 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoresList;

