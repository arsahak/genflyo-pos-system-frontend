"use client";

import api from "@/lib/api";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  MdArrowBack,
  MdCategory,
  MdDelete,
  MdEdit,
  MdInventory,
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
  };
  level: number;
  order: number;
  isFeatured: boolean;
  productCount?: number;
  subCategories?: Array<{
    _id: string;
    name: string;
    slug: string;
    productCount?: number;
    image?: {
      url: string;
      thumbUrl: string;
    };
  }>;
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
}

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
  mainImage?: {
    url: string;
    thumbUrl: string;
  };
  category: string;
}

export default function CategoryDetailPage() {
  const { user } = useStore();
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
    loadCategory();
    loadProducts();
  }, [user, categoryId]);

  const loadCategory = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/categories/${categoryId}`);
      setCategory(response.data);
    } catch (error: unknown) {
      console.error("Failed to load category:", error);
      toast.error("Failed to load category details");
      router.push("/products/categories");
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await api.get(`/categories/${categoryId}/products`);
      setProducts(response.data.products || []);
    } catch (error: unknown) {
      console.error("Failed to load products:", error);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !category ||
      !confirm(`Are you sure you want to delete "${category.name}" category?`)
    )
      return;

    try {
      await api.delete(`/categories/${categoryId}`);
      toast.success("Category deleted successfully");
      router.push("/products/categories");
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to delete category";
      toast.error(errorMessage);
    }
  };

  const canEditCategories =
    user?.role === "super_admin" || user?.permissions?.canEditProducts;
  const canDeleteCategories =
    user?.role === "super_admin" || user?.permissions?.canDeleteProducts;

  if (!user) return null;

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="ml-4 text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Category Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The category you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/products/categories"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Categories
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
            onClick={() => router.push("/products/categories")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MdArrowBack size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {category.name}
            </h1>
            <p className="text-gray-500 mt-1">Category Details</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {canEditCategories && (
            <Link
              href={`/products/categories/${categoryId}/edit`}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <MdEdit size={20} />
              Edit Category
            </Link>
          )}
          {canDeleteCategories && (
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

      {/* Category Overview Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-start gap-6">
          {/* Category Image - Smaller Size */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg overflow-hidden">
              {category.image?.url ? (
                <img
                  src={category.image.url}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <MdCategory className="text-indigo-300 text-5xl" />
                </div>
              )}
            </div>
          </div>

          {/* Category Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="text-gray-600 mb-3">{category.description}</p>
                )}
                {category.parentCategory && (
                  <div className="mb-2">
                    <span className="text-sm text-gray-600">Parent: </span>
                    <Link
                      href={`/products/categories/${category.parentCategory._id}`}
                      className="text-sm text-indigo-600 hover:underline font-medium"
                    >
                      {category.parentCategory.name}
                    </Link>
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Slug:</span> {category.slug}
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-col gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full text-center">
                  Active
                </span>
                {category.isFeatured && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full text-center">
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Statistics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <p className="text-xs text-blue-700 uppercase font-semibold mb-1">
                  Products
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {category.productCount || 0}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                <p className="text-xs text-purple-700 uppercase font-semibold mb-1">
                  Sub-categories
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {category.subCategories?.length || 0}
                </p>
              </div>
              {category.createdBy && (
                <>
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
                    <p className="text-xs text-indigo-700 uppercase font-semibold mb-1">
                      Created By
                    </p>
                    <p className="text-sm font-medium text-indigo-900 truncate">
                      {category.createdBy.name}
                    </p>
                    <p className="text-xs text-indigo-600">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {category.updatedBy && (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg">
                      <p className="text-xs text-gray-700 uppercase font-semibold mb-1">
                        Updated By
                      </p>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {category.updatedBy.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(category.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-categories Section */}
      {category.subCategories && category.subCategories.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Sub-categories ({category.subCategories.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {category.subCategories.map((sub) => (
              <Link
                key={sub._id}
                href={`/products/categories/${sub._id}`}
                className="border-2 border-gray-200 rounded-lg p-3 hover:border-indigo-500 hover:shadow-md transition-all text-center group"
              >
                <div className="relative w-20 h-20 mx-auto bg-gray-100 rounded-lg mb-2 overflow-hidden">
                  {sub.image?.thumbUrl ? (
                    <img
                      src={sub.image.thumbUrl}
                      alt={sub.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MdCategory className="text-gray-400 text-3xl" />
                    </div>
                  )}
                  {/* Product Count Badge */}
                  {sub.productCount !== undefined && (
                    <div className="absolute top-1 right-1 bg-indigo-600 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                      {sub.productCount}
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-gray-900 text-sm truncate mb-1">
                  {sub.name}
                </h3>
                {/* Product Count Text */}
                {sub.productCount !== undefined && (
                  <p className="text-xs text-gray-500">
                    {sub.productCount}{" "}
                    {sub.productCount === 1 ? "product" : "products"}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products in this category */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MdInventory size={24} className="text-indigo-600" />
          Products ({category.productCount || 0})
        </h2>

        {productsLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <MdInventory className="mx-auto text-gray-400 text-5xl mb-2" />
            <p className="text-gray-600">No products in this category yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product._id}`}
                className="border border-gray-200 rounded-lg p-4 hover:border-indigo-500 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {product.mainImage?.url ? (
                      <img
                        src={product.mainImage.url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MdInventory className="text-gray-400 text-2xl" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-indigo-600">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
                  <span className="text-gray-600">Stock:</span>
                  <span className="font-medium text-gray-900">
                    {product.stock} {product.unit}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
