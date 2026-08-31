import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { randomUUID } from "crypto";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await dbConnect();
  const user = await User.findById(session.user.id);
  return NextResponse.json({ addresses: user?.addresses ?? [] });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const a = await req.json();
  if (!a?.fullName || !a?.phone || !a?.line1 || !a?.city || !a?.state || !/^\d{6}$/.test(a?.pincode ?? ""))
    return NextResponse.json({ error: "Incomplete address." }, { status: 400 });

  await dbConnect();
  const user = await User.findById(session.user.id);
  user.addresses.push({
    id: randomUUID(), label: a.label || "Home", fullName: a.fullName, phone: a.phone,
    line1: a.line1, line2: a.line2 ?? "", city: a.city, state: a.state,
    pincode: a.pincode, isDefault: user.addresses.length === 0,
  });
  await user.save();
  return NextResponse.json({ addresses: user.addresses });
}