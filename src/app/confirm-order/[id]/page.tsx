import Image from "next/image";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { inr } from "@/lib/utils";
import ConfirmActions from "@/components/ConfirmActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Confirm Your Order", robots: { index: false } };

export default async function ConfirmOrderPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;

  await dbConnect();
  let order: any = null;
  try { order = await Order.findById(id).lean(); } catch {}

  if (!order || !token || order.confirmToken !== token)
    return (
      <div className="container-shop py-32 text-center">
        <h1 className="font-display text-3xl">This link isn't valid 🌵</h1>
        <p className="mt-3 text-ink/55">Please use the link from your WhatsApp/email, or contact support.</p>
      </div>
    );

  return (
    <div className="container-shop max-w-lg py-12">
      <h1 className="font-display text-3xl">Confirm order #{String(order._id).slice(-6).toUpperCase()}?</h1>
      <p className="mt-2 text-sm text-ink/55">Hi {order.shippingAddress.fullName} — just one tap before your plants set off.</p>

      <div className="card mt-6 p-5">
        {order.items.map((it: any, i: number) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <div className="relative h-12 w-10 overflow-hidden rounded-lg">
              <Image src={it.image} alt={it.name} fill sizes="40px" className="object-cover" />
            </div>
            <p className="flex-1 text-sm font-medium">{it.name} <span className="text-ink/50">× {it.qty}</span></p>
            <span className="text-sm font-semibold">{inr(it.unitPrice * it.qty)}</span>
          </div>
        ))}
        <div className="mt-3 flex justify-between border-t border-forest-900/10 pt-3 font-bold">
          <span>Total paid</span><span>{inr(order.total)}</span>
        </div>
      </div>

      <div className="mt-6">
        <ConfirmActions orderId={String(order._id)} token={token} confirmation={order.confirmation} status={order.status} />
      </div>
    </div>
  );
}