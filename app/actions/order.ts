"use server";

import { auth } from "@/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Helper to get auth headers
async function getAuthHeaders() {
  const session = await auth();
  if (!session?.accessToken) {
    throw new Error("Not authenticated");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.accessToken}`,
  };
}

// Get customer's orders
export async function getMyOrders(page: number = 1, limit: number = 10) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${API_URL}/api/orders/my-orders?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to fetch orders");
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data,
      pagination: data.pagination,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch orders",
      data: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        pages: 0,
      },
    };
  }
}

// Get single order by ID
export async function getOrder(orderId: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to fetch order");
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch order",
      data: null,
    };
  }
}

// Create order
export async function createOrder(orderData: {
  items: Array<{
    product: string;
    quantity: number;
    variant?: string;
    discount?: number;
  }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    email?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    fullName: string;
    phone: string;
    email?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  shippingMethod?: string;
  customerNote?: string;
}) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to create order");
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || "Order created successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order",
    };
  }
}
