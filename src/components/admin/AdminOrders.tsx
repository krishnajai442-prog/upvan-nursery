"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn, inr } from "@/lib/utils";
import { useToasts } from "@/store/toasts";
import { waLink } from "@/lib/whatsapp";
import { CheckIcon, PackageIcon, TruckIcon } from "@/components/icons";

const statusChip: Record<string, string> = {
  PLACED: "bg-sun/15 text-[#8a6210]", SHIPPED: "bg-forest-100 text-forest-700",
  DELIVERED: "bg-forest-800 text-cream", CANCELLED: "bg-clay-100 text-clay-600",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<"ACTION" | "ALL" | "PLACED" | "SHIPPED" | "DELIVERED">("ACTION");
  const toast = useToasts((s) => s.push);
  const prevIds = useRef<Set<string>>(new Set());
  const loadedOnce = useRef(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/orders");
    const d = await res.json();
    if (!res.ok) return;
    const list: any[] = d.orders ?? [];

    // 🔔 Detect brand-new PLACED orders between polls
    if (loadedOnce.current) {
      const fresh = list.filter((o) => o.status === "PLACED" && !prevIds.current.has(o.id));
      for (const o of fresh) {
        toast(`🔔 New order #${o.id.slice(-6).toUpperCase()} — ${inr(o.total)}, ${o.shippingAddress.city}`);
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification("🌿 Upvan: new order!", {
            body: `#${o.id.slice(-6).toUpperCase()} · ${o.shippingAddress.fullName} · ${inr(o.total)}`,
          });
        }
      }
    }
    prevIds.current = new Set(list.map((o) => o.id));
    loadedOnce.current = true;
    setOrders(list);
  }, [toast]);

  useEffect(() => {
    load();
    const t = setInterval(load, 30_000); // poll every 30s
    return () => clearInterval(t);
  }, [load]);

  async function patch(id: string, body: Record<string, string>) {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    const d = await res.json();
    if (!res.ok) return toast(d.error ?? "Update failed", "error");
    setOrders((list) => list.map((o) => (o.id === id ? { ...o, ...d.order } : o)));
  }

  const confirmMessage = (o: any) =>
    `Hi ${o.shippingAddress.fullName}! 🌿 Your Upvan Nursery order #${o.id.slice(-6).toUpperCase()} (${inr(o.total)}) is ready to pack.\n\n` +
    `Please confirm so we can ship:\n${window.location.origin}/confirm-order/${o.id}?token=${o.confirmToken}\n\n— Team Upvan`;

  const filtered = orders.filter((o) => {
    if (filter === "ALL") return true;
    if (filter === "ACTION") return o.status !== "DELIVERED" && o.status !== "CANCELLED";
    return o.status === filter;
  });

  const counts = {
    pending: orders.filter((o) => o.confirmation === "PENDING" && o.status !== "CANCELLED").length,
    toShip: orders.filter((o) => o.status === "PLACED" && o.confirmation === "CONFIRMED").length,
    shipped: orders.filter((o) => o.status === "SHIPPED").length,
    deliveredToday: orders.filter((o) => o.status === "DELIVERED" && new Date(o.updatedAt).toDateString() === new Date().toDateString()).length,
  };

  return (
    <div>
      {/* Summary strip */}
      <div className="mb-4 grid grid-cols-4 gap-2 text-center">
        {[["Awaiting confirm", counts.pending], ["To pack", counts.toShip], ["Shipped", counts.shipped], ["Delivered today", counts.deliveredToday]].map(([l, v]) => (
          <div key={l as string} className="card px-2 py-3">
            <p className={cn("font-display text-2xl", (v as number) > 0 && l !== "Delivered today" && "text-clay-600")}>{v}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink/45">{l}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {(["ACTION", "ALL", "PLACED", "SHIPPED", "DELIVERED"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn("shrink-0 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition",
              filter === f ? "bg-forest-900 text-cream" : "bg-forest-900/5 text-ink/60")}>
            {f === "ACTION" ? "Needs action" : f}
          </button>
        ))}
        {typeof Notification !== "undefined" && Notification.permission !== "granted" && (
          <button onClick={() => Notification.requestPermission()}
            className="shrink-0 rounded-full bg-sun/20 px-4 py-1.5 text-xs font-bold text-[#8a6210]">
            🔔 Enable alerts
          </button>
        )}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 && <p className="py-16 text-center text-ink/50">No orders here 🌵</p>}
        {filtered.map((o) => (
          <div key={o.id} className="card p-4">
            {/* Header row */}
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display text-lg">#{o.id.slice(-6).toUpperCase()}</p>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusChip[o.status]}`}>{o.status}</span>
              {o.confirmation === "PENDING" && o.status !== "CANCELLED" && (
                <span className="rounded-full bg-clay-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">⏳ Awaiting confirmation</span>
              )}
              {o.confirmation === "CONFIRMED" && (
                <span className="rounded-full bg-forest-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest-700">✓ Confirmed</span>
              )}
              <span className="ml-auto text-sm font-bold">{inr(o.total)}</span>
            </div>

            {/* Customer + items */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex -space-x-2">
                {o.items.slice(0, 3).map((it: any, i: number) => (
                  <div key={i} className="relative h-12 w-10 overflow-hidden rounded-lg border-2 border-white">
                    <Image src={it.image} alt={it.name} fill sizes="40px" className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="min-w-0 flex-1 text-sm">
                <p className="truncate font-semibold">{o.shippingAddress.fullName} · {o.shippingAddress.city} ({o.shippingAddress.pincode})</p>
                <p className="text-xs text-ink/50">{o.items.length} item{o.items.length > 1 ? "s" : ""} · {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
              </div>
            </div>

            {/* Contact row — one-tap call & WhatsApp on phone */}
            <div className="mt-3 flex gap-2">
              <a href={`tel:${o.shippingAddress.phone}`} className="btn btn-ghost flex-1 py-2.5 text-xs">📞 Call customer</a>
              <a href={waLink(o.shippingAddress.phone, confirmMessage(o))} target="_blank" rel="noopener"
                className="btn flex-1 bg-[#25D366] py-2.5 text-xs text-white">💬 WhatsApp confirm link</a>
            </div>

            {/* Action buttons per stage */}
            <div className="mt-3 space-y-2">
              {o.confirmation === "PENDING" && o.status !== "CANCELLED" && (
                <button onClick={() => { patch(o.id, { confirmation: "CONFIRMED" }); toast("Marked confirmed ✓"); }}
                  className="btn btn-ghost w-full border-dashed py-3 text-xs">
                  Customer confirmed on call — mark as Confirmed
                </button>
              )}
              {o.status === "PLACED" && o.confirmation === "CONFIRMED" && (
                <button onClick={() => { patch(o.id, { status: "SHIPPED" }); toast("Marked as shipped 🚚"); }}
                  className="btn btn-primary w-full py-3.5 text-sm"><PackageIcon className="h-4 w-4" /> Packed & shipped</button>
              )}
              {o.status === "PLACED" && o.confirmation === "PENDING" && (
                <p className="text-center text-xs text-ink/45">Wait for customer confirmation before packing</p>
              )}
              {o.status === "SHIPPED" && (
                <button onClick={() => { patch(o.id, { status: "DELIVERED" }); toast("Delivered 🎉"); }}
                  className="btn btn-clay w-full py-3.5 text-sm"><TruckIcon className="h-4 w-4" /> Mark delivered</button>
              )}
              {o.status === "DELIVERED" && (
                <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-forest-700">
                  <CheckIcon className="h-4 w-4" /> Delivered {new Date(o.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}