import CheckoutFlow from "@/components/CheckoutFlow";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Checkout", robots: { index: false } };
export default function CheckoutPage() { return <CheckoutFlow />; }