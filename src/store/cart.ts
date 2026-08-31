import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  key: string; productId: string; slug: string; name: string; image: string;
  sizeId: string; sizeLabel: string; potId: string; potLabel: string;
  unitPrice: number; qty: number; stock: number;
};

type CartState = {
  items: CartItem[];
  bump: number; // increments on add → triggers badge bounce
  addItem: (i: Omit<CartItem, "key">) => void;
  updateQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      bump: 0,
      addItem: (i) =>
        set((s) => {
          const key = `${i.productId}:${i.sizeId}:${i.potId}`;
          const exists = s.items.find((x) => x.key === key);
          const items = exists
            ? s.items.map((x) => (x.key === key ? { ...x, qty: Math.min(x.qty + i.qty, i.stock) } : x))
            : [...s.items, { ...i, key, qty: Math.min(i.qty, i.stock) }];
          return { items, bump: s.bump + 1 };
        }),
      updateQty: (key, qty) =>
        set((s) => ({ items: s.items.map((x) => (x.key === key ? { ...x, qty: Math.max(1, Math.min(qty, x.stock)) } : x)) })),
      removeItem: (key) => set((s) => ({ items: s.items.filter((x) => x.key !== key) })),
      clear: () => set((s) => ({ items: [] })),
    }),
    { name: "upvan-cart" }
  )
);

export const cartCount = (s: CartState) => s.items.reduce((n, i) => n + i.qty, 0);
export const cartSubtotal = (s: CartState) => s.items.reduce((n, i) => n + i.unitPrice * i.qty, 0);