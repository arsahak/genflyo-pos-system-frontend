"use client";

import { useSidebar } from "@/lib/SidebarContext";
import { useStore } from "@/lib/store";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getProductById, updateProduct } from "@/app/actions/product";
import { getAllCategories } from "@/app/actions/categories";
import { getAllBrands } from "@/app/actions/brands";
import {
  MdArrowBack,
  MdAttachMoney,
  MdCategory,
  MdClose,
  MdCloudUpload,
  MdDateRange,
  MdDescription,
  MdInventory,
  MdLabel,
  MdLocalPharmacy,
  MdPercent,
  MdQrCode,
  MdSave,
  MdWarning,
} from "react-icons/md";
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

interface Brand {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export default function UpdateProduct() {
  const { user } = useStore();
  const { isDarkMode } = useSidebar();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // --- Data States ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");

  // --- Image States ---
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>("");
  const [existingImages, setExistingImages] = useState<any[]>([]);

  // --- Form State ---
  const [formData, setFormData] = useState({
    // Identity
    name: "",
    genericName: "",
    sku: "",
    barcode: "",
    category: "",
    categoryId: "",
    subCategory: "",
    subCategoryId: "",
    brand: "",
    manufacturer: "",
    rackLocation: "",

    // Units & Pricing (The Logic Core)
    purchaseUnit: "Box", // Buying Unit
    sellingUnit: "Strip", // Selling Unit
    conversionFactor: "30", // 1 Box = 30 Strips
    purchasePriceBox: "",
    mrp: "",
    salesPrice: "",
    costPerUnit: "",
    taxRate: "0",
    hsnCode: "",
    discountPercent: "0",

    // Inventory & Batch
    openingStockBoxes: "0",
    stock: "0",
    minStock: "10",
    batchNumber: "",
    expiryDate: "",
    manufacturingDate: "",
    expiryAlertDays: "90",

    // Medical Details
    drugForm: "Tablet",
    strength: "",
    packSize: "",
    dosage: "",
    sideEffects: "",

    // Safety Flags
    isPrescription: false,
    isControlled: false,
    requiresRefrigeration: false,
    isAntibiotic: false,

    // Meta
    description: "",
    isFeatured: false,
  });

  // --- Logic Effects ---

  // 1. Calculate Cost Per Strip automatically
  useEffect(() => {
    const boxPrice = parseFloat(formData.purchasePriceBox) || 0;
    const factor = parseFloat(formData.conversionFactor) || 1;
    if (boxPrice > 0 && factor > 0) {
      setFormData((prev) => ({
        ...prev,
        costPerUnit: (boxPrice / factor).toFixed(2),
      }));
    }
  }, [formData.purchasePriceBox, formData.conversionFactor]);

  // 2. Calculate Total Stock (Strips) from Boxes
  useEffect(() => {
    const boxes = parseFloat(formData.openingStockBoxes) || 0;
    const factor = parseFloat(formData.conversionFactor) || 1;
    setFormData((prev) => ({
      ...prev,
      stock: (boxes * factor).toString(),
    }));
  }, [formData.openingStockBoxes, formData.conversionFactor]);

  // 3. Load Categories, Brands, and Suppliers
  useEffect(() => {
    const loadData = async () => {
      try {
        const { getAllSuppliers } = await import("@/app/actions/suppliers");
        const [categoriesRes, brandsRes, suppliersRes] = await Promise.all([
          getAllCategories({ limit: 100 }),
          getAllBrands({ limit: 1000, isActive: true }),
          getAllSuppliers({ limit: 1000, isActive: true })
        ]);

        if (categoriesRes.success && categoriesRes.data?.categories) {
          const all = categoriesRes.data.categories;
          setCategories(all);
          setMainCategories(all.filter((c: Category) => !c.parentCategory));
          setSubCategories(all.filter((c: Category) => c.parentCategory));
        }

        if (brandsRes.success && brandsRes.data?.brands) {
          setBrands(brandsRes.data.brands);
        }

        if (suppliersRes.success && suppliersRes.data) {
          setSuppliers(suppliersRes.data);
        }
      } catch (e) {
        toast.error("Failed to load data");
      }
    };
    loadData();
  }, []);

  // 4. Load Product
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
      const response = await getProductById(productId);

      if (!response.success || !response.data) {
        toast.error(response.error || "Failed to load product");
        router.push("/products");
        return;
      }

      const product = response.data;
      console.log("Loaded product data:", product); // Debug log

      // Format dates for input fields
      const formatDate = (date: string) => {
        if (!date) return "";
        try {
          return new Date(date).toISOString().split("T")[0];
        } catch {
          return "";
        }
      };

      // Map unit back to selling unit
      const unitMap: { [key: string]: string } = {
        strip: "Strip",
        pcs: "Piece",
        bottle: "Bottle",
        injection: "Ampoule",
        box: "Box",
        pack: "Pack",
      };

      // Extract location from location object
      let rackLocation = "";
      if (product.location) {
        if (typeof product.location === "string") {
          rackLocation = product.location;
        } else if (product.location.shelf) {
          rackLocation = `${product.location.shelf}${product.location.bin ? "-" + product.location.bin : ""}`;
        }
      }

      // Parse notes to extract medical details (drugForm, sideEffects, etc.)
      let drugForm = "Tablet";
      let packSize = "";
      let sideEffects = "";
      let requiresRefrigeration = false;
      let isAntibiotic = false;

