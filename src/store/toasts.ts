import { create } from "zustand";

type Toast = { id: number; msg: string; type: "success" | "error" };

export const useToasts = create<{
  toasts: Toast[];
  push: (msg: string, type?: "success" | "error") => void;
  dismiss: (id: number) => void;
}>((set) => ({
  toasts: [],
  push: (msg, type = "success") => {
    const id = Date.now() + Math.random();
    set((s) => ({ toasts: [...s.toasts, { id, msg, type }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3400);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));