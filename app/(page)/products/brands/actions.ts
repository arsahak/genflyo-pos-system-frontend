"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface Brand {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface BrandsResponse {
  brands: Brand[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

interface ApiError {
  message: string;
  error?: string;
}

/**
 * Get authorization token from cookies
 */
async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
}

/**
 * Fetch all brands with optional filters
 */
export async function getBrands(params?: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<{ success: boolean; data?: BrandsResponse; error?: string }> {
  try {
    const token = await getAuthToken();

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.isActive !== undefined)
      queryParams.append("isActive", params.isActive.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const url = `${API_URL}/brands${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      return {
        success: false,
        error: errorData.message || "Failed to fetch brands",
      };
    }

    const data: BrandsResponse = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching brands:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch brands",
    };
  }
}

/**
 * Get a single brand by ID
 */
export async function getBrandById(
  id: string
): Promise<{ success: boolean; data?: Brand; error?: string }> {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_URL}/brands/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      return {
        success: false,
        error: errorData.message || "Failed to fetch brand",
      };
    }

    const data: Brand = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching brand:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch brand",
    };
  }
}

/**
 * Create a new brand
 */
export async function createBrand(formData: {
  name: string;
  description?: string;
  isActive?: boolean;
}): Promise<{ success: boolean; data?: Brand; error?: string }> {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_URL}/brands`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      return {
        success: false,
        error: errorData.message || "Failed to create brand",
      };
    }

    const data = await response.json();
    return { success: true, data: data.brand };
  } catch (error) {
    console.error("Error creating brand:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create brand",
    };
  }
}

/**
 * Update an existing brand
 */
export async function updateBrand(
  id: string,
  formData: {
    name?: string;
    description?: string;
    isActive?: boolean;
  }
): Promise<{ success: boolean; data?: Brand; error?: string }> {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_URL}/brands/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      return {
        success: false,
        error: errorData.message || "Failed to update brand",
      };
    }

    const data = await response.json();
    return { success: true, data: data.brand };
  } catch (error) {
    console.error("Error updating brand:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update brand",
    };
  }
}

/**
 * Delete a brand (soft delete)
 */
export async function deleteBrand(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_URL}/brands/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      return {
        success: false,
        error: errorData.message || "Failed to delete brand",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting brand:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete brand",
    };
  }
}

/**
 * Get brand statistics
 */
export async function getBrandStats(): Promise<{
  success: boolean;
  data?: { total: number; active: number; inactive: number };
  error?: string;
}> {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_URL}/brands/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      return {
        success: false,
        error: errorData.message || "Failed to fetch brand statistics",
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching brand stats:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch brand statistics",
    };
  }
}

/**
 * Initialize default Bangladeshi pharmaceutical brands
 */
export async function initializeDefaultBrands(): Promise<{
  success: boolean;
  data?: Brand[];
  error?: string;
}> {
  const DEFAULT_BRANDS = [
    "Square Pharmaceuticals",
    "Beximco Pharmaceuticals",
    "Incepta Pharmaceuticals",
    "Renata Limited",
    "ACI Limited",
    "Eskayef Pharmaceuticals",
    "Opsonin Pharma",
    "Healthcare Pharmaceuticals",
    "Aristopharma",
    "Drug International",
    "Popular Pharmaceuticals",
    "Orion Pharma",
    "General Pharmaceuticals",
    "Acme Laboratories",
    "Radiant Pharmaceuticals",
    "IBN SINA Pharmaceutical",
    "Novo Pharma",
    "BSRM Pharmaceuticals",
    "Edruc Limited",
    "Sanofi Bangladesh",
  ];

  try {
    const createdBrands: Brand[] = [];

    for (const brandName of DEFAULT_BRANDS) {
      const result = await createBrand({
        name: brandName,
        description: "Leading pharmaceutical company",
        isActive: true,
      });

      if (result.success && result.data) {
        createdBrands.push(result.data);
      } else {
        console.error(`Failed to create brand: ${brandName}`, result.error);
      }
    }

    return {
      success: true,
      data: createdBrands,
    };
  } catch (error) {
    console.error("Error initializing default brands:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to initialize default brands",
    };
  }
}
