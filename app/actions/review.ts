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

export interface CreateReviewInput {
  productId: string;
  orderId: string;
  rating: number;
  title?: string;
  comment: string;
}

export async function createReview(input: CreateReviewInput) {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_URL}/api/reviews`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        product: input.productId,
        order: input.orderId,
        rating: input.rating,
        title: input.title,
        comment: input.comment,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error:
          data.message ||
          "Failed to submit review. You can only review products from delivered orders.",
      };
    }

    return {
      success: true,
      message: data.message || "Review submitted successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error creating review:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to submit review",
    };
  }
}

// Get customer's reviews to check which products have been reviewed
export async function getMyReviews() {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_URL}/api/reviews?customer=me&limit=1000`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to fetch reviews");
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data || [],
    };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch reviews",
      data: [],
    };
  }
}


