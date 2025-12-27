"use client";

import { useSidebar } from "@/lib/SidebarContext";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllBrands, deleteBrand } from "@/app/actions/brands";
import BrandFilters from "./components/BrandFilters";
import BrandListHeader from "./components/BrandListHeader";
import { BrandListSkeleton } from "./components/BrandListSkeleton";
import BrandStats from "./components/BrandStats";
import BrandTable from "./components/BrandTable";

export interface Brand {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  logo?: {
    url?: string;
    thumbUrl?: string;
    displayUrl?: string;
  };
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function BrandsList() {
  const { user } = useStore();
  const { isDarkMode } = useSidebar();
  const router = useRouter();

  // State
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalBrands, setTotalBrands] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const loadBrands = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getAllBrands({
        page: currentPage,
        limit: 50,
        search: searchTerm || undefined,
        isActive: statusFilter !== "all" ? statusFilter === "active" : undefined,
        sortBy,
        sortOrder,
      });

      if (result.success && result.data?.brands) {
        setBrands(result.data.brands);
        setTotalBrands(result.data.pagination?.total || result.data.brands.length);
        setTotalPages(result.data.pagination?.pages || Math.ceil(result.data.brands.length / 50));
      } else {
        toast.error(result.error || "Failed to load brands");
        setBrands([]);
      }
    } catch (error: any) {
      console.error("Failed to load brands:", error);
      toast.error(error?.message || "Failed to load brands");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  const handleDelete = async (brandId: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;

    try {
      const result = await deleteBrand(brandId);

      if (result.success) {
        toast.success(result.message || "Brand deleted successfully");
        loadBrands();
      } else {
        toast.error(result.error || "Failed to delete brand");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete brand");
    }
  };

  const handleEdit = (brandId: string) => {
    router.push(`/products/brands/edit/${brandId}`);
  };

  const handleAddNew = () => {
    router.push("/products/brands/add");
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  if (!user) return null;

  return (
    <div
      className={`min-h-screen pb-20 ${
        isDarkMode ? "bg-gray-950 text-gray-100" : "bg-slate-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <BrandListHeader isDarkMode={isDarkMode} onAddNew={handleAddNew} />

      {/* Main Content */}
      <div className="py-6">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          {/* Stats */}
          <BrandStats
            totalBrands={totalBrands}
            activeBrands={brands.filter((b) => b.isActive).length}
            inactiveBrands={brands.filter((b) => !b.isActive).length}
            isDarkMode={isDarkMode}
          />

          {/* Filters */}
          <BrandFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
            onSortChange={handleSort}
            isDarkMode={isDarkMode}
          />

          {/* Table */}
          {loading ? (
            <BrandListSkeleton isDarkMode={isDarkMode} />
          ) : (
            <BrandTable
              brands={brands}
              currentPage={currentPage}
              totalPages={totalPages}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSort={handleSort}
              onPageChange={setCurrentPage}
              isDarkMode={isDarkMode}
            />
          )}
        </div>
      </div>
    </div>
  );
}
