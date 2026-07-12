"use server";

import { auth } from "@/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper to construct API URL robustly
function buildApiUrl(endpoint: string) {
  const baseUrl = API_URL.replace(/\/$/, "");
  const path = baseUrl.endsWith("/api") ? endpoint : `/api${endpoint}`;
  return `${baseUrl}${path}`;
}

async function getAuthHeaders() {
  const session = await auth();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.accessToken}`,
  };
}

export async function getAllSourcedItems(params?: {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}) {
  let url = "";
  try {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    url = `${buildApiUrl("/external-sources")}?${queryParams.toString()}`;
    console.log("Fetching Sourced Items URL:", url);

    const response = await fetch(url, { headers, cache: "no-store" });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch sourced items" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get sourced items error:", error);
    return { 
        success: false, 
        error: `${error instanceof Error ? error.message : "An unexpected error occurred"} (URL: ${url})`
    };
  }
}

export async function deleteSourcedItem(id: string) {
  let url = "";
  try {
    const headers = await getAuthHeaders();
    url = `${buildApiUrl("/external-sources")}/${id}`;
    
    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to delete item" };
    }

    const data = await response.json();
    return { success: true, data, message: "Item deleted successfully" };
  } catch (error) {
    console.error("Delete sourced item error:", error);
    return { 
        success: false, 
        error: `${error instanceof Error ? error.message : "An unexpected error occurred"} (URL: ${url})`
    };
  }
}
