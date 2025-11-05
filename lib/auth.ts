import api from "./api";
import { useStore } from "./store";

/**
 * Logout Functions
 */

// Logout from current device
export const logout = async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      await api.post("/auth/logout", {
        refreshToken,
        logoutAll: false,
      });
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Clear local state regardless of API call success
    clearAuthData();
  }
};

// Logout from all devices
export const logoutAll = async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      await api.post("/auth/logout", {
        refreshToken,
        logoutAll: true,
      });
    }
  } catch (error) {
    console.error("Logout all error:", error);
  } finally {
    // Clear local state regardless of API call success
    clearAuthData();
  }
};

// Clear authentication data
export const clearAuthData = (): void => {
  // Clear localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("pos-storage");

  // Clear Zustand store
  useStore.getState().clearAuth();

  // Redirect to login
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
};

/**
 * Session Management
 */

// Get all active sessions
export const getSessions = async () => {
  try {
    const response = await api.get("/auth/sessions");
    return response.data;
  } catch (error) {
    console.error("Get sessions error:", error);
    throw error;
  }
};

// Revoke a specific session
export const revokeSession = async (sessionId: string) => {
  try {
    await api.delete(`/auth/sessions/${sessionId}`);
    return { success: true };
  } catch (error) {
    console.error("Revoke session error:", error);
    throw error;
  }
};

/**
 * Token Verification
 */

// Verify if token is still valid
export const verifyToken = async () => {
  try {
    const response = await api.get("/auth/verify");
    return response.data;
  } catch (error) {
    return { valid: false };
  }
};

/**
 * Password Management
 */

// Change password
export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  logoutOtherDevices = false
) => {
  try {
    const response = await api.post("/auth/change-password", {
      currentPassword,
      newPassword,
      logoutOtherDevices,
    });
    return response.data;
  } catch (error) {
    console.error("Change password error:", error);
    throw error;
  }
};

/**
 * Permission Helpers
 */

// Check if user has specific permission
export const hasPermission = (permission: string): boolean => {
  const user = useStore.getState().user;

  if (!user) return false;

  // Super admin has all permissions
  if (user.role === "super_admin") return true;

  // Check specific permission
  return (user.permissions as any)?.[permission] === true;
};

// Check if user has any of the specified roles
export const hasRole = (...roles: string[]): boolean => {
  const user = useStore.getState().user;

  if (!user) return false;

  return roles.includes(user.role);
};

// Get user role display name
export const getRoleDisplayName = (role: string): string => {
  const roleNames: Record<string, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    manager: "Manager",
    cashier: "Cashier",
    seller: "Seller",
    editor: "Editor",
    waiter: "Waiter",
    pharmacist: "Pharmacist",
    kitchen_staff: "Kitchen Staff",
  };

  return roleNames[role] || role;
};

/**
 * Auto-login (check if user is already authenticated)
 */
export const checkAuth = async (): Promise<boolean> => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken || !refreshToken) {
    return false;
  }

  // Verify token
  const result = await verifyToken();

  if (result.valid) {
    // Update user in store
    useStore.getState().setUser(result.user);
    return true;
  }

  // Try to refresh token
  try {
    const response = await api.post("/auth/refresh", { refreshToken });
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    // Verify again
    const verifyResult = await verifyToken();
    if (verifyResult.valid) {
      useStore.getState().setUser(verifyResult.user);
      return true;
    }
  } catch (error) {
    // Refresh failed
    clearAuthData();
    return false;
  }

  return false;
};

