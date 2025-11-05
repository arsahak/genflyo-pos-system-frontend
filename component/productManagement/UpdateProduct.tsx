"use client";

import api from "@/lib/api";
import { useStore } from "@/lib/store";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdClose, MdImage, MdSave } from "react-icons/md";

export default function UpdateProduct() {
  const { user } = useStore();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    description: "",
    category: "",
    subCategory: "",
    brand: "",
    manufacturer: "",
    price: "",
    cost: "",
    wholesalePrice: "",
    discountPrice: "",
    discountPercentage: "",
    stock: "0",
    minStock: "10",
    reorderLevel: "5",
    unit: "pcs",
    hasExpiry: false,
    expiryDate: "",
    manufacturingDate: "",
    batchNumber: "",
    expiryAlertDays: "30",
    isPrescription: false,
    isControlled: false,
    genericName: "",
    dosage: "",
    strength: "",
    isFood: false,
    cuisine: "",
    preparationTime: "",
    ingredients: "",
    allergens: "",
    isVegetarian: false,
    isVegan: false,
    spiceLevel: "",
    hasWarranty: false,
    warrantyPeriod: "",
    warrantyType: "",
    taxRate: "0",
    hsnCode: "",
    weight: "",
    weightUnit: "kg",
    tags: "",
    isFeatured: false,
    supplierName: "",
    supplierPhone: "",
    supplierEmail: "",
    supplierAddress: "",
    notes: "",
  });

  useEffect(() => {
    if (!productId) {
      toast.error("Product ID is required");
      router.push("/products");
      return;
    }
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setFetching(true);
      const response = await api.get(`/products/${productId}`);
      const product = response.data;

      // Format dates for input fields
      const formatDate = (date: string) => {
        if (!date) return "";
        return new Date(date).toISOString().split("T")[0];
      };

      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        barcode: product.barcode || "",
        description: product.description || "",
        category: product.category || "",
        subCategory: product.subCategory || "",
        brand: product.brand || "",
        manufacturer: product.manufacturer || "",
        price: product.price?.toString() || "",
        cost: product.cost?.toString() || "",
        wholesalePrice: product.wholesalePrice?.toString() || "",
        discountPrice: product.discountPrice?.toString() || "",
        discountPercentage: product.discountPercentage?.toString() || "",
        stock: product.stock?.toString() || "0",
        minStock: product.minStock?.toString() || "10",
        reorderLevel: product.reorderLevel?.toString() || "5",
        unit: product.unit || "pcs",
        hasExpiry: product.hasExpiry || false,
        expiryDate: formatDate(product.expiryDate),
        manufacturingDate: formatDate(product.manufacturingDate),
        batchNumber: product.batchNumber || "",
        expiryAlertDays: product.expiryAlertDays?.toString() || "30",
        isPrescription: product.isPrescription || false,
        isControlled: product.isControlled || false,
        genericName: product.genericName || "",
        dosage: product.dosage || "",
        strength: product.strength || "",
        isFood: product.isFood || false,
        cuisine: product.cuisine || "",
        preparationTime: product.preparationTime?.toString() || "",
        ingredients: product.ingredients?.join(", ") || "",
        allergens: product.allergens?.join(", ") || "",
        isVegetarian: product.isVegetarian || false,
        isVegan: product.isVegan || false,
        spiceLevel: product.spiceLevel || "",
        hasWarranty: product.hasWarranty || false,
        warrantyPeriod: product.warrantyPeriod?.toString() || "",
        warrantyType: product.warrantyType || "",
        taxRate: product.taxRate?.toString() || "0",
        hsnCode: product.hsnCode || "",
        weight: product.weight?.toString() || "",
        weightUnit: product.weightUnit || "kg",
        tags: product.tags?.join(", ") || "",
        isFeatured: product.isFeatured || false,
        supplierName: product.supplier?.name || "",
        supplierPhone: product.supplier?.phone || "",
        supplierEmail: product.supplier?.email || "",
        supplierAddress: product.supplier?.address || "",
        notes: product.notes || "",
      });

      setExistingImages(product.images || []);
    } catch (error: unknown) {
      console.error("Failed to load product:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to load product";
      toast.error(errorMessage);
      router.push("/products");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + imageFiles.length + existingImages.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    const newPreviews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setImageFiles([...imageFiles, ...files]);
  };

  const removeNewImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
    toast("Image will be removed when you save the product", {
      icon: "ℹ️",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();

      // Append new images only if there are new images
      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          submitData.append("images", file);
        });
      }

      // Append form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (
          key === "supplierName" ||
          key === "supplierPhone" ||
          key === "supplierEmail" ||
          key === "supplierAddress"
        ) {
          return;
        }

        if (value !== "" && value !== null && value !== undefined) {
          submitData.append(key, value.toString());
        }
      });

      // Add supplier object
      if (
        formData.supplierName ||
        formData.supplierPhone ||
        formData.supplierEmail ||
        formData.supplierAddress
      ) {
        submitData.append(
          "supplier",
          JSON.stringify({
            name: formData.supplierName,
            phone: formData.supplierPhone,
            email: formData.supplierEmail,
            address: formData.supplierAddress,
          })
        );
      }

      await api.put(`/products/${productId}`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product updated successfully!");
      router.push("/products");
    } catch (error: unknown) {
      console.error("Error updating product:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update product";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const canEditProducts =
    user.role === "super_admin" || user.permissions?.canEditProducts;

  if (!canEditProducts) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Access Denied
          </h2>
          <p className="text-red-600">
            You do not have permission to edit products.
          </p>
        </div>
      </div>
    );
  }

  if (fetching) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="ml-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Update Product</h1>
        <p className="text-gray-500 mt-1">Edit product information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Use the same structure as AddNewProduct but with formData pre-filled */}
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Barcode
              </label>
              <input
                type="text"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="pcs">Pieces</option>
                <option value="kg">Kilogram</option>
                <option value="g">Gram</option>
                <option value="l">Liter</option>
                <option value="ml">Milliliter</option>
                <option value="box">Box</option>
                <option value="pack">Pack</option>
                <option value="bottle">Bottle</option>
                <option value="strip">Strip</option>
                <option value="tablet">Tablet</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expiration */}
        {formData.hasExpiry && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Expiration Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Number
                </label>
                <input
                  type="text"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Days
                </label>
                <input
                  type="number"
                  name="expiryAlertDays"
                  value={formData.expiryAlertDays}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Images */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Product Images
          </h2>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Current Images
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {existingImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img.url || img.thumbUrl}
                      alt="Product"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <MdClose size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          <div className="space-y-4">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <MdImage className="w-8 h-8 mb-2 text-gray-400" />
              <p className="text-xs text-gray-500">Add more images</p>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </label>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`New ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <MdClose size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <MdSave size={20} />
                <span>Update Product</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
