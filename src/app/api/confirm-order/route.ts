import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: Request) {
  const { orderId, token, action } = await req.json().catch(() => ({}));
  if (!orderId || !token || !["confirm", "cancel"].includes(action))
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  await dbConnect();
  const order = await Order.findOne({ _id: orderId, confirmToken: token });
  if (!order) return NextResponse.json({ error: "Order not found or link expired." }, { status: 404 });
  if (order.status === "CANCELLED")
    return NextResponse.json({ error: "This order was cancelled." }, { status: 400 });

  if (action === "confirm") {
    if (order.confirmation === "CONFIRMED")
      return NextResponse.json({ confirmation: "CONFIRMED" });
    order.confirmation = "CONFIRMED";
    order.confirmedAt = new Date();
  } else {
    order.confirmation = "CANCELLED";
    order.status = "CANCELLED";
  }
  await order.save();
  return NextResponse.json({ confirmation: order.confirmation, status: order.status });
}