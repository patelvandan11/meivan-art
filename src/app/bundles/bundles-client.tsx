"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Gift, Truck } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { PlantArtMatchmaker } from "@/components/home/plant-art-matchmaker";
import { products as initialProducts } from "@/lib/data/products";

export function BundlesClient() {
  const bundles = useMemo(() => {
    return initialProducts.filter(
      (p) =>
        p.productType === "bundle" ||
        p.categorySlug === "plant-art-bundles" ||
        p.tags?.includes("bundle")
    );
  }, []);

  return (
    <div className="min-h-screen pb-24">
      {/* 🎁 Bundles Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-500/10 via-terracotta/5 to-transparent pt-28 pb-16 px-4 sm:px-6 lg:px-8 border-b border-border/40">
        <div className="mx-auto max-w-5xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-500/30 px-4 py-1.5 text-xs font-semibold text-purple-900 dark:text-purple-300 mb-4"
          >
            <Gift className="h-4 w-4 text-purple-600" />
            <span>Harmonious Pairings • Save Up to ₹1,500</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground"
          >
            Curated Sanctuary Sets:{" "}
            <span className="bg-gradient-to-r from-purple-600 via-terracotta to-emerald-600 bg-clip-text text-transparent">
              Art & Plant Bundles
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            Complete room transformations in one thoughtfully curated box. An original stretched canvas painting paired with a healthy potted indoor plant in an artisan hand-painted planter.
          </motion.p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5 text-purple-700 dark:text-purple-400 font-semibold">
              <Gift className="h-4 w-4" /> Ready-to-Gift Luxury Box
            </span>
            <span className="hidden sm:inline opacity-40">•</span>
            <span className="flex items-center gap-1.5 text-purple-700 dark:text-purple-400 font-semibold">
              <Truck className="h-4 w-4" /> Safe Eco-Friendly Delivery
            </span>
            <span className="hidden sm:inline opacity-40">•</span>
            <span className="flex items-center gap-1.5 text-purple-700 dark:text-purple-400 font-semibold">
              <ShieldCheck className="h-4 w-4" /> Plant Guarantee Included
            </span>
          </div>
        </div>
      </section>

      {/* Grid of Curated Bundles */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <div className="border-b border-border/60 pb-4">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold">Featured Sanctuary Bundles</h2>
          <p className="text-sm text-muted-foreground mt-1">Pre-styled pairings curated by artist Vandan.</p>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {bundles.map((bundle) => (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard product={bundle} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Matchmaker for Custom Bundles */}
      <div className="mt-16">
        <PlantArtMatchmaker />
      </div>
    </div>
  );
}
