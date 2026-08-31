import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, cn } from "@/lib/utils";
import AnimatedSection from "./AnimatedSection";
import { ArrowRightIcon } from "./icons";

function BannerCard({ c }: { c: typeof CATEGORIES[number] }) {
  return (
    <Link href={`/products?category=${c.id}`} className="group relative block h-36 overflow-hidden rounded-3xl">
      <Image src={c.image} alt={c.name} fill sizes="(max-width:768px) 90vw, 45vw" className="object-cover transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-950/85 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-center p-6 text-cream">
        <h3 className="font-display text-2xl">{c.name}</h3>
        <p className="text-sm text-cream/75">{c.blurb}</p>
        <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-leaf transition group-hover:gap-3">
          Shop now <ArrowRightIcon className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

export default function CategoryGrid() {
  const main = CATEGORIES.slice(0, 5);
  const rest = CATEGORIES.slice(5);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:[grid-auto-rows:200px]">
        {main.map((c, i) => (
          <AnimatedSection key={c.id} delay={i * 0.06}
            className={cn("group relative overflow-hidden rounded-3xl", i === 0 && "col-span-2 row-span-2 min-h-[420px]", i !== 0 && "min-h-[200px]")}>
            <Link href={`/products?category=${c.id}`} className="absolute inset-0 block">
              <Image src={c.image} alt={c.name} fill sizes="(max-width:768px) 50vw, 25vw"
                className="object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-cream">
                <h3 className={cn("font-display", i === 0 ? "text-3xl" : "text-xl")}>{c.name}</h3>
                <p className="mt-0.5 text-sm text-cream/75">{c.blurb}</p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-leaf transition group-hover:gap-3">
                  Shop now <ArrowRightIcon className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </AnimatedSection>
        ))}
      </div>
      {rest.length > 0 && (
        <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto">
          {rest.map((c, i) => (
            <AnimatedSection key={c.id} delay={i * 0.08} className="min-w-[280px] flex-1 snap-start">
              <BannerCard c={c} />
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  );
}