import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import OrderDetails from "@/components/OrderDetails";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order Confirmed", robots: { index: false } };

export default async function OrderSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/orders");

  await dbConnect();
  let doc: any = null;
  try { doc = await Order.findOne({ _id: id, user: session.user.id }).lean(); } catch (error) {console.error("Order lookup failed:", error)}
  if (!doc) notFound();

  const order = JSON.parse(JSON.stringify({ ...doc, id: String(doc._id), user: undefined, _id: undefined }));
  return <OrderDetails order={order} celebrate />;
}