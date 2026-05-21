"use client";

import { create } from "zustand";
import type { Product } from "@/data/products";

export type CartItem = {
  product: Product;
  quantity: number;
  size: string;
  color: string;
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, delta: number) => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (product, size, color) =>
    set((state) => {
      const existing = state.items.find(
        (i) => i.product.id === product.id && i.size === size && i.color === color
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i === existing ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { product, quantity: 1, size, color }] };
    }),

  removeItem: (productId, size, color) =>
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.product.id === productId && i.size === size && i.color === color)
      ),
    })),

  updateQuantity: (productId, size, color, delta) =>
    set((state) => ({
      items: state.items
        .map((i) =>
          i.product.id === productId && i.size === size && i.color === color
            ? { ...i, quantity: i.quantity + delta }
            : i
        )
        .filter((i) => i.quantity > 0),
    })),

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
}));
