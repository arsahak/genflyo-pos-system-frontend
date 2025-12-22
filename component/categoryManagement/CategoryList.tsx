"use client";

import api from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";
import { useSidebar } from "@/lib/SidebarContext";
import { useStore } from "@/lib/store";
import { getTranslation } from "@/lib/translations";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CategoryFilters } from "./components/CategoryFilters";
import { CategoryListHeader } from "./components/CategoryListHeader";
import { CategoryListSkeleton } from "./components/CategoryListSkeleton";
import { CategoryStats } from "./components/CategoryStats";
import { CategoryTable } from "./components/CategoryTable";
import { Category, Pagination } from "./types";

export default function CategoryList() {
  const { user } = useStore();
  const router = useRouter();
  const { isDarkMode } = useSidebar();
  const { language } = useLanguage();

  const t = (key: string) => getTranslation(key, language);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
    hasMore: false,
  });

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "100", // Increased to load more for hierarchical display
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await api.get(`/categories?${params.toString()}`);

      if (response.data.categories) {
        setCategories(response.data.categories);
        setPagination(response.data.pagination);
      } else {
        setCategories(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error: unknown) {
      console.error("Failed to load categories:", error);
      toast.error("Failed to load categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
    loadCategories();
  }, [user, router, currentPage, searchTerm, loadCategories]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}" category?`))
      return;

    try {
      await api.delete(`/categories/${categoryId}`);
      toast.success("Category deleted successfully");
      loadCategories();
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to delete category";
      toast.error(errorMessage);
    }
  };

  // Organize categories hierarchically with useMemo to prevent hydration issues
  const { rootCategories, hierarchyMap } = useMemo(() => {
    const rootCategories = categories.filter(
      (cat) => !cat.parentCategory || cat.parentCategory._id === ""
    );
    const childCategories = categories.filter(
      (cat) => cat.parentCategory && cat.parentCategory._id !== ""
    );

    // Create a map of parent categories with their children
    const hierarchyMap: { [key: string]: Category[] } = {};

    childCategories.forEach((child) => {
      const parentId = child.parentCategory?._id || "";
      if (!hierarchyMap[parentId]) {
        hierarchyMap[parentId] = [];
      }
      hierarchyMap[parentId].push(child);
    });

    return { rootCategories, hierarchyMap };
  }, [categories]);

  const canAddCategories =
    user?.role === "super_admin" || user?.permissions?.canAddProducts || false;
  const canEditCategories =
    user?.role === "super_admin" || user?.permissions?.canEditProducts || false;
  const canDeleteCategories =
    user?.role === "super_admin" || user?.permissions?.canDeleteProducts || false;

  if (!user) return null;

  if (loading) {
    return (
      <div
        className={`min-h-screen p-6 transition-colors duration-300 font-sans ${
          isDarkMode ? "bg-gray-950" : "bg-slate-50"
        }`}
      >
        <div className="max-w-[1920px] mx-auto">
          <CategoryListSkeleton isDarkMode={isDarkMode} />
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
        <CategoryListHeader 
          isDarkMode={isDarkMode}
          canAddCategories={canAddCategories} 
        />

        <CategoryStats
          isDarkMode={isDarkMode}
          totalCategories={pagination.total}
          rootCategoriesCount={rootCategories.length}
          subCategoriesCount={categories.length - rootCategories.length}
          currentViewCount={categories.length}
        />

        <CategoryFilters
          isDarkMode={isDarkMode}
          searchTerm={searchTerm}
          handleSearch={handleSearch}
        />

        <CategoryTable
          isDarkMode={isDarkMode}
          loading={loading}
          categories={categories}
          rootCategories={rootCategories}
          hierarchyMap={hierarchyMap}
          pagination={pagination}
          handlePageChange={handlePageChange}
          canEditCategories={canEditCategories}
          canDeleteCategories={canDeleteCategories}
          handleDelete={handleDelete}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
}
