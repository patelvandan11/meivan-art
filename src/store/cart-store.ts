import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

interface CartStore {
  items: { product: Product; quantity: number }[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        if (!product || !product.id) return;
        const qty = Math.max(1, Number(quantity) || 1);
        set((state) => {
          const existing = state.items.find(
            (i) => i.product.id === product.id || (i.product.slug && i.product.slug === product.slug)
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id || (i.product.slug && i.product.slug === product.slug)
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity: qty }] };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(
            (i) => i.product.id !== productId && i.product.slug !== productId
          ),
        }));
      },
      updateQuantity: (productId, quantity) => {
        const qty = Number(quantity);
        if (isNaN(qty) || qty <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId || i.product.slug === productId
              ? { ...i, quantity: qty }
              : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotal: () =>
        get().items.reduce(
          (sum, i) => sum + (Number(i.product.price) || 0) * (Number(i.quantity) || 0),
          0
        ),
      getItemCount: () =>
        get().items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0),
    }),
    { name: "artisan-haven-cart" }
  )
);
