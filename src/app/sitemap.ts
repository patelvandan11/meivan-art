import type { MetadataRoute } from "next";
import { getAllProductsFromStore } from "@/lib/products-store";
import { categories, artists } from "@/lib/data/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://meivan-art.vercel.app";
  const now = new Date();

  // 1. Core High-Priority Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/artists`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/site-map`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/ai`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ai/room-decor`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ai/gift-finder`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // 2. SEO Category Filter Routes
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/shop?category=${cat.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // 3. Artist Profile Routes
  const artistRoutes: MetadataRoute.Sitemap = (artists || []).map((artist) => ({
    url: `${baseUrl}/artists/${artist.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  // 4. Dynamic Product Detail Routes
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getAllProductsFromStore();
    productRoutes = products.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (err) {
    console.error("[Sitemap Error]: Failed to fetch products for sitemap", err);
  }

  return [...staticRoutes, ...categoryRoutes, ...artistRoutes, ...productRoutes];
}
