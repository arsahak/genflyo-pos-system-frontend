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
 * GET /api/inventory/stats/summary - Get inventory statistics
 */
export async function getInventoryStats(storeId?: string) {
  try {
    const headers = await getAuthHeaders();
    const url = storeId
      ? `${API_URL}/api/inventory/stats/summary?storeId=${storeId}`
      : `${API_URL}/api/inventory/stats/summary`;
    const response = await fetch(url, { headers, cache: "no-store" });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch inventory stats" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get inventory stats error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * GET /api/inventory/alerts/low-stock - Get low stock items
 */
export async function getLowStockItems(storeId?: string) {
  try {
    const headers = await getAuthHeaders();
    const url = storeId
      ? `${API_URL}/api/inventory/alerts/low-stock?storeId=${storeId}`
      : `${API_URL}/api/inventory/alerts/low-stock`;
    const response = await fetch(url, { headers, cache: "no-store" });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch low stock items" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get low stock items error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * GET /api/inventory - Get all inventory
 */
export async function getAllInventory(params?: {
  page?: number;
  limit?: number;
  search?: string;
  storeId?: string;
  lowStock?: boolean;
}) {
  try {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.storeId) queryParams.append("storeId", params.storeId);
    if (params?.lowStock) queryParams.append("lowStock", "true");

    const url = `${API_URL}/api/inventory${queryParams.toString() ? `?${queryParams}` : ""}`;
    const response = await fetch(url, { headers, cache: "no-store" });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch inventory" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get all inventory error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * GET /api/inventory/:storeId - Get inventory by store
 */
export async function getInventoryByStore(storeId: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/inventory/${storeId}`, { headers });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch store inventory" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get inventory by store error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * POST /api/inventory/adjust - Adjust inventory
 * Backend expects: productId, storeId, adjustment (positive/negative number), reason, location, minStock, maxStock
 */
export async function adjustInventory(formData: FormData) {
  try {
    const headers = await getAuthHeaders();

    // Parse adjustment as a number (can be positive or negative)
    const adjustment = parseInt(formData.get("adjustment") as string);
    const minStock = formData.get("minStock") ? parseInt(formData.get("minStock") as string) : undefined;
    const maxStock = formData.get("maxStock") ? parseInt(formData.get("maxStock") as string) : undefined;

    const adjustmentData = {
      productId: formData.get("productId") as string,
      storeId: formData.get("storeId") as string,
      adjustment: adjustment,
      reason: formData.get("reason") as string || "Stock adjustment",
      location: formData.get("location") as string || undefined,
      minStock: minStock,
      maxStock: maxStock,
    };

    console.log("Adjusting inventory - Data:", adjustmentData);

    const response = await fetch(`${API_URL}/api/inventory/adjust`, {
      method: "POST",
      headers,
      body: JSON.stringify(adjustmentData),
    });

    console.log("Adjust inventory response status:", response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error("Adjust inventory error response:", error);
      return { success: false, error: error.message || "Failed to adjust inventory" };
    }

    const data = await response.json();
    console.log("Inventory adjusted successfully - Response:", data);
    return { success: true, data, message: data.message || "Inventory adjusted successfully" };
  } catch (error) {
    console.error("Adjust inventory error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * POST /api/inventory/adjust/batch - Batch adjust inventory
 */
export async function batchAdjustInventory(formData: FormData) {
  try {
    const headers = await getAuthHeaders();
    const adjustments = JSON.parse(formData.get("adjustments") as string);

    const response = await fetch(`${API_URL}/api/inventory/adjust/batch`, {
      method: "POST",
      headers,
      body: JSON.stringify({ adjustments }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to batch adjust inventory" };
    }

    const data = await response.json();
    return { success: true, data, message: "Inventory batch adjusted successfully" };
  } catch (error) {
    console.error("Batch adjust inventory error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * POST /api/inventory/transfer - Transfer inventory between stores
 */
export async function transferInventory(formData: FormData) {
  try {
    const headers = await getAuthHeaders();
    const transferData = {
      productId: formData.get("productId") as string,
      fromStoreId: formData.get("fromStoreId") as string,
      toStoreId: formData.get("toStoreId") as string,
      quantity: parseInt(formData.get("quantity") as string),
      notes: formData.get("notes") as string,
    };

    const response = await fetch(`${API_URL}/api/inventory/transfer`, {
      method: "POST",
      headers,
      body: JSON.stringify(transferData),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to transfer inventory" };
    }

    const data = await response.json();
    return { success: true, data, message: "Inventory transferred successfully" };
  } catch (error) {
    console.error("Transfer inventory error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * PUT /api/inventory/:id - Update inventory
 */
export async function updateInventory(id: string, formData: FormData) {
  try {
    const headers = await getAuthHeaders();
    const inventoryData = {
      quantity: parseInt(formData.get("quantity") as string),
      minStockLevel: parseInt(formData.get("minStockLevel") as string),
      maxStockLevel: parseInt(formData.get("maxStockLevel") as string),
    };

    const response = await fetch(`${API_URL}/api/inventory/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(inventoryData),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to update inventory" };
    }

    const data = await response.json();
    return { success: true, data, message: "Inventory updated successfully" };
  } catch (error) {
    console.error("Update inventory error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * DELETE /api/inventory/:id - Delete inventory entry
 */
export async function deleteInventory(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/inventory/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to delete inventory" };
    }

    const data = await response.json();
    return { success: true, data, message: "Inventory deleted successfully" };
  } catch (error) {
    console.error("Delete inventory error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
