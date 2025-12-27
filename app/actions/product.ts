"use server";

import { auth } from "@/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper function to get auth headers
async function getAuthHeaders() {
  const session = await auth();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.accessToken}`,
  };
}

/**
 * GET /api/products - Get all products with pagination, search, and filters
 */
export async function getAllProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  status?: string;
  lowStock?: boolean;
  inStock?: boolean;
}) {
  try {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.category) queryParams.append("category", params.category);
    if (params?.brand) queryParams.append("brand", params.brand);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.lowStock !== undefined) queryParams.append("lowStock", params.lowStock.toString());
    if (params?.inStock !== undefined) queryParams.append("inStock", params.inStock.toString());

    const url = `${API_URL}/api/products${queryParams.toString() ? `?${queryParams}` : ""}`;
    const response = await fetch(url, { headers, cache: "no-store" });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch products" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get all products error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * GET /api/products/alerts/expiring - Get products expiring soon
 */
export async function getExpiringProducts() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/products/alerts/expiring`, { headers });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch expiring products" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get expiring products error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * GET /api/products/alerts/low-stock - Get products with low stock
 */
export async function getLowStockProducts() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/products/alerts/low-stock`, { headers });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch low stock products" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get low stock products error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * GET /api/products/meta/categories - Get all unique categories
 */
export async function getProductCategories() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/products/meta/categories`, { headers });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch categories" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get product categories error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * GET /api/products/meta/brands - Get all unique brands
 */
export async function getProductBrands() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/products/meta/brands`, { headers });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch brands" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get product brands error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * GET /api/products/:id - Get product by ID
 */
export async function getProductById(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/products/${id}`, { headers });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Product not found" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get product by ID error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * POST /api/products - Create a new product
 */
export async function createProduct(formData: FormData) {
  try {
    const session = await auth();
    const headers = {
      Authorization: `Bearer ${session?.accessToken}`,
    };

    const response = await fetch(`${API_URL}/api/products`, {
      method: "POST",
      headers,
      body: formData, // FormData for image uploads
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to create product" };
    }

    const data = await response.json();
    return { success: true, data, message: "Product created successfully" };
  } catch (error) {
    console.error("Create product error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * PUT /api/products/:id - Update product
 */
export async function updateProduct(id: string, formData: FormData) {
  try {
    const session = await auth();
    const headers = {
      Authorization: `Bearer ${session?.accessToken}`,
    };

    const response = await fetch(`${API_URL}/api/products/${id}`, {
      method: "PUT",
      headers,
      body: formData, // FormData for image uploads
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to update product" };
    }

    const data = await response.json();
    return { success: true, data, message: "Product updated successfully" };
  } catch (error) {
    console.error("Update product error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * DELETE /api/products/:id - Delete product (soft delete)
 */
export async function deleteProduct(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/products/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to delete product" };
    }

    const data = await response.json();
    return { success: true, data, message: "Product deleted successfully" };
  } catch (error) {
    console.error("Delete product error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * POST /api/products/bulk-import - Bulk import products
 */
export async function bulkImportProducts(formData: FormData) {
  try {
    const headers = await getAuthHeaders();
    const productsData = formData.get("products");

    const response = await fetch(`${API_URL}/api/products/bulk-import`, {
      method: "POST",
      headers,
      body: JSON.stringify({ products: productsData ? JSON.parse(productsData as string) : [] }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to import products" };
    }

    const data = await response.json();
    return { success: true, data, message: "Products imported successfully" };
  } catch (error) {
    console.error("Bulk import products error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
