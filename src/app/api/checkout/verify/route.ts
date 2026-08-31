import { sendWhatsAppMessage, buildConfirmMessage } from "@/lib/whatsapp";
import { notifyAdminEmail } from "@/lib/mail";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import crypto from "crypto";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { getRazorpay } from "@/lib/razorpay";
import { sendOrderEmail } from "@/lib/mail";

const err = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return err("Please log in.", 401);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
      return err("Missing payment details.", 400);

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return err("Payments are not configured.", 500);

    // 1. Verify signature: HMAC_SHA256(order_id|payment_id)
    const expected = crypto.createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
    const a = Buffer.from(expected);
    const b = Buffer.from(String(razorpay_signature));
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b))
      return err("Payment signature verification failed.", 400);

    // 2. Confirm with Razorpay that the order was actually paid
    const rzp = getRazorpay();
    const rzpOrder: any = await rzp.orders.fetch(razorpay_order_id);
    if (rzpOrder.status !== "paid") return err("Payment not captured yet — please retry.", 400);

    const notes = rzpOrder.notes ?? {};
    const items = JSON.parse(notes.itemsJson ?? "[]");
    const address = JSON.parse(notes.addressJson ?? "{}");
    const subtotal = Number(notes.subtotal || 0);
    const shipping = Number(notes.shipping || 0);
    const total = Number(notes.total || 0);
    if (total * 100 !== rzpOrder.amount) return err("Amount mismatch detected.", 400);

    // 3. Recompute from DB + decrement stock + snapshot order
    await dbConnect();
    const products = await Product.find({ _id: { $in: items.map((i: any) => i.productId) } });
    const orderItems: any[] = [];

    for (const it of items) {
      const p: any = products.find((pp: any) => pp._id.toString() === it.productId);
      if (!p) continue;
      const size = p.sizes.find((s: any) => s.id === it.sizeId) ?? p.sizes[0];
      const pot = p.pots.find((x: any) => x.id === it.potId) ?? p.pots[0];
      const unitPrice = p.price + (size?.priceDelta ?? 0) + (pot?.priceDelta ?? 0);
      orderItems.push({
        product: p._id, name: p.name, image: p.images?.[0] ?? "",
        sizeLabel: size?.label ?? "", potLabel: pot?.label ?? "", unitPrice, qty: it.qty,
      });
      await Product.updateOne({ _id: p._id, stock: { $gte: it.qty } }, { $inc: { stock: -it.qty } });
    }

        const confirmToken = crypto.randomBytes(24).toString("hex");

    const order = await Order.create({
      user: session.user.id, email: session.user.email, items: orderItems,
      subtotal, shipping, total,
      shippingAddress: {
        fullName: address.fullName, phone: address.phone, line1: address.line1,
        line2: address.line2 ?? "", city: address.city, state: address.state, pincode: address.pincode,
      },
      payment: { razorpayOrderId: razorpay_order_id, razorpayPaymentId: razorpay_payment_id },
      status: "PLACED",
      confirmation: "PENDING",
      confirmToken,
    });

    // ---- Notifications (all fire-and-forget) ----
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const confirmUrl = `${site}/confirm-order/${order._id}?token=${confirmToken}`;
    const waMsg = buildConfirmMessage({
      name: address.fullName, orderId: String(order._id), total, confirmUrl,
    });

    sendOrderEmail({ order, to: session.user.email ?? notes.email, confirmUrl }).catch((e) => console.error("[mail]", e.message));
    notifyAdminEmail(order).catch((e) => console.error("[mail]", e.message));
    sendWhatsAppMessage(address.phone, waMsg).then((sent) => {
      if (!sent) console.log("[whatsapp] API not configured — admin can send manually from /admin");
    }).catch(() => {});

    return NextResponse.json({ orderId: order._id.toString() });
   
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Verification failed." }, { status: 500 });
  }
}