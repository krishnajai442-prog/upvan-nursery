"use client";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { LeafIcon } from "./icons";

function Shell({ children, title, sub }: { children: React.ReactNode; title: string; sub: React.ReactNode }) {
  return (
    <div className="container-shop flex justify-center py-16">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-forest-900 text-cream"><LeafIcon className="h-6 w-6" /></span>
          <h1 className="mt-4 font-display text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-ink/55">{sub}</p>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setBusy(false);
    if (res?.error) return setError("Invalid email or password.");
    router.push("/"); router.refresh();
  }

  return (
    <Shell title="Welcome back" sub={<>New to Upvan? <Link href="/signup" className="font-semibold text-forest-700">Create an account</Link></>}>
      <form onSubmit={submit} className="space-y-4">
        <div><label className="label">Email</label><input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><label className="label">Password</label><input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        {error && <p className="text-sm font-semibold text-clay-600">{error}</p>}
        <button disabled={busy} className="btn btn-primary w-full py-3.5 text-sm">{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </Shell>
  );
}

export function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    const res = await fetch("/api/signup", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setBusy(false); return setError(data.error ?? "Signup failed"); }
    const login = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    setBusy(false);
    if (login?.error) return router.push("/login");
    router.push("/"); router.refresh();
  }

  return (
    <Shell title="Join the jungle" sub={<>Already have an account? <Link href="/login" className="font-semibold text-forest-700">Sign in</Link></>}>
      <form onSubmit={submit} className="space-y-4">
        <div><label className="label">Full name</label><input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div><label className="label">Email</label><input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div><label className="label">Password</label><input className="input" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
        {error && <p className="text-sm font-semibold text-clay-600">{error}</p>}
        <button disabled={busy} className="btn btn-clay w-full py-3.5 text-sm">{busy ? "Creating account…" : "Create account"}</button>
      </form>
    </Shell>
  );
}

export function WithSuspense({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}