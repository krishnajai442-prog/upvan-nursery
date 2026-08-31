"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { useToasts } from "@/store/toasts";
import { StarIcon, CheckIcon } from "./icons";

type Review = { id: string; name: string; rating: number; text: string; verified: boolean; createdAt: string };

export default function Reviews({ productId, reviews, loggedIn, hasPurchased }: {
  productId: string; reviews: Review[]; loggedIn: boolean; hasPurchased: boolean;
}) {
  const router = useRouter();
  const toast = useToasts((s) => s.push);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const avg = reviews.length ? reviews.reduce((n, r) => n + r.rating, 0) / reviews.length : 0;
  const dist = [5, 4, 3, 2, 1].map((s) => reviews.filter((r) => Math.round(r.rating) === s).length);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) return toast("Tap a star rating first ⭐", "error");
    setBusy(true);
    const res = await fetch(`/api/products/${productId}/reviews`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, text }),
    });
    const d = await res.json();
    setBusy(false);
    if (!res.ok) return toast(d.error ?? "Could not post review", "error");
    toast("Thanks for your review! 🌿");
    setRating(0); setText("");
    router.refresh(); // re-fetch server-side review list + updated rating
  }

  return (
    <div>
      <h2 className="font-display text-3xl sm:text-4xl">What plant parents say</h2>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        {/* Summary + form */}
        <div>
          <div className="card p-6">
            <div className="flex items-end gap-3">
              <span className="font-display text-5xl">{avg ? avg.toFixed(1) : "—"}</span>
              <div className="pb-1">
                <div className="flex text-sun">{[1,2,3,4,5].map((n) => <StarIcon key={n} className="h-4 w-4" filled={n <= Math.round(avg)} />)}</div>
                <p className="mt-1 text-xs text-ink/50">{reviews.length} review{reviews.length === 1 ? "" : "s"}</p>
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              {dist.map((count, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-3 font-semibold">{5 - i}</span>
                  <StarIcon className="h-3 w-3 text-sun" />
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-forest-100">
                    <div className="h-full rounded-full bg-sun" style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : 0 }} />
                  </div>
                  <span className="w-5 text-right text-ink/45">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card mt-4 p-6">
            {loggedIn ? (
              <form onSubmit={submit}>
                <p className="label">Your rating</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button type="button" key={n} onClick={() => setRating(n)}
                      onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
                      className={n <= (hover || rating) ? "text-sun" : "text-ink/15"}>
                      <motion.span whileTap={{ scale: 1.3 }} className="block"><StarIcon className="h-8 w-8" /></motion.span>
                    </button>
                  ))}
                </div>
                <textarea className="input mt-3 min-h-20" maxLength={600} value={text} onChange={(e) => setText(e.target.value)}
                  placeholder="How's your plant doing? (optional)" />
                {hasPurchased && <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-forest-600"><CheckIcon className="h-3.5 w-3.5" /> Verified buyer — your badge will show</p>}
                <button disabled={busy} className="btn btn-primary mt-3 w-full py-3 text-sm">{busy ? "Posting…" : "Post review"}</button>
              </form>
            ) : (
              <p className="text-sm text-ink/60"><Link href="/login" className="font-semibold text-forest-700">Log in</Link> to write a review.</p>
            )}
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {reviews.length === 0 && <p className="py-10 text-center text-ink/50">No reviews yet — be the first! 🌱</p>}
          {reviews.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: Math.min(i, 5) * 0.05 }}
              className="card p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-forest-100 text-sm font-bold text-forest-800">
                  {r.name?.[0]?.toUpperCase() ?? "?"}
                </span>
                <div>
                  <p className="text-sm font-semibold">{r.name}
                    {r.verified && <span className="ml-2 rounded-full bg-forest-100 px-2 py-0.5 text-[10px] font-bold text-forest-700">✓ Verified buyer</span>}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="flex text-sun">{[1,2,3,4,5].map((n) => <StarIcon key={n} className="h-3 w-3" filled={n <= r.rating} />)}</span>
                    <span className="text-[11px] text-ink/40">{new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                </div>
              </div>
              {r.text && <p className="mt-3 text-sm leading-relaxed text-ink/75">{r.text}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}