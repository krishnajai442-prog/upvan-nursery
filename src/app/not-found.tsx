import Link from "next/link";
import { LeafIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="container-shop flex flex-col items-center py-32 text-center">
      <LeafIcon className="h-16 w-16 text-forest-200" />
      <h1 className="mt-6 font-display text-5xl">This plant wandered off</h1>
      <p className="mt-3 text-ink/55">The page you're looking for isn't in our greenhouse.</p>
      <Link href="/products" className="btn btn-primary mt-8 px-7 py-3.5 text-sm">Back to the jungle</Link>
    </div>
  );
}