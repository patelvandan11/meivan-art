"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, Palette } from "lucide-react";
import { categories as initialCategories } from "@/lib/data/products";
import type { Product } from "@/types";

export function CategoriesSection() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error("Error loading products for categories:", err));
  }, []);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary/80 px-3.5 py-1 text-xs font-semibold text-terracotta mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Curated Studio Art Collections
          </div>
          <h2 className="font-heading text-4xl font-semibold md:text-5xl">
            Explore Art Collections
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            From atmospheric sunset canvases to lush botanical studies and handbound sketchbooks, find artwork that brings warmth and contemplation into your sanctuary.
          </p>
        </div>

        <motion.div
          layout
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {initialCategories.map((category) => {
            const matchingProducts = products.filter(
              (p) =>
                p.categorySlug?.toLowerCase() === category.slug.toLowerCase() ||
                p.category?.toLowerCase() === category.name.toLowerCase()
            );
            const count = matchingProducts.length > 0 ? matchingProducts.length : category.productCount;
            const displayImage =
              matchingProducts.length > 0 && matchingProducts[0].images?.[0]
                ? matchingProducts[0].images[0]
                : category.image;

            return (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-card border border-border/70 shadow-sm transition-all duration-300 hover:shadow-soft-lg hover:border-terracotta/40"
                >
                  <Image
                    src={displayImage}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {category.icon && (
                          <span className="text-xl">{category.icon}</span>
                        )}
                        <h3 className="font-heading text-xl font-bold">
                          {category.name}
                        </h3>
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-xs transition-transform group-hover:scale-110 group-hover:bg-terracotta">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="mt-1.5 text-xs text-white/80 line-clamp-2">
                      {category.description}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-terracotta dark:text-amber-300">
                      {count} {count === 1 ? "Artwork" : "Artworks"} Available
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
