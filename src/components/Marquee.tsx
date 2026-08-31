import { LeafIcon } from "./icons";

const ITEMS = ["Free shipping over ₹999", "Live-plant arrival guarantee", "27,000+ PIN codes", "Plastic-free eco packaging", "Real botanists on call", "UPI · Cards · NetBanking"];

export default function Marquee() {
  return (
    <div className="overflow-hidden bg-forest-950 py-3 text-cream">
      <div className="animate-marquee flex w-max">
        {[...ITEMS, ...ITEMS].map((t, i) => (
          <span key={i} className="mx-4 flex items-center gap-8 whitespace-nowrap text-xs font-semibold uppercase tracking-[.2em]">
            {t} <LeafIcon className="h-3.5 w-3.5 text-leaf" />
          </span>
        ))}
      </div>
    </div>
  );
}