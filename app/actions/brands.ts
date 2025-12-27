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
 * GET /api/brands/stats - Get brand statistics
 */
export async function getBrandStats() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/brands/stats`, { headers });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch brand stats" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get brand stats error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * GET /api/brands - Get all brands with pagination, search, and filters
 */
export async function getAllBrands(params?: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: string;
}) {
  try {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const url = `${API_URL}/api/brands${queryParams.toString() ? `?${queryParams}` : ""}`;
    const response = await fetch(url, { headers, cache: "no-store" });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch brands" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get all brands error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * GET /api/brands/:id - Get brand by ID
 */
export async function getBrandById(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/brands/${id}`, { headers });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Brand not found" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get brand by ID error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * POST /api/brands - Create a new brand
 */
export async function createBrand(formData: FormData) {
  try {
    const headers = await getAuthHeaders();
    const brandData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      isActive: formData.get("isActive") === "true",
    };

    const response = await fetch(`${API_URL}/api/brands`, {
      method: "POST",
      headers,
      body: JSON.stringify(brandData),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to create brand" };
    }

    const data = await response.json();
    return { success: true, data, message: "Brand created successfully" };
  } catch (error) {
    console.error("Create brand error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * PUT /api/brands/:id - Update brand
 */
export async function updateBrand(id: string, formData: FormData) {
  try {
    const headers = await getAuthHeaders();
    const brandData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      isActive: formData.get("isActive") === "true",
    };

    const response = await fetch(`${API_URL}/api/brands/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(brandData),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to update brand" };
    }

    const data = await response.json();
    return { success: true, data, message: "Brand updated successfully" };
  } catch (error) {
    console.error("Update brand error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * DELETE /api/brands/:id - Delete brand
 */
export async function deleteBrand(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/brands/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to delete brand" };
    }

    const data = await response.json();
    return { success: true, data, message: "Brand deleted successfully" };
  } catch (error) {
    console.error("Delete brand error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
