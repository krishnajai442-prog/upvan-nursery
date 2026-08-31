"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useToasts } from "@/store/toasts";
import { CheckIcon, XIcon } from "./icons";

export default function Toaster() {
  const { toasts, dismiss } = useToasts();
  return (
    <div className="fixed bottom-5 left-1/2 z-[90] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            onClick={() => dismiss(t.id)}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className={`flex items-center gap-2.5 rounded-full px-4 py-3 text-left text-sm font-medium text-white shadow-xl ${
              t.type === "error" ? "bg-clay-600" : "bg-forest-900"
            }`}
          >
            <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${t.type === "error" ? "bg-white/20" : "bg-leaf"}`}>
              {t.type === "error" ? <XIcon className="h-3 w-3" /> : <CheckIcon className="h-3 w-3" />}
            </span>
            {t.msg}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}