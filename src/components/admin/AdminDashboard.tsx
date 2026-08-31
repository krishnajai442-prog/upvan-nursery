"use client";
import AdminOrders from "./AdminOrders";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { cn, inr } from "@/lib/utils";
import { useToasts } from "@/store/toasts";
import AdminPlantForm from "./AdminPlantForm";
import { MinusIcon, PlusIcon, SearchIcon, TrashIcon, LeafIcon } from "@/components/icons";

export default function AdminDashboard() {
  // near the other useState lines, add:
  const [tab, setTab] = useState<"plants" | "orders">("plants");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<any | "new" | null>(null);
  const toast = useToasts((s) => s.push);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    if (res.ok) setProducts(data.products ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function adjustStock(p: any, delta: number) {
    const stock = Math.max(0, p.stock + delta);
    const res = await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stock }),
    });
    if (res.ok) setProducts((list) => list.map((x) => (x.id === p.id ? { ...x, stock } : x)));
    else toast("Could not update stock", "error");
  }

  async function remove(p: any) {
    if (!confirm(`Delete "${p.name}" permanently?`)) return;
    const res = await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
    if (res.ok) { setProducts((l) => l.filter((x) => x.id !== p.id)); toast("Plant deleted"); }
    else toast("Delete failed", "error");
  }

  if (editing !== null) {
    return (
      <AdminPlantForm
        initial={editing === "new" ? null : editing}
        onBack={() => setEditing(null)}
        onSaved={() => { setEditing(null); load(); }}
      />
    );
  }

  const filtered = products.filter(
    (p) => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.category.includes(q.toLowerCase())
  );
  const lowStock = products.filter((p) => p.stock <= 5).length;

  return (
    
    <div className="container-shop max-w-3xl py-8 pb-32">
      <header className="mb-6">
        <h1 className="flex items-center gap-2 font-display text-3xl"><LeafIcon className="h-6 w-6 text-leaf" /> Upvan Admin</h1>
        <p className="mt-1 text-sm text-ink/55">
            {products.length} plants · {lowStock > 0 ? <span className="font-semibold text-clay-600">{lowStock} low on stock</span> : "stock healthy"}
           </p>
        <div className="mt-4 flex gap-2">
          <button onClick={() => setTab("plants")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${tab === "plants" ? "bg-forest-900 text-cream" : "bg-forest-900/5 text-ink/70"}`}>
            🌿 Plants ({products.length})
          </button>
          <button onClick={() => setTab("orders")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${tab === "orders" ? "bg-forest-900 text-cream" : "bg-forest-900/5 text-ink/70"}`}>
            📦 Orders
          </button>
        </div>
      </header>

      {tab === "orders" ? (
        <AdminOrders />
      ) : (
        <>
          {/* everything from your existing plants view: search box, list, floating + button */}
      <div className="relative mb-6">
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search plants…" className="input rounded-full pl-10" />
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-20" />)}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <div key={p.id} className="card flex items-center gap-3 p-3">
              <button onClick={() => setEditing(p)} className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl">
                <Image src={p.images?.[0]} alt={p.name} fill sizes="56px" className="object-cover" />
              </button>
              <button onClick={() => setEditing(p)} className="min-w-0 flex-1 text-left">
                <p className="truncate font-display text-base">
                  {p.name} {p.featured && <span className="text-sun">★</span>}
                </p>
                <p className="text-xs text-ink/50">{inr(p.price)} · {p.category}</p>
              </button>
              <div className="flex items-center gap-1.5">
                <button onClick={() => adjustStock(p, -1)} className="grid h-8 w-8 place-items-center rounded-full border border-forest-900/15 transition hover:bg-forest-50"><MinusIcon className="h-3.5 w-3.5" /></button>
                <span className={cn("w-8 text-center text-sm font-bold", p.stock <= 5 && "text-clay-600")}>{p.stock}</span>
                <button onClick={() => adjustStock(p, 1)} className="grid h-8 w-8 place-items-center rounded-full border border-forest-900/15 transition hover:bg-forest-50"><PlusIcon className="h-3.5 w-3.5" /></button>
              </div>
              <button onClick={() => remove(p)} className="p-2 text-ink/30 transition hover:text-clay-600"><TrashIcon className="h-4 w-4" /></button>
            </div>
          ))}
          {filtered.length === 0 && <p className="py-16 text-center text-ink/50">No plants match “{q}”</p>}
        </div>
      )}

      {/* Thumb-friendly floating add button */}
      <button onClick={() => setEditing("new")} aria-label="Add plant"
        className="btn btn-clay fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full text-2xl shadow-2xl">
        <PlusIcon className="h-6 w-6" />
      </button>
    </>
  )};
  </div>
)
}