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
 * GET /api/categories - Get all categories with pagination and search
 */
export async function getAllCategories(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  try {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);

    const url = `${API_URL}/api/categories${queryParams.toString() ? `?${queryParams}` : ""}`;
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch categories" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get all categories error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * GET /api/categories/tree - Get categories in hierarchical tree structure
 */
export async function getCategoryTree() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/categories/tree`, { headers });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch category tree" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get category tree error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * GET /api/categories/:id - Get category by ID
 */
export async function getCategoryById(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/categories/${id}`, { headers });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Category not found" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get category by ID error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * GET /api/categories/:id/products - Get all products in a category
 */
export async function getCategoryProducts(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/categories/${id}/products`, { headers });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch category products" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get category products error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * POST /api/categories - Create a new category
 */
export async function createCategory(formData: FormData) {
  try {
    const session = await auth();
    const headers = {
      Authorization: `Bearer ${session?.accessToken}`,
    };

    const response = await fetch(`${API_URL}/api/categories`, {
      method: "POST",
      headers,
      body: formData, // FormData for image upload
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to create category" };
    }

    const data = await response.json();
    return { success: true, data, message: "Category created successfully" };
  } catch (error) {
    console.error("Create category error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * PUT /api/categories/:id - Update category
 */
export async function updateCategory(id: string, formData: FormData) {
  try {
    const session = await auth();
    const headers = {
      Authorization: `Bearer ${session?.accessToken}`,
    };

    const response = await fetch(`${API_URL}/api/categories/${id}`, {
      method: "PUT",
      headers,
      body: formData, // FormData for image upload
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to update category" };
    }

    const data = await response.json();
    return { success: true, data, message: "Category updated successfully" };
  } catch (error) {
    console.error("Update category error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * DELETE /api/categories/:id - Soft delete category
 */
export async function deleteCategory(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/categories/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to delete category" };
    }

    const data = await response.json();
    return { success: true, data, message: "Category deleted successfully" };
  } catch (error) {
    console.error("Delete category error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
