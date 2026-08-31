import type { Product } from "@/types";
import ProductCard from "./ProductCard";
import AnimatedSection from "./AnimatedSection";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p, i) => (
        <AnimatedSection key={p.id} delay={Math.min(i, 7) * 0.05}>
          <ProductCard p={p} />
        </AnimatedSection>
      ))}
    </div>
  );
}