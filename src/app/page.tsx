import Link from "next/link";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { toProduct } from "@/lib/utils";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import Testimonials from "@/components/Testimonials";
import AnimatedSection from "@/components/AnimatedSection";
import { GridSkeleton } from "@/components/Skeletons";
import { ArrowRightIcon, LeafIcon } from "@/components/icons";
import type { Product as ProductType } from "@/types";

export const dynamic = "force-dynamic";

const STEPS = [
  ["01", "Picked at dawn", "Plants are selected from 40+ partner nurseries only on the morning they ship."],
  ["02", "Packed in eco-cocoons", "Breathable, plastic-free cocoons hold soil and roots firm for the journey."],
  ["03", "Shipped pan-India", "Temperature-aware courier routing to 27,000+ PIN codes across India."],
  ["04", "7-day care promise", "If your plant arrives unhappy, we replace it free. Botanists on call, always."],
];

export default async function HomePage() {
  let featured: ProductType[] = [];
  try {
    await dbConnect();
    const docs = await Product.find({ featured: true }).sort({ rating: -1 }).limit(8).lean();
    featured = docs.map(toProduct);
  } catch { /* DB not ready yet — show skeletons */ }

  return (
    <>
      <Hero />
      <Marquee />

      <section className="container-shop py-20">
        <AnimatedSection className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.25em] text-clay-600">Browse by mood</p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">Find your corner of green</h2>
          </div>
          <Link href="/products" className="flex items-center gap-2 text-sm font-semibold text-forest-700 hover:gap-3 transition-all">
            All plants <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </AnimatedSection>
        <CategoryGrid />
      </section>

      <section className="container-shop pb-20">
        <AnimatedSection className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.25em] text-clay-600">Loved right now</p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">Bestsellers this season</h2>
          </div>
        </AnimatedSection>
        {featured.length ? <ProductGrid products={featured} /> : <GridSkeleton n={8} />}
      </section>

      <section className="container-shop grid gap-12 pb-20 lg:grid-cols-[.9fr_1.1fr]">
        <AnimatedSection className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-bold uppercase tracking-[.25em] text-clay-600">The Upvan way</p>
          <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">From our nurseries to your balcony — <em className="italic text-forest-600">alive</em>, guaranteed.</h2>
          <LeafIcon className="mt-8 h-16 w-16 text-forest-200" />
        </AnimatedSection>
        <div>
          {STEPS.map(([n, title, body], i) => (
            <AnimatedSection key={n} delay={i * 0.08} className="flex gap-6 border-b border-forest-900/10 py-7 first:pt-0 last:border-0">
              <span className="font-display text-3xl text-clay-500/70">{n}</span>
              <div>
                <h3 className="font-display text-xl">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/60">{body}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <Testimonials />

      <section className="container-shop pt-20">
        <AnimatedSection className="leaf-texture relative overflow-hidden rounded-[2.5rem] bg-forest-900 px-8 py-16 text-center text-cream sm:py-20">
          <LeafIcon className="pointer-events-none absolute -left-16 -bottom-16 h-72 w-72 -rotate-12 text-cream/5" />
          <h2 className="mx-auto max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
            Every balcony deserves <em className="italic text-leaf">a forest</em>.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-cream/70">Start with one hardy friend. Free shipping on orders above ₹999, anywhere in India.</p>
          <Link href="/products" className="btn btn-clay mt-8 px-8 py-4 text-sm">Start growing</Link>
        </AnimatedSection>
      </section>
    </>
  );
}