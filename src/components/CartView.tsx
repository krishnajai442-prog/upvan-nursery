"use client";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cartSubtotal, useCart } from "@/store/cart";
import { useMounted } from "@/lib/hooks";
import { FREE_SHIPPING_ABOVE, SHIPPING_FEE, inr } from "@/lib/utils";
import { MinusIcon, PlusIcon, TrashIcon, LeafIcon } from "./icons";

export default function CartView() {
  const mounted = useMounted();
  const items = useCart((s) => s.items);
  const subtotal = useCart(cartSubtotal);
  const updateQty = useCart((s) => s.updateQty);
  const removeItem = useCart((s) => s.removeItem);

  if (!mounted) return <div className="container-shop py-16"><div className="skeleton h-40 w-full" /></div>;

  const shipping = subtotal >= FREE_SHIPPING_ABOVE || subtotal === 0 ? 0 : SHIPPING_FEE;
  const remaining = Math.max(0, FREE_SHIPPING_ABOVE - subtotal);

  if (!items.length)
    return (
      <div className="container-shop flex flex-col items-center py-28 text-center">
        <LeafIcon className="h-16 w-16 text-forest-200" />
        <h1 className="mt-5 font-display text-3xl">Your cart is feeling empty</h1>
        <p className="mt-2 text-ink/55">Every jungle starts with a single pot.</p>
        <Link href="/products" className="btn btn-clay mt-6 px-7 py-3.5 text-sm">Browse plants</Link>
      </div>
    );

  return (
    <div className="container-shop grid gap-10 py-12 lg:grid-cols-[1.6fr_1fr]">
      <div>
        <h1 className="mb-8 font-display text-4xl">Your cart</h1>
        <ul className="space-y-4">
          <AnimatePresence initial={false}>
            {items.map((it) => (
              <motion.li key={it.key} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.3 }}
                className="card flex gap-4 p-4">
                <Link href={`/products/${it.slug}`} className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl">
                  <Image src={it.image} alt={it.name} fill sizes="96px" className="object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link href={`/products/${it.slug}`} className="font-display text-lg leading-tight hover:text-forest-700">{it.name}</Link>
                      <p className="mt-0.5 text-xs text-ink/55">{it.sizeLabel} · {it.potLabel}</p>
                    </div>
                    <button onClick={() => removeItem(it.key)} className="rounded-full p-2 text-ink/40 transition hover:bg-clay-100 hover:text-clay-600" aria-label="Remove">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-forest-900/15">
                      <button className="p-2" onClick={() => updateQty(it.key, it.qty - 1)}><MinusIcon className="h-3.5 w-3.5" /></button>
                      <span className="w-7 text-center text-sm font-bold">{it.qty}</span>
                      <button className="p-2" onClick={() => updateQty(it.key, it.qty + 1)}><PlusIcon className="h-3.5 w-3.5" /></button>
                    </div>
                    <p className="font-bold">{inr(it.unitPrice * it.qty)}</p>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <aside className="h-fit lg:sticky lg:top-24">
        <div className="card p-6">
          <h2 className="font-display text-2xl">Summary</h2>
          {remaining > 0 ? (
            <p className="mt-2 text-xs font-semibold text-clay-600">Add {inr(remaining)} more for FREE shipping 🚚</p>
          ) : (
            <p className="mt-2 text-xs font-semibold text-forest-600">You've unlocked FREE shipping 🎉</p>
          )}
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-forest-100">
            <motion.div className="h-full rounded-full bg-leaf"
              animate={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_ABOVE) * 100)}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }} />
          </div>
          <dl className="mt-6 space-y-2.5 text-sm">
            <div className="flex justify-between"><dt className="text-ink/60">Subtotal</dt><dd className="font-semibold">{inr(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink/60">Shipping</dt><dd className="font-semibold">{shipping ? inr(shipping) : "FREE"}</dd></div>
            <div className="flex justify-between border-t border-forest-900/10 pt-3 text-base"><dt className="font-bold">Total</dt><dd className="font-bold">{inr(subtotal + shipping)}</dd></div>
          </dl>
          <Link href="/checkout" className="btn btn-clay mt-6 w-full px-6 py-4 text-sm">Proceed to checkout</Link>
          <p className="mt-3 text-center text-[11px] text-ink/45">Secure payment via Razorpay · UPI, Cards, NetBanking</p>
        </div>
      </aside>
    </div>
  );
}