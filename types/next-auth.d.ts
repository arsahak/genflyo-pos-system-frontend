import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      _id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      roleId?: string;
      permissions?: unknown;
      profileImage?: string;
      lastLogin?: string;
    } & DefaultSession["user"];
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  }

  interface User {
    id?: string;
    _id?: string;
    name?: string;
    email?: string;
    role?: string;
    roleId?: string;
    permissions?: unknown;
    profileImage?: string;
    lastLogin?: string;
    emailVerified?: Date | null;
    accessToken?: string;
    refreshToken?: string;
    accessTokenIssuedAt?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
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
}
