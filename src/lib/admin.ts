import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import dbConnect from "./db";
import User from "@/models/User";

/** Returns the session only if the signed-in user has role "admin" */
export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  await dbConnect();
  const user = await User.findById(session.user.id);
  return user?.role === "admin" ? session : null;
}

export function normalizeOptions(list: any[], fallbackId: string, fallbackLabel: string) {
  const opts = (Array.isArray(list) ? list : [])
    .map((o) => ({ id: o.id, label: o.label, priceDelta: Number(o.priceDelta) || 0 }))
    .filter((o) => o.id && o.label);
  return opts.length ? opts : [{ id: fallbackId, label: fallbackLabel, priceDelta: 0 }];
}