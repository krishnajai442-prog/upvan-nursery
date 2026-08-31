"use client";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { StarIcon } from "./icons";

const T = [
  { name: "Ananya Iyer", city: "Bengaluru", stars: 5, text: "My Monstera travelled from Pune to Bengaluru looking fresher than the day it was potted. The eco-cocoon packaging is genius." },
  { name: "Rohan Mehta", city: "Mumbai", stars: 5, text: "Ordered a Peace Lily for my mum's balcony. It bloomed within three weeks. Tracking + care WhatsApp support is a lovely touch." },
  { name: "Sneha Reddy", city: "Hyderabad", stars: 4, text: "One leaf got bruised in transit — they replaced the whole plant in 4 days, no questions. That's how you earn a plant parent for life." },
  { name: "Arjun Nair", city: "Kochi", stars: 5, text: "The pincode checker said yes to my tiny town and the Snake Plant actually showed up alive. Impressive logistics for a plant store." },
  { name: "Divya Sharma", city: "Jaipur", stars: 5, text: "Bougainvillea in terracotta, zero damage, and the care card is fridge-worthy. Third order this year." },
];

export default function Testimonials() {
  return (
    <section className="bg-forest-950 py-20 text-cream">
      <div className="container-shop">
        <AnimatedSection>
          <p className="text-xs font-bold uppercase tracking-[.25em] text-leaf">Plant parents across India</p>
          <h2 className="mt-3 max-w-xl font-display text-4xl leading-tight sm:text-5xl">
            12,000+ balconies,<br /><em className="italic text-leaf">greener</em> because of us.
          </h2>
        </AnimatedSection>
      </div>
      <div className="no-scrollbar mt-10 flex snap-x gap-4 overflow-x-auto px-6 pb-4 md:px-10">
        {T.map((t, i) => (
          <motion.figure key={t.name}
            initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.08 }}
            whileHover={{ y: -6 }}
            className="w-[320px] shrink-0 snap-start rounded-3xl border border-cream/10 bg-white/5 p-6">
            <div className="flex gap-0.5 text-sun">{Array.from({ length: t.stars }).map((_, j) => <StarIcon key={j} className="h-4 w-4" />)}</div>
            <blockquote className="mt-4 text-sm leading-relaxed text-cream/85">“{t.text}”</blockquote>
            <figcaption className="mt-5 text-sm">
              <span className="font-bold">{t.name}</span> <span className="text-cream/50">· {t.city}</span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}