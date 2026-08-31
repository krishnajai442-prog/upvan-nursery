// src/app/wishlist/page.tsx
import WishlistView from "@/components/WishlistView";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Wishlist" };
export default function WishlistPage() { return <WishlistView />; }