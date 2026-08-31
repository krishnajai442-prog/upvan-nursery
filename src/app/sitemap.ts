import { MetadataRoute } from "next";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const staticRoutes = ["", "/products", "/login", "/signup"].map((r) => ({
    url: `${base}${r}`, lastModified: new Date(), changeFrequency: "daily" as const, priority: r === "" ? 1 : 0.7,
  }));
  try {
    await dbConnect();
    const docs = await Product.find().select("slug updatedAt").lean();
    return [...staticRoutes, ...docs.map((p: any) => ({
      url: `${base}/products/${p.slug}`, lastModified: p.updatedAt ?? new Date(),
      changeFrequency: "weekly" as const, priority: 0.8,
    }))];
  } catch {
    return staticRoutes;
  }
}