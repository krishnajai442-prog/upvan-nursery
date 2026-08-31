export default function Loading() {
  return (
    <div className="container-shop grid grid-cols-2 gap-6 py-16 md:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton aspect-[4/5]" />)}
    </div>
  );
}