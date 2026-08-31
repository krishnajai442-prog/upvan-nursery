import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) { return clsx(inputs); }

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const FREE_SHIPPING_ABOVE = 999;
export const SHIPPING_FEE = 79;

export const discountPct = (price: number, mrp: number) => Math.round((1 - price / mrp) * 100);
export const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const CATEGORIES = [
  { id: "indoor",        name: "Indoor",          blurb: "Low-light lovers for every corner", image: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=900&q=80" },
  { id: "outdoor",       name: "Outdoor",         blurb: "Sun-drunk blooms for balconies",    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80" },
  { id: "succulents",    name: "Succulents",      blurb: "Sculptural, thirsty-for-nothing",   image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=900&q=80" },
  { id: "flowering",     name: "Flowering",       blurb: "Colour that keeps coming back",     image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80" },
  { id: "air-purifying", name: "Air-Purifying",   blurb: "NASA-approved fresh air machines",  image: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?auto=format&fit=crop&w=900&q=80" },
  { id: "herbs",         name: "Herbs & Edibles", blurb: "Grow your kitchen garden",          image: "https://images.unsplash.com/photo-1466781783364-36c955e42a7f?auto=format&fit=crop&w=1400&q=80" },
  { id: "fruit", name: "Fruit Trees", blurb: "Mango to lemon — grow your own",                image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=80" },
];

/** Strip Mongoose internals → serializable plain object for client components */
export function toProduct(p: any): any {
  return {
    id: String(p._id), slug: p.slug, name: p.name, scientificName: p.scientificName,
    description: p.description, category: p.category, images: p.images, price: p.price,
    mrp: p.mrp,
    sizes: (p.sizes ?? []).map((s: any) => ({ id: s.id, label: s.label, priceDelta: s.priceDelta })),
    pots: (p.pots ?? []).map((s: any) => ({ id: s.id, label: s.label, priceDelta: s.priceDelta })),
    care: p.care, stock: p.stock, featured: p.featured, rating: p.rating,
    reviewsCount: p.reviewsCount, tags: p.tags,
  };
}