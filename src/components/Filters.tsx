"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, cn } from "@/lib/utils";
import { SearchIcon, XIcon } from "./icons";

const PRICE_RANGES = [
  { label: "Under ₹300", min: "0", max: "299" },
  { label: "₹300 – ₹599", min: "300", max: "599" },
  { label: "₹600 – ₹999", min: "600", max: "999" },
  { label: "₹1,000+", min: "1000", max: "" },
];
const SIZES = ["Small", "Medium", "Large"];
const POTS = ["Nursery Pot", "Terracotta Pot", "Ceramic Pot"];
const SORTS = [
  { v: "featured", label: "Featured" },
  { v: "price_asc", label: "Price: Low → High" },
  { v: "price_desc", label: "Price: High → Low" },
  { v: "rating", label: "Top rated" },
  { v: "newest", label: "Newest" },
];

export default function Filters({ count }: { count: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const cat = sp.get("category") ?? "";

  const push = (mutate: (p: URLSearchParams) => void) => {
    const p = new URLSearchParams(sp.toString());
    mutate(p);
    const s = p.toString();
    router.push(s ? `${pathname}?${s}` : pathname, { scroll: false });
  };
  const setOne = (key: string, value: string) => push((p) => (value ? p.set(key, value) : p.delete(key)));
  const setPrice = (min: string, max: string) =>
    push((p) => { min ? p.set("min", min) : p.delete("min"); max ? p.set("max", max) : p.delete("max"); });

  const active = !!(cat || sp.get("min") || sp.get("max") || sp.get("size") || sp.get("pot") || sp.get("q"));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setOne("category", "")}
          className={cn("rounded-full border px-4 py-1.5 text-sm font-medium transition",
            !cat ? "border-forest-900 bg-forest-900 text-cream" : "border-forest-900/15 hover:border-forest-900/40")}>
          All
        </button>
        {CATEGORIES.map((c) => (
          <button key={c.id} onClick={() => setOne("category", c.id === cat ? "" : c.id)}
            className={cn("rounded-full border px-4 py-1.5 text-sm font-medium transition",
              cat === c.id ? "border-forest-900 bg-forest-900 text-cream" : "border-forest-900/15 hover:border-forest-900/40")}>
            {c.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <form className="relative" onSubmit={(e) => { e.preventDefault(); setOne("q", q); }}>
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search this collection…"
            className="input w-56 rounded-full pl-9" />
        </form>
        <select className="input w-auto rounded-full" value={sp.get("price") ?? ""}
          onChange={(e) => {
            const r = PRICE_RANGES[Number(e.target.value)];
            e.target.value === "" ? setPrice("", "") : setPrice(r.min, r.max);
          }}>
          <option value="">Any price</option>
          {PRICE_RANGES.map((r, i) => <option key={r.label} value={i}>{r.label}</option>)}
        </select>
        <select className="input w-auto rounded-full" value={sp.get("size") ?? ""} onChange={(e) => setOne("size", e.target.value)}>
          <option value="">Any size</option>
          {SIZES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="input w-auto rounded-full" value={sp.get("pot") ?? ""} onChange={(e) => setOne("pot", e.target.value)}>
          <option value="">Any pot</option>
          {POTS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="input w-auto rounded-full" value={sp.get("sort") ?? "featured"} onChange={(e) => setOne("sort", e.target.value)}>
          {SORTS.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
        </select>
        {active && (
          <button onClick={() => router.push(pathname, { scroll: false })}
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-clay-600 hover:bg-clay-100/60">
            <XIcon className="h-3.5 w-3.5" /> Clear all
          </button>
        )}
        <span className="ml-auto text-sm text-ink/50">{count} plant{count === 1 ? "" : "s"}</span>
      </div>
    </div>
  );
}