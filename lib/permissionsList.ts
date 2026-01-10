/**
 * Centralized Permission List for User Management Forms
 * This ensures consistency across NewUserCreate and UserEdit components
 */

import { PermissionKey } from "./permissions";

export interface PermissionItem {
  key: PermissionKey;
  label: string;
  description?: string;
}

export interface PermissionCategory {
  title: string;
  icon: string;
  color: string;
  permissions: PermissionItem[];
}

export const permissionCategories: PermissionCategory[] = [
  {
    title: "Dashboard",
    icon: "dashboard",
    color: "blue",
    permissions: [
      {
        key: "canViewDashboard",
        label: "View Dashboard",
        description: "Access main dashboard",
      },
    ],
  },
  {
    title: "Sales & POS",
    icon: "sales",
    color: "green",
    permissions: [
      {
        key: "canViewSales",
        label: "View Sales",
        description: "View sales records",
      },
      {
        key: "canCreateSales",
        label: "Create Sales",
        description: "Process new sales transactions",
      },
      {
        key: "canEditSales",
        label: "Edit Sales",
        description: "Modify existing sales",
      },
      {
        key: "canDeleteSales",
        label: "Delete Sales",
        description: "Remove sales records",
      },
      {
        key: "canProcessRefunds",
        label: "Process Refunds",
        description: "Handle refund transactions",
      },
      {
        key: "canViewSalesReports",
        label: "View Sales Reports",
        description: "Access sales analytics",
      },
    ],
  },
  {
    title: "Order Management",
    icon: "orders",
    color: "orange",
    permissions: [
      {
        key: "canViewOrders",
        label: "View Orders",
        description: "View order records",
      },
      {
        key: "canCreateOrders",
        label: "Create Orders",
        description: "Create new orders",
      },
      {
        key: "canEditOrders",
        label: "Edit Orders",
        description: "Modify existing orders",
      },
      {
        key: "canDeleteOrders",
        label: "Delete Orders",
        description: "Remove order records",
      },
      {
        key: "canApproveOrders",
        label: "Approve Orders",
        description: "Approve pending orders",
      },
      {
        key: "canCancelOrders",
        label: "Cancel Orders",
        description: "Cancel orders",
      },
    ],
  },
  {
    title: "Product Management",
    icon: "products",
    color: "blue",
    permissions: [
      {
        key: "canViewProducts",
        label: "View Products",
        description: "View product catalog",
      },
      {
        key: "canAddProducts",
        label: "Add Products",
        description: "Create new products",
      },
      {
        key: "canEditProducts",
        label: "Edit Products",
        description: "Modify product details",
      },
      {
        key: "canDeleteProducts",
        label: "Delete Products",
        description: "Remove products",
      },
      {
        key: "canManageCategories",
        label: "Manage Categories",
        description: "Manage product categories",
      },
      {
        key: "canViewBarcodes",
        label: "View Barcodes",
        description: "View product barcodes",
      },
      {
        key: "canGenerateBarcodes",
        label: "Generate Barcodes",
        description: "Create new product barcodes",
      },
      {
        key: "canDeleteBarcodes",
        label: "Delete Barcodes",
        description: "Remove product barcodes",
      },
      {
        key: "canManageBarcodes",
        label: "Manage Barcodes",
        description: "Full barcode management",
      },
    ],
  },
  {
    title: "Inventory Management",
    icon: "inventory",
    color: "teal",
    permissions: [
      {
        key: "canViewInventory",
        label: "View Inventory",
        description: "View stock levels",
      },
      {
        key: "canManageInventory",
        label: "Manage Inventory",
        description: "Full inventory control",
      },
      {
        key: "canAdjustStock",
        label: "Adjust Stock",
        description: "Modify stock quantities",
      },
    ],
  },
  {
    title: "Supplier Management",
    icon: "suppliers",
    color: "yellow",
    permissions: [
      {
        key: "canViewSuppliers",
        label: "View Suppliers",
        description: "View supplier list",
      },
      {
        key: "canAddSuppliers",
        label: "Add Suppliers",
        description: "Create new suppliers",
      },
      {
        key: "canEditSuppliers",
        label: "Edit Suppliers",
        description: "Modify supplier details",
      },
      {
        key: "canDeleteSuppliers",
        label: "Delete Suppliers",
        description: "Remove suppliers",
      },
      {
        key: "canManageSuppliers",
        label: "Manage Suppliers",
        description: "Full supplier management",
      },
    ],
  },
  {
    title: "Customer Management",
    icon: "customers",
    color: "purple",
    permissions: [
      {
        key: "canViewCustomers",
        label: "View Customers",
        description: "View customer list",
      },
      {
        key: "canAddCustomers",
        label: "Add Customers",
        description: "Create new customers",
      },
      {
        key: "canEditCustomers",
        label: "Edit Customers",
        description: "Modify customer details",
      },
      {
        key: "canDeleteCustomers",
        label: "Delete Customers",
        description: "Remove customers",
      },
      {
        key: "canViewCustomerHistory",
        label: "View Customer History",
        description: "Access customer purchase history",
      },
    ],
  },
  {
    title: "User Management",
    icon: "users",
    color: "pink",
    permissions: [
      {
        key: "canViewUsers",
        label: "View Users",
        description: "View user list",
      },
      {
        key: "canAddUsers",
        label: "Add Users",
        description: "Create new users",
      },
      {
        key: "canEditUsers",
        label: "Edit Users",
        description: "Modify user details",
      },
      {
        key: "canDeleteUsers",
        label: "Delete Users",
        description: "Remove users",
      },
      {
        key: "canManageRoles",
        label: "Manage Roles",
        description: "Create and edit roles",
      },
    ],
  },
  {
    title: "Store Management",
    icon: "stores",
    color: "cyan",
    permissions: [
      {
        key: "canViewStores",
        label: "View Stores",
        description: "View store list",
      },
      {
        key: "canAddStores",
        label: "Add Stores",
        description: "Create new stores",
      },
      {
        key: "canEditStores",
        label: "Edit Stores",
        description: "Modify store details",
      },
      {
        key: "canDeleteStores",
        label: "Delete Stores",
        description: "Remove stores",
      },
      {
        key: "canManageStoreSettings",
        label: "Manage Store Settings",
        description: "Configure store settings",
      },
    ],
  },
  {
    title: "Reports & Analytics",
    icon: "reports",
    color: "indigo",
    permissions: [
      {
        key: "canViewReports",
        label: "View Reports",
        description: "Access analytics and reports",
      },
      {
        key: "canExportReports",
        label: "Export Reports",
        description: "Download report data",
      },
      {
        key: "canViewAnalytics",
        label: "View Analytics",
        description: "Access detailed analytics",
      },
    ],
  },
  {
    title: "System Settings",
    icon: "settings",
    color: "red",
    permissions: [
      {
        key: "canManageSettings",
        label: "Manage Settings",
        description: "Configure system settings",
      },
      {
        key: "canManagePaymentMethods",
        label: "Manage Payment Methods",
        description: "Configure payment options",
      },
      {
        key: "canManageTaxSettings",
        label: "Manage Tax Settings",
        description: "Configure tax rates",
      },
      {
        key: "canManageReceiptSettings",
        label: "Manage Receipt Settings",
        description: "Configure receipt templates",
      },
      {
        key: "canViewSystemLogs",
        label: "View System Logs",
        description: "Access system logs and audit trails",
      },
    ],
  },
];

