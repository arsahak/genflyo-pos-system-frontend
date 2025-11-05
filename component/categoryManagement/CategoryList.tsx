"use client";

import api from "@/lib/api";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { IoMdSearch } from "react-icons/io";
import {
  MdAdd,
  MdCategory,
  MdDelete,
  MdEdit,
  MdInventory,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    url: string;
    thumbUrl: string;
  };
  parentCategory?: {
    _id: string;
    name: string;
    slug: string;
  };
  level: number;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
  productCount?: number;
  createdBy?: {
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

export default function CategoryList() {
  const { user } = useStore();
  const router = useRouter();

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
    user?.role === "super_admin" || user?.permissions?.canAddProducts;
  const canEditCategories =
    user?.role === "super_admin" || user?.permissions?.canEditProducts;
  const canDeleteCategories =
    user?.role === "super_admin" || user?.permissions?.canDeleteProducts;

  if (!user) return null;

  // Component to render a single category row
  const CategoryRow = ({
    category,
    isSubcategory = false,
  }: {
    category: Category;
    isSubcategory?: boolean;
  }) => (
    <div
      className={`group hover:bg-indigo-50 transition-colors border-b border-gray-200 ${
        isSubcategory ? "bg-gray-50" : "bg-white"
      }`}
    >
      <div className="flex items-center px-6 py-4 gap-4">
        {/* Category Image */}
        <div
          className={`flex-shrink-0 ${
            isSubcategory ? "w-12 h-12 ml-8" : "w-16 h-16"
          } rounded-lg overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100`}
        >
          {category.image?.url ? (
            <img
              src={category.image.url}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MdCategory
                className={`text-indigo-400 ${
                  isSubcategory ? "text-2xl" : "text-3xl"
                }`}
              />
            </div>
          )}
        </div>

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link href={`/products/categories/${category._id}`}>
              <h3
                className={`${
                  isSubcategory ? "text-base" : "text-lg font-semibold"
                } text-gray-900 hover:text-indigo-600 transition-colors`}
              >
                {isSubcategory && (
                  <span className="text-indigo-400 mr-2">└─</span>
                )}
                {category.name}
              </h3>
            </Link>

            {/* Badges */}
            {category.isFeatured && (
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                Featured
              </span>
            )}
            {hierarchyMap[category._id] &&
              hierarchyMap[category._id].length > 0 && (
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                  {hierarchyMap[category._id].length} Sub
                </span>
              )}
          </div>

          {category.description && (
            <p className="text-sm text-gray-600 line-clamp-1">
              {category.description}
            </p>
          )}
        </div>

        {/* Product Count */}
        <div className="flex-shrink-0 text-center px-4">
          <div className="flex items-center gap-1 text-gray-700">
            <MdInventory size={18} className="text-indigo-600" />
            <span className="font-semibold">{category.productCount || 0}</span>
          </div>
          <p className="text-xs text-gray-500">Products</p>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <Link
            href={`/products/categories/${category._id}`}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            View
          </Link>

          {canEditCategories && (
            <Link
              href={`/products/categories/${category._id}/edit`}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Edit"
            >
              <MdEdit size={20} />
            </Link>
          )}

          {canDeleteCategories && (
            <button
              onClick={() => handleDelete(category._id, category.name)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <MdDelete size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">Manage product categories</p>
        </div>
        {canAddCategories && (
          <Link
            href="/products/categories/add-new-category"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <MdAdd size={20} />
            <span>Add New Category</span>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white">
          <p className="text-sm opacity-90">Total Categories</p>
          <p className="text-3xl font-bold mt-1">{pagination.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg text-white">
          <p className="text-sm opacity-90">Parent Categories</p>
          <p className="text-3xl font-bold mt-1">{rootCategories.length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg text-white">
          <p className="text-sm opacity-90">Sub-categories</p>
          <p className="text-3xl font-bold mt-1">
            {categories.length - rootCategories.length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-lg text-white">
          <p className="text-sm opacity-90">Current View</p>
          <p className="text-3xl font-bold mt-1">{categories.length}</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="relative">
          <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search categories by name or description..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        {searchTerm && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Active filter:</span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full flex items-center gap-1">
              Search: {searchTerm}
              <button
                onClick={() => handleSearch("")}
                className="ml-1 hover:text-indigo-900"
              >
                ×
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <MdCategory className="mx-auto text-gray-400 text-6xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? "Try adjusting your search"
                : "Get started by creating your first category"}
            </p>
            {canAddCategories && (
              <Link
                href="/products/categories/add-new-category"
                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
              >
                Add New Category
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Hierarchical Categories List */}
            <div className="overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-100 border-b-2 border-gray-300 px-6 py-3">
                <div className="flex items-center gap-4">
                  <div className="w-16"></div>
                  <div className="flex-1 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Category Name
                  </div>
                  <div className="w-24 text-center text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Products
                  </div>
                  <div className="w-48 text-center text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Actions
                  </div>
                </div>
              </div>

              {/* Categories List */}
              {rootCategories.length === 0 && categories.length > 0
                ? // If all categories are subcategories (edge case)
                  categories.map((category) => (
                    <CategoryRow
                      key={category._id}
                      category={category}
                      isSubcategory={true}
                    />
                  ))
                : // Show hierarchical display
                  rootCategories.map((rootCategory, index) => (
                    <div key={rootCategory._id}>
                      {/* Parent Category */}
                      <CategoryRow category={rootCategory} />

                      {/* Subcategories */}
                      {hierarchyMap[rootCategory._id] &&
                        hierarchyMap[rootCategory._id].length > 0 &&
                        hierarchyMap[rootCategory._id].map((subCategory) => (
                          <CategoryRow
                            key={subCategory._id}
                            category={subCategory}
                            isSubcategory={true}
                          />
                        ))}

                      {/* Separator between parent category groups */}
                      {index < rootCategories.length - 1 && (
                        <div className="h-2 bg-gray-200"></div>
                      )}
                    </div>
                  ))}
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
                  categories
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
    </div>
  );
}
