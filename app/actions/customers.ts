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
 * GET /api/customers - Get all customers with search and filter
 */
export async function getAllCustomers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  phone?: string;
  q?: string;
}) {
  try {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    // Backend expects 'phone' for phone search or 'q' for name search
    if (params?.phone) {
      queryParams.append("phone", params.phone);
    } else if (params?.q) {
      queryParams.append("q", params.q);
    } else if (params?.search) {
      // Treat search as phone number search
      queryParams.append("phone", params.search);
    }

    const url = `${API_URL}/api/customers${queryParams.toString() ? `?${queryParams}` : ""}`;
    const response = await fetch(url, { headers, cache: "no-store" });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch customers" };
    }

    // Backend returns customers array directly
    const customers = await response.json();
    return { success: true, data: { customers } };
  } catch (error) {
    console.error("Get all customers error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * GET /api/customers/phone/:phone - Find customer by phone number
 */
export async function getCustomerByPhone(phone: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/customers/phone/${phone}`, { headers });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Customer not found" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get customer by phone error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * GET /api/customers/:id - Get customer by ID
 */
export async function getCustomerById(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/customers/${id}`, { headers });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Customer not found" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get customer by ID error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * POST /api/customers - Create new customer
 */
export async function createCustomer(formData: FormData) {
  try {
    const headers = await getAuthHeaders();
    const customerData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      country: formData.get("country") as string,
      loyaltyPoints: parseInt(formData.get("loyaltyPoints") as string) || 0,
    };

    const response = await fetch(`${API_URL}/api/customers`, {
      method: "POST",
      headers,
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to create customer" };
    }

    const data = await response.json();
    return { success: true, data, message: "Customer created successfully" };
  } catch (error) {
    console.error("Create customer error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * PUT /api/customers/:id - Update customer
 */
export async function updateCustomer(id: string, formData: FormData) {
  try {
    const headers = await getAuthHeaders();
    const customerData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      country: formData.get("country") as string,
      loyaltyPoints: parseInt(formData.get("loyaltyPoints") as string) || 0,
    };

    const response = await fetch(`${API_URL}/api/customers/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to update customer" };
    }

    const data = await response.json();
    return { success: true, data, message: "Customer updated successfully" };
  } catch (error) {
    console.error("Update customer error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * DELETE /api/customers/:id - Soft delete customer
 */
export async function deleteCustomer(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/customers/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to delete customer" };
    }

    const data = await response.json();
    return { success: true, data, message: "Customer deleted successfully" };
  } catch (error) {
    console.error("Delete customer error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
