"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { categories as initialCategories } from "@/lib/data/products";
import type { Product } from "@/types";

type CategoryFilter = "all" | "plant" | "art" | "both";

export function CategoriesSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("all");

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

  const filteredCategories = initialCategories.filter((cat) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "plant") return cat.type === "plant";
    if (activeFilter === "art") return cat.type === "art";
    if (activeFilter === "both") return cat.type === "both" || cat.type === "plant" || cat.type === "art";
    return true;
  });

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary/80 px-3.5 py-1 text-xs font-semibold text-terracotta mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Curated Botanical & Art Collections
          </div>
          <h2 className="font-heading text-4xl font-semibold md:text-5xl">
            Explore by Category
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            From breath-giving indoor houseplants to soulful original canvas paintings, find what speaks to your home.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "all", label: "✨ All Collections" },
              { id: "plant", label: "🌿 Plants & Planters" },
              { id: "art", label: "🎨 Paintings & Art" },
              { id: "both", label: "🎁 Curated Bundles" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as CategoryFilter)}
                className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all ${
                  activeFilter === tab.id
                    ? "bg-terracotta text-white shadow-sm scale-105"
                    : "bg-card border border-border/70 text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          layout
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {filteredCategories.map((category) => {
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
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href={`/shop?category=${category.slug}`}
                    className="group relative block overflow-hidden rounded-card border border-border/50 bg-card dark:border-white/10 dark:hover:border-terracotta/50 shadow-soft transition-all duration-300 hover:shadow-soft-lg"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={displayImage}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity group-hover:from-black/90" />
                      
                      {/* Top icon pill */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
                          <span>{category.icon || "🌿"}</span>
                          <span>{category.type === "plant" ? "Botanical" : category.type === "art" ? "Art Studio" : "Art & Nature"}</span>
                        </span>
                      </div>

                      {/* Bottom title & count */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <div className="flex items-end justify-between">
                          <div>
                            <h3 className="font-heading text-2xl font-semibold text-white group-hover:text-amber-200 transition-colors">
                              {category.name}
                            </h3>
                            <p className="mt-1 text-xs text-white/75 line-clamp-1">
                              {category.description}
                            </p>
                            <p className="mt-2 text-xs font-medium text-amber-300">
                              {count} {count === 1 ? "item available" : "items available"}
                            </p>
                          </div>
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all group-hover:scale-110 group-hover:bg-terracotta text-white">
                            <ArrowUpRight className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
