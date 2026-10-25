"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Palette, Sparkles, ShieldCheck, CheckCircle2, ArrowRight, MessageCircle } from "lucide-react";
import { getWhatsAppUrl, buildGeneralInquiryWhatsAppMessage } from "@/lib/whatsapp";
import { ProductCard } from "@/components/product/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { products as initialProducts } from "@/lib/data/products";

type ArtThemeFilter = "all" | "sunset" | "galaxy" | "botanical" | "journal";

export function ArtClient() {
  const [search, setSearch] = useState("");
  const [themeFilter, setThemeFilter] = useState<ArtThemeFilter>("all");

  // Filter art products
  const artProducts = useMemo(() => {
    return initialProducts.filter(
      (p) =>
        p.productType === "art" ||
        p.categorySlug === "paintings" ||
        p.categorySlug === "botanical-art" ||
        p.categorySlug === "journals"
    );
  }, []);

  const filtered = useMemo(() => {
    return artProducts.filter((p) => {
      // Search
      if (search) {
        const q = search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesTags = p.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesTags) return false;
      }

      // Theme filter
      if (themeFilter === "sunset") {
        return (
          p.tags?.some((t) => t.includes("sunset") || t.includes("sun")) ||
          p.name.toLowerCase().includes("sunset")
        );
      }
      if (themeFilter === "galaxy") {
        return (
          p.tags?.some((t) => t.includes("galaxy") || t.includes("astronomy") || t.includes("celestial")) ||
          p.name.toLowerCase().includes("celestial")
        );
      }
      if (themeFilter === "botanical") {
        return (
          p.categorySlug === "botanical-art" ||
          p.tags?.some((t) => t.includes("botanical") || t.includes("foliage") || t.includes("leaf"))
        );
      }
      if (themeFilter === "journal") {
        return p.categorySlug === "journals";
      }

      return true;
    });
  }, [artProducts, search, themeFilter]);

  return (
    <div className="min-h-screen pb-24">
      {/* 🎨 Studio Art Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-terracotta/5 to-transparent pt-28 pb-16 px-4 sm:px-6 lg:px-8 border-b border-border/40">
        <div className="absolute top-10 right-10 hidden lg:block opacity-20 pointer-events-none">
          <Palette className="h-96 w-96 text-terracotta animate-pulse-soft" />
        </div>

        <div className="mx-auto max-w-5xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-500/30 px-4 py-1.5 text-xs font-semibold text-amber-900 dark:text-amber-300 mb-4"
          >
            <Palette className="h-4 w-4 text-terracotta" />
            <span>Studio Fine Art & Original Storytelling Canvases</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground"
          >
            Art That Tells a Story:{" "}
            <span className="bg-gradient-to-r from-terracotta via-amber-600 to-rose-600 bg-clip-text text-transparent">
              Original Canvases
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            Individually painted with heavyweight acrylics and luminescent oils on stretched cotton canvas. From emotional sunset gradients to swirling deep astronomy nebulae.
          </motion.p>

          {/* Art Guarantees Banner */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5 text-terracotta font-semibold">
              <ShieldCheck className="h-4 w-4" /> 100% Original One-of-a-Kind
            </span>
            <span className="hidden sm:inline opacity-40">•</span>
            <span className="flex items-center gap-1.5 text-terracotta font-semibold">
              <Sparkles className="h-4 w-4" /> Signed Certificate of Authenticity
            </span>
            <span className="hidden sm:inline opacity-40">•</span>
            <span className="flex items-center gap-1.5 text-terracotta font-semibold">
              <CheckCircle2 className="h-4 w-4" /> Stretched & Ready to Hang
            </span>
          </div>
        </div>
      </section>

      {/* 🔍 Search & Themes Filter */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-border/60">
          {/* Search */}
          <div className="w-full md:w-80">
            <Input
              placeholder="Search paintings (Sunset, Celestial...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-full"
            />
          </div>

          {/* Theme Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-center md:justify-end">
            {[
              { id: "all", label: "✨ All Works" },
              { id: "sunset", label: "🌅 Sunsets & Landscapes" },
              { id: "galaxy", label: "🌌 Astronomy & Nebulae" },
              { id: "botanical", label: "🍃 Botanical Prints" },
              { id: "journal", label: "📖 Handbound Journals" },
            ].map((theme) => (
              <button
                key={theme.id}
                onClick={() => setThemeFilter(theme.id as ArtThemeFilter)}
                className={`rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                  themeFilter === theme.id
                    ? "bg-terracotta text-white shadow-xs scale-105"
                    : "bg-card border border-border/70 text-muted-foreground hover:text-foreground"
                }`}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>

        {/* Counter */}
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {filtered.length} original artworks</span>
          {(themeFilter !== "all" || search) && (
            <button
              onClick={() => {
                setThemeFilter("all");
                setSearch("");
              }}
              className="text-terracotta hover:underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Art Cards Grid */}
        <div className="mt-8">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Palette className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
              <h3 className="text-lg font-semibold">No artworks match your search</h3>
              <p className="text-sm text-muted-foreground mt-1">Try resetting the filter pills.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setThemeFilter("all");
                  setSearch("");
                }}
              >
                View All Artworks
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((art) => (
                <motion.div
                  key={art.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <ProductCard product={art} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* 🎨 About the Artist Spotlight */}
        <section className="mt-24 rounded-3xl border border-border/70 bg-secondary/30 p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-soft-lg">
              <Image
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80"
                alt="Artist studio painting easel"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">
                Meet the Creator
              </span>
              <h2 className="mt-1 font-heading text-3xl font-bold">Vandan Patel</h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                &ldquo;Every painting begins with an emotion — the tranquil stillness of a twilight sunset, the wonder of gazing into deep cosmic constellations, or the mindful rhythm of lush jungle leaves. Art should bring grounded peace and warmth to the spaces where you live and dream.&rdquo;
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={getWhatsAppUrl(buildGeneralInquiryWhatsAppMessage("Custom Canvas Painting Commission"))}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold">
                    <MessageCircle className="h-4 w-4 fill-current" />
                    Book Commission via WhatsApp
                  </Button>
                </a>
                <Link href="/gallery">
                  <Button size="lg" variant="outline" className="gap-2">
                    Browse Community Gallery 🖼️
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
