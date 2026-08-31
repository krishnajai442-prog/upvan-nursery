import { NextResponse } from "next/server";
import { getAdminSession, normalizeOptions } from "@/lib/admin";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const b = await req.json().catch(() => ({}));

  const allowed = ["name","scientificName","description","category","images","price","mrp","stock","featured","rating","reviewsCount","tags","care"] as const;
  const update: Record<string, unknown> = {};
  for (const k of allowed) if (b[k] !== undefined) update[k] = b[k];
  if (b.sizes !== undefined) update.sizes = normalizeOptions(b.sizes, "s", "Standard");
  if (b.pots !== undefined) update.pots = normalizeOptions(b.pots, "nursery", "Nursery Pot");
  if (update.images !== undefined && (!Array.isArray(update.images) || !(update.images as string[]).length))
    return NextResponse.json({ error: "At least one photo is required." }, { status: 400 });

  await dbConnect();
  const doc = await Product.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
  if (!doc) return NextResponse.json({ error: "Plant not found." }, { status: 404 });
  return NextResponse.json({ product: { ...doc, id: String((doc as any)._id) } });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await dbConnect();
  const doc = await Product.findByIdAndDelete(id);
  if (!doc) return NextResponse.json({ error: "Plant not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}