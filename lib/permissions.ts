/**
 * Permission utilities and hooks for role-based access control
 */

import { useStore } from "./store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export type PermissionKey =
  // POS & Sales
  | "canViewSales"
  | "canCreateSales"
  | "canEditSales"
  | "canDeleteSales"
  | "canProcessRefunds"
  | "canViewSalesReports"
  // Products
  | "canViewProducts"
  | "canAddProducts"
  | "canEditProducts"
  | "canDeleteProducts"
  | "canManageCategories"
  | "canViewInventory"
  | "canManageInventory"
  | "canAdjustStock"
  // Customers
  | "canViewCustomers"
  | "canAddCustomers"
  | "canEditCustomers"
  | "canDeleteCustomers"
  | "canViewCustomerHistory"
  // Users
  | "canViewUsers"
  | "canAddUsers"
  | "canEditUsers"
  | "canDeleteUsers"
  | "canManageRoles"
  // Stores
  | "canViewStores"
  | "canAddStores"
  | "canEditStores"
  | "canDeleteStores"
  | "canManageStoreSettings"
  // Reports & Analytics
  | "canViewReports"
  | "canExportReports"
  | "canViewAnalytics"
  | "canViewDashboard"
  // System Settings
  | "canManageSettings"
  | "canManagePaymentMethods"
  | "canManageTaxSettings"
  | "canManageReceiptSettings"
  | "canViewSystemLogs";

/**
 * Hook to check if user has a specific permission
 */
export function usePermission(permission: PermissionKey): boolean {
  const hasPermission = useStore((state) => state.hasPermission);
  return hasPermission(permission);
}

/**
 * Hook to check if user has ANY of the specified permissions
 */
export function useHasAnyPermission(permissions: PermissionKey[]): boolean {
  const hasPermission = useStore((state) => state.hasPermission);
  return permissions.some((permission) => hasPermission(permission));
}

/**
 * Hook to check if user has ALL of the specified permissions
 */
export function useHasAllPermissions(permissions: PermissionKey[]): boolean {
  const hasPermission = useStore((state) => state.hasPermission);
  return permissions.every((permission) => hasPermission(permission));
}

/**
 * Hook to get the current user
 */
export function useCurrentUser() {
  return useStore((state) => state.user);
}

/**
 * Hook to check if user has a specific role
 */
export function useHasRole(role: string | string[]): boolean {
  const user = useStore((state) => state.user);
  if (!user) return false;

  if (Array.isArray(role)) {
    return role.includes(user.role);
  }
  return user.role === role;
}

/**
 * Hook to protect a page - redirects if user doesn't have required permission
 */
export function useRequirePermission(
  permission: PermissionKey | PermissionKey[],
  redirectTo: string = "/"
) {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const hasPermission = useStore((state) => state.hasPermission);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    const permissions = Array.isArray(permission) ? permission : [permission];
    const hasAccess = permissions.some((perm) => hasPermission(perm));

    if (!hasAccess) {
      router.push(redirectTo);
    }
  }, [user, permission, redirectTo, router, hasPermission]);

  return user !== null;
}

/**
 * Hook to protect a page - redirects if user doesn't have required role
 */
export function useRequireRole(
  role: string | string[],
  redirectTo: string = "/"
) {
  const router = useRouter();
  const user = useStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    const roles = Array.isArray(role) ? role : [role];
    const hasRole = roles.includes(user.role);

    if (!hasRole) {
      router.push(redirectTo);
    }
  }, [user, role, redirectTo, router]);

  return user !== null;
}

/**
 * Component wrapper to conditionally render based on permission
 */
export function hasPermissionSync(
  user: any,
  permission: PermissionKey
): boolean {
  if (!user) return false;
  if (user.role === "super_admin") return true;
  return user.permissions?.[permission] === true;
}

/**
 * Get user-accessible navigation items based on permissions
 */
export function getAccessibleNavItems(user: any) {
  if (!user) return [];

  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      permission: "canViewDashboard" as PermissionKey,
    },
    {
      name: "POS",
      path: "/pos",
      permission: "canCreateSales" as PermissionKey,
    },
    {
      name: "Sales",
      path: "/sales",
      permission: "canViewSales" as PermissionKey,
    },
    {
      name: "Products",
      path: "/products",
      permission: "canViewProducts" as PermissionKey,
    },
    {
      name: "Inventory",
      path: "/inventory",
      permission: "canViewInventory" as PermissionKey,
    },
    {
      name: "Customers",
      path: "/customers",
      permission: "canViewCustomers" as PermissionKey,
    },
    {
      name: "Users",
      path: "/users",
      permission: "canViewUsers" as PermissionKey,
    },
    {
      name: "Stores",
      path: "/stores",
      permission: "canViewStores" as PermissionKey,
    },
    {
      name: "Reports",
      path: "/reports",
      permission: "canViewReports" as PermissionKey,
    },
    {
      name: "Settings",
      path: "/settings",
      permission: "canManageSettings" as PermissionKey,
    },
  ];

  return navItems.filter((item) => hasPermissionSync(user, item.permission));
}
