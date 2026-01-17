"use client";

import { getProductById, deleteProduct } from "@/app/actions/product";
import { useSidebar } from "@/lib/SidebarContext";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  MdArrowBack,
  MdDelete,
  MdEdit,
  MdInventory,
  MdWarning,
  MdLocationOn,
  MdLocalPharmacy,
  MdAccessTime,
  MdPerson,
  MdCalendarToday,
} from "react-icons/md";

interface Product {
  _id: string;
  name: string;
  sku?: string;
  barcode?: string;
  description?: string;
  category: string;
  subCategory?: string;
  brand?: string;
  manufacturer?: string;
  price: number;
  cost?: number;
  wholesalePrice?: number;
  discountPrice?: number;
  discountPercentage?: number;
  purchaseUnit?: string;
  sellingUnit?: string;
  conversionFactor?: number;
  purchasePriceBox?: number;
  stock: number;
  minStock?: number;
  maxStock?: number;
  reorderLevel?: number;
  unit: string;
  mainImage?: {
    url: string;
    thumbUrl: string;
    displayUrl: string;
  };
  featureImages?: Array<{
    url: string;
    thumbUrl: string;
    displayUrl: string;
  }>;
  hasExpiry: boolean;
  expiryDate?: string;
  manufacturingDate?: string;
  batchNumber?: string;
  expiryAlertDays?: number;
  isExpiringSoon?: boolean;
  isExpired?: boolean;
  isLowStock?: boolean;
  profitMargin?: number;
  // Pharmacy fields
  isPrescription?: boolean;
  isControlled?: boolean;
  genericName?: string;
  dosage?: string;
  strength?: string;
  // Location
  location?: {
    aisle?: string;
    shelf?: string;
    bin?: string;
  } | string;
  // Tax
  taxRate?: number;
  hsnCode?: string;
  // Status
  isFeatured: boolean;
  isActive?: boolean;
  // Tags
  tags?: string[];
  // Supplier
  supplier?: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  suppliers?: Array<{
    _id: string;
    name: string;
    company?: string;
    phone?: string;
    email?: string;
  }>;
  // Tracking
  createdBy?: {
    name: string;
    email: string;
  };
  updatedBy?: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

// Skeleton Component
const ProductDetailSkeleton = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const skeletonBase = `animate-pulse rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`;
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-white";

