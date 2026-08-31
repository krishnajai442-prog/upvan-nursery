import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { getRazorpay } from "@/lib/razorpay";
import { FREE_SHIPPING_ABOVE, SHIPPING_FEE } from "@/lib/utils";

const err = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return err("Please log in to checkout.", 401);

    const body = await req.json();
    const items = Array.isArray(body.items) ? body.items : [];
    const address = body.address;
    if (!items.length) return err("Your cart is empty.", 400);
    if (!address?.fullName || !address?.phone || !address?.line1 || !address?.city ||
        !address?.state || !/^\d{6}$/.test(address?.pincode ?? ""))
      return err("Please provide a complete shipping address.", 400);

    await dbConnect();
    const products = await Product.find({ _id: { $in: items.map((i: any) => i.productId) } });

    let subtotal = 0;
    const cleanItems = items.map((it: any) => {
      const p: any = products.find((pp: any) => pp._id.toString() === it.productId);
      if (!p) throw new Error("A plant in your cart is no longer available.");
      const qty = Math.max(1, Math.min(Number(it.qty) || 1, 20));
      if (p.stock < qty) throw new Error(`Only ${p.stock} left of ${p.name}.`);
      const size = p.sizes.find((s: any) => s.id === it.sizeId) ?? p.sizes[0];
      const pot = p.pots.find((x: any) => x.id === it.potId) ?? p.pots[0];
      subtotal += (p.price + (size?.priceDelta ?? 0) + (pot?.priceDelta ?? 0)) * qty;
      return { productId: it.productId, sizeId: size?.id, potId: pot?.id, qty };
    });

    const shipping = subtotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
    const total = subtotal + shipping;

    const rzp = getRazorpay();
    const order = await rzp.orders.create({
      amount: total * 100, // paise
      currency: "INR",
      receipt: `upvan_${Date.now()}`,
      notes: {
        userId: session.user.id,
        email: session.user.email ?? "",
        itemsJson: JSON.stringify(cleanItems),
        addressJson: JSON.stringify(address),
        subtotal: String(subtotal), shipping: String(shipping), total: String(total),
      },
    });

    return NextResponse.json({
      orderId: order.id, amount: order.amount, currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID, subtotal, shipping, total,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Could not start payment." }, { status: 500 });
  }
}