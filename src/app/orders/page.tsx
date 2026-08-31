import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { inr } from "@/lib/utils";
import AnimatedSection from "@/components/AnimatedSection";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My Orders", robots: { index: false } };

const chip: Record<string, string> = {
  PLACED: "bg-sun/15 text-[#8a6210]", SHIPPED: "bg-forest-100 text-forest-700",
  DELIVERED: "bg-forest-800 text-cream", CANCELLED: "bg-clay-100 text-clay-600",
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/orders");

  await dbConnect();
  const orders = await Order.find({ user: session.user.id }).sort({ createdAt: -1 }).lean();

  return (
    <div className="container-shop max-w-4xl py-12">
      <h1 className="mb-8 font-display text-4xl">My orders</h1>
      {orders.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-ink/55">No orders yet — your first plant is waiting.</p>
          <Link href="/products" className="btn btn-primary mt-6 px-7 py-3.5 text-sm">Browse plants</Link>
        </div>
      )}
      <div className="space-y-5">
        {orders.map((o: any, i) => (
          <AnimatedSection key={String(o._id)} delay={i * 0.06}>
            <Link href={`/order-success/${String(o._id)}`} className="card block p-5 transition hover:border-forest-700/40 hover:shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-lg">Order #{String(o._id).slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-ink/50">{new Date(o.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })} · {o.items.length} item{o.items.length > 1 ? "s" : ""}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${chip[o.status]}`}>{o.status}</span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                {o.items.slice(0, 4).map((it: any, j: number) => (
                  <div key={j} className="relative h-14 w-12 overflow-hidden rounded-lg">
                    <Image src={it.image} alt={it.name} fill sizes="48px" className="object-cover" />
                  </div>
                ))}
                <span className="ml-auto font-bold">{inr(o.total)}</span>
              </div>
            </Link>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}