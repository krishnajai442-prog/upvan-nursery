import mongoose from "mongoose";

const cached = (global as any)._mongoose ?? { conn: null, promise: null };
(global as any)._mongoose = cached;

export default async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not set");
    cached.promise = mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}