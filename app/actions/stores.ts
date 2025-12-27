"use server";

import { auth } from "@/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Standard response type
type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

// Helper function to get auth headers
async function getAuthHeaders() {
  const session = await auth();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.accessToken}`,
  };
}

// Helper function to build query string
function buildQueryString(params: Record<string, string | number | undefined>): string {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) queryParams.append(key, value.toString());
  });
  return queryParams.toString() ? `?${queryParams}` : "";
}

// Helper function to handle fetch errors
async function handleFetchResponse<T>(response: Response, errorMessage: string): Promise<ActionResponse<T>> {
  if (!response.ok) {
    try {
      const error = await response.json();
      return { success: false, error: error.message || errorMessage };
    } catch {
      return { success: false, error: `${errorMessage} (Status: ${response.status})` };
    }
  }

  try {
    const data = await response.json();
    return { success: true, data };
  } catch {
    return { success: false, error: "Failed to parse response data" };
  }
}

/**
 * GET /api/stores - Get all active stores
 * @param params - Optional filters including pagination and search
 */
export async function getAllStores(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ActionResponse> {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return { success: false, error: "Authentication required. Please log in again." };
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    };

    const queryString = buildQueryString({
      page: params?.page,
      limit: params?.limit,
      search: params?.search,
    });

    const url = `${API_URL}/api/stores${queryString}`;
    console.log("Fetching stores from:", url);

    const response = await fetch(url, { headers, cache: "no-store" });

    console.log("Get stores response status:", response.status);

    if (!response.ok) {
      try {
        const error = await response.json();
        console.error("Get stores error response:", error);
        return { success: false, error: error.message || "Failed to fetch stores" };
      } catch {
        return { success: false, error: `Failed to fetch stores (Status: ${response.status})` };
      }
    }

    // Backend returns stores array directly
    const stores = await response.json();
    console.log("Stores fetched successfully:", stores.length || 0, "stores");
    return { success: true, data: { stores } };
  } catch (error) {
    console.error("Get all stores error:", error);
    return { success: false, error: "An unexpected error occurred while fetching stores" };
  }
}

/**
 * GET /api/stores/:id - Get store by ID
 * @param id - Store ID
 */
export async function getStoreById(id: string): Promise<ActionResponse> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/stores/${id}`, {
      headers,
      cache: "no-store"
    });

    return handleFetchResponse(response, "Store not found");
  } catch (error) {
    console.error("Get store by ID error:", error);
    return { success: false, error: "An unexpected error occurred while fetching store" };
  }
}

/**
 * POST /api/stores - Create new store
 * @param formData - FormData containing store details
 */
export async function createStore(formData: FormData): Promise<ActionResponse> {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return { success: false, error: "Authentication required. Please log in again." };
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    };

    const storeData = {
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      manager: formData.get("manager") as string,
      isActive: formData.get("isActive") === "true",
    };

    console.log("Creating store with API URL:", `${API_URL}/api/stores`);

    const response = await fetch(`${API_URL}/api/stores`, {
      method: "POST",
      headers,
      body: JSON.stringify(storeData),
    });

    console.log("Create store response status:", response.status);

    if (!response.ok) {
      try {
        const error = await response.json();
        console.error("Create store error response:", error);
        return { success: false, error: error.message || "Failed to create store" };
      } catch {
        return { success: false, error: `Failed to create store (Status: ${response.status})` };
      }
    }

    const data = await response.json();
    console.log("Store created successfully:", data);
    return {
      success: true,
      data,
      message: "Store created successfully"
    };
  } catch (error) {
    console.error("Create store error:", error);
    return { success: false, error: "An unexpected error occurred while creating store" };
  }
}

/**
 * PUT /api/stores/:id - Update store
 * @param id - Store ID
 * @param formData - FormData containing store details
 */
export async function updateStore(id: string, formData: FormData): Promise<ActionResponse> {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return { success: false, error: "Authentication required. Please log in again." };
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    };

    const storeData = {
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      manager: formData.get("manager") as string,
      isActive: formData.get("isActive") === "true",
    };

    console.log("Updating store with ID:", id);

    const response = await fetch(`${API_URL}/api/stores/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(storeData),
    });

    console.log("Update store response status:", response.status);

    if (!response.ok) {
      try {
        const error = await response.json();
        console.error("Update store error response:", error);
        return { success: false, error: error.message || "Failed to update store" };
      } catch {
        return { success: false, error: `Failed to update store (Status: ${response.status})` };
      }
    }

    const data = await response.json();
    console.log("Store updated successfully:", data);
    return {
      success: true,
      data,
      message: "Store updated successfully"
    };
  } catch (error) {
    console.error("Update store error:", error);
    return { success: false, error: "An unexpected error occurred while updating store" };
  }
}

/**
 * DELETE /api/stores/:id - Soft delete store
 * @param id - Store ID
 */
export async function deleteStore(id: string): Promise<ActionResponse> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/stores/${id}`, {
      method: "DELETE",
      headers,
    });

    return handleFetchResponse(response, "Failed to delete store");
  } catch (error) {
    console.error("Delete store error:", error);
    return { success: false, error: "An unexpected error occurred while deleting store" };
  }
}
