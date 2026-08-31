import { LoginForm, WithSuspense } from "@/components/AuthForms";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Login" };
export default function LoginPage() { return <WithSuspense><LoginForm /></WithSuspense>; }