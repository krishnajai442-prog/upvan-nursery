"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { LeafIcon, ShieldIcon, StarIcon } from "./icons";

const fade = (d: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: d, ease: [0.21, 0.6, 0.35, 1] as const },
});

export default function Hero() {
  return (
    <section className="leaf-texture relative overflow-hidden">
      <LeafIcon className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rotate-12 text-forest-900/5" />
      <div className="container-shop grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
        <div>
          <motion.p {...fade(0)} className="mb-4 text-xs font-bold uppercase tracking-[.25em] text-clay-600">
            Pan-India plant nursery · est. 2019
          </motion.p>
          <motion.h1 {...fade(0.08)} className="font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Bring the <em className="italic text-forest-600">wild</em> home,<br />leaf by leaf.
          </motion.h1>
          <motion.p {...fade(0.16)} className="mt-5 max-w-lg text-base leading-relaxed text-ink/65 sm:text-lg">
            Hand-nurtured plants from 40+ Indian nurseries, packed in breathable eco-cocoons
            and delivered alive to 27,000+ PIN codes.
          </motion.p>
          <motion.div {...fade(0.24)} className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="btn btn-clay px-7 py-3.5 text-sm">Shop all plants</Link>
            <Link href="/products?category=air-purifying" className="btn btn-ghost px-7 py-3.5 text-sm">Air-purifying picks</Link>
          </motion.div>
          <motion.dl {...fade(0.32)} className="mt-10 flex divide-x divide-forest-900/10">
            {[["4.8★", "12,400+ reviews"], ["2L+", "plants shipped"], ["27k+", "PIN codes served"]].map(([v, l]) => (
              <div key={l} className="pr-6 pl-6 first:pl-0">
                <dt className="font-display text-2xl font-semibold text-forest-800">{v}</dt>
                <dd className="text-xs text-ink/55">{l}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div {...fade(0.2)} className="relative mx-auto w-full max-w-md">
          <div className="arch relative aspect-[4/5] overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1470058869958-2a77ade41c02?auto=format&fit=crop&w=900&q=80"
              alt="Lush potted plants" fill priority sizes="(max-width:1024px) 100vw, 40vw" className="object-cover" />
          </div>
          <motion.div className="absolute -left-6 top-10 hidden sm:block"
            animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
            <div className="card flex items-center gap-3 px-4 py-3 shadow-xl">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-forest-100 text-forest-700"><ShieldIcon className="h-4.5 w-4.5" /></span>
              <div className="text-xs"><p className="font-bold">7-day promise</p><p className="text-ink/55">Free replacement</p></div>
            </div>
          </motion.div>
          <motion.div className="absolute -right-4 bottom-12 hidden sm:block"
            animate={{ y: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
            <div className="card flex items-center gap-3 px-4 py-3 shadow-xl">
              <span className="flex text-sun"><StarIcon className="h-4 w-4" /><StarIcon className="h-4 w-4" /><StarIcon className="h-4 w-4" /></span>
              <p className="text-xs font-semibold">“Arrived greener than<br />my neighbour's.” — Pune</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}