import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json().catch(() => ({}));
    if (!name || !email || !password)
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    if (password.length < 6)
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });

    await dbConnect();
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return NextResponse.json({ error: "Account already exists — try logging in." }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ name, email: email.toLowerCase(), passwordHash });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Signup failed." }, { status: 500 });
  }
}