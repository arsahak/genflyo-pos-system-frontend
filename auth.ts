import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Access token expires in 30 days
const ACCESS_TOKEN_LIFETIME = 30 * 24 * 60 * 60; // 30 days in seconds
// Refresh token expires in 30 days (same as access token)
const REFRESH_TOKEN_LIFETIME = 30 * 24 * 60 * 60; // 30 days in seconds
// Refresh access token when it has less than 1 day remaining
const REFRESH_THRESHOLD = 24 * 60 * 60; // 1 day in seconds

interface TokenData {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  roleId?: string;
  permissions?: unknown;
  profileImage?: string;
  lastLogin?: string;
  accessToken?: string;
  refreshToken?: string;
  accessTokenIssuedAt?: number;
  error?: string;
}

/**
 * Refreshes the access token using the refresh token
 */
async function refreshAccessToken(token: any): Promise<any> {
  try {
    console.log("Attempting to refresh access token...");

    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to refresh token");
    }

    console.log("Access token refreshed successfully");

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken, // Backend rotates refresh tokens
      accessTokenIssuedAt: Date.now(),
      error: undefined,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);

    return {
      ...token,
      error: "RefreshTokenError",
    };
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: REFRESH_TOKEN_LIFETIME, // Session lasts as long as refresh token
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          // Check content type to ensure we got JSON
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            console.error(
              "Server returned non-JSON response. Backend may be down."
            );
            throw new Error(
              "Unable to connect to server. Please check if backend is running."
            );
          }

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Invalid email or password");
          }

          // Backend returns: { message, user, accessToken, refreshToken }
          if (!data.user || !data.accessToken || !data.refreshToken) {
            console.error("Incomplete user data received from server:", data);
            throw new Error("Server error. Please try again.");
          }

          console.log("User authenticated successfully:", data.user.email);

          // Return user with both access and refresh tokens
          return {
            id: data.user.id || data.user._id,
            _id: data.user.id || data.user._id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            roleId: data.user.roleId,
            permissions: data.user.permissions,
            profileImage: data.user.profileImage,
            lastLogin: data.user.lastLogin,
            emailVerified: null, // Required by NextAuth
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            accessTokenIssuedAt: Date.now(),
          };
        } catch (error) {
          console.error("Authorization error:", error);
          if (error instanceof Error) {
            throw error;
          }
          throw new Error("An unexpected error occurred. Please try again.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in - store user data and tokens
      if (user) {
        token.id = user.id;
        token._id = user._id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.roleId = user.roleId;
        token.permissions = user.permissions;
        token.profileImage = user.profileImage;
        token.lastLogin = user.lastLogin;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenIssuedAt = user.accessTokenIssuedAt || Date.now();
        return token;
      }

      // Return previous token if the access token has not expired yet
      const timeUntilExpiry =
        (token.accessTokenIssuedAt ? Number(token.accessTokenIssuedAt) : 0) +
        ACCESS_TOKEN_LIFETIME * 1000 -
        Date.now();

      // If access token is still valid and not close to expiry, return token as-is
      if (timeUntilExpiry > REFRESH_THRESHOLD * 1000) {
        return token;
      }

      // Access token has expired or is close to expiring, try to refresh it
      console.log("Access token expired or expiring soon, refreshing...");
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      // Check if there was an error refreshing the token
      if (token.error === "RefreshTokenError") {
        console.log("Refresh token error detected, forcing re-login");
        return {
          ...session,
          user: undefined,
          accessToken: undefined,
          error: "RefreshTokenError",
        };
      }

      // Pass token data to session
      if (token && token.accessToken) {
        session.user = {
          id: token.id,
          _id: token._id,
          name: token.name,
          email: token.email,
          role: token.role,
          roleId: token.roleId,
          permissions: token.permissions,
          profileImage: token.profileImage,
          lastLogin: token.lastLogin,
          image: token.profileImage,
        } as any;
        session.accessToken = String(token.accessToken);
        session.refreshToken = String(token.refreshToken);
      }

      return session;
    },
  },
  events: {
    async signOut(message) {
      // Call backend logout endpoint to revoke refresh token
      const token = "token" in message ? message.token : null;
      if (token?.refreshToken) {
        try {
          await fetch(`${API_URL}/api/auth/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.accessToken}`,
            },
            body: JSON.stringify({
              refreshToken: token.refreshToken,
              logoutAll: false,
            }),
          });
          console.log("User logged out successfully");
        } catch (error) {
          console.error("Error during logout:", error);
        }
      }
    },
  },
});
