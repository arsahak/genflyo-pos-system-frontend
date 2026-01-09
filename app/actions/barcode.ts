"use server";

import { auth } from "@/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getAuthHeaders() {
  const session = await auth();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.accessToken}`,
  };
}

export interface Barcode {
  _id: string;
  barcode: string;
  productId: {
    _id: string;
    name: string;
    sku: string;
    price: number;
    image?: string;
  };
  type: string;
  isActive: boolean;
  notes?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BarcodeListResponse {
  barcodes: Barcode[];
  totalPages: number;
  currentPage: number;
  total: number;
}

/**
 * Generate a new unique barcode for a product
 */
export async function generateBarcode(productId: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/barcodes/generate`, {
      method: "POST",
      headers,
      body: JSON.stringify({ productId }),
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Generate barcode error:", error);
    return { success: false, error: "Failed to generate barcode" };
  }
}

/**
 * Create a new barcode
 */
export async function createBarcode(barcodeData: {
  barcode: string;
  productId: string;
  type?: string;
  notes?: string;
}) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/barcodes`, {
      method: "POST",
      headers,
      body: JSON.stringify(barcodeData),
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Create barcode error:", error);
    return { success: false, error: "Failed to create barcode" };
  }
}

/**
 * Get all barcodes with pagination and filters
 */
export async function getAllBarcodes(params?: {
  page?: number;
  limit?: number;
  search?: string;
  productId?: string;
  type?: string;
  isActive?: boolean;
}) {
  try {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.productId) queryParams.append("productId", params.productId);
    if (params?.type) queryParams.append("type", params.type);
    if (params?.isActive !== undefined)
      queryParams.append("isActive", params.isActive.toString());

    const url = `${API_URL}/api/barcodes${
      queryParams.toString() ? `?${queryParams}` : ""
    }`;

    const response = await fetch(url, {
      headers,
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    const data: BarcodeListResponse = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get barcodes error:", error);
    return { success: false, error: "Failed to fetch barcodes" };
  }
}

/**
 * Delete a barcode
 */
export async function deleteBarcode(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/barcodes/${id}`, {
      method: "DELETE",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Delete barcode error:", error);
    return { success: false, error: "Failed to delete barcode" };
  }
}

/**
 * Check if barcode is duplicate
 */
export async function checkDuplicate(barcode: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/barcodes/check`, {
      method: "POST",
      headers,
      body: JSON.stringify({ barcode }),
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Check duplicate error:", error);
    return { success: false, error: "Failed to check duplicate" };
  }
}
