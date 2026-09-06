import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let productUrls: MetadataRoute.Sitemap = [];
  try {
    const products = await db.getProductsListing(true);
    productUrls = products.map((p) => ({
      url: `https://pokkystozy.xyz/setting/${p.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {}

  return [
    {
      url: "https://pokkystozy.xyz",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...productUrls,
  ];
}