      if (product.notes) {
        const notes = product.notes;
        // Extract Form
        const formMatch = notes.match(/Form:\s*([^\n]+)/i);
        if (formMatch) drugForm = formMatch[1].trim();
        // Extract Pack Size
        const packMatch = notes.match(/Pack Size:\s*([^\n]+)/i);
        if (packMatch) packSize = packMatch[1].trim();
        // Extract Side Effects
        const sideMatch = notes.match(/Side Effects:\s*([^\n]+)/i);
        if (sideMatch) sideEffects = sideMatch[1].trim();
        // Check flags
        if (notes.includes("Requires Refrigeration")) requiresRefrigeration = true;
        if (notes.includes("Full Course Alert")) isAntibiotic = true;
      }

      // Also check for drugForm field directly if exists
      if (product.drugForm) {
        drugForm = product.drugForm;
      }

      // Calculate conversionFactor - default to 30 or use existing if available
      const conversionFactor = product.conversionFactor?.toString() || "30";

      // Calculate opening stock boxes from total stock
      const totalStock = parseFloat(product.stock?.toString() || "0");
      const factor = parseFloat(conversionFactor) || 30;
      const openingStockBoxes = factor > 0 ? Math.floor(totalStock / factor).toString() : "0";

      // Find category and subcategory IDs from loaded categories
      let categoryId = "";
      let subCategoryId = "";

      // Try to match category by name
      if (product.category && categories.length > 0) {
        const mainCat = categories.find(c => c.name === product.category && !c.parentCategory);
        if (mainCat) {
          categoryId = mainCat._id;
        }
      }

      // Try to match subcategory by name
      if (product.subCategory && categories.length > 0) {
        const subCat = categories.find(c => c.name === product.subCategory && c.parentCategory);
        if (subCat) {
          subCategoryId = subCat._id;
          // Also set parent category if found
          if (subCat.parentCategory) {
            categoryId = subCat.parentCategory._id;
          }
        }
      }

      setFormData({
        // Identity
        name: product.name || "",
        genericName: product.genericName || "",
        sku: product.sku || "",
        barcode: product.barcode || "",
        category: product.category || "",
        categoryId: categoryId,
        subCategory: product.subCategory || "",
        subCategoryId: subCategoryId,
        brand: product.brand || "",
        manufacturer: product.manufacturer || "",
        rackLocation: rackLocation,

        // Units & Pricing
        purchaseUnit: product.purchaseUnit || "Box",
        sellingUnit: unitMap[product.unit] || product.sellingUnit || "Strip",
        conversionFactor: conversionFactor,
        purchasePriceBox: product.purchasePriceBox?.toString() || "",
        mrp: product.wholesalePrice?.toString() || product.mrp?.toString() || "",
        salesPrice: product.price?.toString() || product.salesPrice?.toString() || "",
        costPerUnit: product.cost?.toString() || product.costPerUnit?.toString() || "",
        taxRate: product.taxRate?.toString() || "0",
        hsnCode: product.hsnCode || "",
        discountPercent: product.discountPercentage?.toString() || product.discountPercent?.toString() || "0",

        // Inventory & Batch
        openingStockBoxes: openingStockBoxes,
        stock: product.stock?.toString() || "0",
        minStock: product.minStock?.toString() || product.reorderLevel?.toString() || "10",
        batchNumber: product.batchNumber || "",
        expiryDate: formatDate(product.expiryDate),
        manufacturingDate: formatDate(product.manufacturingDate),
        expiryAlertDays: product.expiryAlertDays?.toString() || "90",

        // Medical Details
        drugForm: drugForm,
        strength: product.strength || "",
        packSize: packSize || product.packSize || "",
        dosage: product.dosage || "",
        sideEffects: sideEffects || product.sideEffects || "",

        // Safety Flags
        isPrescription: product.isPrescription || false,
        isControlled: product.isControlled || false,
        requiresRefrigeration: requiresRefrigeration || product.requiresRefrigeration || false,
        isAntibiotic: isAntibiotic || product.isAntibiotic || false,

        // Meta
        description: product.description || "",
        isFeatured: product.isFeatured || false,
      });

      // Set selected supplier if exists
      if (product.suppliers && product.suppliers.length > 0) {
        const supplierId = product.suppliers[0]._id || product.suppliers[0];
        setSelectedSupplier(supplierId);
      }

      // Set main image if exists
      if (product.mainImage?.url) {
        setMainImagePreview(product.mainImage.url);
      } else if (product.mainImage && typeof product.mainImage === "string") {
        setMainImagePreview(product.mainImage);
      } else if (product.images && product.images.length > 0) {
        const imageUrl = product.images[0].url || product.images[0].thumbUrl || product.images[0];
        if (imageUrl) {
          setMainImagePreview(imageUrl);
        }
      } else if (product.image) {
        // Fallback to single image field if it exists
        setMainImagePreview(product.image);
      }

