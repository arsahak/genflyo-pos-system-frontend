/**
 * DEPRECATED: This file is being phased out.
 * New code should use server actions from /app/actions/ instead.
 *
 * This client-side API utility now works with Auth.js (NextAuth) sessions.
 * It's kept for backward compatibility with existing components.
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies with requests
});

// Add token to requests - now uses Auth.js session cookies automatically
api.interceptors.request.use(
  async (config) => {
    // Auth.js automatically sends session cookies
    // No need to manually add Authorization header
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is not 401, reject immediately
    if (error.response?.status !== 401) {
      // Handle specific error codes
      if (error.response?.status === 423) {
        // Account locked
        console.error("Account is locked");
      }
      return Promise.reject(error);
    }

    // For 401 errors, redirect to sign-in
    // Auth.js will handle token refresh automatically
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Session expired, redirect to sign-in
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        window.location.href = `/sign-in?callbackUrl=${encodeURIComponent(currentPath)}`;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
