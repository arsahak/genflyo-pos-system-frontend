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
 * GET /api/sales/stats/summary - Get sales statistics
 */
export async function getSalesStats(params?: {
  startDate?: string;
  endDate?: string;
  storeId?: string;
}) {
  try {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.storeId) queryParams.append("storeId", params.storeId);

    const url = `${API_URL}/api/sales/stats/summary${queryParams.toString() ? `?${queryParams}` : ""}`;
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch sales stats" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get sales stats error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * GET /api/sales - Get all sales
 */
export async function getAllSales(params?: {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  storeId?: string;
}) {
  try {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.storeId) queryParams.append("storeId", params.storeId);

    const url = `${API_URL}/api/sales${queryParams.toString() ? `?${queryParams}` : ""}`;
    const response = await fetch(url, { headers, cache: "no-store" });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch sales" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get all sales error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * GET /api/sales/:id - Get sale by ID
 */
export async function getSaleById(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/sales/${id}`, { headers });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Sale not found" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get sale by ID error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * POST /api/sales - Create sale
 */
export async function createSale(formData: FormData) {
  try {
    const headers = await getAuthHeaders();
    const saleData = JSON.parse(formData.get("saleData") as string);

    console.log("Creating sale - URL:", `${API_URL}/api/sales`);
    console.log("Creating sale - Data:", saleData);
    console.log("Creating sale - Headers:", headers);

    const response = await fetch(`${API_URL}/api/sales`, {
      method: "POST",
      headers,
      body: JSON.stringify(saleData),
    });

    console.log("Sale response status:", response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error("Sale creation error response:", error);
      return { success: false, error: error.message || "Failed to create sale" };
    }

    const data = await response.json();
    console.log("Sale created successfully - Response:", data);
    return { success: true, data, message: "Sale created successfully" };
  } catch (error) {
    console.error("Create sale error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * PUT /api/sales/:id - Update sale
 */
export async function updateSale(id: string, formData: FormData) {
  try {
    const headers = await getAuthHeaders();
    const saleData = JSON.parse(formData.get("saleData") as string);

    const response = await fetch(`${API_URL}/api/sales/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(saleData),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to update sale" };
    }

    const data = await response.json();
    return { success: true, data, message: "Sale updated successfully" };
  } catch (error) {
    console.error("Update sale error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * DELETE /api/sales/:id - Delete sale (soft delete)
 */
export async function deleteSale(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/sales/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to delete sale" };
    }

    const data = await response.json();
    return { success: true, data, message: "Sale deleted successfully" };
  } catch (error) {
    console.error("Delete sale error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
