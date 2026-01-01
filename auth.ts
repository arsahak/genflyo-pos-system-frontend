import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Access token expires in 30 days - NO REFRESH TOKEN NEEDED
const ACCESS_TOKEN_LIFETIME = 30 * 24 * 60 * 60; // 30 days in seconds

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
  accessTokenIssuedAt?: number;
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: ACCESS_TOKEN_LIFETIME, // Session lasts 30 days
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

          // Backend returns: { message, user, accessToken }
          if (!data.user || !data.accessToken) {
            console.error("Incomplete user data received from server:", data);
            throw new Error("Server error. Please try again.");
          }

          console.log("User authenticated successfully:", data.user.email);

          // Return user with access token (no refresh token)
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
      // Initial sign in - store user data and token
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
        token.accessTokenIssuedAt = user.accessTokenIssuedAt || Date.now();
        return token;
      }

      // Check if token has expired (30 days)
      const tokenAge = Date.now() - (token.accessTokenIssuedAt ? Number(token.accessTokenIssuedAt) : 0);
      const hasExpired = tokenAge > ACCESS_TOKEN_LIFETIME * 1000;

      if (hasExpired) {
        console.log("Access token expired after 30 days, user must re-login");
        return {
          ...token,
          error: "TokenExpired",
        };
      }

      // Token is still valid, return as-is
      return token;
    },
    async session({ session, token }) {
      // Check if token expired
      if (token.error === "TokenExpired") {
        console.log("Token expired, forcing re-login");
        return {
          ...session,
          user: undefined,
          accessToken: undefined,
          error: "TokenExpired",
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
      }

      return session;
    },
  },
  events: {
    async signOut(message) {
      // Call backend logout endpoint
      const token = "token" in message ? message.token : null;
      if (token?.accessToken) {
        try {
          await fetch(`${API_URL}/api/auth/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.accessToken}`,
            },
          });
          console.log("User logged out successfully");
        } catch (error) {
          console.error("Error during logout:", error);
        }
      }
    },
  },
});
