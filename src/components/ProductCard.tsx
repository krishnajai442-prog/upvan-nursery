"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Product } from "@/types";
import { cn, discountPct, inr } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useToasts } from "@/store/toasts";
import { BagIcon, HeartIcon, StarIcon } from "./icons";

export default function ProductCard({ p }: { p: Product }) {
  const addItem = useCart((s) => s.addItem);
  const wished = useWishlist((s) => s.items.some((i) => i.productId === p.id));
  const toggleWish = useWishlist((s) => s.toggle);
  const toast = useToasts((s) => s.push);
  const [hover, setHover] = useState(false);

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (p.stock <= 0) return toast("This plant is out of stock", "error");
    addItem({
      productId: p.id, slug: p.slug, name: p.name, image: p.images[0],
      sizeId: p.sizes[0]?.id ?? "s", sizeLabel: p.sizes[0]?.label ?? "Standard",
      potId: p.pots[0]?.id ?? "nursery", potLabel: p.pots[0]?.label ?? "Nursery Pot",
      unitPrice: p.price + (p.sizes[0]?.priceDelta ?? 0) + (p.pots[0]?.priceDelta ?? 0),
      qty: 1, stock: p.stock,
    });
    toast(`${p.name} added to cart 🌱`);
  };

  return (
    <motion.article whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
      <Link href={`/products/${p.slug}`} className="group block"
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-cream">
          <Image src={p.images[0]} alt={p.name} fill sizes="(max-width:640px) 50vw, 25vw"
            className="object-cover transition duration-700 group-hover:scale-105" />
          {p.images[1] && (
            <Image src={p.images[1]} alt="" fill sizes="(max-width:640px) 50vw, 25vw"
              className={cn("object-cover transition duration-700 group-hover:scale-105",
                hover ? "opacity-100" : "opacity-0")} />
          )}
          {p.mrp > p.price && (
            <span className="absolute left-3 top-3 rounded-full bg-clay-500 px-2.5 py-1 text-[11px] font-bold text-white">
              −{discountPct(p.price, p.mrp)}%
            </span>
          )}
          {p.stock <= 10 && p.stock > 0 && (
            <span className="absolute left-3 top-11 rounded-full bg-sun/90 px-2.5 py-1 text-[11px] font-bold text-forest-950">
              Only {p.stock} left
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); toggleWish({ productId: p.id, slug: p.slug, name: p.name, image: p.images[0], price: p.price, mrp: p.mrp }); }}
            aria-label="Wishlist"
            className={cn("absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow transition hover:scale-110",
              wished ? "text-clay-500" : "text-ink/50")}>
            <HeartIcon className="h-4.5 w-4.5" fill={wished ? "currentColor" : "none"} />
          </button>
          <button onClick={quickAdd} aria-label="Add to cart"
            className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-forest-900 text-cream shadow-lg transition hover:scale-110 hover:bg-forest-700 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
            <BagIcon className="h-4.5 w-4.5" />
          </button>
        </div>
        <div className="mt-3 px-1">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-forest-600">{p.category.replace("-", " ")}</p>
          <h3 className="mt-0.5 font-display text-lg leading-snug">{p.name}</h3>
          <p className="text-xs italic text-ink/50">{p.scientificName}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="font-bold">{inr(p.price)}</span>
            {p.mrp > p.price && <span className="text-xs text-ink/40 line-through">{inr(p.mrp)}</span>}
            <span className="ml-auto flex items-center gap-1 text-xs text-ink/60">
              <StarIcon className="h-3.5 w-3.5 text-sun" /> {p.rating} <span className="text-ink/35">({p.reviewsCount})</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}