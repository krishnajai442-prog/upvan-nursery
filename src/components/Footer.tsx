"use client";
import Link from "next/link";
import { useState } from "react";
import { CATEGORIES } from "@/lib/utils";
import { useToasts } from "@/store/toasts";
import { LeafIcon } from "./icons";

export default function Footer() {
  const toast = useToasts((s) => s.push);
  const [email, setEmail] = useState("");

  return (
    <footer className="mt-24 bg-forest-950 text-cream">
      <div className="container-shop grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-cream text-forest-950"><LeafIcon className="h-5 w-5" /></span>
            <span className="font-display text-xl font-semibold">Upvan<span className="text-clay-500">.</span></span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-cream/70">
            A pan-India plant nursery. Hand-nurtured plants, breathable eco-cocoons,
            and doorstep delivery to 27,000+ PIN codes — from Srinagar to Kanyakumari.
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-cream/50">Shop</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/products" className="hover:text-leaf">All plants</Link></li>
            {CATEGORIES.slice(0, 4).map((c) => (
              <li key={c.id}><Link href={`/products?category=${c.id}`} className="hover:text-leaf">{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-cream/50">Help</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/orders" className="hover:text-leaf">Track your order</Link></li>
            <li><Link href="/cart" className="hover:text-leaf">Cart</Link></li>
            <li><Link href="/login" className="hover:text-leaf">Account</Link></li>
            <li><span className="text-cream/70">care@upvan.store</span></li>
            <li><span className="text-cream/70">+91 9508919693</span></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-cream/50">Growing tips, monthly</h4>
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (email) { toast("Welcome to the jungle 🌿 You're subscribed!"); setEmail(""); } }}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required
              placeholder="you@email.com"
              className="w-full rounded-full border border-cream/20 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-cream/40 focus:border-leaf" />
            <button className="btn btn-clay px-5 py-2.5 text-sm">Join</button>
          </form>
          <p className="mt-4 text-xs text-cream/50">UPI · Cards · NetBanking · Wallets — secured by Razorpay</p>
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/50">
        © 2026 Upvan Nursery · Grown with 🌱 in India
      </div>
    </footer>
  );
}