  return (
    <div className="p-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-lg ${skeletonBase}`} />
          <div>
            <div className={`h-8 w-64 mb-2 ${skeletonBase}`} />
            <div className={`h-4 w-32 ${skeletonBase}`} />
          </div>
        </div>
        <div className="flex gap-3">
          <div className={`h-12 w-32 rounded-lg ${skeletonBase}`} />
          <div className={`h-12 w-24 rounded-lg ${skeletonBase}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Skeleton */}
        <div className={`${cardBg} rounded-xl shadow-sm p-6`}>
          <div className={`w-full h-64 mb-4 rounded-lg ${skeletonBase}`} />
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-16 rounded ${skeletonBase}`} />
            ))}
          </div>
        </div>

        {/* Details Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className={`${cardBg} rounded-xl shadow-sm p-6`}>
            <div className={`h-6 w-40 mb-4 ${skeletonBase}`} />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i}>
                  <div className={`h-4 w-20 mb-2 ${skeletonBase}`} />
                  <div className={`h-5 w-32 ${skeletonBase}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Skeleton */}
          <div className={`${cardBg} rounded-xl shadow-sm p-6`}>
            <div className={`h-6 w-32 mb-4 ${skeletonBase}`} />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-24 rounded-lg ${skeletonBase}`} />
              ))}
            </div>
          </div>

          {/* Stock Skeleton */}
          <div className={`${cardBg} rounded-xl shadow-sm p-6`}>
            <div className={`h-6 w-36 mb-4 ${skeletonBase}`} />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className={`h-4 w-20 mb-2 ${skeletonBase}`} />
                  <div className={`h-5 w-24 ${skeletonBase}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProductDetailPage() {
  const { user } = useStore();
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
    loadProduct();
  }, [user, productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await getProductById(productId);

      if (!response.success || !response.data) {
        toast.error(response.error || "Failed to load product details");
        router.push("/products");
        return;
      }

      setProduct(response.data);
      setSelectedImage(
        response.data.mainImage?.url || response.data.featureImages?.[0]?.url || ""
      );
    } catch (error: unknown) {
      console.error("Failed to load product:", error);
      toast.error("Failed to load product details");
      router.push("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !product ||
      !confirm(`Are you sure you want to delete "${product.name}"?`)
    )
      return;

    try {
      const result = await deleteProduct(productId);

      if (result.success) {
        toast.success(result.message || "Product deleted successfully");
        router.push("/products");
      } else {
        toast.error(result.error || "Failed to delete product");
      }
    } catch (error: unknown) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  };

  // Get shelf location value
  const getShelfLocation = () => {
    if (!product?.location) return null;
    if (typeof product.location === "string") {
      try {
        const loc = JSON.parse(product.location);
        return loc.shelf || null;
      } catch {
        return product.location;
      }
    }
    return product.location.shelf || null;
  };

  const canEditProducts =
    user?.role === "super_admin" || user?.permissions?.canEditProducts;
  const canDeleteProducts =
    user?.role === "super_admin" || user?.permissions?.canDeleteProducts;

  // Theme classes
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-white";
  const textPrimary = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondary = isDarkMode ? "text-gray-400" : "text-gray-600";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";

  if (!user) return null;

  if (loading) {
    return <ProductDetailSkeleton isDarkMode={isDarkMode} />;
  }

  if (!product) {
    return (
      <div className={`p-6 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}>
        <div className="text-center py-16">
          <MdInventory className={`mx-auto text-6xl mb-4 ${textSecondary}`} />
          <h2 className={`text-2xl font-bold ${textPrimary} mb-2`}>
            Product Not Found
          </h2>
          <p className={`${textSecondary} mb-4`}>
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const shelfLocation = getShelfLocation();

  return (
    <div className={`p-6 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/products")}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <MdArrowBack size={24} />
          </button>
          <div>
            <h1 className={`text-3xl font-bold ${textPrimary}`}>{product.name}</h1>
            <p className={`${textSecondary} mt-1`}>Product Details</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {canEditProducts && (
            <Link
              href={`/products/${productId}/edit`}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 transition-colors"
            >
              <MdEdit size={20} />
              Edit Product
            </Link>
          )}
          {canDeleteProducts && (
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
            >
              <MdDelete size={20} />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Alert Badges */}
      {(product.isExpired || product.isExpiringSoon || product.isLowStock) && (
        <div className="mb-6 flex flex-wrap gap-3">
          {product.isExpired && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 px-4 py-2 rounded-lg flex items-center gap-2">
              <MdWarning size={20} />
              <span className="font-medium">Product Expired!</span>
            </div>
          )}
          {product.isExpiringSoon && !product.isExpired && (
            <div className="bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-800 text-orange-800 dark:text-orange-300 px-4 py-2 rounded-lg flex items-center gap-2">
              <MdWarning size={20} />
              <span className="font-medium">Expiring Soon</span>
            </div>
          )}
          {product.isLowStock && (
            <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300 px-4 py-2 rounded-lg flex items-center gap-2">
              <MdWarning size={20} />
              <span className="font-medium">Low Stock Alert</span>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images */}
        <div className="lg:col-span-1 space-y-6">
          <div className={`${cardBg} rounded-xl shadow-sm p-6`}>
            <div className="mb-4">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className={`w-full h-64 object-contain rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}
                />
              ) : (
                <div className={`w-full h-64 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <MdInventory className={`text-6xl ${textSecondary}`} />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {(product.mainImage || (product.featureImages && product.featureImages.length > 0)) && (
              <div className="grid grid-cols-4 gap-2">
                {product.mainImage && (
                  <div className="relative">
                    <img
                      src={product.mainImage.thumbUrl || product.mainImage.url}
                      alt="Main"
                      onClick={() => setSelectedImage(product.mainImage!.url)}
                      className={`w-full h-16 object-cover rounded cursor-pointer border-2 transition-all ${
                        selectedImage === product.mainImage.url
                          ? "border-indigo-600"
                          : `border-transparent hover:border-gray-300 ${isDarkMode ? "hover:border-gray-600" : ""}`
                      }`}
                    />
                    <span className="absolute bottom-0 left-0 right-0 bg-indigo-600 text-white text-xs text-center py-0.5 rounded-b">
                      Main
                    </span>
                  </div>
                )}
                {product.featureImages?.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img.thumbUrl || img.url}
                      alt={`Feature ${index + 1}`}
                      onClick={() => setSelectedImage(img.url)}
                      className={`w-full h-16 object-cover rounded cursor-pointer border-2 transition-all ${
                        selectedImage === img.url
                          ? "border-indigo-600"
                          : `border-transparent hover:border-gray-300 ${isDarkMode ? "hover:border-gray-600" : ""}`
                      }`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location Card */}
          {shelfLocation && (
            <div className={`${cardBg} rounded-xl shadow-sm p-6`}>
              <h3 className={`text-lg font-semibold ${textPrimary} mb-3 flex items-center gap-2`}>
                <MdLocationOn className="text-indigo-500" />
                Storage Location
              </h3>
              <div className={`p-4 rounded-lg ${isDarkMode ? "bg-indigo-900/30" : "bg-indigo-50"}`}>
                <p className={`text-2xl font-bold ${isDarkMode ? "text-indigo-300" : "text-indigo-700"}`}>
                  📍 {shelfLocation}
                </p>
              </div>
            </div>
          )}

          {/* Status Badges */}
          <div className={`${cardBg} rounded-xl shadow-sm p-6`}>
            <h3 className={`text-lg font-semibold ${textPrimary} mb-3`}>Status</h3>
            <div className="flex flex-wrap gap-2">
              {product.isFeatured && (
                <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium">
                  ⭐ Featured
                </span>
              )}
              {product.isPrescription && (
                <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
                  ℞ Prescription
                </span>
              )}
              {product.isControlled && (
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                  🔒 Controlled
                </span>
              )}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.isActive !== false
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}>
                {product.isActive !== false ? "✓ Active" : "○ Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className={`${cardBg} rounded-xl shadow-sm p-6`}>
            <h2 className={`text-xl font-semibold ${textPrimary} mb-4`}>
              Basic Information
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <InfoItem label="SKU" value={product.sku || "N/A"} isDarkMode={isDarkMode} />
              <InfoItem label="Barcode" value={product.barcode || "N/A"} isDarkMode={isDarkMode} />
              <InfoItem label="Category" value={product.category} isDarkMode={isDarkMode} />
              <InfoItem label="Sub Category" value={product.subCategory || "N/A"} isDarkMode={isDarkMode} />
              <InfoItem label="Brand" value={product.brand || "N/A"} isDarkMode={isDarkMode} />
              <InfoItem label="Manufacturer" value={product.manufacturer || "N/A"} isDarkMode={isDarkMode} />
              {product.description && (
                <div className="col-span-full">
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>Description</p>
                  <p className={textPrimary}>{product.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Pharmacy Details */}
          {(product.genericName || product.strength || product.dosage) && (
            <div className={`${cardBg} rounded-xl shadow-sm p-6`}>
              <h2 className={`text-xl font-semibold ${textPrimary} mb-4 flex items-center gap-2`}>
                <MdLocalPharmacy className="text-emerald-500" />
                Pharmacy Details
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {product.genericName && (
                  <InfoItem label="Generic Name (Salt)" value={product.genericName} isDarkMode={isDarkMode} />
                )}
                {product.strength && (
                  <InfoItem label="Strength" value={product.strength} isDarkMode={isDarkMode} />
                )}
                {product.dosage && (
                  <InfoItem label="Dosage" value={product.dosage} isDarkMode={isDarkMode} />
                )}
              </div>
            </div>
          )}

          {/* Pricing & Stock */}
          <div className={`${cardBg} rounded-xl shadow-sm p-6`}>
            <h2 className={`text-xl font-semibold ${textPrimary} mb-4`}>
              Pricing
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <PriceCard
                label="Sale Price (Per Unit)"
                value={product.price}
                color="indigo"
                isDarkMode={isDarkMode}
              />
              {product.cost && (
                <PriceCard
                  label="Cost Price"
                  value={product.cost}
                  color="gray"
                  isDarkMode={isDarkMode}
                />
              )}
              {product.wholesalePrice && (
                <PriceCard
                  label="MRP (Box/Pack)"
                  value={product.wholesalePrice}
                  color="purple"
                  isDarkMode={isDarkMode}
                />
              )}
              {product.profitMargin !== undefined && product.profitMargin > 0 && (
                <div className={`p-4 rounded-lg ${isDarkMode ? "bg-emerald-900/30" : "bg-emerald-50"}`}>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                    Profit Margin
                  </p>
                  <p className={`text-2xl font-bold ${isDarkMode ? "text-emerald-300" : "text-emerald-700"}`}>
                    {product.profitMargin.toFixed(1)}%
                  </p>
                </div>
              )}
            </div>

            <h2 className={`text-xl font-semibold ${textPrimary} mb-4`}>
              Stock Information
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg ${
                product.isLowStock
                  ? isDarkMode ? "bg-red-900/30" : "bg-red-50"
                  : isDarkMode ? "bg-gray-700" : "bg-gray-50"
              }`}>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Current Stock</p>
                <p className={`text-2xl font-bold ${
                  product.isLowStock
                    ? isDarkMode ? "text-red-400" : "text-red-600"
                    : textPrimary
                }`}>
                  {product.stock} <span className="text-sm font-normal">{product.unit}</span>
                </p>
              </div>
              <InfoItem label="Min Stock" value={`${product.minStock || 0} ${product.unit}`} isDarkMode={isDarkMode} />
              <InfoItem label="Reorder Level" value={`${product.reorderLevel || 0} ${product.unit}`} isDarkMode={isDarkMode} />
              <InfoItem label="Unit" value={product.unit} isDarkMode={isDarkMode} />
            </div>
          </div>

          {/* Expiration Info */}
          {product.hasExpiry && (
            <div className={`${cardBg} rounded-xl shadow-sm p-6`}>
              <h2 className={`text-xl font-semibold ${textPrimary} mb-4 flex items-center gap-2`}>
                <MdCalendarToday className="text-orange-500" />
                Expiration Details
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg ${
                  product.isExpired
                    ? isDarkMode ? "bg-red-900/30" : "bg-red-50"
                    : product.isExpiringSoon
                    ? isDarkMode ? "bg-orange-900/30" : "bg-orange-50"
                    : isDarkMode ? "bg-gray-700" : "bg-gray-50"
                }`}>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Expiry Date</p>
                  <p className={`text-lg font-bold ${
                    product.isExpired
                      ? isDarkMode ? "text-red-400" : "text-red-600"
                      : product.isExpiringSoon
                      ? isDarkMode ? "text-orange-400" : "text-orange-600"
                      : textPrimary
                  }`}>
                    {product.expiryDate
                      ? new Date(product.expiryDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                {product.manufacturingDate && (
                  <InfoItem
                    label="Manufacturing Date"
                    value={new Date(product.manufacturingDate).toLocaleDateString()}
                    isDarkMode={isDarkMode}
                  />
                )}
                <InfoItem
                  label="Batch Number"
                  value={product.batchNumber || "N/A"}
                  isDarkMode={isDarkMode}
                />
                <InfoItem
                  label="Alert Before"
                  value={`${product.expiryAlertDays || 30} days`}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          )}

          {/* Tax Info */}
          {(product.taxRate !== undefined || product.hsnCode) && (
            <div className={`${cardBg} rounded-xl shadow-sm p-6`}>
              <h2 className={`text-xl font-semibold ${textPrimary} mb-4`}>
                Tax Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Tax Rate" value={`${product.taxRate || 0}%`} isDarkMode={isDarkMode} />
                {product.hsnCode && (
                  <InfoItem label="HSN Code" value={product.hsnCode} isDarkMode={isDarkMode} />
                )}
              </div>
            </div>
          )}

          {/* Suppliers */}
          {product.suppliers && product.suppliers.length > 0 && (
            <div className={`${cardBg} rounded-xl shadow-sm p-6`}>
              <h2 className={`text-xl font-semibold ${textPrimary} mb-4`}>
                Suppliers
              </h2>
              <div className="space-y-3">
                {product.suppliers.map((supplier, index) => (
                  <div key={supplier._id || index} className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                    <p className={`font-medium ${textPrimary}`}>{supplier.name || supplier.company}</p>
                    {supplier.phone && <p className={`text-sm ${textSecondary}`}>📞 {supplier.phone}</p>}
                    {supplier.email && <p className={`text-sm ${textSecondary}`}>✉️ {supplier.email}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className={`${cardBg} rounded-xl shadow-sm p-6`}>
              <h2 className={`text-xl font-semibold ${textPrimary} mb-4`}>Tags</h2>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${
                      isDarkMode
                        ? "bg-indigo-900/50 text-indigo-300"
                        : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {product.notes && (
            <div className={`${cardBg} rounded-xl shadow-sm p-6`}>
              <h2 className={`text-xl font-semibold ${textPrimary} mb-4`}>Notes</h2>
              <p className={`${textSecondary} whitespace-pre-wrap`}>{product.notes}</p>
            </div>
          )}

          {/* Tracking Info */}
          <div className={`${cardBg} rounded-xl shadow-sm p-6`}>
            <h2 className={`text-xl font-semibold ${textPrimary} mb-4 flex items-center gap-2`}>
              <MdAccessTime className="text-blue-500" />
              Tracking Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.createdBy && (
                <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <MdPerson className={textSecondary} />
                    <p className={`text-sm ${textSecondary}`}>Created By</p>
                  </div>
                  <p className={`font-medium ${textPrimary}`}>
                    {product.createdBy.name}
                  </p>
                  <p className={`text-sm ${textSecondary}`}>{product.createdBy.email}</p>
                  <p className={`text-xs ${textSecondary} mt-1`}>
                    {new Date(product.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
              {product.updatedBy && (
                <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <MdPerson className={textSecondary} />
                    <p className={`text-sm ${textSecondary}`}>Last Updated By</p>
                  </div>
                  <p className={`font-medium ${textPrimary}`}>
                    {product.updatedBy.name}
                  </p>
                  <p className={`text-sm ${textSecondary}`}>{product.updatedBy.email}</p>
                  <p className={`text-xs ${textSecondary} mt-1`}>
                    {new Date(product.updatedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, isDarkMode }: { label: string; value: string; isDarkMode: boolean }) {
  return (
    <div>
      <p className={`text-sm mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{label}</p>
      <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{value}</p>
    </div>
  );
}

function PriceCard({
  label,
  value,
  color,
  isDarkMode,
}: {
  label: string;
  value: number;
  color: string;
  isDarkMode: boolean;
}) {
  const colorClasses = {
    indigo: isDarkMode
      ? "bg-indigo-900/30 text-indigo-400 text-indigo-300"
      : "bg-indigo-50 text-indigo-600 text-indigo-700",
    gray: isDarkMode
      ? "bg-gray-700 text-gray-400 text-gray-300"
      : "bg-gray-50 text-gray-600 text-gray-700",
    purple: isDarkMode
      ? "bg-purple-900/30 text-purple-400 text-purple-300"
      : "bg-purple-50 text-purple-600 text-purple-700",
  };

  const classes = colorClasses[color as keyof typeof colorClasses] || colorClasses.gray;
  const [bg, textLight, textDark] = classes.split(" ");

  return (
    <div className={`${bg} p-4 rounded-lg`}>
      <p className={`text-sm ${textLight} font-medium`}>{label}</p>
      <p className={`text-2xl font-bold ${textDark}`}>৳{value.toFixed(2)}</p>
    </div>
  );
}
