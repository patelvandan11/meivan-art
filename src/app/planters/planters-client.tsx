"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Droplets, Wind } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { products as initialProducts } from "@/lib/data/products";

type MaterialFilter = "all" | "terracotta" | "ceramic";

export function PlantersClient() {
  const [search, setSearch] = useState("");
  const [materialFilter, setMaterialFilter] = useState<MaterialFilter>("all");

  const planterProducts = useMemo(() => {
    return initialProducts.filter(
      (p) =>
        p.productType === "planter" ||
        p.categorySlug === "planters" ||
        p.tags?.some((t) => t.includes("pot") || t.includes("planter"))
    );
  }, []);

  const filtered = useMemo(() => {
    return planterProducts.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesTags = p.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesTags) return false;
      }

      if (materialFilter === "terracotta") {
        return p.name.toLowerCase().includes("terracotta") || p.tags?.includes("terracotta");
      }
      if (materialFilter === "ceramic") {
        return p.name.toLowerCase().includes("ceramic") || p.tags?.includes("ceramic");
      }

      return true;
    });
  }, [planterProducts, search, materialFilter]);

  return (
    <div className="min-h-screen pb-24">
      {/* 🏺 Planters Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-600/10 via-terracotta/5 to-transparent pt-28 pb-16 px-4 sm:px-6 lg:px-8 border-b border-border/40">
        <div className="mx-auto max-w-5xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-500/30 px-4 py-1.5 text-xs font-semibold text-amber-900 dark:text-amber-300 mb-4"
          >
            <span>🏺 Hand-Painted Pottery & Ceramic Studio</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground"
          >
            Planters as Canvases:{" "}
            <span className="bg-gradient-to-r from-terracotta via-amber-600 to-amber-700 bg-clip-text text-transparent">
              Hand-Painted Pots
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            Turn your houseplants into living sculptures. Our breathable earthenware terracotta and high-fired ceramic planters are individually hand-painted with sunset gradients and botanical motifs.
          </motion.p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5 text-terracotta font-semibold">
              <Droplets className="h-4 w-4" /> Built-in Drainage Holes
            </span>
            <span className="hidden sm:inline opacity-40">•</span>
            <span className="flex items-center gap-1.5 text-terracotta font-semibold">
              <Wind className="h-4 w-4" /> Breathable Root Aeration
            </span>
            <span className="hidden sm:inline opacity-40">•</span>
            <span className="flex items-center gap-1.5 text-terracotta font-semibold">
              <ShieldCheck className="h-4 w-4" /> Sealed UV & Water-Resistant Coat
            </span>
          </div>
        </div>
      </section>

      {/* 🔍 Filters & Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div className="w-full md:w-80">
            <Input
              placeholder="Search pots (Terracotta, Fern...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-full"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "✨ All Pots" },
              { id: "terracotta", label: "🏺 Terracotta Earthenware" },
              { id: "ceramic", label: "✨ Glazed Ceramic" },
            ].map((mat) => (
              <button
                key={mat.id}
                onClick={() => setMaterialFilter(mat.id as MaterialFilter)}
                className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                  materialFilter === mat.id
                    ? "bg-terracotta text-white shadow-xs scale-105"
                    : "bg-card border border-border/70 text-muted-foreground hover:text-foreground"
                }`}
              >
                {mat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {filtered.length} artisan planters</span>
          {(materialFilter !== "all" || search) && (
            <button
              onClick={() => {
                setMaterialFilter("all");
                setSearch("");
              }}
              className="text-terracotta hover:underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="mt-8">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <h3 className="text-lg font-semibold">No planters match your search</h3>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setMaterialFilter("all");
                  setSearch("");
                }}
              >
                Show All Planters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((planter) => (
                <motion.div
                  key={planter.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <ProductCard product={planter} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Terracotta Benefits Card */}
        <section className="mt-24 rounded-3xl border border-border/70 bg-secondary/30 p-8 sm:p-12">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">
              Horticultural Design
            </span>
            <h2 className="mt-1 font-heading text-3xl font-bold">Why Pots Matter to Plants</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Plastic pots suffocate roots. Natural clay breathes, wicks away excess moisture, and prevents the root decay common in indoor environments.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link href="/plants">
              <Button size="lg" className="gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold">
                Explore Indoor Plants to Pair 🌿
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
