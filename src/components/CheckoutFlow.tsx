"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cartSubtotal, useCart } from "@/store/cart";
import { useToasts } from "@/store/toasts";
import { FREE_SHIPPING_ABOVE, SHIPPING_FEE, inr } from "@/lib/utils";
import { INDIAN_STATES, pinToState } from "@/lib/pincodes";
import type { Address } from "@/types";
import { MapPinIcon, ShieldIcon } from "./icons";

const empty: Address = { fullName: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" };

export default function CheckoutFlow() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const items = useCart((s) => s.items);
  const subtotal = useCart(cartSubtotal);
  const clearCart = useCart((s) => s.clear);
  const toast = useToasts((s) => s.push);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState("new");
  const [form, setForm] = useState<Address>(empty);
  const [saveAddress, setSaveAddress] = useState(true);
  const [paying, setPaying] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (status === "authenticated")
      fetch("/api/addresses").then((r) => r.json()).then((d) => {
        const list = d.addresses ?? [];
        setAddresses(list);
        if (list.length) setSelectedId(list[0].id!);
      }).catch(() => {});
  }, [status]);

  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  const set = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onPincode = (v: string) => {
    const val = v.replace(/\D/g, "").slice(0, 6);
    setForm((f) => ({ ...f, pincode: val, state: val.length === 6 && pinToState(val) && !f.state ? pinToState(val)! : f.state }));
    if (val.length === 6 && pinToState(val)) setForm((f) => ({ ...f, pincode: val, state: pinToState(val)! }));
  };

  const address: Address | null = selectedId === "new" ? form : addresses.find((a) => a.id === selectedId) ?? form;

  function validate(a: Address | null) {
    if (!a) return "Select a delivery address";
    if (a.fullName.trim().length < 3) return "Enter the recipient's full name";
    if (!/^[6-9]\d{9}$/.test(a.phone)) return "Enter a valid 10-digit Indian mobile number";
    if (a.line1.trim().length < 5) return "Enter house/street address";
    if (a.city.trim().length < 2) return "Enter city";
    if (!a.state) return "Select state";
    if (!/^\d{6}$/.test(a.pincode)) return "Enter a valid 6-digit PIN code";
    return null;
  }

  function openRazorpay(data: any, addr: Address) {
    const RZP = (window as any).Razorpay;
    if (!RZP) { toast("Payment system is still loading — try again in a moment", "error"); setPaying(false); return; }

    const rzp = new RZP({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: "Upvan Nursery",
      description: "Plant order payment",
      order_id: data.orderId,
      prefill: { name: addr.fullName, email: session?.user?.email ?? "", contact: addr.phone },
      theme: { color: "#1d4830" },
      handler: async (resp: any) => {
        try {
          const vRes = await fetch("/api/checkout/verify", {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(resp),
          });
          const vData = await vRes.json();
          if (!vRes.ok) throw new Error(vData.error ?? "Payment verification failed");
          clearCart();
          router.push(`/order-success/${vData.orderId}`);
        } catch (e: any) {
          toast(e.message ?? "Verification failed — contact support with your payment ID", "error");
          setPaying(false);
        }
      },
      modal: { ondismiss: () => { toast("Payment cancelled — you can retry anytime", "error"); setPaying(false); } },
    });
    rzp.on("payment.failed", (resp: any) => {
      toast(resp?.error?.description ?? "Payment failed — please retry", "error");
      setPaying(false);
    });
    rzp.open();
  }

  async function pay() {
    const err = validate(address);
    if (err) { toast(err, "error"); return; }
    if (!session?.user) { router.push("/login?callbackUrl=/checkout"); return; }

    setPaying(true);
    try {
      if (selectedId === "new" && saveAddress) {
        const res = await fetch("/api/addresses", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(address),
        });
        if (res.ok) { const d = await res.json(); setAddresses(d.addresses ?? []); }
      }
      const createRes = await fetch("/api/checkout/create-order", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, sizeId: i.sizeId, potId: i.potId, qty: i.qty })),
          address,
        }),
      });
      const data = await createRes.json();
      if (!createRes.ok) throw new Error(data.error ?? "Could not create order");
      openRazorpay(data, address!);
    } catch (e: any) {
      toast(e.message ?? "Something went wrong", "error");
      setPaying(false);
    }
  }

  if (!mounted) return <div className="container-shop py-16"><div className="skeleton h-64 w-full" /></div>;

  if (!items.length)
    return (
      <div className="container-shop py-28 text-center">
        <h1 className="font-display text-3xl">Nothing to check out yet</h1>
        <Link href="/products" className="btn btn-primary mt-6 px-7 py-3.5 text-sm">Browse plants</Link>
      </div>
    );

  return (
    <div className="container-shop grid gap-10 py-12 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <h1 className="font-display text-4xl">Checkout</h1>
        <h2 className="mt-8 mb-4 flex items-center gap-2 font-display text-2xl"><MapPinIcon className="h-5 w-5 text-clay-500" /> Delivery address</h2>

        {addresses.length > 0 && (
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            {addresses.map((a) => (
              <button key={a.id} onClick={() => setSelectedId(a.id!)}
                className={`card p-4 text-left transition ${selectedId === a.id ? "border-forest-700 ring-2 ring-forest-600/30" : "hover:border-forest-900/30"}`}>
                <p className="text-xs font-bold uppercase tracking-wider text-forest-600">{a.label}{a.isDefault ? " · default" : ""}</p>
                <p className="mt-1 font-semibold">{a.fullName}</p>
                <p className="mt-0.5 text-sm text-ink/60">{a.line1}, {a.city}, {a.state} — {a.pincode}</p>
                <p className="text-sm text-ink/60">{a.phone}</p>
              </button>
            ))}
            <button onClick={() => setSelectedId("new")}
              className={`card flex items-center justify-center p-4 text-sm font-semibold text-forest-700 transition ${selectedId === "new" ? "border-forest-700 ring-2 ring-forest-600/30" : ""}`}>
              + Deliver to a new address
            </button>
          </div>
        )}

        {selectedId === "new" && (
          <div className="card grid gap-4 p-6 sm:grid-cols-2">
            <div><label className="label">Full name</label><input className="input" value={form.fullName} onChange={set("fullName")} placeholder="Priya Sharma" /></div>
            <div><label className="label">Mobile</label><input className="input" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))} placeholder="98765 43210" inputMode="numeric" /></div>
            <div className="sm:col-span-2"><label className="label">House / street</label><input className="input" value={form.line1} onChange={set("line1")} placeholder="Flat 402, Green Meadows, MG Road" /></div>
            <div className="sm:col-span-2"><label className="label">Landmark (optional)</label><input className="input" value={form.line2 ?? ""} onChange={set("line2")} placeholder="Near city park" /></div>
            <div><label className="label">PIN code</label><input className="input" value={form.pincode} onChange={(e) => onPincode(e.target.value)} placeholder="560001" inputMode="numeric" /></div>
            <div><label className="label">City</label><input className="input" value={form.city} onChange={set("city")} placeholder="Bengaluru" /></div>
            <div className="sm:col-span-2">
              <label className="label">State</label>
              <select className="input" value={form.state} onChange={set("state")}>
                <option value="">Select state…</option>
                {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
              {form.pincode.length === 6 && pinToState(form.pincode) && form.state === pinToState(form.pincode) && (
                <p className="mt-1 text-xs text-forest-600">Auto-detected from PIN ✓</p>
              )}
            </div>
            <label className="flex items-center gap-2 text-sm text-ink/70 sm:col-span-2">
              <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="h-4 w-4 accent-forest-700" />
              Save this address to my account
            </label>
          </div>
        )}
      </div>

      <aside className="h-fit lg:sticky lg:top-24">
        <div className="card p-6">
          <h2 className="font-display text-2xl">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((it) => (
              <li key={it.key} className="flex items-center gap-3">
                <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg">
                  <Image src={it.image} alt={it.name} fill sizes="48px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{it.name}</p>
                  <p className="text-xs text-ink/55">{it.sizeLabel} · {it.potLabel} × {it.qty}</p>
                </div>
                <span className="text-sm font-semibold">{inr(it.unitPrice * it.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-forest-900/10 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-ink/60">Subtotal</dt><dd className="font-semibold">{inr(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink/60">Shipping</dt><dd className="font-semibold">{shipping ? inr(shipping) : "FREE"}</dd></div>
            <div className="flex justify-between pt-2 text-base"><dt className="font-bold">To pay</dt><dd className="font-bold">{inr(total)}</dd></div>
          </dl>
          <button onClick={pay} disabled={paying} className="btn btn-clay mt-6 w-full px-6 py-4 text-sm">
            {paying ? "Processing…" : `Pay ${inr(total)} securely`}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-ink/45">
            <ShieldIcon className="h-3.5 w-3.5" /> 256-bit encrypted · Razorpay · UPI, Cards, NetBanking, Wallets
          </p>
        </div>
      </aside>
    </div>
  );
}