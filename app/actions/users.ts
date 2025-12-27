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
 * GET /api/users - Get all users with pagination and search
 * @param params - Optional filters including pagination, search, and role
 */
export async function getAllUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
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
      role: params?.role,
    });

    const url = `${API_URL}/api/users${queryString}`;
    console.log("Fetching users from:", url);

    const response = await fetch(url, { headers, cache: "no-store" });

    console.log("Get users response status:", response.status);

    return handleFetchResponse(response, "Failed to fetch users");
  } catch (error) {
    console.error("Get all users error:", error);
    return { success: false, error: "An unexpected error occurred while fetching users" };
  }
}

/**
 * GET /api/users/me - Get current user
 */
export async function getCurrentUser(): Promise<ActionResponse> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/users/me`, {
      headers,
      cache: "no-store"
    });

    return handleFetchResponse(response, "Failed to fetch current user");
  } catch (error) {
    console.error("Get current user error:", error);
    return { success: false, error: "An unexpected error occurred while fetching current user" };
  }
}

/**
 * GET /api/users/:id - Get user by ID
 * @param id - User ID
 */
export async function getUserById(id: string): Promise<ActionResponse> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/users/${id}`, {
      headers,
      cache: "no-store"
    });

    return handleFetchResponse(response, "User not found");
  } catch (error) {
    console.error("Get user by ID error:", error);
    return { success: false, error: "An unexpected error occurred while fetching user" };
  }
}

/**
 * POST /api/users - Create user
 * @param formData - FormData containing user details and optional profile image
 */
export async function createUser(formData: FormData): Promise<ActionResponse> {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return { success: false, error: "Authentication required. Please log in again." };
    }

    const headers = {
      Authorization: `Bearer ${session.accessToken}`,
    };

    console.log("Creating user with API URL:", `${API_URL}/api/users`);

    const response = await fetch(`${API_URL}/api/users`, {
      method: "POST",
      headers,
      body: formData,
    });

    console.log("Create user response status:", response.status);

    if (!response.ok) {
      try {
        const error = await response.json();
        console.error("Create user error response:", error);
        return { success: false, error: error.message || "Failed to create user" };
      } catch {
        return { success: false, error: `Failed to create user (Status: ${response.status})` };
      }
    }

    const data = await response.json();
    console.log("User created successfully:", data);
    return {
      success: true,
      data,
      message: "User created successfully"
    };
  } catch (error) {
    console.error("Create user error:", error);
    return { success: false, error: "An unexpected error occurred while creating user" };
  }
}

/**
 * PUT /api/users/:id - Update user
 * @param id - User ID
 * @param formData - FormData containing user details and optional profile image
 */
export async function updateUser(id: string, formData: FormData): Promise<ActionResponse> {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return { success: false, error: "Authentication required. Please log in again." };
    }

    const headers = {
      Authorization: `Bearer ${session.accessToken}`,
    };

    console.log("Updating user with ID:", id);

    const response = await fetch(`${API_URL}/api/users/${id}`, {
      method: "PUT",
      headers,
      body: formData,
    });

    console.log("Update user response status:", response.status);

    if (!response.ok) {
      try {
        const error = await response.json();
        console.error("Update user error response:", error);
        return { success: false, error: error.message || "Failed to update user" };
      } catch {
        return { success: false, error: `Failed to update user (Status: ${response.status})` };
      }
    }

    const data = await response.json();
    console.log("User updated successfully:", data);
    return {
      success: true,
      data,
      message: "User updated successfully"
    };
  } catch (error) {
    console.error("Update user error:", error);
    return { success: false, error: "An unexpected error occurred while updating user" };
  }
}

/**
 * DELETE /api/users/:id - Delete user (soft delete)
 * @param id - User ID
 */
export async function deleteUser(id: string): Promise<ActionResponse> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/users/${id}`, {
      method: "DELETE",
      headers,
    });

    return handleFetchResponse(response, "Failed to delete user");
  } catch (error) {
    console.error("Delete user error:", error);
    return { success: false, error: "An unexpected error occurred while deleting user" };
  }
}
