"use client";

import { ReactNode } from "react";
import { useHasRole, PermissionKey } from "@/lib/permissions";
import { useStore } from "@/lib/store";

interface PermissionGuardProps {
  children: ReactNode;
  permission?: PermissionKey | PermissionKey[];
  role?: string | string[];
  fallback?: ReactNode;
  requireAll?: boolean; // For multiple permissions: true = AND, false = OR
}

/**
 * PermissionGuard component - Conditionally renders UI elements based on permissions or roles
 *
 * Usage:
 * <PermissionGuard permission="canAddUsers">
 *   <button>Add User</button>
 * </PermissionGuard>
 */
export default function PermissionGuard({
  children,
  permission,
  role,
  fallback = null,
  requireAll = false,
}: PermissionGuardProps) {
  const { hasPermission } = useStore();
  const hasRole = useHasRole;

  // Check role requirement
  if (role) {
    const roles = Array.isArray(role) ? role : [role];
    if (!hasRole(roles)) {
      return <>{fallback}</>;
    }
  }

  // Check permission requirement
  if (permission) {
    const permissions = Array.isArray(permission) ? permission : [permission];

    const hasAccess = requireAll
      ? permissions.every((perm) => hasPermission(perm))
      : permissions.some((perm) => hasPermission(perm));

    if (!hasAccess) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}
