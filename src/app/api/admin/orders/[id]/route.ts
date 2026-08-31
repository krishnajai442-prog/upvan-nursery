import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

type Ctx = { params: Promise<{ id: string }> };
const STATUSES = ["PLACED", "SHIPPED", "DELIVERED", "CANCELLED"];
const CONFIRMATIONS = ["PENDING", "CONFIRMED", "CANCELLED"];

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const b = await req.json().catch(() => ({}));

  const update: Record<string, unknown> = {};
  if (b.status && STATUSES.includes(b.status)) update.status = b.status;
  if (b.confirmation && CONFIRMATIONS.includes(b.confirmation)) {
    update.confirmation = b.confirmation;
    if (b.confirmation === "CONFIRMED") update.confirmedAt = new Date();
  }
  if (!Object.keys(update).length)
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });

  await dbConnect();
  const doc = await Order.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
  if (!doc) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  return NextResponse.json({ order: { ...doc, id: String((doc as any)._id) } });
}