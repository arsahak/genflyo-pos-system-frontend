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
function buildQueryString(params: Record<string, string | undefined>): string {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
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
 * GET /api/reports/sales - Get sales report
 * @param params - Optional filters including date range, store, and grouping
 */
export async function getSalesReport(params?: {
  from?: string;
  to?: string;
  storeId?: string;
  groupBy?: string;
}): Promise<ActionResponse> {
  try {
    const headers = await getAuthHeaders();
    const queryString = buildQueryString({
      from: params?.from,
      to: params?.to,
      storeId: params?.storeId,
      groupBy: params?.groupBy,
    });

    const url = `${API_URL}/api/reports/sales${queryString}`;
    const response = await fetch(url, { headers, cache: "no-store" });

    return handleFetchResponse(response, "Failed to fetch sales report");
  } catch (error) {
    console.error("Get sales report error:", error);
    return { success: false, error: "An unexpected error occurred while fetching sales report" };
  }
}

/**
 * GET /api/reports/inventory - Get inventory report
 * @param params - Optional filters including date range and store
 */
export async function getInventoryReport(params?: {
  from?: string;
  to?: string;
  storeId?: string;
}): Promise<ActionResponse> {
  try {
    const headers = await getAuthHeaders();
    const queryString = buildQueryString({
      from: params?.from,
      to: params?.to,
      storeId: params?.storeId,
    });

    const url = `${API_URL}/api/reports/inventory${queryString}`;
    const response = await fetch(url, { headers, cache: "no-store" });

    return handleFetchResponse(response, "Failed to fetch inventory report");
  } catch (error) {
    console.error("Get inventory report error:", error);
    return { success: false, error: "An unexpected error occurred while fetching inventory report" };
  }
}

/**
 * GET /api/reports/customers - Get customer report
 * @param params - Optional filters including date range
 */
export async function getCustomerReport(params?: {
  from?: string;
  to?: string;
}): Promise<ActionResponse> {
  try {
    const headers = await getAuthHeaders();
    const queryString = buildQueryString({
      from: params?.from,
      to: params?.to,
    });

    const url = `${API_URL}/api/reports/customers${queryString}`;
    const response = await fetch(url, { headers, cache: "no-store" });

    return handleFetchResponse(response, "Failed to fetch customer report");
  } catch (error) {
    console.error("Get customer report error:", error);
    return { success: false, error: "An unexpected error occurred while fetching customer report" };
  }
}

/**
 * GET /api/reports/financial - Get financial report
 * @param params - Optional filters including date range and store
 */
export async function getFinancialReport(params?: {
  from?: string;
  to?: string;
  storeId?: string;
}): Promise<ActionResponse> {
  try {
    const headers = await getAuthHeaders();
    const queryString = buildQueryString({
      from: params?.from,
      to: params?.to,
      storeId: params?.storeId,
    });

    const url = `${API_URL}/api/reports/financial${queryString}`;
    const response = await fetch(url, { headers, cache: "no-store" });

    return handleFetchResponse(response, "Failed to fetch financial report");
  } catch (error) {
    console.error("Get financial report error:", error);
    return { success: false, error: "An unexpected error occurred while fetching financial report" };
  }
}

/**
 * Export report to specific format (PDF/Excel)
 * @param reportType - Type of report (sales, inventory, customer, financial)
 * @param format - Export format (pdf or excel)
 * @param params - Optional filters
 */
export async function exportReport(
  reportType: "sales" | "inventory" | "customer" | "financial",
  format: "pdf" | "excel",
  params?: Record<string, string>
): Promise<ActionResponse> {
  try {
    const headers = await getAuthHeaders();
    const queryString = buildQueryString({
      format,
      ...params,
    });

    const url = `${API_URL}/api/reports/${reportType}/export${queryString}`;
    const response = await fetch(url, { headers, cache: "no-store" });

    if (!response.ok) {
      return handleFetchResponse(response, `Failed to export ${reportType} report`);
    }

    // For file downloads, return the blob URL
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const fileName = `${reportType}_report_${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;

    return {
      success: true,
      data: { downloadUrl, fileName },
      message: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report exported successfully`
    };
  } catch (error) {
    console.error("Export report error:", error);
    return { success: false, error: "An unexpected error occurred while exporting report" };
  }
}
