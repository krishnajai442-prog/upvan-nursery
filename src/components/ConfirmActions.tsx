"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckIcon, XIcon } from "./icons";

export default function ConfirmActions({ orderId, token, confirmation, status }: {
  orderId: string; token: string; confirmation: string; status: string;
}) {
  const [state, setState] = useState(confirmation);
  const [orderStatus, setOrderStatus] = useState(status);
  const [busy, setBusy] = useState<"" | "confirm" | "cancel">("");

  async function act(action: "confirm" | "cancel") {
    setBusy(action);
    const res = await fetch("/api/confirm-order", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, token, action }),
    });
    const d = await res.json();
    setBusy("");
    if (!res.ok) return alert(d.error ?? "Something went wrong");
    setState(d.confirmation); setOrderStatus(d.status);
  }

  if (state === "CONFIRMED")
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card bg-forest-50 p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-forest-800 text-cream"><CheckIcon className="h-7 w-7" /></span>
        <h2 className="mt-4 font-display text-2xl">Order confirmed! 🌿</h2>
        <p className="mt-2 text-sm text-ink/60">We're packing your plants in their eco-cocoons. Track progress anytime.</p>
      </motion.div>
    );
  if (state === "CANCELLED" || orderStatus === "CANCELLED")
    return (
      <div className="card bg-clay-100/50 p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-clay-500 text-white"><XIcon className="h-7 w-7" /></span>
        <h2 className="mt-4 font-display text-2xl">Order cancelled</h2>
        <p className="mt-2 text-sm text-ink/60">Your refund will be processed in 5–7 working days. We hope to see you again!</p>
      </div>
    );

  return (
    <div className="space-y-3">
      <button onClick={() => act("confirm")} disabled={!!busy} className="btn btn-clay w-full py-4 text-base">
        {busy === "confirm" ? "Confirming…" : "✅ Yes, confirm my order"}
      </button>
      <button onClick={() => act("cancel")} disabled={!!busy} className="btn btn-ghost w-full py-4 text-base">
        {busy === "cancel" ? "Cancelling…" : "Cancel this order"}
      </button>
      <p className="text-center text-xs text-ink/45">We start packing only after your confirmation.</p>
    </div>
  );
}