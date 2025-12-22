"use client";

import api from "@/lib/api";
import { useSidebar } from "@/lib/SidebarContext";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdClose, MdImage, MdSave } from "react-icons/md";
import { ProductFormSkeleton } from "./components/ProductFormSkeleton";

interface Category {
  _id: string;
  name: string;
  slug: string;
  parentCategory?: {
    _id: string;
    name: string;
  };
}

export default function AddNewProduct() {
  const { user } = useStore();
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>("");
  const [featureImageFiles, setFeatureImageFiles] = useState<File[]>([]);
  const [featureImagePreviews, setFeatureImagePreviews] = useState<string[]>(
    []
  );

  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    sku: "",
    barcode: "",
    description: "",
    category: "", // Will store category name
    categoryId: "", // Will store category _id
    subCategory: "",
    subCategoryId: "",
    brand: "",
    manufacturer: "",

    // Pricing
    price: "",
    cost: "",
    wholesalePrice: "",
    discountPrice: "",
    discountPercentage: "",

    // Stock Management
    stock: "0",
    minStock: "10",
    reorderLevel: "5",
    unit: "pcs",

    // Expiration Management
    hasExpiry: false,
    expiryDate: "",
    manufacturingDate: "",
    batchNumber: "",
    expiryAlertDays: "30",

    // Pharmacy Specific
    isPrescription: false,
    isControlled: false,
    genericName: "",
    dosage: "",
    strength: "",

    // Restaurant Specific
    isFood: false,
    cuisine: "",
    preparationTime: "",
    ingredients: "",
    allergens: "",
    isVegetarian: false,
    isVegan: false,
    spiceLevel: "",

    // Electronics & Warranty
    hasWarranty: false,
    warrantyPeriod: "",
    warrantyType: "",

    // Tax & Legal
    taxRate: "0",
    hsnCode: "",

    // Additional Details
    weight: "",
    weightUnit: "kg",

    // Tags & Search
    tags: "",

    // Status
    isFeatured: false,

    // Supplier
    supplierName: "",
    supplierPhone: "",
    supplierEmail: "",
    supplierAddress: "",

    // Notes
    notes: "",
  });

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await api.get("/categories", {
        params: { limit: 100 },
      });
      const allCategories = response.data.categories || [];
      setCategories(allCategories);

      // Separate main categories and subcategories
      const main = allCategories.filter((cat: Category) => !cat.parentCategory);
      const sub = allCategories.filter((cat: Category) => cat.parentCategory);
      setMainCategories(main);
      setSubCategories(sub);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setFetching(false);
    }
  };

  // Handle category selection
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;

    if (!selectedId) {
      setFormData((prev) => ({
        ...prev,
        category: "",
        categoryId: "",
        subCategory: "",
        subCategoryId: "",
      }));
      return;
    }

    const selectedCategory = categories.find((cat) => cat._id === selectedId);

    if (selectedCategory) {
      // If it's a main category
      if (!selectedCategory.parentCategory) {
        setFormData((prev) => ({
          ...prev,
          category: selectedCategory.name,
          categoryId: selectedCategory._id,
          subCategory: "",
          subCategoryId: "",
        }));
      } else {
        // If it's a subcategory
        setFormData((prev) => ({
          ...prev,
          category: selectedCategory.parentCategory?.name || "",
          categoryId: selectedCategory.parentCategory?._id || "",
          subCategory: selectedCategory.name,
          subCategoryId: selectedCategory._id,
        }));
      }
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

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMainImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setMainImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeMainImage = () => {
    setMainImageFile(null);
    setMainImagePreview("");
  };

  const handleFeatureImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    if (files.length + featureImageFiles.length > 5) {
      toast.error("Maximum 5 feature images allowed");
      return;
    }

    // Generate previews
    const newPreviews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setFeatureImagePreviews([...featureImagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setFeatureImageFiles([...featureImageFiles, ...files]);
  };

  const removeFeatureImage = (index: number) => {
    setFeatureImageFiles(featureImageFiles.filter((_, i) => i !== index));
    setFeatureImagePreviews(featureImagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();

      // Append main image
      if (mainImageFile) {
        submitData.append("mainImage", mainImageFile);
      }

      // Append feature images
      featureImageFiles.forEach((file) => {
        submitData.append("featureImages", file);
      });

      // Append basic fields
      Object.entries(formData).forEach(([key, value]) => {
        if (
          key === "supplierName" ||
          key === "supplierPhone" ||
          key === "supplierEmail" ||
          key === "supplierAddress" ||
          key === "categoryId" || // Skip - we only send category name
          key === "subCategoryId" // Skip - we only send subCategory name
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

      await api.post("/products", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product created successfully!");
      router.push("/products");
    } catch (error: unknown) {
      console.error("Error creating product:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to create product";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const canAddProducts =
    user.role === "super_admin" || user.permissions?.canAddProducts || false;

  if (!canAddProducts) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Access Denied
          </h2>
          <p className="text-red-600">
            You do not have permission to add products.
          </p>
        </div>
      </div>
    );
  }

  if (fetching) {
    return (
      <div className="p-6">
        <ProductFormSkeleton isDarkMode={isDarkMode} />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-500 mt-1">
          Create a new product for your inventory
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU (Stock Keeping Unit)
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., PROD-001"
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
                placeholder="Scan or enter barcode"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.subCategoryId || formData.categoryId}
                onChange={handleCategoryChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select a category</option>

                {/* Main Categories */}
                {mainCategories.map((cat) => {
                  const categorySubCategories = subCategories.filter(
                    (sub) => sub.parentCategory?._id === cat._id
                  );

                  return (
                    <optgroup
                      key={cat._id}
                      label={`📁 ${cat.name.toUpperCase()}`}
                    >
                      {/* Main Category Option */}
                      <option value={cat._id}>
                        {cat.name} (Main Category)
                      </option>

                      {/* Subcategories under this main category */}
                      {categorySubCategories.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          └─ {sub.name} (Sub-category)
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>

              {/* Display selected category info */}
              {formData.category && (
                <div className="mt-2 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <p className="text-sm text-indigo-700">
                    <span className="font-semibold">📁 Main Category:</span>{" "}
                    {formData.category}
                  </p>
                  {formData.subCategory && (
                    <p className="text-sm text-indigo-700 mt-1">
                      <span className="font-semibold">└─ Sub-category:</span>{" "}
                      {formData.subCategory}
                    </p>
                  )}
                </div>
              )}

              <p className="mt-2 text-xs text-gray-500">
                💡 Select a main category or a sub-category for this product
              </p>
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
                placeholder="Brand name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manufacturer
              </label>
              <input
                type="text"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Manufacturer name"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Product description"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selling Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost Price
              </label>
              <input
                type="number"
                step="0.01"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wholesale Price
              </label>
              <input
                type="number"
                step="0.01"
                name="wholesalePrice"
                value={formData.wholesalePrice}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Price
              </label>
              <input
                type="number"
                step="0.01"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HSN Code
              </label>
              <input
                type="text"
                name="hsnCode"
                value={formData.hsnCode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="HSN/SAC Code"
              />
            </div>
          </div>
        </div>

        {/* Stock Management */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Stock Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Stock
              </label>
              <input
                type="number"
                name="minStock"
                value={formData.minStock}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reorder Level
              </label>
              <input
                type="number"
                name="reorderLevel"
                value={formData.reorderLevel}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="5"
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
                <option value="capsule">Capsule</option>
                <option value="injection">Injection</option>
                <option value="syrup">Syrup</option>
                <option value="dozen">Dozen</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expiration Management */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Expiration Management
          </h2>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="hasExpiry"
                checked={formData.hasExpiry}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                This product has an expiration date
              </span>
            </label>
          </div>

          {formData.hasExpiry && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  Manufacturing Date
                </label>
                <input
                  type="date"
                  name="manufacturingDate"
                  value={formData.manufacturingDate}
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
                  placeholder="Batch #"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Before (Days)
                </label>
                <input
                  type="number"
                  name="expiryAlertDays"
                  value={formData.expiryAlertDays}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="30"
                />
              </div>
            </div>
          )}
        </div>

        {/* Pharmacy Specific */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Pharmacy Details (Optional)
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isPrescription"
                  checked={formData.isPrescription}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Prescription Required
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isControlled"
                  checked={formData.isControlled}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Controlled Substance
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generic Name
                </label>
                <input
                  type="text"
                  name="genericName"
                  value={formData.genericName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Generic name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dosage
                </label>
                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., 500mg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Strength
                </label>
                <input
                  type="text"
                  name="strength"
                  value={formData.strength}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Strength"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Specific */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Restaurant/Food Details (Optional)
          </h2>

          <div className="space-y-4">
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isFood"
                  checked={formData.isFood}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  This is a food item
                </span>
              </label>
            </div>

            {formData.isFood && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cuisine Type
                    </label>
                    <input
                      type="text"
                      name="cuisine"
                      value={formData.cuisine}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g., Chinese, Italian"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preparation Time (minutes)
                    </label>
                    <input
                      type="number"
                      name="preparationTime"
                      value={formData.preparationTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="15"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spice Level
                    </label>
                    <select
                      name="spiceLevel"
                      value={formData.spiceLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">None</option>
                      <option value="mild">Mild</option>
                      <option value="medium">Medium</option>
                      <option value="hot">Hot</option>
                      <option value="extra_hot">Extra Hot</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ingredients (comma-separated)
                    </label>
                    <textarea
                      name="ingredients"
                      value={formData.ingredients}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g., Tomato, Onion, Spices"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allergens (comma-separated)
                    </label>
                    <textarea
                      name="allergens"
                      value={formData.allergens}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g., Nuts, Dairy, Gluten"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isVegetarian"
                      checked={formData.isVegetarian}
                      onChange={handleChange}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Vegetarian
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isVegan"
                      checked={formData.isVegan}
                      onChange={handleChange}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Vegan</span>
                  </label>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Warranty (Electronics) */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Warranty (Optional)
          </h2>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="hasWarranty"
                checked={formData.hasWarranty}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Product has warranty
              </span>
            </label>
          </div>

          {formData.hasWarranty && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warranty Period (months)
                </label>
                <input
                  type="number"
                  name="warrantyPeriod"
                  value={formData.warrantyPeriod}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warranty Type
                </label>
                <select
                  name="warrantyType"
                  value={formData.warrantyType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="manufacturer">Manufacturer</option>
                  <option value="seller">Seller</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Supplier Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Supplier Information (Optional)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier Name
              </label>
              <input
                type="text"
                name="supplierName"
                value={formData.supplierName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Supplier name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier Phone
              </label>
              <input
                type="tel"
                name="supplierPhone"
                value={formData.supplierPhone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier Email
              </label>
              <input
                type="email"
                name="supplierEmail"
                value={formData.supplierEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier Address
              </label>
              <input
                type="text"
                name="supplierAddress"
                value={formData.supplierAddress}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Address"
              />
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Product Images
          </h2>

          <div className="space-y-6">
            {/* Main Image */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Main Product Image <span className="text-red-500">*</span>
              </h3>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-indigo-300 border-dashed rounded-lg cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <MdImage className="w-10 h-10 mb-3 text-indigo-400" />
                    <p className="mb-2 text-sm text-indigo-600 font-semibold">
                      Main Product Image
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF, WebP up to 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleMainImageChange}
                  />
                </label>
              </div>

              {/* Main Image Preview */}
              {mainImagePreview && (
                <div className="mt-4">
                  <div className="relative inline-block">
                    <img
                      src={mainImagePreview}
                      alt="Main Product"
                      className="w-48 h-48 object-cover rounded-lg border-4 border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={removeMainImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <MdClose size={20} />
                    </button>
                    <span className="absolute bottom-2 left-2 bg-indigo-600 text-white text-xs px-3 py-1 rounded font-semibold">
                      MAIN IMAGE
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Feature Images */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Feature Images (Optional - Max 5)
              </h3>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <MdImage className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-xs text-gray-500">
                      Add up to 5 feature images
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFeatureImagesChange}
                    disabled={featureImageFiles.length >= 5}
                  />
                </label>
              </div>

              {/* Feature Images Previews */}
              {featureImagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                  {featureImagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Feature ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeatureImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <MdClose size={16} />
                      </button>
                      <span className="absolute bottom-2 left-2 bg-gray-700 text-white text-xs px-2 py-1 rounded">
                        Feature {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {featureImageFiles.length >= 5 && (
                <p className="mt-2 text-sm text-orange-600">
                  Maximum 5 feature images reached
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Additional Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., organic, imported, bestseller"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Any additional notes..."
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Mark as featured product
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <MdSave size={20} />
                <span>Create Product</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
