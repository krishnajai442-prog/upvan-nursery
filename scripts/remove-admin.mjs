import mongoose from "mongoose";
import { loadEnv } from "./env.mjs";

loadEnv();
const email = process.argv[2];
if (!email) { console.error("Usage: npm run remove-admin -- you@email.com"); process.exit(1); }
if (!process.env.MONGODB_URI) { console.error("❌ MONGODB_URI missing"); process.exit(1); }

await mongoose.connect(process.env.MONGODB_URI);
const res = await mongoose.connection.db.collection("users")
  .updateOne({ email: email.toLowerCase() }, { $set: { role: "user" } });
console.log(res.matchedCount ? `✅ ${email} is no longer an admin` : "❌ No user with that email found.");
await mongoose.disconnect();