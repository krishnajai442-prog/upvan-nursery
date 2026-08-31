import mongoose from "mongoose";
import { loadEnv } from "./env.mjs";

loadEnv();
const email = process.argv[2];
if (!email) { console.error("Usage: npm run make-admin -- you@email.com"); process.exit(1); }
if (!process.env.MONGODB_URI) { console.error("❌ MONGODB_URI missing"); process.exit(1); }

await mongoose.connect(process.env.MONGODB_URI);
const res = await mongoose.connection.db.collection("users")
  .updateOne({ email: email.toLowerCase() }, { $set: { role: "admin" } });
console.log(res.matchedCount ? `✅ ${email} is now an admin` : "❌ No user with that email — sign up on the site first, then re-run.");
await mongoose.disconnect();