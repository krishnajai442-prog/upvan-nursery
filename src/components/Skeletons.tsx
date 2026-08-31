export function ProductCardSkeleton() {
  return (
    <div>
      <div className="skeleton aspect-[4/5] w-full" />
      <div className="skeleton mt-3 h-4 w-3/4" />
      <div className="skeleton mt-2 h-3 w-1/2" />
      <div className="skeleton mt-2 h-4 w-1/3" />
    </div>
  );
}
export function GridSkeleton({ n = 8 }: { n?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: n }).map((_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  );
}