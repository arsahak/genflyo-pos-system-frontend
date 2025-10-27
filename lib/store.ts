import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
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

      clearAuth: () =>
        set({ user: null, accessToken: null, refreshToken: null }),

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
