"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { inr } from "@/lib/utils";
import { CheckIcon, PackageIcon, TruckIcon } from "./icons";
import { useState, useEffect } from "react";






const STEPS = [["PLACED", PackageIcon], ["SHIPPED", TruckIcon], ["DELIVERED", CheckIcon]] as const;

export default function OrderDetails({ order, celebrate = false }: { order: any; celebrate?: boolean }) {
  const [liveStatus, setLiveStatus] = useState(order.status);
  const [liveConfirm, setLiveConfirm] = useState(order.confirmation);

useEffect(() => {
  const t = setInterval(async () => {
    try {
      const res = await fetch(`/api/my-orders/${order.id}`);
      if (res.ok) {
        const d = await res.json();
        setLiveStatus(d.status);
        setLiveConfirm(d.confirmation);
      }
    } catch {}
  }, 12_000); // refresh every 12s
  return () => clearInterval(t);
}, [order.id]);
  const stepIndex = liveStatus === "DELIVERED" ? 2 : liveStatus === "SHIPPED" ? 1 : 0;

  return (
    <div className="container-shop max-w-3xl py-12">
      {celebrate && (
        <div className="mb-10 text-center">
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
            className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-forest-800 text-cream shadow-xl">
            <motion.span initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}>
              <CheckIcon className="h-9 w-9" />
            </motion.span>
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mt-6 font-display text-4xl sm:text-5xl">Your plants are on the way! 🌱</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-3 text-ink/60">
            A confirmation email is heading to your inbox. Order <b>#{order.id.slice(-6).toUpperCase()}</b>
          </motion.p>
        </div>
      )}

      {liveConfirm === "PENDING" && liveStatus !== "CANCELLED" && (
  <div className="mb-6 rounded-2xl bg-sun/15 p-4 text-center text-sm font-semibold text-[#8a6210]">
    ⏳ Please confirm your order from the link sent to your WhatsApp/email so we can start packing.
  </div>
)}
<p className="mb-4 flex items-center justify-center gap-1.5 text-xs text-ink/45">
  <span className="relative flex h-2 w-2"><span className="absolute h-full w-full animate-ping rounded-full bg-leaf opacity-60" /><span className="relative h-2 w-2 rounded-full bg-leaf" /></span>
  Status updates automatically
</p>

      <div className="mb-8 flex items-center justify-between">
        {STEPS.map(([label, Icon], i) => (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span className={`grid h-10 w-10 place-items-center rounded-full border-2 transition ${i <= stepIndex ? "border-forest-700 bg-forest-700 text-cream" : "border-forest-900/15 text-ink/30"}`}>
                <Icon className="h-4.5 w-4.5" />
              </span>
              <span className={`text-[11px] font-bold uppercase tracking-wider ${i <= stepIndex ? "text-forest-700" : "text-ink/35"}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`mx-2 mb-5 h-0.5 flex-1 ${i < stepIndex ? "bg-forest-700" : "bg-forest-900/10"}`} />}
          </div>
        ))}
      </div>

      <div className="card p-6">
        <ul className="space-y-4">
          {order.items.map((it: any, i: number) => (
            <li key={i} className="flex items-center gap-4">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl"><Image src={it.image} alt={it.name} fill sizes="64px" className="object-cover" /></div>
              <div className="flex-1">
                <p className="font-display text-lg">{it.name}</p>
                <p className="text-xs text-ink/55">{it.sizeLabel} · {it.potLabel} × {it.qty}</p>
              </div>
              <span className="font-semibold">{inr(it.unitPrice * it.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 border-t border-forest-900/10 pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-ink/60">Subtotal</dt><dd>{inr(order.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-ink/60">Shipping</dt><dd>{order.shipping ? inr(order.shipping) : "FREE"}</dd></div>
          <div className="flex justify-between text-base font-bold"><dt>Total paid</dt><dd>{inr(order.total)}</dd></div>
        </dl>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="card p-5 text-sm">
          <p className="label">Delivering to</p>
          <p className="font-semibold">{order.shippingAddress.fullName}</p>
          <p className="mt-1 text-ink/65">{order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}<br />{order.shippingAddress.phone}</p>
        </div>
        <div className="card p-5 text-sm">
          <p className="label">Payment</p>
          <p className="font-semibold text-forest-700">Paid ✓</p>
          <p className="mt-1 text-ink/65">Razorpay ID: <span className="font-mono text-xs">{order.payment.razorpayPaymentId}</span><br />
            Placed {new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
        </div>
      </div>
    </div>
  );
}