import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { toProduct } from "@/lib/utils";
import Gallery from "@/components/Gallery";
import AddToCartPanel from "@/components/AddToCartPanel";
import ProductGrid from "@/components/ProductGrid";
import AnimatedSection from "@/components/AnimatedSection";
import { DropletIcon, StarIcon, SunIcon, ThermometerIcon, WindIcon } from "@/components/icons";
import type { Metadata } from "next";
import Review from "@/models/Review";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Reviews from "@/components/Reviews";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

async function getProduct(slug: string) {
  await dbConnect();
  const doc = await Product.findOne({ slug }).lean();
  return doc ? toProduct(doc) : null;
}

export async function generateMetadata({ params }: Ctx): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  if (!p) return { title: "Plant not found" };
  return {
    title: `${p.name} (${p.scientificName}) — Buy Online`,
    description: p.description,
    openGraph: { title: `${p.name} · Upvan Nursery`, description: p.description, images: [{ url: p.images[0], width: 900, height: 1125 }] },
  };
}

export default async function ProductDetailPage({ params }: Ctx) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();

  await dbConnect();
  const relatedDocs = await Product.find({ category: p.category, _id: { $ne: p.id } }).limit(4).lean();
  const related = relatedDocs.map(toProduct);

    const reviewDocs = await Review.find({ product: p.id }).sort({ createdAt: -1 }).limit(30).lean();
  const reviews = reviewDocs.map((r: any) => ({
    id: String(r._id), name: r.name, rating: r.rating, text: r.text, verified: r.verified, createdAt: r.createdAt,
  }));
  const session = await getServerSession(authOptions);
  const hasPurchased = session?.user?.id
    ? !!(await Order.exists({ user: session.user.id, "items.product": p.id, status: { $ne: "CANCELLED" } }))
    : false;

  const care = [
    [SunIcon, "Light", p.care.light], [DropletIcon, "Water", p.care.water],
    [ThermometerIcon, "Temperature", p.care.temperature], [WindIcon, "Humidity", p.care.humidity],
  ] as const;

  return (
    <div className="container-shop py-10">
      <nav className="mb-6 text-sm text-ink/50">
        <a href="/" className="hover:text-forest-700">Home</a> / <a href="/products" className="hover:text-forest-700">Plants</a> / <span className="text-ink">{p.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <Gallery images={p.images} name={p.name} />
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-clay-600">{p.category.replace("-", " ")}</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">{p.name}</h1>
          <p className="mt-1 text-lg italic text-ink/50">{p.scientificName}</p>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="flex text-sun">{Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} className="h-4 w-4" filled={i < Math.round(p.rating)} />)}</span>
            <span className="font-semibold">{p.rating}</span>
            <span className="text-ink/45">· {p.reviewsCount} reviews</span>
          </div>

          <p className="mt-5 leading-relaxed text-ink/70">{p.description}</p>

          <div className="mt-8">
            <AddToCartPanel p={p} />
          </div>

          <div className="mt-10">
            <h2 className="mb-4 font-display text-xl">Care, made simple</h2>
            <div className="grid grid-cols-2 gap-3">
              {care.map(([Icon, label, value]) => (
                <div key={label} className="card px-4 py-3.5">
                  <div className="flex items-center gap-2 text-forest-700"><Icon className="h-4.5 w-4.5" /><span className="text-xs font-bold uppercase tracking-wider">{label}</span></div>
                  <p className="mt-1 text-sm text-ink/70">{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-ink/60">Difficulty: <b>{p.care.difficulty}</b></p>
          </div>

          <details className="group mt-8 border-t border-forest-900/10 pt-4">
            <summary className="cursor-pointer list-none font-display text-lg">Shipping & the 7-day promise</summary>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              Ships within 24 hours in a breathable eco-cocoon. If your plant arrives damaged or wilts within 7 days,
              we replace it free — just send us a photo. Delivery across 27,000+ Indian PIN codes.
            </p>
          </details>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <AnimatedSection className="mb-8">
            <h2 className="font-display text-3xl sm:text-4xl">Grows well with…</h2>
          </AnimatedSection>
          <ProductGrid products={related} />
        </section>
      )}
        <section className="mt-24">
        <AnimatedSection>
          <Reviews productId={p.id} reviews={reviews} loggedIn={!!session?.user} hasPurchased={hasPurchased} />
        </AnimatedSection>
      </section>
    </div>
  );
}