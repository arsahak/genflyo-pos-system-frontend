"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { PermissionKey } from "@/lib/permissions";
import toast from "react-hot-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: PermissionKey | PermissionKey[];
  requiredRole?: string | string[];
  redirectTo?: string;
  showToast?: boolean;
}

/**
 * ProtectedRoute component - Wraps pages that require specific permissions or roles
 *
 * Usage:
 * <ProtectedRoute requiredPermission="canViewUsers">
 *   <YourPageContent />
 * </ProtectedRoute>
 */
export default function ProtectedRoute({
  children,
  requiredPermission,
  requiredRole,
  redirectTo = "/",
  showToast = true,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, hasPermission } = useStore();

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      if (showToast) {
        toast.error("Please log in to access this page");
      }
      router.push("/");
      return;
    }

    // Check role requirement
    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const hasRole = roles.includes(user.role);

      if (!hasRole) {
        if (showToast) {
          toast.error("You don't have access to this page");
        }
        router.push(redirectTo);
        return;
      }
    }

    // Check permission requirement
    if (requiredPermission) {
      const permissions = Array.isArray(requiredPermission)
        ? requiredPermission
        : [requiredPermission];
      const hasAccess = permissions.some((perm) => hasPermission(perm));

      if (!hasAccess) {
        if (showToast) {
          toast.error("You don't have permission to access this page");
        }
        router.push(redirectTo);
        return;
      }
    }
  }, [user, requiredPermission, requiredRole, redirectTo, router, hasPermission, showToast]);

  // Don't render children until we verify access
  if (!user) {
    return null;
  }

  // If role check is required
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user.role)) {
      return null;
    }
  }

  // If permission check is required
  if (requiredPermission) {
    const permissions = Array.isArray(requiredPermission)
      ? requiredPermission
      : [requiredPermission];
    const hasAccess = permissions.some((perm) => hasPermission(perm));

    if (!hasAccess) {
      return null;
    }
  }

  return <>{children}</>;
}
