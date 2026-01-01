"use client";

import {
  getAllProducts,
  getProductCategories,
  getProductBrands,
  getExpiringProducts,
  getLowStockProducts,
  deleteProduct,
  bulkImportProducts,
} from "@/app/actions/product";
import { useSidebar } from "@/lib/SidebarContext";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ProductFilters } from "./components/ProductFilters";
import { ProductImportModal } from "./components/ProductImportModal";
import { ProductListHeader } from "./components/ProductListHeader";
import { ProductListSkeleton } from "./components/ProductListSkeleton";
import { ProductStats } from "./components/ProductStats";
import { ProductTable } from "./components/ProductTable";
import { Pagination, Product } from "./types";

export default function ProductsList() {
  const { user } = useStore();
  const router = useRouter();
  const { isDarkMode } = useSidebar();

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
  const [deleting, setDeleting] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getAllProducts({
        page: currentPage,
        limit: 20,
        search: searchTerm || undefined,
        category: categoryFilter || undefined,
        brand: brandFilter || undefined,
        status: stockFilter || undefined,
      });

      if (result.success && result.data?.products) {
        setProducts(result.data.products);
        setPagination(result.data.pagination || {
          total: result.data.products.length,
          page: currentPage,
          limit: 20,
          totalPages: Math.ceil(result.data.products.length / 20),
          hasMore: false,
        });
      } else {
        toast.error(result.error || "Failed to load products");
        setProducts([]);
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
        getProductCategories(),
        getProductBrands(),
      ]);

      if (categoriesRes.success && categoriesRes.data?.categories) {
        setCategories(categoriesRes.data.categories);
      }
      if (brandsRes.success && brandsRes.data?.brands) {
        setBrands(brandsRes.data.brands);
      }
    } catch (error) {
      console.error("Failed to load metadata:", error);
    }
  }, []);

  const loadAlerts = useCallback(async () => {
    try {
      const [expiringRes, lowStockRes] = await Promise.all([
        getExpiringProducts(),
        getLowStockProducts(),
      ]);

      if (expiringRes.success && expiringRes.data) {
        setExpiringCount(expiringRes.data.count || 0);
      }
      if (lowStockRes.success && lowStockRes.data) {
        setLowStockCount(lowStockRes.data.count || 0);
      }
    } catch (error) {
      console.error("Failed to load alerts:", error);
    }
  }, []);

  // Load products when filters change
  useEffect(() => {
    // Wait for user to be synced before loading
    if (!user) return;
    loadProducts();
  }, [user, loadProducts]);

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

  const handleStockFilter = (value: string) => {
    setStockFilter(value);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setBrandFilter("");
    setStockFilter("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      setDeleting(true);
      const result = await deleteProduct(productId);

      if (result.success) {
        toast.success(result.message || "Product deleted successfully");
        // Reload data after deletion
        await Promise.all([
          loadProducts(),
          loadMetadata(),
          loadAlerts()
        ]);
      } else {
        toast.error(result.error || "Failed to delete product");
      }
    } catch (error: unknown) {
      console.error("Delete product error:", error);
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  const canAddProducts =
    user?.role === "super_admin" || user?.permissions?.canAddProducts || false;
  const canEditProducts =
    user?.role === "super_admin" || user?.permissions?.canEditProducts || false;
  const canDeleteProducts =
    user?.role === "super_admin" || user?.permissions?.canDeleteProducts || false;

  // CSV Export Function
  const handleExportCSV = async () => {
    try {
      toast.loading("Exporting products...");
      
      const result = await getAllProducts({
        page: 1,
        limit: 10000,
        search: searchTerm || undefined,
        category: categoryFilter || undefined,
        brand: brandFilter || undefined,
        lowStock: stockFilter === "low" ? true : undefined,
        inStock: stockFilter === "in" ? true : stockFilter === "out" ? false : undefined,
      });

      if (!result.success) {
        toast.dismiss();
        toast.error(result.error || "Failed to fetch products");
        return;
      }

      const exportProducts = result.data?.products || [];

      if (!exportProducts || exportProducts.length === 0) {
        toast.dismiss();
        toast.error("No products to export");
        return;
      }

      const csvHeaders = [
        "Name", "SKU", "Barcode", "Description", "Category", "SubCategory",
        "Brand", "Price", "Cost", "Stock", "MinStock", "ReorderLevel",
        "Unit", "HasExpiry", "ExpiryDate", "ExpiryAlertDays", "IsFeatured", "IsActive",
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

  const handleDownloadTemplate = () => {
    const csvHeaders = [
      "Name", "SKU", "Barcode", "Description", "Category", "SubCategory",
      "Brand", "Price", "Cost", "Stock", "MinStock", "ReorderLevel",
      "Unit", "HasExpiry", "ExpiryDate", "ExpiryAlertDays", "IsFeatured", "IsActive",
    ];

    const sampleRow = [
      "Sample Product", "SKU001", "1234567890123", "Sample product description",
      "Electronics", "Phones", "Samsung", "499.99", "350.00", "100", "10", "20",
      "pcs", "FALSE", "", "0", "FALSE", "TRUE",
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

  const handleImportCSV = async () => {
    if (!importFile) {
      toast.error("Please select a CSV file");
      return;
    }

    try {
      setImporting(true);
      toast.loading("Importing products...");

      const text = await importFile.text();
      const rows = text.split("\n").map((row) => {
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

      const productsToImport = dataRows.map((row) => {
        const product: any = {};
        headers.forEach((header, index) => {
          const value = row[index]?.replace(/^"|"$/g, "");
          const headerLower = header.toLowerCase().trim();

          if (headerLower === "name") product.name = value;
          else if (headerLower === "sku") product.sku = value;
          else if (headerLower === "barcode") product.barcode = value;
          else if (headerLower === "description") product.description = value;
          else if (headerLower === "category") product.category = value;
          else if (headerLower === "subcategory") product.subCategory = value;
          else if (headerLower === "brand") product.brand = value;
          else if (headerLower === "price") product.price = parseFloat(value) || 0;
          else if (headerLower === "cost") product.cost = parseFloat(value) || 0;
          else if (headerLower === "stock") product.stock = parseInt(value) || 0;
          else if (headerLower === "minstock") product.minStock = parseInt(value) || 0;
          else if (headerLower === "reorderlevel") product.reorderLevel = parseInt(value) || 0;
          else if (headerLower === "unit") product.unit = value || "pcs";
          else if (headerLower === "hasexpiry") product.hasExpiry = value.toUpperCase() === "TRUE";
          else if (headerLower === "expirydate" && value) product.expiryDate = value;
          else if (headerLower === "expiryalertdays") product.expiryAlertDays = parseInt(value) || 0;
          else if (headerLower === "isfeatured") product.isFeatured = value.toUpperCase() === "TRUE";
          else if (headerLower === "isactive") product.isActive = value.toUpperCase() === "TRUE";
        });
        return product;
      });

      const formData = new FormData();
      formData.append("products", JSON.stringify(productsToImport));

      const result = await bulkImportProducts(formData);

      toast.dismiss();

      if (result.success) {
        toast.success(result.message || `Successfully imported ${productsToImport.length} products!`);
        setShowImportModal(false);
        setImportFile(null);
        await Promise.all([loadProducts(), loadMetadata(), loadAlerts()]);
      } else {
        toast.error(result.error || "Failed to import products");
      }
    } catch (error: unknown) {
      console.error("Import error:", error);
      toast.dismiss();
      toast.error("Failed to import products");
    } finally {
      setImporting(false);
    }
  };

  // Show loading while waiting for session sync
  if (!user) {
    return (
      <div
        className={`min-h-screen p-6 transition-colors duration-300 font-sans ${
          isDarkMode ? "bg-gray-950 text-gray-100" : "bg-slate-50 text-gray-900"
        }`}
      >
        <div className="max-w-[1920px] mx-auto">
          <ProductListSkeleton isDarkMode={isDarkMode} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 font-sans ${
        isDarkMode ? "bg-gray-950 text-gray-100" : "bg-slate-50 text-gray-900"
      }`}
    >
      <div className="max-w-[1920px] mx-auto">
        <ProductListHeader
          isDarkMode={isDarkMode}
          canAddProducts={canAddProducts}
          setShowImportModal={setShowImportModal}
          handleExportCSV={handleExportCSV}
          handleDownloadTemplate={handleDownloadTemplate}
        />

        {(loading && products.length === 0) || deleting ? (
          <ProductListSkeleton isDarkMode={isDarkMode} />
        ) : (
          <>
            <ProductStats
              isDarkMode={isDarkMode}
              totalProducts={pagination.total}
              currentProducts={products.length}
              lowStockCount={lowStockCount}
              expiringCount={expiringCount}
              handleStockFilter={handleStockFilter}
            />

            <ProductFilters
              isDarkMode={isDarkMode}
              searchTerm={searchTerm}
              handleSearch={handleSearch}
              categoryFilter={categoryFilter}
              handleCategoryFilter={handleCategoryFilter}
              stockFilter={stockFilter}
              handleStockFilter={handleStockFilter}
              categories={categories}
              clearAllFilters={clearAllFilters}
            />

            <ProductTable
              isDarkMode={isDarkMode}
              loading={loading}
              products={products}
              pagination={pagination}
              handlePageChange={handlePageChange}
              canEditProducts={canEditProducts}
              canDeleteProducts={canDeleteProducts}
              handleDelete={handleDelete}
            />
          </>
        )}

        <ProductImportModal
          isDarkMode={isDarkMode}
          showImportModal={showImportModal}
          setShowImportModal={setShowImportModal}
          importFile={importFile}
          setImportFile={setImportFile}
          importing={importing}
          handleImportCSV={handleImportCSV}
          handleDownloadTemplate={handleDownloadTemplate}
        />
      </div>
    </div>
  );
}
