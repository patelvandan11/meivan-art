"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, Sun, Droplets, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { products as initialProducts } from "@/lib/data/products";

type LightFilter = "all" | "bright" | "medium" | "low";
type CareFilter = "all" | "easy" | "air";

export function PlantsClient() {
  const [search, setSearch] = useState("");
  const [lightFilter, setLightFilter] = useState<LightFilter>("all");
  const [careFilter, setCareFilter] = useState<CareFilter>("all");

  // Filter only plant products
  const plantProducts = useMemo(() => {
    return initialProducts.filter(
      (p) =>
        p.productType === "plant" ||
        p.categorySlug === "indoor-plants" ||
        p.categorySlug === "succulents"
    );
  }, []);

  const filtered = useMemo(() => {
    return plantProducts.filter((p) => {
      // Search
      if (search) {
        const q = search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesTags = p.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesTags) return false;
      }

      // Light filter
      if (lightFilter !== "all" && p.plantCare) {
        const light = p.plantCare.light?.toLowerCase() || "";
        if (lightFilter === "bright" && !light.includes("bright")) return false;
        if (lightFilter === "medium" && !light.includes("medium") && !light.includes("moderate")) return false;
        if (lightFilter === "low" && !light.includes("low")) return false;
      }

      // Care filter
      if (careFilter === "easy" && p.plantCare) {
        const diff = p.plantCare.difficulty?.toLowerCase() || "";
        if (!diff.includes("easy") && !diff.includes("beginner") && !diff.includes("hard to kill")) return false;
      }
      if (careFilter === "air" && p.plantCare) {
        if (!p.plantCare.airPurifying) return false;
      }

      return true;
    });
  }, [plantProducts, search, lightFilter, careFilter]);

  return (
    <div className="min-h-screen pb-24">
      {/* 🌿 Animated Botanical Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent pt-28 pb-16 px-4 sm:px-6 lg:px-8 border-b border-border/40">
        <div className="absolute top-10 right-10 hidden lg:block opacity-20 pointer-events-none">
          <Leaf className="h-96 w-96 text-emerald-600 animate-sway" />
        </div>

        <div className="mx-auto max-w-5xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/30 px-4 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-4"
          >
            <Leaf className="h-4 w-4 text-emerald-600" />
            <span>Botanical Nursery & Living Greenery</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground"
          >
            Breathe Life Into Your Space with{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              Healthy Indoor Plants
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            Hand-nurtured, acclimated houseplants that purify indoor air and spark daily joy. Potted in breathable artisan planters and delivered across India with zero-mess root-lock packaging.
          </motion.p>

          {/* Plant Guarantees Banner */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" /> 100% Alive on Arrival Guarantee
            </span>
            <span className="hidden sm:inline opacity-40">•</span>
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <Droplets className="h-4 w-4" /> Hydrated Roots & Nutrient Soil
            </span>
            <span className="hidden sm:inline opacity-40">•</span>
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <Sparkles className="h-4 w-4" /> Hand-Painted Pot Included
            </span>
          </div>
        </div>
      </section>

      {/* 🔍 Interactive Filters & Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-border/60">
          {/* Search */}
          <div className="w-full md:w-80">
            <Input
              placeholder="Search plants (Monstera, Snake Plant...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-full"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-center md:justify-end">
            <div className="inline-flex rounded-full bg-secondary/60 p-1 border border-border/50">
              {[
                { id: "all", label: "All Plants" },
                { id: "easy", label: "🌿 Hard to Kill" },
                { id: "air", label: "✨ Air Purifying" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setCareFilter(opt.id as CareFilter)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    careFilter === opt.id
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="inline-flex rounded-full bg-secondary/60 p-1 border border-border/50">
              {[
                { id: "all", label: "All Lights" },
                { id: "bright", label: "☀️ Bright" },
                { id: "medium", label: "⛅ Moderate" },
                { id: "low", label: "🌙 Low Light" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setLightFilter(opt.id as LightFilter)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    lightFilter === opt.id
                      ? "bg-amber-700 text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {filtered.length} healthy indoor plants</span>
          {(lightFilter !== "all" || careFilter !== "all" || search) && (
            <button
              onClick={() => {
                setLightFilter("all");
                setCareFilter("all");
                setSearch("");
              }}
              className="text-terracotta hover:underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Plant Cards Grid */}
        <div className="mt-8">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Leaf className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
              <h3 className="text-lg font-semibold">No plants match your filter</h3>
              <p className="text-sm text-muted-foreground mt-1">Try resetting your filters or search keywords.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setLightFilter("all");
                  setCareFilter("all");
                  setSearch("");
                }}
              >
                Show All Plants
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((plant) => (
                <motion.div
                  key={plant.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <ProductCard product={plant} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* 📚 Plant Care 101 Guide Cards */}
        <section className="mt-24 rounded-3xl border border-border/70 bg-secondary/30 p-8 sm:p-12">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Botanical Wisdom
            </span>
            <h2 className="mt-1 font-heading text-3xl font-bold">Plant Care 101</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Every plant from Vandan Art & Plants arrives with an easy care card. Here are the golden rules to keep them flourishing:
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-xs">
              <Sun className="h-8 w-8 text-amber-500 mb-3" />
              <h3 className="font-heading text-lg font-bold">1. Light is Food</h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Most indoor plants thrive in bright, indirect light near an east or north window. Avoid harsh scorching midday rays on sensitive tropical leaves.
              </p>
            </div>

            <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-xs">
              <Droplets className="h-8 w-8 text-blue-500 mb-3" />
              <h3 className="font-heading text-lg font-bold">2. The 2-Inch Moisture Rule</h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Overwatering is the #1 danger. Poke your finger 2 inches into the soil. If it feels dry and powdery, it is time to give your plant a deep drink.
              </p>
            </div>

            <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-xs">
              <Leaf className="h-8 w-8 text-emerald-500 mb-3" />
              <h3 className="font-heading text-lg font-bold">3. Breathable Planters</h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Our hand-painted terracotta pots allow root systems to breathe and naturally regulate soil moisture, preventing waterlogging and root rot.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/shop?category=plant-art-bundles">
              <Button size="lg" className="gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold">
                Explore Art + Plant Bundles 🎁
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
