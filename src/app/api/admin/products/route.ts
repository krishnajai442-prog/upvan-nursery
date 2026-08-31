import { NextResponse } from "next/server";
import { getAdminSession, normalizeOptions } from "@/lib/admin";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/[\s_-]+/g, "-");

export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await dbConnect();
  const docs = await Product.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ products: docs.map((d: any) => ({ ...d, id: String(d._id) })) });
}

export async function POST(req: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json().catch(() => ({}));

  if (!b.name || !b.category || !Number.isFinite(Number(b.price)) || Number(b.price) <= 0 ||
      !Array.isArray(b.images) || !b.images.length)
    return NextResponse.json({ error: "Name, category, price and at least one photo are required." }, { status: 400 });

  await dbConnect();
  const base = slugify(String(b.name));
  let slug = base, n = 2;
  while (await Product.exists({ slug })) slug = `${base}-${n++}`;

  const doc = await Product.create({
    slug,
    name: b.name,
    scientificName: b.scientificName ?? "",
    description: b.description ?? "",
    category: b.category,
    images: b.images.map(String),
    price: Number(b.price),
    mrp: Math.max(Number(b.mrp) || Number(b.price), Number(b.price)),
    sizes: normalizeOptions(b.sizes, "s", "Standard"),
    pots: normalizeOptions(b.pots, "nursery", "Nursery Pot"),
    care: {
      light: b.care?.light ?? "", water: b.care?.water ?? "",
      temperature: b.care?.temperature ?? "", humidity: b.care?.humidity ?? "",
      difficulty: b.care?.difficulty ?? "Easy",
    },
    stock: Math.max(0, Number(b.stock) || 0),
    featured: !!b.featured,
    rating: Number(b.rating) || 4.5,
    reviewsCount: Number(b.reviewsCount) || 0,
    tags: Array.isArray(b.tags) ? b.tags : [],
  });
  return NextResponse.json({ product: { ...doc.toObject(), id: String(doc._id) } }, { status: 201 });
}