import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Permissions {
  // POS & Sales
  canViewSales?: boolean;
  canCreateSales?: boolean;
  canEditSales?: boolean;
  canDeleteSales?: boolean;
  canProcessRefunds?: boolean;
  canViewSalesReports?: boolean;

  // Products
  canViewProducts?: boolean;
  canAddProducts?: boolean;
  canEditProducts?: boolean;
  canDeleteProducts?: boolean;
  canManageCategories?: boolean;
  canViewInventory?: boolean;
  canManageInventory?: boolean;
  canAdjustStock?: boolean;

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

  // Reports & Analytics
  canViewReports?: boolean;
  canExportReports?: boolean;
  canViewAnalytics?: boolean;
  canViewDashboard?: boolean;

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
  accessToken: string | null;
  refreshToken: string | null;
  cart: CartItem[];
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  hasPermission: (permission: keyof Permissions) => boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateCartItem: (index: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      cart: [],

      setUser: (user) => set({ user }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      clearAuth: () => {
        // Clear tokens from localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
        set({ user: null, accessToken: null, refreshToken: null, cart: [] });
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
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
