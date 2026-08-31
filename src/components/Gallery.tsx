"use client";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Gallery({ images, name }: { images: string[]; name: string }) {
  const [i, setI] = useState(0);
  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-cream">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }} className="absolute inset-0">
            <Image src={images[i]} alt={name} fill priority sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((src, idx) => (
            <button key={src} onClick={() => setI(idx)}
              className={cn("relative h-20 w-20 overflow-hidden rounded-xl border-2 transition", idx === i ? "border-forest-700" : "border-transparent opacity-70 hover:opacity-100")}>
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}