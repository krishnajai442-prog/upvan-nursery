"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cartCount, useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useMounted } from "@/lib/hooks";
import { BagIcon, HeartIcon, LeafIcon, MenuIcon, PackageIcon, SearchIcon, UserIcon, XIcon } from "./icons";

const NAV = [
  { href: "/products", label: "All Plants" },
  { href: "/products?category=indoor", label: "Indoor" },
  { href: "/products?category=outdoor", label: "Outdoor" },
  { href: "/products?category=succulents", label: "Succulents" },
  { href: "/products?category=flowering", label: "Flowering" },
];

export default function Navbar() {
  const mounted = useMounted();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const count = useCart(cartCount);
  const bump = useCart((s) => s.bump);
  const wishCount = useWishlist((s) => s.items.length);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => { setOpen(false); setMenu(false); }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-forest-900/10 bg-yellow/95 backdrop-blur-sm">
      <div className="container-shop flex h-16 items-center gap-4">
        <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Menu">
          <MenuIcon className="h-6 w-6" />
        </button>

        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-forest-900 text-cream">
            <LeafIcon className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">Upvan<span className="text-clay-500">.</span></span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link key={n.label} href={n.href}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-ink/70 transition hover:bg-forest-900/5 hover:text-ink">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <form
            className="relative hidden md:block"
            onSubmit={(e) => { e.preventDefault(); router.push(`/products?q=${encodeURIComponent(q)}`); }}
          >
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search plants…"
              className="w-44 rounded-full border border-forest-900/15 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:w-56 focus:border-forest-600" />
          </form>

          <Link href="/wishlist" className="relative rounded-full p-2 transition hover:bg-forest-900/5" aria-label="Wishlist">
            <HeartIcon className="h-5 w-5" />
            {mounted && wishCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-forest-600 px-1 text-[10px] font-bold text-white">{wishCount}</span>
            )}
          </Link>

          <Link href="/cart" className="relative rounded-full p-2 transition hover:bg-forest-900/5" aria-label="Cart">
            <BagIcon className="h-5 w-5" />
            {mounted && count > 0 && (
              <motion.span key={bump}
                initial={{ scale: 0.4 }}
                animate={{ scale: [0.4, 1.35, 1] }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-clay-500 px-1 text-[10px] font-bold text-white">
                {count}
              </motion.span>
            )}
          </Link>

          {session?.user ? (
            <div className="relative">
              <button onClick={() => setMenu((v) => !v)} className="flex items-center gap-1.5 rounded-full p-1.5 transition hover:bg-forest-900/5">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-forest-100 text-xs font-bold text-forest-800">
                  {session.user.name?.[0]?.toUpperCase()}
                </span>
              </button>
              <AnimatePresence>
                {menu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenu(false)} />
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-forest-900/10 bg-white p-1.5 shadow-xl">
                      <p className="truncate px-3 py-2 text-xs text-ink/50">{session.user.email}</p>
                      <Link href="/orders" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-forest-50"><PackageIcon className="h-4 w-4" /> My orders</Link>
                      <Link href="/wishlist" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-forest-50"><HeartIcon className="h-4 w-4" /> Wishlist</Link>
                      <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full rounded-xl px-3 py-2 text-left text-sm text-clay-600 hover:bg-clay-100/60">Sign out</button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/login" className="hidden items-center gap-1.5 rounded-full border border-forest-900/15 px-3.5 py-2 text-sm font-semibold transition hover:bg-forest-900/5 sm:flex">
              <UserIcon className="h-4 w-4" /> Login
            </Link>
          )}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.28 }}
            className="fixed inset-0 z-[60] w-80 bg-paper p-6 shadow-2xl lg:hidden">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-xl font-semibold">Upvan<span className="text-clay-500">.</span></span>
              <button onClick={() => setOpen(false)}><XIcon className="h-6 w-6" /></button>
            </div>
            <form className="relative mb-6" onSubmit={(e) => { e.preventDefault(); router.push(`/products?q=${encodeURIComponent(q)}`); }}>
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search plants…" className="input pl-9" />
            </form>
            <nav className="flex flex-col gap-1">
              {NAV.map((n) => (
                <Link key={n.label} href={n.href} className="rounded-xl px-3 py-2.5 font-display text-lg hover:bg-forest-50">{n.label}</Link>
              ))}
              <Link href="/orders" className="rounded-xl px-3 py-2.5 font-display text-lg hover:bg-yellow-50">My Orders</Link>
              {!session?.user && <Link href="/login" className="btn btn-primary mt-4 px-5 py-3 text-sm">Login / Sign up</Link>}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}