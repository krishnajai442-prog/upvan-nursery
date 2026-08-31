import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishItem = { productId: string; slug: string; name: string; image: string; price: number; mrp: number };

export const useWishlist = create<{ items: WishItem[]; toggle: (p: WishItem) => void; remove: (id: string) => void }>()(
  persist(
    (set) => ({
      items: [],
      toggle: (p) =>
        set((s) => ({
          items: s.items.some((i) => i.productId === p.productId)
            ? s.items.filter((i) => i.productId !== p.productId)
            : [...s.items, p],
        })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.productId !== id) })),
    }),
    { name: "upvan-wishlist" }
  )
);