import { Suspense } from "react";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { CATEGORIES, escapeRegex, toProduct } from "@/lib/utils";
import Filters from "@/components/Filters";
import ProductGrid from "@/components/ProductGrid";
import { LeafIcon } from "@/components/icons";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }): Promise<Metadata> {
  const sp = await searchParams;
  const cat = CATEGORIES.find((c) => c.id === sp.category);
  const title = cat ? `Buy ${cat.name} Plants Online India` : sp.q ? `Search “${sp.q}”` : "All Plants";
  return { title, description: `${title} — shop hand-nurtured plants with pan-India delivery at Upvan Nursery.` };
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  await dbConnect();

  const query: Record<string, unknown> = {};
  if (sp.category) query.category = sp.category;
  if (sp.q) {
    const rx = new RegExp(escapeRegex(sp.q), "i");
    query.$or = [{ name: rx }, { scientificName: rx }, { tags: rx }];
  }
  const price: Record<string, number> = {};
  if (sp.min) price.$gte = Number(sp.min);
  if (sp.max) price.$lte = Number(sp.max);
  if (Object.keys(price).length) query.price = price;
  if (sp.size) query["sizes.label"] = sp.size;
  if (sp.pot) query["pots.label"] = sp.pot;

  const sort: Record<string, 1 | -1> =
    sp.sort === "price_asc" ? { price: 1 } :
    sp.sort === "price_desc" ? { price: -1 } :
    sp.sort === "rating" ? { rating: -1 } :
    sp.sort === "newest" ? { createdAt: -1 } :
    { featured: -1, rating: -1 };

  const docs = await Product.find(query).sort(sort).limit(60).lean();
  const products = docs.map(toProduct);
  const cat = CATEGORIES.find((c) => c.id === sp.category);

  return (
    <div className="container-shop py-10">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[.25em] text-clay-600">The collection</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">{cat ? cat.name + " plants" : sp.q ? "Search results" : "All plants"}</h1>
        {cat && <p className="mt-2 text-ink/60">{cat.blurb}</p>}
      </header>

      <Suspense fallback={null}>
        <Filters count={products.length} />
      </Suspense>

      <div className="mt-10">
        {products.length ? (
          <ProductGrid products={products} />
        ) : (
          <div className="flex flex-col items-center py-24 text-center">
            <LeafIcon className="h-14 w-14 text-forest-200" />
            <h2 className="mt-4 font-display text-2xl">No plants match those filters</h2>
            <p className="mt-1 text-sm text-ink/55">Try clearing a filter or two — the jungle is big.</p>
          </div>
        )}
      </div>
    </div>
  );
}