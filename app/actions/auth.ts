"use server";

import { auth, signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Sign in a user with email and password
 */
export async function userSignIn(
  email: string,
  password: string
): Promise<{
  error?: string;
  ok: boolean;
  url?: string;
}> {
  try {
    // Validate input
    if (!email || !password) {
      return {
        error: "Email and password are required",
        ok: false,
      };
    }

    console.log("Attempting to sign in:", { email });

    // Call NextAuth signIn with credentials
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // If we reach here, sign in was successful
    console.log("User signed in successfully:", email);

    return {
      ok: true,
      url: "/", // Default redirect after successful login
    };
  } catch (error) {
    console.error("Sign in error:", error);

    // Handle NextAuth specific errors
    if (error instanceof AuthError) {
      // AuthError types: CredentialsSignin, CallbackRouteError, etc.
      const errorMessage =
        error.type === "CredentialsSignin"
          ? "Invalid email or password"
          : error.message || "Authentication failed";

      return {
        error: errorMessage,
        ok: false,
      };
    }

    // Handle connection errors
    if (error instanceof Error) {
      const isConnectionError =
        error.message.includes("fetch failed") ||
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("Unable to connect");

      return {
        error: isConnectionError
          ? "Unable to connect to server. Please check if backend is running."
          : error.message,
        ok: false,
      };
    }

    return {
      error: "An unexpected error occurred. Please try again.",
      ok: false,
    };
  }
}

/**
 * Sign out the current user
 * This will revoke the refresh token on the backend
 * Note: signOut() will redirect automatically, so this function never returns
 */
export async function userSignOut(): Promise<void> {
  // NextAuth signOut will redirect to /sign-in
  // It throws NEXT_REDIRECT which is expected behavior in Next.js App Router
  await signOut({ redirectTo: "/sign-in" });
}

/**
 * Sign up a new user (customer)
 * This calls the backend signup API directly
 */
export async function userSignUp(formData: FormData): Promise<{
  error?: string;
  ok: boolean;
  url?: string;
  message?: string;
}> {
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;
  const name = formData.get("name") as string | null;

  // Validation
  if (!email || !password || !name) {
    return {
      error: "Name, email, and password are required",
      ok: false,
    };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      error: "Invalid email format",
      ok: false,
    };
  }

  // Password validation
  if (password.length < 6) {
    return {
      error: "Password must be at least 6 characters long",
      ok: false,
    };
  }

  try {
    console.log("Creating new user account:", { email, name });

    // Call customer signup API
    const response = await fetch(`${API_URL}/api/customers/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
      }),
    });

    // Parse response
    let data;
    try {
      data = await response.json();
    } catch {
      console.error("Failed to parse JSON response:", response.status);
      return {
        error: `Server error (${response.status}). Please try again.`,
        ok: false,
      };
    }

    // Handle errors from backend
    if (!response.ok || !data.success) {
      const errorMessage =
        data.message ||
        data.error ||
        (Array.isArray(data.errors) ? data.errors.join(", ") : null) ||
        "Failed to create account. Please try again.";

      console.error("Signup failed:", {
        status: response.status,
        errorMessage,
      });

      return {
        error: errorMessage,
        ok: false,
      };
    }

    // Signup successful
    console.log("Account created successfully:", data.data?.email || email);

    return {
      ok: true,
      message: data.message || "Account created successfully! Please sign in.",
      url: "/sign-in", // Redirect to sign in page
    };
  } catch (error) {
    console.error("Error during sign up:", error);

    // Check for connection errors
    const isConnectionError =
      error instanceof Error &&
      (error.message.includes("fetch failed") ||
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("NetworkError"));

    if (isConnectionError) {
      return {
        error: `Unable to connect to the server. Please make sure the backend is running at ${API_URL}`,
        ok: false,
      };
    }

    return {
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.",
      ok: false,
    };
  }
}


/**
 * Get the current session (server action for client components)
 */
export async function getCurrentSession() {
  try {
    const session = await auth();
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}
