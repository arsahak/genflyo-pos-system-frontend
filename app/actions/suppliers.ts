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
 * GET /api/suppliers - Get all suppliers with search and filter
 */
export async function getAllSuppliers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  q?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
}) {
  try {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.q) queryParams.append("q", params.q);
    if (params?.search) queryParams.append("q", params.search);
    if (params?.email) queryParams.append("email", params.email);
    if (params?.phone) queryParams.append("phone", params.phone);
    if (params?.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());

    const url = `${API_URL}/api/suppliers${queryParams.toString() ? `?${queryParams}` : ""}`;
    const response = await fetch(url, { headers, cache: "no-store" });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch suppliers" };
    }

    const data = await response.json();
    return { success: true, data: data.data, pagination: data.pagination };
  } catch (error) {
    console.error("Get all suppliers error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * GET /api/suppliers/:id - Get supplier by ID
 */
export async function getSupplierById(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/suppliers/${id}`, {
      headers,
      cache: "no-store"
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Supplier not found" };
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error("Get supplier by ID error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * POST /api/suppliers - Create new supplier
 */
export async function createSupplier(supplierData: {
  name: string;
  company: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  city?: string;
  country?: string;
  taxNumber?: string;
  paymentTerms?: string;
  notes?: string;
}) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/suppliers`, {
      method: "POST",
      headers,
      body: JSON.stringify(supplierData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.errors?.[0] || "Failed to create supplier"
      };
    }

    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    console.error("Create supplier error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * PUT /api/suppliers/:id - Update supplier
 */
export async function updateSupplier(id: string, supplierData: {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  city?: string;
  country?: string;
  taxNumber?: string;
  paymentTerms?: string;
  notes?: string;
}) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/suppliers/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(supplierData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.errors?.[0] || "Failed to update supplier"
      };
    }

    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    console.error("Update supplier error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * DELETE /api/suppliers/:id - Soft delete supplier
 */
export async function deleteSupplier(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/suppliers/${id}`, {
      method: "DELETE",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || "Failed to delete supplier" };
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error("Delete supplier error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * DELETE /api/suppliers/:id/permanent - Permanently delete supplier
 */
export async function permanentDeleteSupplier(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/suppliers/${id}/permanent`, {
      method: "DELETE",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || "Failed to permanently delete supplier" };
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error("Permanent delete supplier error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * PUT /api/suppliers/:id/restore - Restore deleted supplier
 */
export async function restoreSupplier(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/suppliers/${id}/restore`, {
      method: "PUT",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || "Failed to restore supplier" };
    }

    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    console.error("Restore supplier error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * GET /api/suppliers/stats - Get supplier statistics
 */
export async function getSupplierStats() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/suppliers/stats`, {
      headers,
      cache: "no-store"
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch supplier stats" };
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error("Get supplier stats error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
