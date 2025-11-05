"use client";

import api from "@/lib/api";
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
  stock: number;
  minStock?: number;
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
  batchNumber?: string;
  expiryAlertDays?: number;
  isExpiringSoon?: boolean;
  isExpired?: boolean;
  isLowStock?: boolean;
  profitMargin?: number;
  isPrescription?: boolean;
  isControlled?: boolean;
  genericName?: string;
  dosage?: string;
  strength?: string;
  isFood?: boolean;
  cuisine?: string;
  ingredients?: string[];
  allergens?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  spiceLevel?: string;
  hasWarranty?: boolean;
  warrantyPeriod?: number;
  warrantyType?: string;
  taxRate?: number;
  tags?: string[];
  isFeatured: boolean;
  supplier?: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  };
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

export default function ProductDetailPage() {
  const { user } = useStore();
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
      const response = await api.get(`/products/${productId}`);
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
      await api.delete(`/products/${productId}`);
      toast.success("Product deleted successfully");
      router.push("/products");
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to delete product";
      toast.error(errorMessage);
    }
  };

  const canEditProducts =
    user?.role === "super_admin" || user?.permissions?.canEditProducts;
  const canDeleteProducts =
    user?.role === "super_admin" || user?.permissions?.canDeleteProducts;

  if (!user) return null;

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="ml-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The product you're looking for doesn't exist.
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/products")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MdArrowBack size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-500 mt-1">Product Details</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {canEditProducts && (
            <Link
              href={`/products/${productId}/edit`}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <MdEdit size={20} />
              Edit Product
            </Link>
          )}
          {canDeleteProducts && (
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <MdDelete size={20} />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Alert Badges */}
      {(product.isExpired || product.isExpiringSoon || product.isLowStock) && (
        <div className="mb-6 flex gap-3">
          {product.isExpired && (
            <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded-lg flex items-center gap-2">
              <MdWarning size={20} />
              <span className="font-medium">Product Expired!</span>
            </div>
          )}
          {product.isExpiringSoon && !product.isExpired && (
            <div className="bg-orange-100 border border-orange-300 text-orange-800 px-4 py-2 rounded-lg flex items-center gap-2">
              <MdWarning size={20} />
              <span className="font-medium">Expiring Soon</span>
            </div>
          )}
          {product.isLowStock && (
            <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg flex items-center gap-2">
              <MdWarning size={20} />
              <span className="font-medium">Low Stock Alert</span>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-4">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-64 object-contain rounded-lg bg-gray-50"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MdInventory className="text-gray-400 text-6xl" />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {(product.mainImage || (product.featureImages && product.featureImages.length > 0)) && (
              <div className="grid grid-cols-4 gap-2">
                {/* Main Image Thumbnail */}
                {product.mainImage && (
                  <div className="relative">
                    <img
                      src={product.mainImage.thumbUrl || product.mainImage.url}
                      alt="Main"
                      onClick={() => setSelectedImage(product.mainImage!.url)}
                      className={`w-full h-16 object-cover rounded cursor-pointer border-2 transition-all ${
                        selectedImage === product.mainImage.url
                          ? "border-indigo-600"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    />
                    <span className="absolute bottom-0 left-0 right-0 bg-indigo-600 text-white text-xs text-center py-0.5 rounded-b">
                      Main
                    </span>
                  </div>
                )}

                {/* Feature Images Thumbnails */}
                {product.featureImages && product.featureImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img.thumbUrl || img.url}
                      alt={`Feature ${index + 1}`}
                      onClick={() => setSelectedImage(img.url)}
                      className={`w-full h-16 object-cover rounded cursor-pointer border-2 transition-all ${
                        selectedImage === img.url
                          ? "border-indigo-600"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    />
                    <span className="absolute bottom-0 left-0 right-0 bg-gray-700 text-white text-xs text-center py-0.5 rounded-b">
                      F{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="SKU" value={product.sku || "N/A"} />
              <InfoItem label="Barcode" value={product.barcode || "N/A"} />
              <InfoItem label="Category" value={product.category} />
              <InfoItem
                label="Sub Category"
                value={product.subCategory || "N/A"}
              />
              <InfoItem label="Brand" value={product.brand || "N/A"} />
              <InfoItem
                label="Manufacturer"
                value={product.manufacturer || "N/A"}
              />
              {product.description && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p className="text-gray-900">{product.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Pricing & Stock
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <PriceCard
                label="Selling Price"
                value={product.price}
                color="indigo"
              />
              {product.cost && (
                <PriceCard
                  label="Cost Price"
                  value={product.cost}
                  color="gray"
                />
              )}
              {product.wholesalePrice && (
                <PriceCard
                  label="Wholesale"
                  value={product.wholesalePrice}
                  color="purple"
                />
              )}
              {product.profitMargin && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">
                    Profit Margin
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {product.profitMargin.toFixed(1)}%
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-4 gap-4">
              <InfoItem
                label="Current Stock"
                value={`${product.stock} ${product.unit}`}
              />
              <InfoItem
                label="Min Stock"
                value={`${product.minStock || 0} ${product.unit}`}
              />
              <InfoItem
                label="Reorder Level"
                value={`${product.reorderLevel || 0} ${product.unit}`}
              />
              <InfoItem label="Unit" value={product.unit} />
            </div>
          </div>

          {/* Expiration Info */}
          {product.hasExpiry && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Expiration Details
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <InfoItem
                  label="Expiry Date"
                  value={
                    product.expiryDate
                      ? new Date(product.expiryDate).toLocaleDateString()
                      : "N/A"
                  }
                />
                <InfoItem
                  label="Batch Number"
                  value={product.batchNumber || "N/A"}
                />
                <InfoItem
                  label="Alert Before"
                  value={`${product.expiryAlertDays || 30} days`}
                />
              </div>
            </div>
          )}

          {/* Additional Details */}
          {product.tags && product.tags.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tracking Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Tracking Information
            </h2>
            <div className="space-y-3">
              {product.createdBy && (
                <div>
                  <p className="text-sm text-gray-600">Created By</p>
                  <p className="text-gray-900 font-medium">
                    {product.createdBy.name} ({product.createdBy.email})
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(product.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
              {product.updatedBy && (
                <div>
                  <p className="text-sm text-gray-600">Last Updated By</p>
                  <p className="text-gray-900 font-medium">
                    {product.updatedBy.name} ({product.updatedBy.email})
                  </p>
                  <p className="text-xs text-gray-500">
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

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-gray-900 font-medium">{value}</p>
    </div>
  );
}

function PriceCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const colorClasses = {
    indigo: "bg-indigo-50 text-indigo-600 text-indigo-700",
    gray: "bg-gray-50 text-gray-600 text-gray-700",
    purple: "bg-purple-50 text-purple-600 text-purple-700",
  };

  const classes =
    colorClasses[color as keyof typeof colorClasses] || colorClasses.gray;
  const [bg, textLight, textDark] = classes.split(" ");

  return (
    <div className={`${bg} p-4 rounded-lg`}>
      <p className={`text-sm ${textLight} font-medium`}>{label}</p>
      <p className={`text-2xl font-bold ${textDark}`}>${value.toFixed(2)}</p>
    </div>
  );
}
