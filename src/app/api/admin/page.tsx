import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdminSession } from "@/lib/admin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  const admin = await getAdminSession();
  if (!admin)
    return (
      <div className="container-shop py-32 text-center">
        <h1 className="font-display text-3xl">You're signed in, but not an admin 🌱</h1>
        <p className="mt-3 text-sm text-ink/60">Run <code className="rounded bg-cream px-2 py-1 font-mono text-xs">npm run make-admin -- {session.user.email}</code> in your project folder to unlock the panel.</p>
      </div>
    );
  return <AdminDashboard />;
}