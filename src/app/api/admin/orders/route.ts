import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await dbConnect();
  const docs = await Order.find().sort({ createdAt: -1 }).limit(100).lean();
  return NextResponse.json({
    orders: docs.map((d: any) => ({ ...d, id: String(d._id) })),
  });
}