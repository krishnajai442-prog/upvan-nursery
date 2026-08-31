import { SignupForm, WithSuspense } from "@/components/AuthForms";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Create Account" };
export default function SignupPage() { return <WithSuspense><SignupForm /></WithSuspense>; }