      setExistingImages(product.images || []);
    } catch (error: unknown) {
      console.error("Failed to load product:", error);
      toast.error(error instanceof Error ? error.message : "Failed to load product");
      router.push("/products");
    } finally {
      setFetching(false);
    }
  };

  // --- Handlers ---

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    
    // Clear category validation error
    if (validationErrors.category) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.category;
        return newErrors;
      });
    }
    
    const cat = categories.find((c) => c._id === selectedId);
    if (!cat) {
      setFormData((prev) => ({
        ...prev,
        category: "",
        categoryId: "",
        subCategory: "",
        subCategoryId: "",
      }));
      return;
    }
    if (!cat.parentCategory) {
      setFormData((prev) => ({
        ...prev,
        category: cat.name,
        categoryId: cat._id,
        subCategory: "",
        subCategoryId: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        category: cat.parentCategory?.name || "",
        categoryId: cat.parentCategory?._id || "",
        subCategory: cat.name,
        subCategoryId: cat._id,
      }));
    }
  };

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setMainImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSupplier(e.target.value);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = "Product Name is required";
    }
    if (!formData.genericName.trim()) {
      newErrors.genericName = "Generic Name (Salt) is required";
    }
    if (!formData.category.trim()) {
      newErrors.category = "Please select a category";
    }
    if (!formData.salesPrice || parseFloat(formData.salesPrice) <= 0) {
      newErrors.salesPrice = "Sale Price is required and must be greater than 0";
    }

    setValidationErrors(newErrors);

    // Show error toast with summary
    if (Object.keys(newErrors).length > 0) {
      toast.error(`Please fill in all required fields (${Object.keys(newErrors).length} errors)`, { 
        duration: 5000,
        icon: "⚠️"
      });
      
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (element as HTMLElement).focus();
      }
      
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      // Upload main image if changed
      if (mainImageFile) {
        data.append("mainImage", mainImageFile);
      }

      // Basic Information
      data.append("name", formData.name);
      if (formData.sku) data.append("sku", formData.sku);
      if (formData.barcode) data.append("barcode", formData.barcode);
      if (formData.description) data.append("description", formData.description);
      if (formData.genericName) data.append("genericName", formData.genericName);
      if (formData.brand) data.append("brand", formData.brand);
      if (formData.manufacturer) data.append("manufacturer", formData.manufacturer);

      // Category (required)
      if (formData.category) data.append("category", formData.category);
      if (formData.subCategory) data.append("subCategory", formData.subCategory);

      // Pricing - Map frontend fields to backend fields
      if (formData.salesPrice) data.append("price", formData.salesPrice);
      if (formData.costPerUnit) data.append("cost", formData.costPerUnit);
      if (formData.mrp) data.append("wholesalePrice", formData.mrp);
      if (formData.discountPercent) data.append("discountPercentage", formData.discountPercent);
      if (formData.taxRate) data.append("taxRate", formData.taxRate);
      if (formData.hsnCode) data.append("hsnCode", formData.hsnCode);

      // Stock Management
      if (formData.stock) data.append("stock", formData.stock);
      if (formData.minStock) data.append("minStock", formData.minStock);
      if (formData.minStock) data.append("reorderLevel", formData.minStock);

      // Unit - Map sellingUnit to backend unit enum
      const unitMap: { [key: string]: string } = {
        Strip: "strip",
        Piece: "pcs",
        Bottle: "bottle",
        Ampoule: "injection",
        Box: "box",
        Carton: "box",
        Jar: "bottle",
        Pack: "pack",
      };
      const backendUnit = unitMap[formData.sellingUnit] || "pcs";
      data.append("unit", backendUnit);

      // Expiry Management
      const hasExpiry = !!formData.expiryDate;
      data.append("hasExpiry", hasExpiry.toString());
      if (formData.expiryDate) {
        data.append("expiryDate", formData.expiryDate);
      }
      if (formData.manufacturingDate) {
        data.append("manufacturingDate", formData.manufacturingDate);
      }
      if (formData.batchNumber) {
        data.append("batchNumber", formData.batchNumber);
      }
      if (formData.expiryAlertDays) {
        data.append("expiryAlertDays", formData.expiryAlertDays);
      }

      // Pharmacy Specific
      data.append("isPrescription", formData.isPrescription.toString());
      data.append("isControlled", formData.isControlled.toString());
      if (formData.strength) data.append("strength", formData.strength);
      if (formData.dosage) data.append("dosage", formData.dosage);

      // Additional medical details - store in notes or description
      const medicalNotes = [];
      if (formData.drugForm) medicalNotes.push(`Form: ${formData.drugForm}`);
      if (formData.packSize) medicalNotes.push(`Pack Size: ${formData.packSize}`);
      if (formData.sideEffects) medicalNotes.push(`Side Effects: ${formData.sideEffects}`);
      if (formData.requiresRefrigeration) medicalNotes.push("Requires Refrigeration");
      if (formData.isAntibiotic) medicalNotes.push("Full Course Alert (Antibiotic)");

      // Location - Map rackLocation to location object
      if (formData.rackLocation) {
        const locationParts = formData.rackLocation.split(/[-_\/]/);
        const locationObj = {
          shelf: locationParts[0] || formData.rackLocation,
          bin: locationParts[1] || "",
          aisle: locationParts[2] || "",
        };
        data.append("location", JSON.stringify(locationObj));
      }

      // Supplier
      if (selectedSupplier) {
        data.append("suppliers", JSON.stringify([selectedSupplier]));
      }

      // Status
      data.append("isFeatured", formData.isFeatured.toString());
      data.append("isActive", "true");

      // Notes - Store additional medical details in notes field
      if (medicalNotes.length > 0) {
        data.append("notes", medicalNotes.join("\n"));
      }

      const result = await updateProduct(productId, data);

      if (result.success) {
        toast.success(result.message || "Product updated successfully!");
        router.push("/products");
      } else {
        toast.error(result.error || "Failed to update product");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const canEditProducts =
    user.role === "super_admin" || user.permissions?.canEditProducts || false;

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
        <ProductFormSkeleton isDarkMode={isDarkMode} />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pb-20 ${
        isDarkMode ? "bg-gray-950 text-gray-100" : "bg-slate-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`sticky top-0 z-30 py-4 shadow-sm border-b transition-colors ${
          isDarkMode
            ? "bg-gray-900/95 border-gray-800 backdrop-blur-md"
            : "bg-white/95 border-slate-200 backdrop-blur-md"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            {/* Left Section - Back Button + Title */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <button
                onClick={() => router.back()}
                className={`p-2 rounded-full transition-colors shrink-0 ${
                  isDarkMode
                    ? "hover:bg-gray-800 text-gray-400"
                    : "hover:bg-slate-100 text-slate-500"
                }`}
              >
                <MdArrowBack size={24} />
              </button>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    isDarkMode ? "bg-indigo-900/50" : "bg-indigo-50"
                  }`}
                >
                  <MdLocalPharmacy
                    className={`${
                      isDarkMode ? "text-indigo-400" : "text-indigo-600"
                    }`}
                    size={24}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h1
                    className={`text-xl sm:text-2xl font-bold ${
                      isDarkMode ? "text-gray-100" : "text-slate-900"
                    }`}
                  >
                    Update Product
                  </h1>
                  <p
                    className={`text-xs sm:text-sm mt-0.5 hidden sm:block ${
                      isDarkMode ? "text-gray-400" : "text-slate-500"
                    }`}
                  >
                    Edit product information and inventory details.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section - Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={() => router.back()}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-colors border ${
                  isDarkMode
                    ? "border-gray-700 hover:bg-gray-800 text-gray-300"
                    : "border-slate-300 hover:bg-slate-50 text-slate-700"
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 disabled:opacity-70 flex items-center gap-1.5 sm:gap-2 transition-all transform active:scale-95"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <MdSave size={18} /> <span>Update Product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6">
        <div className="max-w-[1600px] mx-auto px-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* ================= LEFT COLUMN (MAIN CONTENT) ================= */}
            <div className="lg:col-span-8 space-y-6">
              {/* 1. Basic Information Card */}
              <section
                className={`rounded-2xl shadow-sm border p-6 ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-800"
                    : "bg-white border-slate-200"
                }`}
              >
                <h2
                  className={`text-lg font-bold mb-6 flex items-center gap-2 pb-3 border-b ${
                    isDarkMode
                      ? "text-gray-100 border-gray-800"
                      : "text-slate-800 border-slate-100"
                  }`}
                >
                  <MdInventory className="text-indigo-500 text-xl" /> Product
                  Identity
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label
                      className={`block text-sm font-medium mb-1.5 ${
                        isDarkMode ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full h-11 px-4 rounded-lg border focus:ring-2 transition-all ${
                        validationErrors.name
                          ? "border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10"
                          : isDarkMode
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-indigo-500"
                          : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-indigo-500"
                      }`}
                      placeholder="e.g. Napa Extra 500mg"
                    />
                    {validationErrors.name && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <span>⚠️</span> {validationErrors.name}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label
                      className={`block text-sm font-medium mb-1.5 ${
                        isDarkMode ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Generic Name (Salt){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MdLabel
                        className={`absolute left-3.5 top-3.5 text-lg ${
                          isDarkMode ? "text-gray-500" : "text-slate-400"
                        }`}
                      />
                      <input
                        type="text"
                        name="genericName"
                        value={formData.genericName}
                        onChange={handleChange}
                        className={`w-full h-11 pl-10 pr-4 rounded-lg border focus:ring-2 transition-all ${
                          validationErrors.genericName
                            ? "border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10"
                            : isDarkMode
                            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-indigo-500"
                            : "bg-indigo-50/30 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-indigo-500"
                        }`}
                        placeholder="e.g. Paracetamol + Caffeine"
                      />
                    </div>
                    {validationErrors.genericName && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <span>⚠️</span> {validationErrors.genericName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1.5 ${
                        isDarkMode ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Brand
                    </label>
                    <select
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className={`w-full h-11 px-4 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition-all ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-slate-300 text-slate-900"
                      }`}
                    >
                      <option value="">Select Brand</option>
                      {brands.map((brand) => (
                        <option key={brand._id} value={brand.name}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1.5 ${
                        isDarkMode ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Supplier
                    </label>
                    <select
                      value={selectedSupplier}
                      onChange={handleSupplierChange}
                      className={`w-full h-11 px-4 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition-all ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-slate-300 text-slate-900"
                      }`}
                    >
                      <option value="">Select Supplier (Optional)</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier._id} value={supplier._id}>
                          {supplier.company}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1.5 ${
                        isDarkMode ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      SKU / Code
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      className={`w-full h-11 px-4 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition-all ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-slate-300 text-slate-900"
                      }`}
                      placeholder="Auto-generated if empty"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      className={`block text-sm font-medium mb-1.5 ${
                        isDarkMode ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Description
                    </label>
                    <div className="relative">
                      <MdDescription
                        className={`absolute left-3.5 top-3.5 text-lg ${
                          isDarkMode ? "text-gray-500" : "text-slate-400"
                        }`}
                      />
                      <textarea
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition-all resize-none ${
                          isDarkMode
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-white border-slate-300 text-slate-900"
                        }`}
                        placeholder="Add detailed product description..."
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Pricing Engine Card */}
              <section
                className={`rounded-2xl shadow-sm border p-6 overflow-hidden relative ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-800"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100 dark:border-gray-800">
                  <h2
                    className={`text-lg font-bold flex items-center gap-2 ${
                      isDarkMode ? "text-gray-100" : "text-slate-800"
                    }`}
                  >
                    <MdAttachMoney className="text-emerald-500 text-xl" /> Units
                    & Pricing Logic
                  </h2>
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${
                      isDarkMode
                        ? "bg-emerald-900/30 text-emerald-400"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    Auto-Calculation Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Unit Logic */}
                  <div
                    className={`md:col-span-5 p-5 rounded-xl border ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <h3
                      className={`text-xs font-bold uppercase tracking-wider mb-4 ${
                        isDarkMode ? "text-gray-400" : "text-slate-500"
                      }`}
                    >
                      Unit Configuration
                    </h3>

                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 gap-1">
                        <label
                          className={`text-xs font-medium ${
                            isDarkMode ? "text-gray-400" : "text-slate-500"
                          }`}
                        >
                          Purchase Unit (Buy In)
                        </label>
                        <select
                          name="purchaseUnit"
                          value={formData.purchaseUnit}
                          onChange={handleChange}
                          className={`w-full h-10 px-3 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 ${
                            isDarkMode
                              ? "bg-gray-900 border-gray-600 text-white"
                              : "bg-white border-slate-300 text-slate-900"
                          }`}
                        >
                          <option>Box</option>
                          <option>Carton</option>
                          <option>Jar</option>
                          <option>Pack</option>
                        </select>
                      </div>

                      <div className="relative flex items-center py-2">
                        <div
                          className={`flex-grow h-px ${
                            isDarkMode ? "bg-gray-700" : "bg-slate-300"
                          }`}
                        ></div>
                        <span
                          className={`flex-shrink-0 px-3 text-[10px] font-bold uppercase rounded-full border ${
                            isDarkMode
                              ? "bg-gray-900 text-gray-500 border-gray-700"
                              : "bg-white text-slate-400 border-slate-300"
                          }`}
                        >
                          1 {formData.purchaseUnit} Contains
                        </span>
                        <div
                          className={`flex-grow h-px ${
                            isDarkMode ? "bg-gray-700" : "bg-slate-300"
                          }`}
                        ></div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label
                            className={`text-xs font-medium block mb-1 ${
                              isDarkMode ? "text-gray-400" : "text-slate-500"
                            }`}
                          >
                            Quantity
                          </label>
                          <input
                            type="number"
                            name="conversionFactor"
                            value={formData.conversionFactor}
                            onChange={handleChange}
                            className={`w-full h-10 px-3 border rounded-lg text-center font-bold focus:ring-2 focus:ring-indigo-500 ${
                              isDarkMode
                                ? "bg-gray-900 border-gray-600 text-indigo-400"
                                : "bg-white border-slate-300 text-indigo-600"
                            }`}
                          />
                        </div>
                        <div>
                          <label
                            className={`text-xs font-medium block mb-1 ${
                              isDarkMode ? "text-gray-400" : "text-slate-500"
                            }`}
                          >
                            Selling Unit
                          </label>
                          <select
                            name="sellingUnit"
                            value={formData.sellingUnit}
                            onChange={handleChange}
                            className={`w-full h-10 px-3 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 ${
                              isDarkMode
                                ? "bg-gray-900 border-gray-600 text-white"
                                : "bg-white border-slate-300 text-slate-900"
                            }`}
                          >
                            <option>Strip</option>
                            <option>Piece</option>
                            <option>Bottle</option>
                            <option>Ampoule</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price Calculations */}
                  <div className="md:col-span-7 space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label
                          className={`block text-xs font-bold uppercase mb-1.5 ${
                            isDarkMode ? "text-gray-400" : "text-slate-500"
                          }`}
                        >
                          Purchase Price (Box)
                        </label>
                        <div className="relative">
                          <span
                            className={`absolute left-3 top-2.5 ${
                              isDarkMode ? "text-gray-500" : "text-slate-400"
                            }`}
                          >
                            $
                          </span>
                          <input
                            type="number"
                            name="purchasePriceBox"
                            value={formData.purchasePriceBox}
                            onChange={handleChange}
                            className={`w-full h-11 pl-7 pr-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 ${
                              isDarkMode
                                ? "bg-gray-800 border-gray-700 text-white"
                                : "bg-white border-slate-300 text-slate-900"
                            }`}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          className={`block text-xs font-bold uppercase mb-1.5 ${
                            isDarkMode ? "text-gray-400" : "text-slate-500"
                          }`}
                        >
                          Cost Per {formData.sellingUnit}
                        </label>
                        <div className="relative">
                          <span
                            className={`absolute left-3 top-2.5 ${
                              isDarkMode ? "text-gray-500" : "text-slate-400"
                            }`}
                          >
                            $
                          </span>
                          <input
                            type="text"
                            value={formData.costPerUnit}
                            readOnly
                            disabled
                            className={`w-full h-11 pl-7 pr-3 rounded-lg border cursor-not-allowed ${
                              isDarkMode
                                ? "bg-gray-800/50 border-gray-700 text-gray-400"
                                : "bg-slate-100 border-slate-200 text-slate-500"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-5 rounded-xl border grid grid-cols-2 md:grid-cols-3 gap-5 ${
                        isDarkMode
                          ? "bg-emerald-900/10 border-emerald-900/30"
                          : "bg-emerald-50/50 border-emerald-100"
                      }`}
                    >
                      <div className="col-span-2 md:col-span-1">
                        <label
                          className={`block text-xs font-bold uppercase mb-1.5 ${
                            isDarkMode ? "text-emerald-400" : "text-emerald-700"
                          }`}
                        >
                          Sale Price <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span
                            className={`absolute left-3 top-2.5 z-10 ${
                              isDarkMode
                                ? "text-emerald-500/70"
                                : "text-emerald-600/70"
                            }`}
                          >
                            $
                          </span>
                          <input
                            type="number"
                            name="salesPrice"
                            value={formData.salesPrice}
                            onChange={handleChange}
                            className={`w-full h-10 pl-7 pr-3 rounded-lg border font-bold focus:ring-2 transition-all ${
                              validationErrors.salesPrice
                                ? "border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10"
                                : isDarkMode
                                ? "bg-gray-900 border-emerald-800/50 text-emerald-400 focus:bg-gray-800 focus:ring-emerald-500"
                                : "bg-white border-emerald-300 text-emerald-800 focus:ring-emerald-500"
                            }`}
                            placeholder="0.00"
                          />
                        </div>
                        {validationErrors.salesPrice && (
                          <p className="mt-1 text-sm text-red-500 flex items-center gap-1 col-span-2 md:col-span-1">
                            <span>⚠️</span> {validationErrors.salesPrice}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          className={`block text-xs font-bold uppercase mb-1.5 ${
                            isDarkMode ? "text-gray-400" : "text-emerald-700"
                          }`}
                        >
                          MRP
                        </label>
                        <div className="relative">
                          <span
                            className={`absolute left-3 top-2.5 ${
                              isDarkMode
                                ? "text-gray-500"
                                : "text-emerald-600/50"
                            }`}
                          >
                            $
                          </span>
                          <input
                            type="number"
                            name="mrp"
                            value={formData.mrp}
                            onChange={handleChange}
                            className={`w-full h-10 pl-7 pr-3 rounded-lg border focus:ring-2 focus:ring-emerald-500 ${
                              isDarkMode
                                ? "bg-gray-800 border-gray-700 text-white"
                                : "bg-white border-emerald-200 text-slate-900"
                            }`}
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div className="hidden md:block">
                        <label
                          className={`block text-xs font-bold uppercase mb-1.5 ${
                            isDarkMode ? "text-gray-400" : "text-slate-500"
                          }`}
                        >
                          Tax %
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="taxRate"
                            value={formData.taxRate}
                            onChange={handleChange}
                            className={`w-full h-10 pl-3 pr-8 rounded-lg border focus:ring-2 focus:ring-indigo-500 ${
                              isDarkMode
                                ? "bg-gray-800 border-gray-700 text-white"
                                : "bg-white border-slate-300 text-slate-900"
                            }`}
                            placeholder="0"
                          />
                          <MdPercent
                            className={`absolute right-3 top-3 ${
                              isDarkMode ? "text-gray-500" : "text-slate-400"
                            }`}
                            size={14}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Clinical & Batch Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Clinical */}
                <section
                  className={`rounded-2xl shadow-sm border p-6 h-full ${
                    isDarkMode
                      ? "bg-gray-900 border-gray-800"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <h2
                    className={`text-lg font-bold mb-5 flex items-center gap-2 ${
                      isDarkMode ? "text-gray-100" : "text-slate-800"
                    }`}
                  >
                    <MdLocalPharmacy className="text-pink-500" /> Clinical
                    Details
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            isDarkMode ? "text-gray-300" : "text-slate-600"
                          }`}
                        >
                          Formulation
                        </label>
                        <select
                          name="drugForm"
                          value={formData.drugForm}
                          onChange={handleChange}
                          className={`w-full h-10 px-3 border rounded-lg text-sm focus:ring-2 focus:ring-pink-500 ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-700 text-white"
                              : "bg-white border-slate-300 text-slate-900"
                          }`}
                        >
                          <option>Tablet</option>
                          <option>Capsule</option>
                          <option>Syrup</option>
                          <option>Injection</option>
                          <option>Cream</option>
                          <option>Drops</option>
                          <option>Ointment</option>
                          <option>Jelly</option>
                          <option>Lotion</option>
                          <option>Toothpaste</option>
                          <option>Shampoo</option>
                          <option>Condoms</option>
                          <option>Pill</option>
                          <option>Napkin</option>
                          <option>Diaper</option>
                          <option>Surgical</option>
                          <option>Insulin</option>
                          <option>Suppository</option>
                          <option>Suspension</option>
                          <option>Vaccine</option>
                        </select>
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            isDarkMode ? "text-gray-300" : "text-slate-600"
                          }`}
                        >
                          Strength
                        </label>
                        <input
                          type="text"
                          name="strength"
                          value={formData.strength}
                          onChange={handleChange}
                          className={`w-full h-10 px-3 border rounded-lg focus:ring-2 focus:ring-pink-500 ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-700 text-white"
                              : "bg-white border-slate-300 text-slate-900"
                          }`}
                          placeholder="500mg"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          isDarkMode ? "text-gray-300" : "text-slate-600"
                        }`}
                      >
                        Dosage / Usage
                      </label>
                      <input
                        type="text"
                        name="dosage"
                        value={formData.dosage}
                        onChange={handleChange}
                        className={`w-full h-10 px-3 border rounded-lg focus:ring-2 focus:ring-pink-500 ${
                          isDarkMode
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-white border-slate-300 text-slate-900"
                        }`}
                        placeholder="e.g. 1+0+1 After meal"
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          isDarkMode ? "text-gray-300" : "text-slate-600"
                        }`}
                      >
                        Side Effects
                      </label>
                      <textarea
                        name="sideEffects"
                        value={formData.sideEffects}
                        onChange={handleChange}
                        rows={2}
                        className={`w-full p-3 border rounded-lg text-sm resize-none focus:ring-2 focus:ring-pink-500 ${
                          isDarkMode
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-white border-slate-300 text-slate-900"
                        }`}
                        placeholder="Any known side effects..."
                      />
                    </div>
                  </div>
                </section>

                {/* Batch & Inventory */}
                <section
                  className={`rounded-2xl shadow-sm border p-6 h-full ${
                    isDarkMode
                      ? "bg-gray-900 border-gray-800"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <h2
                    className={`text-lg font-bold mb-5 flex items-center gap-2 ${
                      isDarkMode ? "text-gray-100" : "text-slate-800"
                    }`}
                  >
                    <MdDateRange className="text-orange-500" /> Batch &
                    Inventory
                  </h2>
                  <div className="space-y-4">
                    <div
                      className={`p-4 rounded-xl border ${
                        isDarkMode
                          ? "bg-orange-900/10 border-orange-900/30"
                          : "bg-orange-50 border-orange-100"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <label
                          className={`text-sm font-bold ${
                            isDarkMode ? "text-orange-400" : "text-orange-800"
                          }`}
                        >
                          Opening Stock (Boxes)
                        </label>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded border uppercase ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-700 text-gray-400"
                              : "bg-white border-slate-200 text-slate-500"
                          }`}
                        >
                          Auto-calc
                        </span>
                      </div>
                      <input
                        type="number"
                        name="openingStockBoxes"
                        value={formData.openingStockBoxes}
                        onChange={handleChange}
                        className={`w-full h-10 px-3 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                          isDarkMode
                            ? "bg-gray-800 border-orange-900/50 text-white"
                            : "bg-white border-orange-200 text-slate-900"
                        }`}
                        placeholder="0"
                      />
                      <div
                        className={`mt-2 text-xs flex justify-between ${
                          isDarkMode ? "text-orange-400/80" : "text-orange-700"
                        }`}
                      >
                        <span>Total Strips in DB:</span>
                        <span className="font-bold text-base">
                          {formData.stock}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          className={`block text-xs font-bold uppercase mb-1 ${
                            isDarkMode ? "text-gray-400" : "text-slate-500"
                          }`}
                        >
                          Batch #
                        </label>
                        <input
                          type="text"
                          name="batchNumber"
                          value={formData.batchNumber}
                          onChange={handleChange}
                          className={`w-full h-9 px-3 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-700 text-white"
                              : "bg-white border-slate-300 text-slate-900"
                          }`}
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-xs font-bold uppercase mb-1 ${
                            isDarkMode ? "text-gray-400" : "text-slate-500"
                          }`}
                        >
                          Expiry Date
                        </label>
                        <input
                          type="date"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          className={`w-full h-9 px-3 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-700 text-white"
                              : "bg-white border-slate-300 text-slate-900"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Low Stock Alert */}
                    <div
                      className={`p-4 rounded-xl border ${
                        isDarkMode
                          ? "bg-red-900/10 border-red-900/30"
                          : "bg-red-50 border-red-100"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <MdWarning
                          className={`${
                            isDarkMode ? "text-red-400" : "text-red-600"
                          }`}
                          size={18}
                        />
                        <label
                          className={`text-sm font-bold ${
                            isDarkMode ? "text-red-400" : "text-red-800"
                          }`}
                        >
                          Low Stock Alert
                        </label>
                      </div>
                      <input
                        type="number"
                        name="minStock"
                        value={formData.minStock}
                        onChange={handleChange}
                        min="0"
                        className={`w-full h-10 px-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                          isDarkMode
                            ? "bg-gray-800 border-red-900/50 text-white"
                            : "bg-white border-red-200 text-slate-900"
                        }`}
                        placeholder="e.g. 10"
                      />
                      <div
                        className={`mt-2 text-xs flex items-center gap-1 ${
                          isDarkMode ? "text-red-400/80" : "text-red-700"
                        }`}
                      >
                        <span>⚠️ Alert when stock drops below this quantity</span>
                      </div>
                      <div
                        className={`mt-1 text-xs font-medium ${
                          isDarkMode ? "text-red-400" : "text-red-600"
                        }`}
                      >
                        Unit: {formData.sellingUnit || "Strip"}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* ================= RIGHT COLUMN (SIDEBAR) ================= */}
            <div className="lg:col-span-4 space-y-6">
              {/* 1. Images */}
              <div
                className={`rounded-2xl shadow-sm border p-5 ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-800"
                    : "bg-white border-slate-200"
                }`}
              >
                <h3
                  className={`font-bold mb-4 text-sm uppercase tracking-wide ${
                    isDarkMode ? "text-gray-300" : "text-slate-800"
                  }`}
                >
                  Product Image
                </h3>
                <div
                  className={`w-full aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition relative overflow-hidden group ${
                    isDarkMode
                      ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-500"
                      : "bg-slate-50 border-slate-300 hover:bg-slate-100 hover:border-slate-400"
                  }`}
                >
                  {mainImagePreview ? (
                    <>
                      <img
                        src={mainImagePreview}
                        className="w-full h-full object-contain p-2"
                        alt="Preview"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setMainImageFile(null);
                          setMainImagePreview("");
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MdClose size={16} />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                      <div
                        className={`p-4 rounded-full mb-3 ${
                          isDarkMode ? "bg-gray-700" : "bg-white shadow-sm"
                        }`}
                      >
                        <MdCloudUpload
                          className={`text-3xl ${
                            isDarkMode ? "text-indigo-400" : "text-indigo-500"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-300" : "text-slate-600"
                        }`}
                      >
                        Click to upload image
                      </span>
                      <span
                        className={`text-xs mt-1 ${
                          isDarkMode ? "text-gray-500" : "text-slate-400"
                        }`}
                      >
                        SVG, PNG, JPG or GIF
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleMainImage}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* 2. Category & Location */}
              <div
                className={`rounded-2xl shadow-sm border p-5 ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-800"
                    : "bg-white border-slate-200"
                }`}
              >
                <h3
                  className={`font-bold mb-4 text-sm uppercase tracking-wide ${
                    isDarkMode ? "text-gray-300" : "text-slate-800"
                  }`}
                >
                  Organization
                </h3>
                <div className="space-y-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1.5 flex items-center gap-1 ${
                        isDarkMode ? "text-gray-400" : "text-slate-600"
                      }`}
                    >
                      <MdCategory
                        className={
                          isDarkMode ? "text-gray-500" : "text-slate-400"
                        }
                      />{" "}
                      Category
                    </label>
                    <select
                      value={formData.subCategoryId || formData.categoryId}
                      onChange={handleCategoryChange}
                      className={`w-full h-10 px-3 border rounded-lg text-sm focus:ring-2 transition-all ${
                        validationErrors.category
                          ? "border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10"
                          : isDarkMode
                          ? "bg-gray-800 border-gray-700 text-white focus:ring-indigo-500"
                          : "bg-white border-slate-300 text-slate-900 focus:ring-indigo-500"
                      }`}
                    >
                      <option value="">Select Category *</option>
                      {mainCategories.map((cat) => (
                        <optgroup key={cat._id} label={cat.name}>
                          <option value={cat._id}>{cat.name}</option>
                          {subCategories
                            .filter((s) => s.parentCategory?._id === cat._id)
                            .map((s) => (
                              <option key={s._id} value={s._id}>
                                -- {s.name}
                              </option>
                            ))}
                        </optgroup>
                      ))}
                    </select>
                    {validationErrors.category && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <span>⚠️</span> {validationErrors.category}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1.5 flex items-center gap-1 ${
                        isDarkMode ? "text-gray-400" : "text-slate-600"
                      }`}
                    >
                      <MdQrCode
                        className={
                          isDarkMode ? "text-gray-500" : "text-slate-400"
                        }
                      />{" "}
                      Barcode
                    </label>
                    <input
                      type="text"
                      name="barcode"
                      value={formData.barcode}
                      onChange={handleChange}
                      className={`w-full h-10 px-3 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-slate-300 text-slate-900"
                      }`}
                      placeholder="Scan Code"
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1.5 flex items-center gap-1 ${
                        isDarkMode ? "text-gray-400" : "text-slate-600"
                      }`}
                    >
                      <MdInventory
                        className={
                          isDarkMode ? "text-gray-500" : "text-slate-400"
                        }
                      />{" "}
                      Shelf / Rack
                    </label>
                    <input
                      type="text"
                      name="rackLocation"
                      value={formData.rackLocation}
                      onChange={handleChange}
                      className={`w-full h-10 px-3 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700 text-white focus:bg-gray-800"
                          : "bg-yellow-50/50 border-slate-300 text-slate-900 focus:bg-white"
                      }`}
                      placeholder="e.g. Rack A-12"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Safety Flags */}
              <div
                className={`rounded-2xl shadow-sm border p-5 ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-800"
                    : "bg-white border-slate-200"
                }`}
              >
                <h3
                  className={`font-bold mb-4 text-sm uppercase tracking-wide flex items-center gap-2 ${
                    isDarkMode ? "text-gray-300" : "text-slate-800"
                  }`}
                >
                  <MdWarning className="text-amber-500" /> Compliance
                </h3>
                <div className="space-y-1">
                  <ToggleSwitch
                    label="Rx Required"
                    name="isPrescription"
                    checked={formData.isPrescription}
                    onChange={handleChange}
                    colorClass="bg-indigo-600"
                    isDarkMode={isDarkMode}
                  />
                  <ToggleSwitch
                    label="Narcotic / Controlled"
                    name="isControlled"
                    checked={formData.isControlled}
                    onChange={handleChange}
                    colorClass="bg-red-600"
                    isDarkMode={isDarkMode}
                  />
                  <ToggleSwitch
                    label="Fridge Item ❄️"
                    name="requiresRefrigeration"
                    checked={formData.requiresRefrigeration}
                    onChange={handleChange}
                    colorClass="bg-blue-500"
                    isDarkMode={isDarkMode}
                  />
                  <ToggleSwitch
                    label="Full Course Alert"
                    name="isAntibiotic"
                    checked={formData.isAntibiotic}
                    onChange={handleChange}
                    colorClass="bg-orange-500"
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Helper Component for Toggles
function ToggleSwitch({
  label,
  name,
  checked,
  onChange,
  colorClass,
  isDarkMode,
}: any) {
  return (
    <label
      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition border border-transparent ${
        isDarkMode ? "hover:bg-gray-800" : "hover:bg-slate-50"
      }`}
    >
      <span
        className={`text-sm font-medium ${
          isDarkMode ? "text-gray-300" : "text-slate-700"
        }`}
      >
        {label}
      </span>
      <div className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div
          className={`w-11 h-6 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
            isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-200"
          } ${checked ? colorClass : ""}`}
        ></div>
      </div>
    </label>
  );
}
