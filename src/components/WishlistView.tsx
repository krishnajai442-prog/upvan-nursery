// src/components/WishlistView.tsx
"use client";
import Link from "next/link";
import { useWishlist } from "@/store/wishlist";
import { useMounted } from "@/lib/hooks";
import { inr } from "@/lib/utils";
import ProductCard from "./ProductCard";
import type { Product } from "@/types";

export default function WishlistView() {
  const mounted = useMounted();
  const items = useWishlist((s) => s.items);
  if (!mounted) return <div className="container-shop py-16"><div className="skeleton h-40 w-full" /></div>;

  return (
    <div className="container-shop py-12">
      <h1 className="mb-8 font-display text-4xl">Your wishlist</h1>
      {items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-ink/55">Tap the ♡ on any plant to save it here.</p>
          <Link href="/products" className="btn btn-primary mt-6 px-7 py-3.5 text-sm">Explore plants</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
          {items.map((w) => (
            <ProductCard key={w.productId} p={{
              id: w.productId, slug: w.slug, name: w.name, scientificName: "", description: "",
              category: "", images: [w.image], price: w.price, mrp: w.mrp,
              sizes: [{ id: "s", label: "Standard", priceDelta: 0 }],
              pots: [{ id: "nursery", label: "Nursery Pot", priceDelta: 0 }],
              care: { light: "", water: "", temperature: "", humidity: "", difficulty: "" },
              stock: 99, featured: false, rating: 0, reviewsCount: 0, tags: [],
            } as Product} />
          ))}
        </div>
      )}
    </div>
  );
}