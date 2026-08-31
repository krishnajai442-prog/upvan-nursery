"use client";
import { useState } from "react";
import { CATEGORIES } from "@/lib/utils";
import { useToasts } from "@/store/toasts";
import ImageUploader from "./ImageUploader";

const SIZE_ROWS = [["s", "Small"], ["m", "Medium"], ["l", "Large"]] as const;
const POT_ROWS = [["nursery", "Nursery Pot", 0], ["terracotta", "Terracotta Pot", 99], ["ceramic", "Ceramic Pot", 179]] as const;

type OptionRow = { id: string; label: string; active: boolean; priceDelta: number | string };

export default function AdminPlantForm({ initial, onBack, onSaved }: { initial: any; onBack: () => void; onSaved: () => void }) {
  const toast = useToasts((s) => s.push);
  const isNew = !initial;
  const [saving, setSaving] = useState(false);
  const [f, setF] = useState(() => ({
    name: initial?.name ?? "",
    scientificName: initial?.scientificName ?? "",
    category: initial?.category ?? "indoor",
    price: initial?.price ?? "",
    mrp: initial?.mrp ?? "",
    stock: initial?.stock ?? 10,
    featured: initial?.featured ?? false,
    description: initial?.description ?? "",
    tags: (initial?.tags ?? []).join(", "),
    images: initial?.images ?? [],
    care: {
      light: initial?.care?.light ?? "", water: initial?.care?.water ?? "",
      temperature: initial?.care?.temperature ?? "", humidity: initial?.care?.humidity ?? "",
      difficulty: initial?.care?.difficulty ?? "Easy",
    },
    sizes: SIZE_ROWS.map(([id, label]) => {
      const ex = initial?.sizes?.find((s: any) => s.id === id);
      return { id, label, active: isNew ? id === "s" : !!ex, priceDelta: ex?.priceDelta ?? 0 };
    }) as OptionRow[],
    pots: POT_ROWS.map(([id, label, def]) => {
      const ex = initial?.pots?.find((s: any) => s.id === id);
      return { id, label, active: isNew ? id === "nursery" : !!ex, priceDelta: ex?.priceDelta ?? def };
    }) as OptionRow[],
  }));

  const set = (k: string) => (e: any) => setF((s) => ({ ...s, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const setCare = (k: string) => (e: any) => setF((s) => ({ ...s, care: { ...s.care, [k]: e.target.value } }));
  const setOption = (field: "sizes" | "pots", i: number, patch: Partial<OptionRow>) =>
    setF((s) => ({ ...s, [field]: s[field].map((x, j) => (j === i ? { ...x, ...patch } : x)) }));

  async function save() {
    if (!f.name.trim() || !f.price || !f.images.length)
      return toast("Name, price and at least one photo are required", "error");
    setSaving(true);
    const payload = {
      name: f.name, scientificName: f.scientificName, category: f.category,
      price: Number(f.price), mrp: Number(f.mrp || f.price), stock: Number(f.stock),
      featured: f.featured, description: f.description, images: f.images,
      tags: f.tags.split(",").map((t:string) => t.trim()).filter(Boolean),
      care: f.care,
      sizes: f.sizes.filter((s) => s.active).map(({ id, label, priceDelta }) => ({ id, label, priceDelta: Number(priceDelta) || 0 })),
      pots: f.pots.filter((s) => s.active).map(({ id, label, priceDelta }) => ({ id, label, priceDelta: Number(priceDelta) || 0 })),
    };
    const res = await fetch(isNew ? "/api/admin/products" : `/api/admin/products/${initial.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return toast(data.error ?? "Save failed", "error");
    toast(isNew ? "New plant is live 🌱" : "Plant updated ✓");
    onSaved();
  }

  const OptionSection = ({ title, field, rows }: { title: string; field: "sizes" | "pots"; rows: OptionRow[] }) => (
    <div>
      <p className="label">{title}</p>
      <div className="card divide-y divide-forest-900/5">
        {rows.map((s, i) => (
          <div key={s.id} className="flex items-center gap-3 px-4 py-3">
            <input type="checkbox" className="h-4 w-4 accent-forest-700" checked={s.active}
              onChange={(e) => setOption(field, i, { active: e.target.checked })} />
            <span className="flex-1 text-sm font-medium">{s.label}</span>
            <span className="text-xs text-ink/45">+₹</span>
            <input className="input w-24" inputMode="numeric" value={s.priceDelta}
              onChange={(e) => setOption(field, i, { priceDelta: e.target.value })} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container-shop max-w-2xl py-8 pb-36">
      <button onClick={onBack} className="mb-6 text-sm font-semibold text-forest-700">← Back to dashboard</button>
      <h1 className="mb-6 font-display text-3xl">{isNew ? "Add a new plant" : `Edit: ${initial.name}`}</h1>

      <div className="space-y-6">
        <ImageUploader images={f.images} onChange={(imgs) => setF((s) => ({ ...s, images: imgs }))} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Plant name *</label><input className="input" value={f.name} onChange={set("name")} placeholder="Alphonso Mango" /></div>
          <div><label className="label">Scientific name</label><input className="input" value={f.scientificName} onChange={set("scientificName")} placeholder="Mangifera indica" /></div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={f.category} onChange={set("category")}>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div><label className="label">Tags (comma separated)</label><input className="input" value={f.tags} onChange={set("tags")} placeholder="fruit, grafted, outdoor" /></div>
          <div><label className="label">Price (₹) *</label><input className="input" inputMode="numeric" value={f.price} onChange={set("price")} placeholder="399" /></div>
          <div><label className="label">MRP (₹)</label><input className="input" inputMode="numeric" value={f.mrp} onChange={set("mrp")} placeholder="499" /></div>
          <div><label className="label">Stock</label><input className="input" inputMode="numeric" value={f.stock} onChange={set("stock")} /></div>
          <label className="flex items-center gap-2 self-end pb-2 text-sm font-semibold">
            <input type="checkbox" className="h-4 w-4 accent-forest-700" checked={f.featured} onChange={set("featured")} />
            Show in Bestsellers
          </label>
        </div>

        <div><label className="label">Description</label><textarea className="input min-h-24" value={f.description} onChange={set("description")} placeholder="Why plant parents will love it…" /></div>

        <OptionSection title="Sizes you offer" field="sizes" rows={f.sizes} />
        <OptionSection title="Pot options" field="pots" rows={f.pots} />

        <div>
          <p className="label">Care guide</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">☀️ Light</label><input className="input" value={f.care.light} onChange={setCare("light")} placeholder="Full sun" /></div>
            <div><label className="label">💧 Water</label><input className="input" value={f.care.water} onChange={setCare("water")} placeholder="Every 2 days" /></div>
            <div><label className="label">🌡️ Temperature</label><input className="input" value={f.care.temperature} onChange={setCare("temperature")} placeholder="18–38°C" /></div>
            <div><label className="label">🌬️ Humidity</label><input className="input" value={f.care.humidity} onChange={setCare("humidity")} placeholder="Medium" /></div>
            <div className="sm:col-span-2">
              <label className="label">Difficulty</label>
              <select className="input" value={f.care.difficulty} onChange={setCare("difficulty")}>
                {["Beginner", "Easy", "Intermediate", "Expert"].map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky save bar — thumb reach on phones */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-forest-900/10 bg-paper/95 p-4 backdrop-blur">
        <div className="mx-auto flex max-w-2xl gap-3">
          <button onClick={onBack} className="btn btn-ghost flex-1 py-3.5 text-sm">Cancel</button>
          <button onClick={save} disabled={saving} className="btn btn-clay flex-[2] py-3.5 text-sm">
            {saving ? "Saving…" : isNew ? "🌱 Add plant" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}