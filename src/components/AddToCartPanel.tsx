"use client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { cn, inr } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useToasts } from "@/store/toasts";
import { MinusIcon, PlusIcon, TruckIcon, ShieldIcon } from "./icons";

export default function AddToCartPanel({ p }: { p: Product }) {
  const router = useRouter();
  const addItem = useCart((s) => s.addItem);
  const toast = useToasts((s) => s.push);
  const [sizeId, setSizeId] = useState(p.sizes[0]?.id);
  const [potId, setPotId] = useState(p.pots[0]?.id);
  const [qty, setQty] = useState(1);

  const size = p.sizes.find((s) => s.id === sizeId);
  const pot = p.pots.find((x) => x.id === potId);
  const unit = useMemo(() => p.price + (size?.priceDelta ?? 0) + (pot?.priceDelta ?? 0), [p.price, size, pot]);

  const doAdd = () => {
    if (p.stock <= 0) { toast("This plant is out of stock", "error"); return false; }
    addItem({
      productId: p.id, slug: p.slug, name: p.name, image: p.images[0],
      sizeId: size?.id ?? "s", sizeLabel: size?.label ?? "Standard",
      potId: pot?.id ?? "nursery", potLabel: pot?.label ?? "Nursery Pot",
      unitPrice: unit, qty, stock: p.stock,
    });
    toast(`${p.name} added to cart 🌱`);
    return true;
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="label">Size</p>
        <div className="flex flex-wrap gap-2">
          {p.sizes.map((s) => (
            <button key={s.id} onClick={() => setSizeId(s.id)}
              className={cn("rounded-full border px-4 py-2 text-sm font-medium transition",
                sizeId === s.id ? "border-forest-800 bg-forest-800 text-cream" : "border-forest-900/15 hover:border-forest-900/40")}>
              {s.label}{s.priceDelta > 0 && <span className="ml-1 opacity-70">+{inr(s.priceDelta)}</span>}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="label">Pot</p>
        <div className="flex flex-wrap gap-2">
          {p.pots.map((x) => (
            <button key={x.id} onClick={() => setPotId(x.id)}
              className={cn("rounded-full border px-4 py-2 text-sm font-medium transition",
                potId === x.id ? "border-clay-500 bg-clay-500 text-white" : "border-forest-900/15 hover:border-forest-900/40")}>
              {x.label}{x.priceDelta > 0 && <span className="ml-1 opacity-70">+{inr(x.priceDelta)}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-full border border-forest-900/15">
          <button className="p-3 hover:text-forest-600" onClick={() => setQty((q) => Math.max(1, q - 1))}><MinusIcon className="h-4 w-4" /></button>
          <motion.span key={qty} initial={{ scale: 0.7 }} animate={{ scale: 1 }} className="w-8 text-center font-bold">{qty}</motion.span>
          <button className="p-3 hover:text-forest-600" onClick={() => setQty((q) => Math.min(p.stock, q + 1))}><PlusIcon className="h-4 w-4" /></button>
        </div>
        <p className={cn("text-sm font-semibold", p.stock <= 10 ? "text-clay-600" : "text-forest-600")}>
          {p.stock <= 0 ? "Out of stock" : p.stock <= 10 ? `Only ${p.stock} left!` : "In stock, ships in 24h"}
        </p>
      </div>

      <div className="flex gap-3">
        <button disabled={p.stock <= 0} onClick={doAdd} className="btn btn-primary flex-1 px-6 py-4 text-sm">
          Add to cart · {inr(unit * qty)}
        </button>
        <button disabled={p.stock <= 0} onClick={() => { if (doAdd()) router.push("/checkout"); }}
          className="btn btn-clay flex-1 px-6 py-4 text-sm">
          Buy now
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="card flex items-center gap-2.5 px-4 py-3"><TruckIcon className="h-4.5 w-4.5 text-forest-600" /> Free shipping over ₹999</div>
        <div className="card flex items-center gap-2.5 px-4 py-3"><ShieldIcon className="h-4.5 w-4.5 text-forest-600" /> 7-day replacement promise</div>
      </div>
    </div>
  );
}