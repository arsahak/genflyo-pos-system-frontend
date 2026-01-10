import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Permissions {
  // Dashboard
  canViewDashboard?: boolean;

  // POS & Sales
  canViewSales?: boolean;
  canCreateSales?: boolean;
  canEditSales?: boolean;
  canDeleteSales?: boolean;
  canProcessRefunds?: boolean;
  canViewSalesReports?: boolean;

  // Orders
  canViewOrders?: boolean;
  canCreateOrders?: boolean;
  canEditOrders?: boolean;
  canDeleteOrders?: boolean;
  canApproveOrders?: boolean;
  canCancelOrders?: boolean;

  // Products
  canViewProducts?: boolean;
  canAddProducts?: boolean;
  canEditProducts?: boolean;
  canDeleteProducts?: boolean;
  canManageCategories?: boolean;
  canViewInventory?: boolean;
  canManageInventory?: boolean;
  canAdjustStock?: boolean;

  // Suppliers
  canViewSuppliers?: boolean;
  canAddSuppliers?: boolean;
  canEditSuppliers?: boolean;
  canDeleteSuppliers?: boolean;
  canManageSuppliers?: boolean;

  // Customers
  canViewCustomers?: boolean;
  canAddCustomers?: boolean;
  canEditCustomers?: boolean;
  canDeleteCustomers?: boolean;
  canViewCustomerHistory?: boolean;

  // Users
  canViewUsers?: boolean;
  canAddUsers?: boolean;
  canEditUsers?: boolean;
  canDeleteUsers?: boolean;
  canManageRoles?: boolean;

  // Stores
  canViewStores?: boolean;
  canAddStores?: boolean;
  canEditStores?: boolean;
  canDeleteStores?: boolean;
  canManageStoreSettings?: boolean;

  // Barcodes
  canViewBarcodes?: boolean;
  canGenerateBarcodes?: boolean;
  canDeleteBarcodes?: boolean;
  canManageBarcodes?: boolean;

  // Reports & Analytics
  canViewReports?: boolean;
  canExportReports?: boolean;
  canViewAnalytics?: boolean;

  // System Settings
  canManageSettings?: boolean;
  canManagePaymentMethods?: boolean;
  canManageTaxSettings?: boolean;
  canManageReceiptSettings?: boolean;
  canViewSystemLogs?: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  roleId?: string;
  permissions?: Permissions;
  lastLogin?: string;
  profileImage?: string;
}

interface CartItem {
  productId: string;
  variantId?: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
}

interface Store {
  user: User | null;
  cart: CartItem[];
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  hasPermission: (permission: keyof Permissions) => boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateCartItem: (index: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

/**
 * Zustand store for application state
 *
 * NOTE: Authentication is now handled by Auth.js (NextAuth)
 * This store only manages user info and cart state
 * Tokens are managed by Auth.js session cookies
 */
export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      user: null,
      cart: [],

      setUser: (user) => set({ user }),

      clearAuth: () => {
        set({ user: null, cart: [] });
      },

      hasPermission: (permission: keyof Permissions) => {
        const { user } = get();
        if (!user) return false;

        // Super admin has all permissions
        if (user.role === "super_admin") return true;

        // Check if user has the specific permission
        return user.permissions?.[permission] === true;
      },

      addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),

      removeFromCart: (index) =>
        set((state) => ({
          cart: state.cart.filter((_, i) => i !== index),
        })),

      updateCartItem: (index, quantity) =>
        set((state) => ({
          cart: state.cart.map((item, i) =>
            i === index ? { ...item, quantity } : item
          ),
        })),

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce(
          (total, item) =>
            total + item.unitPrice * item.quantity - (item.discount || 0),
          0
        );
      },
    }),
    {
      name: "pos-storage",
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
