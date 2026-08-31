import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// Load .env.local manually (script runs outside Next)

import { loadEnv } from "./env.mjs"; loadEnv();
if (!process.env.MONGODB_URI) { console.error("❌ Set MONGODB_URI in .env.local"); process.exit(1); }

const plants = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "data/plants.json"), "utf8"));
await mongoose.connect(process.env.MONGODB_URI);

// Same collection Mongoose uses for the Product model
const Seed = mongoose.model("SeedProduct", new mongoose.Schema({}, { strict: false, collection: "products" }));

// await Seed.deleteMany({});
// await Seed.insertMany(plants.map((p) => ({ ...p, createdAt: new Date(), updatedAt: new Date() })));
// console.log(`🌱 Seeded ${plants.length} plants into "products"`);
// await mongoose.disconnect();

const ops = plants.map((p) => ({
  updateOne: {
    filter: { slug: p.slug },
    update: { $set: { ...p, updatedAt: new Date() } },
    upsert: true,
  },
}));
await Seed.bulkWrite(ops);
console.log(`🌱 Upserted ${plants.length} plants — edits made in /admin are preserved`);