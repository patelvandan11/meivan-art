"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Check, ShoppingBag, Leaf, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { products } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";

interface PairRecommendation {
  space: string;
  light: string;
  plantSlug: string;
  artSlug: string;
  title: string;
  tagline: string;
}

const recommendations: PairRecommendation[] = [
  {
    space: "living-room",
    light: "bright",
    plantSlug: "monstera-deliciosa-artisan-pot",
    artSlug: "sunset-serenade-original-canvas-painting",
    title: "The Golden Hour Sanctuary",
    tagline: "Lush tropical Monstera paired with warm sunset canvas for statement elegance.",
  },
  {
    space: "work-desk",
    light: "medium",
    plantSlug: "jade-plant-bonsai-prosperity-succulent",
    artSlug: "emerald-whispers-botanical-foliage-art",
    title: "The Focused Creator Duo",
    tagline: "Bonsai jade succulent + botanical mini art to inspire calm, productive energy.",
  },
  {
    space: "bedroom",
    light: "low",
    plantSlug: "variegated-snake-plant-sansevieria",
    artSlug: "celestial-dreams-astronomy-nebula-canvas",
    title: "The Midnight Dreamscape",
    tagline: "NASA air-purifying snake plant + celestial nebula oil canvas for serene sleep.",
  },
  {
    space: "gift",
    light: "any",
    plantSlug: "golden-pothos-trailing-vine-pot",
    artSlug: "sunset-horizon-hand-painted-planter",
    title: "The Thoughtful Mindful Gift",
    tagline: "Trailing golden pothos in an artist hand-painted terracotta sunset planter.",
  },
];

export function PlantArtMatchmaker() {
  const [selectedSpace, setSelectedSpace] = useState<string>("living-room");
  const [selectedLight, setSelectedLight] = useState<string>("bright");
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((s) => s.addItem);

  const matched =
    recommendations.find(
      (r) => r.space === selectedSpace && (r.light === selectedLight || r.light === "any")
    ) || recommendations[0];

  const plantProduct = products.find((p) => p.slug === matched.plantSlug) || products[0];
  const artProduct = products.find((p) => p.slug === matched.artSlug) || products[7];

  function handleAddBundle() {
    if (plantProduct) addToCart(plantProduct);
    if (artProduct) addToCart(artProduct);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-secondary/40 via-background to-background">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/25 px-4 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Interactive Space Stylist
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold">
            Find Your Perfect Art & Plant Match
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
            Tell us about your room in 2 quick clicks. Our botanical stylist pairs a healthy plant with complementary original canvas art.
          </p>
        </div>

        {/* Step 1 & Step 2 Controls */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="w-full md:w-auto">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 text-center md:text-left">
              1. Choose Your Room / Corner:
            </label>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { id: "living-room", label: "🛋️ Living Room" },
                { id: "work-desk", label: "💻 Work Desk" },
                { id: "bedroom", label: "🛏️ Bedroom" },
                { id: "gift", label: "🎁 Curated Gift" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedSpace(opt.id)}
                  className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all ${
                    selectedSpace === opt.id
                      ? "bg-emerald-700 text-white shadow-sm scale-105"
                      : "bg-card border border-border/70 text-foreground hover:bg-secondary"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full md:w-auto">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 text-center md:text-left">
              2. Available Sunlight:
            </label>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { id: "bright", label: "☀️ Bright Indirect" },
                { id: "medium", label: "⛅ Moderate Light" },
                { id: "low", label: "🌙 Low Light / Shade" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedLight(opt.id)}
                  className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all ${
                    selectedLight === opt.id
                      ? "bg-terracotta text-white shadow-sm scale-105"
                      : "bg-card border border-border/70 text-foreground hover:bg-secondary"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Match Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedSpace}-${selectedLight}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="mt-12 rounded-3xl border border-border/70 bg-card/90 backdrop-blur-md p-6 sm:p-8 lg:p-10 shadow-soft-lg"
          >
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              
              {/* Left: Two paired products visual */}
              <div className="grid grid-cols-2 gap-4 w-full lg:w-1/2">
                {/* Plant Card */}
                <div className="group relative rounded-2xl overflow-hidden border border-border/60 bg-background p-2">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                    <Image
                      src={plantProduct.images[0]}
                      alt={plantProduct.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="220px"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="rounded-full bg-emerald-800 text-white text-[10px] font-semibold px-2 py-0.5 flex items-center gap-1 shadow-xs">
                        <Leaf className="h-3 w-3" /> Plant
                      </span>
                    </div>
                  </div>
                  <div className="p-2">
                    <h4 className="text-xs sm:text-sm font-semibold line-clamp-1">{plantProduct.name}</h4>
                    <p className="text-xs text-terracotta font-medium mt-0.5">{formatPrice(plantProduct.price)}</p>
                  </div>
                </div>

                {/* Art Card */}
                <div className="group relative rounded-2xl overflow-hidden border border-border/60 bg-background p-2">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                    <Image
                      src={artProduct.images[0]}
                      alt={artProduct.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="220px"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="rounded-full bg-amber-800 text-white text-[10px] font-semibold px-2 py-0.5 flex items-center gap-1 shadow-xs">
                        <Palette className="h-3 w-3" /> Art
                      </span>
                    </div>
                  </div>
                  <div className="p-2">
                    <h4 className="text-xs sm:text-sm font-semibold line-clamp-1">{artProduct.name}</h4>
                    <p className="text-xs text-terracotta font-medium mt-0.5">{formatPrice(artProduct.price)}</p>
                  </div>
                </div>
              </div>

              {/* Right: Recommendation Details & Bundle Action */}
              <div className="w-full lg:w-1/2 flex flex-col items-start justify-center">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-3">
                  <Check className="h-3.5 w-3.5" /> Perfect Compatibility Match
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold">
                  {matched.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {matched.tagline}
                </p>

                <div className="mt-6 p-4 rounded-2xl bg-secondary/60 border border-border/50 w-full">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">Combined Pairing Price:</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-terracotta">
                        {formatPrice(plantProduct.price + artProduct.price)}
                      </span>
                      {(plantProduct.comparePrice || artProduct.comparePrice) && (
                        <span className="text-xs line-through text-muted-foreground">
                          {formatPrice((plantProduct.comparePrice || plantProduct.price) + (artProduct.comparePrice || artProduct.price))}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Includes potted plant in artisan container, canvas artwork, and free plant care card.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 w-full">
                  <Button
                    size="lg"
                    onClick={handleAddBundle}
                    className="flex-1 gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition-all hover:scale-102"
                  >
                    {added ? (
                      <>
                        <Check className="h-4 w-4" /> Added Both to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" /> Add This Pairing to Cart
                      </>
                    )}
                  </Button>
                  <Link href={`/product/${plantProduct.slug}`}>
                    <Button variant="outline" size="lg" className="gap-1.5">
                      View Plant <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
