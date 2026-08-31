import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";
import Product from "@/models/Product";
import Order from "@/models/Order";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();
  const docs = await Review.find({ product: id }).sort({ createdAt: -1 }).limit(30).lean();
  return NextResponse.json({ reviews: docs.map((d: any) => ({ id: String(d._id), name: d.name, rating: d.rating, text: d.text, verified: d.verified, createdAt: d.createdAt })) });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Please log in to write a review." }, { status: 401 });

  const { id } = await params;
  const { rating, text } = await req.json().catch(() => ({}));
  if (!Number.isFinite(Number(rating)) || Number(rating) < 1 || Number(rating) > 5)
    return NextResponse.json({ error: "Pick a star rating between 1 and 5." }, { status: 400 });

  await dbConnect();
  const product = await Product.findById(id);
  if (!product) return NextResponse.json({ error: "Plant not found." }, { status: 404 });

  const verified = !!(await Order.exists({
    user: session.user.id, "items.product": product._id, status: { $ne: "CANCELLED" },
  }));

  await Review.findOneAndUpdate(
    { product: product._id, user: session.user.id },
    { $set: { name: session.user.name, rating: Number(rating), text: String(text ?? "").slice(0, 600), verified } },
    { upsert: true, new: true }
  );

  // Recompute the product's public rating
  const agg = await Review.aggregate([
    { $match: { product: product._id } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  if (agg.length) {
    await Product.findByIdAndUpdate(product._id, {
      rating: Math.round(agg[0].avg * 10) / 10,
      reviewsCount: agg[0].count,
    });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}