/**
 * Get all permission keys as an array
 */
export const getAllPermissionKeys = (): string[] => {
  return permissionCategories.flatMap((category) =>
    category.permissions.map((p) => p.key)
  );
};

/**
 * Get permission label by key
 */
export const getPermissionLabel = (key: string): string => {
  for (const category of permissionCategories) {
    const permission = category.permissions.find((p) => p.key === key);
    if (permission) return permission.label;
  }
  return key;
};

/**
 * Get category color classes
 */
export const getCategoryColorClasses = (color: string) => {
  const colorMap: Record<string, { border: string; bg: string; text: string; hover: string }> = {
    blue: {
      border: "border-blue-200",
      bg: "bg-gradient-to-br from-blue-50 to-white",
      text: "text-blue-700",
      hover: "hover:border-blue-400 hover:bg-blue-50/50",
    },
    green: {
      border: "border-green-200",
      bg: "bg-gradient-to-br from-green-50 to-white",
      text: "text-green-700",
      hover: "hover:border-green-400 hover:bg-green-50/50",
    },
    orange: {
      border: "border-orange-200",
      bg: "bg-gradient-to-br from-orange-50 to-white",
      text: "text-orange-700",
      hover: "hover:border-orange-400 hover:bg-orange-50/50",
    },
    teal: {
      border: "border-teal-200",
      bg: "bg-gradient-to-br from-teal-50 to-white",
      text: "text-teal-700",
      hover: "hover:border-teal-400 hover:bg-teal-50/50",
    },
    yellow: {
      border: "border-yellow-200",
      bg: "bg-gradient-to-br from-yellow-50 to-white",
      text: "text-yellow-700",
      hover: "hover:border-yellow-400 hover:bg-yellow-50/50",
    },
    purple: {
      border: "border-purple-200",
      bg: "bg-gradient-to-br from-purple-50 to-white",
      text: "text-purple-700",
      hover: "hover:border-purple-400 hover:bg-purple-50/50",
    },
    pink: {
      border: "border-pink-200",
      bg: "bg-gradient-to-br from-pink-50 to-white",
      text: "text-pink-700",
      hover: "hover:border-pink-400 hover:bg-pink-50/50",
    },
    cyan: {
      border: "border-cyan-200",
      bg: "bg-gradient-to-br from-cyan-50 to-white",
      text: "text-cyan-700",
      hover: "hover:border-cyan-400 hover:bg-cyan-50/50",
    },
    gray: {
      border: "border-gray-200",
      bg: "bg-gradient-to-br from-gray-50 to-white",
      text: "text-gray-700",
      hover: "hover:border-gray-400 hover:bg-gray-50/50",
    },
    indigo: {
      border: "border-indigo-200",
      bg: "bg-gradient-to-br from-indigo-50 to-white",
      text: "text-indigo-700",
      hover: "hover:border-indigo-400 hover:bg-indigo-50/50",
    },
    red: {
      border: "border-red-200",
      bg: "bg-gradient-to-br from-red-50 to-white",
      text: "text-red-700",
      hover: "hover:border-red-400 hover:bg-red-50/50",
    },
  };

  return colorMap[color] || colorMap.blue;
};
