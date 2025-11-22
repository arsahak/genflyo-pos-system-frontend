"use client";

import api from "@/lib/api";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoMdSearch } from "react-icons/io";
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdInventory,
  MdNavigateBefore,
  MdNavigateNext,
  MdWarning,
  MdFileDownload,
  MdFileUpload,
  MdDescription,
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
  price: number;
  cost?: number;
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
  expiryAlertDays?: number;
  isExpiringSoon?: boolean;
  isExpired?: boolean;
  isLowStock?: boolean;
  isFeatured: boolean;
  isActive: boolean;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export default function ProductsList() {
  const { user } = useStore();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
    hasMore: false,
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [expiringCount, setExpiringCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      });

      if (searchTerm) params.append("search", searchTerm);
      if (categoryFilter) params.append("category", categoryFilter);
      if (brandFilter) params.append("brand", brandFilter);
      if (stockFilter === "low") params.append("lowStock", "true");
      if (stockFilter === "out") params.append("inStock", "false");
      if (stockFilter === "in") params.append("inStock", "true");

      const response = await api.get(`/products?${params.toString()}`);

      if (response.data.products) {
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      } else {
        setProducts(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error: unknown) {
      console.error("Failed to load products:", error);
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, categoryFilter, brandFilter, stockFilter]);

  const loadMetadata = useCallback(async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        api.get("/products/meta/categories"),
        api.get("/products/meta/brands"),
      ]);

      setCategories(categoriesRes.data.categories || []);
      setBrands(brandsRes.data.brands || []);
    } catch (error) {
      console.error("Failed to load metadata:", error);
      // Don't show toast error for metadata - it's not critical
    }
  }, []);

  const loadAlerts = useCallback(async () => {
    try {
      const [expiringRes, lowStockRes] = await Promise.all([
        api.get("/products/alerts/expiring"),
        api.get("/products/alerts/low-stock"),
      ]);

      setExpiringCount(expiringRes.data.count || 0);
      setLowStockCount(lowStockRes.data.count || 0);
    } catch (error) {
      console.error("Failed to load alerts:", error);
      // Don't show toast error for alerts - it's not critical
    }
  }, []);

  // Load products when filters change
  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
    loadProducts();
  }, [user, router, loadProducts]);

  // Load metadata and alerts only once on mount
  useEffect(() => {
    if (!user) return;
    loadMetadata();
    loadAlerts();
  }, [user, loadMetadata, loadAlerts]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleBrandFilter = (value: string) => {
    setBrandFilter(value);
    setCurrentPage(1);
  };

  const handleStockFilter = (value: string) => {
    setStockFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) return;

    try {
      await api.delete(`/products/${productId}`);
      toast.success("Product deleted successfully");

      // Reload data after deletion
      await Promise.all([
        loadProducts(),
        loadMetadata(),
        loadAlerts()
      ]);
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to delete product";
      toast.error(errorMessage);
    }
  };

  const canAddProducts =
    user?.role === "super_admin" || user?.permissions?.canAddProducts;
  const canEditProducts =
    user?.role === "super_admin" || user?.permissions?.canEditProducts;
  const canDeleteProducts =
    user?.role === "super_admin" || user?.permissions?.canDeleteProducts;

  // CSV Export Function
  const handleExportCSV = async () => {
    try {
      toast.loading("Exporting products...");
      
      // Build params for export (same as current filters)
      const params = new URLSearchParams({
        limit: "10000", // Get all products for export
      });
      
      if (searchTerm) params.append("search", searchTerm);
      if (categoryFilter) params.append("category", categoryFilter);
      if (brandFilter) params.append("brand", brandFilter);
      if (stockFilter === "low") params.append("lowStock", "true");
      if (stockFilter === "out") params.append("inStock", "false");
      if (stockFilter === "in") params.append("inStock", "true");

      const response = await api.get(`/products?${params.toString()}`);
      const exportProducts = response.data.products || response.data;

      if (!exportProducts || exportProducts.length === 0) {
        toast.dismiss();
        toast.error("No products to export");
        return;
      }

      // Convert to CSV
      const csvHeaders = [
        "Name",
        "SKU",
        "Barcode",
        "Description",
        "Category",
        "SubCategory",
        "Brand",
        "Price",
        "Cost",
        "Stock",
        "MinStock",
        "ReorderLevel",
        "Unit",
        "HasExpiry",
        "ExpiryDate",
        "ExpiryAlertDays",
        "IsFeatured",
        "IsActive",
      ];

      const csvRows = exportProducts.map((product: Product) => [
        `"${product.name || ""}"`,
        `"${product.sku || ""}"`,
        `"${product.barcode || ""}"`,
        `"${product.description || ""}"`,
        `"${product.category || ""}"`,
        `"${product.subCategory || ""}"`,
        `"${product.brand || ""}"`,
        product.price || 0,
        product.cost || 0,
        product.stock || 0,
        product.minStock || 0,
        product.reorderLevel || 0,
        `"${product.unit || "pcs"}"`,
        product.hasExpiry ? "TRUE" : "FALSE",
        `"${product.expiryDate || ""}"`,
        product.expiryAlertDays || 0,
        product.isFeatured ? "TRUE" : "FALSE",
        product.isActive ? "TRUE" : "FALSE",
      ]);

      const csvContent = [
        csvHeaders.join(","),
        ...csvRows.map((row: (string | number)[]) => row.join(",")),
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `products_export_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.dismiss();
      toast.success(`Exported ${exportProducts.length} products successfully!`);
    } catch (error) {
      console.error("Export error:", error);
      toast.dismiss();
      toast.error("Failed to export products");
    }
  };

  // CSV Template Download
  const handleDownloadTemplate = () => {
    const csvHeaders = [
      "Name",
      "SKU",
      "Barcode",
      "Description",
      "Category",
      "SubCategory",
      "Brand",
      "Price",
      "Cost",
      "Stock",
      "MinStock",
      "ReorderLevel",
      "Unit",
      "HasExpiry",
      "ExpiryDate",
      "ExpiryAlertDays",
      "IsFeatured",
      "IsActive",
    ];

    const sampleRow = [
      "Sample Product",
      "SKU001",
      "1234567890123",
      "Sample product description",
      "Electronics",
      "Phones",
      "Samsung",
      "499.99",
      "350.00",
      "100",
      "10",
      "20",
      "pcs",
      "FALSE",
      "",
      "0",
      "FALSE",
      "TRUE",
    ];

    const csvContent = [csvHeaders.join(","), sampleRow.join(",")].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "products_import_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Template downloaded successfully!");
  };

  // CSV Import Function
  const handleImportCSV = async () => {
    if (!importFile) {
      toast.error("Please select a CSV file");
      return;
    }

    try {
      setImporting(true);
      toast.loading("Importing products...");

      // Read and parse CSV file
      const text = await importFile.text();
      const rows = text.split("\n").map((row) => {
        // Simple CSV parser (handles quoted fields)
        const fields: string[] = [];
        let field = "";
        let inQuotes = false;

        for (let i = 0; i < row.length; i++) {
          const char = row[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === "," && !inQuotes) {
            fields.push(field.trim());
            field = "";
          } else {
            field += char;
          }
        }
        fields.push(field.trim());
        return fields;
      });

      const headers = rows[0];
      const dataRows = rows.slice(1).filter((row) => row.some((cell) => cell));

      if (dataRows.length === 0) {
        toast.dismiss();
        toast.error("No data found in CSV file");
        setImporting(false);
        return;
      }

      // Convert CSV rows to product objects
      const productsToImport = dataRows.map((row) => {
        const product: any = {};
        headers.forEach((header, index) => {
          const value = row[index]?.replace(/^"|"$/g, ""); // Remove quotes
          const headerLower = header.toLowerCase().trim();

          if (headerLower === "name") product.name = value;
          else if (headerLower === "sku") product.sku = value;
          else if (headerLower === "barcode") product.barcode = value;
          else if (headerLower === "description") product.description = value;
          else if (headerLower === "category") product.category = value;
          else if (headerLower === "subcategory") product.subCategory = value;
          else if (headerLower === "brand") product.brand = value;
          else if (headerLower === "price")
            product.price = parseFloat(value) || 0;
          else if (headerLower === "cost")
            product.cost = parseFloat(value) || 0;
          else if (headerLower === "stock")
            product.stock = parseInt(value) || 0;
          else if (headerLower === "minstock")
            product.minStock = parseInt(value) || 0;
          else if (headerLower === "reorderlevel")
            product.reorderLevel = parseInt(value) || 0;
          else if (headerLower === "unit") product.unit = value || "pcs";
          else if (headerLower === "hasexpiry")
            product.hasExpiry = value.toUpperCase() === "TRUE";
          else if (headerLower === "expirydate" && value)
            product.expiryDate = value;
          else if (headerLower === "expiryalertdays")
            product.expiryAlertDays = parseInt(value) || 0;
          else if (headerLower === "isfeatured")
            product.isFeatured = value.toUpperCase() === "TRUE";
          else if (headerLower === "isactive")
            product.isActive = value.toUpperCase() === "TRUE";
        });
        return product;
      });

      // Send to backend
      const response = await api.post("/products/bulk-import", {
        products: productsToImport,
      });

      toast.dismiss();
      toast.success(
        `Successfully imported ${
          response.data.imported || productsToImport.length
        } products!`
      );

      // Reload products and close modal
      setShowImportModal(false);
      setImportFile(null);
      await Promise.all([loadProducts(), loadMetadata(), loadAlerts()]);
    } catch (error: unknown) {
      console.error("Import error:", error);
      toast.dismiss();
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to import products";
      toast.error(errorMessage);
    } finally {
      setImporting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your inventory</p>
        </div>
        <div className="flex items-center gap-3">
          {/* CSV Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTemplate}
              className="bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              title="Download CSV Template"
            >
              <MdDescription size={20} />
              <span className="hidden sm:inline">Template</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              title="Export to CSV"
            >
              <MdFileDownload size={20} />
              <span className="hidden sm:inline">Export</span>
            </button>
            {canAddProducts && (
              <button
                onClick={() => setShowImportModal(true)}
                className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                title="Import from CSV"
              >
                <MdFileUpload size={20} />
                <span className="hidden sm:inline">Import</span>
              </button>
            )}
          </div>
          
          {/* Add Product Button */}
          {canAddProducts && (
            <Link
              href="/products/add-new-product"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <MdAdd size={20} />
              <span>Add Product</span>
            </Link>
          )}
        </div>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white">
          <p className="text-sm opacity-90">Total Products</p>
          <p className="text-3xl font-bold mt-1">{pagination.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg text-white">
          <p className="text-sm opacity-90">Current Page</p>
          <p className="text-3xl font-bold mt-1">{products.length}</p>
        </div>
        <div
          className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-lg text-white cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleStockFilter("low")}
        >
          <div className="flex items-center gap-2">
            <MdWarning size={24} />
            <p className="text-sm opacity-90">Low Stock</p>
          </div>
          <p className="text-3xl font-bold mt-1">{lowStockCount}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-lg text-white cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2">
            <MdWarning size={24} />
            <p className="text-sm opacity-90">Expiring Soon</p>
          </div>
          <p className="text-3xl font-bold mt-1">{expiringCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products by name, SKU, barcode..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <select
              value={stockFilter}
              onChange={(e) => handleStockFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="">All Stock Levels</option>
              <option value="in">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || categoryFilter || brandFilter || stockFilter) && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchTerm && (
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full flex items-center gap-1">
                Search: {searchTerm}
                <button
                  onClick={() => handleSearch("")}
                  className="ml-1 hover:text-indigo-900"
                >
                  ×
                </button>
              </span>
            )}
            {categoryFilter && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full flex items-center gap-1">
                Category: {categoryFilter}
                <button
                  onClick={() => handleCategoryFilter("")}
                  className="ml-1 hover:text-purple-900"
                >
                  ×
                </button>
              </span>
            )}
            {stockFilter && (
              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full flex items-center gap-1">
                Stock: {stockFilter}
                <button
                  onClick={() => handleStockFilter("")}
                  className="ml-1 hover:text-orange-900"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={() => {
                handleSearch("");
                handleCategoryFilter("");
                handleBrandFilter("");
                handleStockFilter("");
              }}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <MdInventory className="mx-auto text-gray-400 text-6xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || categoryFilter || stockFilter
                ? "Try adjusting your filters"
                : "Get started by adding your first product"}
            </p>
            {canAddProducts && (
              <Link
                href="/products/add-new-product"
                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
              >
                Add New Product
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {product.mainImage?.url ? (
                              <img
                                src={product.mainImage.url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <MdInventory size={24} />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="font-semibold text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {product.sku && `SKU: ${product.sku}`}
                              {product.brand && ` • ${product.brand}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ${product.price.toFixed(2)}
                        </div>
                        {product.cost && (
                          <div className="text-xs text-gray-500">
                            Cost: ${product.cost.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {product.stock} {product.unit}
                        </div>
                        {product.isLowStock && (
                          <div className="text-xs text-orange-600 font-medium flex items-center gap-1">
                            <MdWarning size={14} />
                            Low Stock
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {product.isExpired && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                              Expired
                            </span>
                          )}
                          {product.isExpiringSoon && !product.isExpired && (
                            <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                              Expiring Soon
                            </span>
                          )}
                          {product.isFeatured && (
                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                              Featured
                            </span>
                          )}
                          {!product.isExpired &&
                            !product.isExpiringSoon &&
                            !product.isFeatured && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                Active
                              </span>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/products/${product._id}`}
                            className="text-indigo-600 hover:text-indigo-900 font-medium"
                          >
                            View
                          </Link>
                          {canEditProducts && (
                            <Link
                              href={`/products/${product._id}/edit`}
                              className="text-green-600 hover:text-green-900 font-medium flex items-center gap-1"
                            >
                              <MdEdit size={16} />
                              Edit
                            </Link>
                          )}
                          {canDeleteProducts && (
                            <button
                              onClick={() =>
                                handleDelete(product._id, product.name)
                              }
                              className="text-red-600 hover:text-red-900 font-medium flex items-center gap-1"
                            >
                              <MdDelete size={16} />
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-semibold">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}
                  </span>{" "}
                  of <span className="font-semibold">{pagination.total}</span>{" "}
                  products
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                  >
                    <MdNavigateBefore size={20} />
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, pagination.totalPages))].map(
                      (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 rounded-lg transition-all ${
                              pagination.page === pageNum
                                ? "bg-indigo-600 text-white"
                                : "border border-gray-300 hover:bg-gray-100"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                  </div>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasMore}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                  >
                    Next
                    <MdNavigateNext size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* CSV Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MdFileUpload size={32} />
                  <div>
                    <h2 className="text-2xl font-bold">Import Products</h2>
                    <p className="text-sm opacity-90 mt-1">
                      Upload CSV file to bulk import products
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                  }}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  disabled={importing}
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <MdDescription size={20} />
                  Instructions
                </h3>
                <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
                  <li>Download the CSV template to see the required format</li>
                  <li>Fill in your product data following the template structure</li>
                  <li>Required fields: Name, Category, Price, Stock, Unit</li>
                  <li>
                    Use TRUE/FALSE for boolean fields (HasExpiry, IsFeatured,
                    IsActive)
                  </li>
                  <li>Date format for ExpiryDate: YYYY-MM-DD</li>
                  <li>Maximum file size: 5MB</li>
                </ul>
              </div>

              {/* File Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Select CSV File
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer">
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                        importFile
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 hover:border-indigo-500 hover:bg-gray-50"
                      }`}
                    >
                      {importFile ? (
                        <div className="space-y-2">
                          <MdDescription className="mx-auto text-green-600 text-4xl" />
                          <p className="text-sm font-medium text-green-700">
                            {importFile.name}
                          </p>
                          <p className="text-xs text-green-600">
                            {(importFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <MdFileUpload className="mx-auto text-gray-400 text-4xl" />
                          <p className="text-sm text-gray-600">
                            Click to select CSV file or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            CSV files only (max 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            toast.error("File size must be less than 5MB");
                            return;
                          }
                          if (!file.name.endsWith(".csv")) {
                            toast.error("Please select a CSV file");
                            return;
                          }
                          setImportFile(file);
                        }
                      }}
                      className="hidden"
                      disabled={importing}
                    />
                  </label>
                </div>

                {importFile && (
                  <button
                    onClick={() => setImportFile(null)}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                    disabled={importing}
                  >
                    Remove file
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <button
                  onClick={handleDownloadTemplate}
                  className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2 text-sm"
                  disabled={importing}
                >
                  <MdDescription size={18} />
                  Download Template
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setShowImportModal(false);
                      setImportFile(null);
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    disabled={importing}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImportCSV}
                    disabled={!importFile || importing}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                  >
                    {importing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Importing...
                      </>
                    ) : (
                      <>
                        <MdFileUpload size={18} />
                        Import Products
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
