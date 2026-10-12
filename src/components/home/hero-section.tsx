"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Sun, Moon, Leaf, Palette, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type VibeMode = "both" | "plants" | "art";

const floatingCards = [
  {
    src: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&q=80",
    alt: "Monstera Deliciosa Indoor Plant",
    caption: "Monstera Deliciosa",
    badge: "🌿 Air Purifying",
    type: "plants",
  },
  {
    src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80",
    alt: "Sunset Serenade Canvas Painting",
    caption: "Sunset Serenade",
    badge: "🎨 100% Original",
    type: "art",
  },
  {
    src: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80",
    alt: "Hand-Painted Terracotta Planter",
    caption: "Sunset Horizon Pot",
    badge: "🏺 Artisan Painted",
    type: "plants",
  },
  {
    src: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80",
    alt: "Art and Plant Sanctuary Bundle",
    caption: "Zen Corner Bundle",
    badge: "🎁 Art + Plant Duo",
    type: "both",
  },
];

const vibeData: Record<
  VibeMode,
  {
    badgeText: string;
    headlineStart: string;
    headlineHighlight: string;
    headlineEnd: string;
    description: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  }
> = {
  both: {
    badgeText: "Art That Tells a Story • Plants That Breathe Life",
    headlineStart: "Where Handcrafted Art Meets ",
    headlineHighlight: "Living Nature.",
    headlineEnd: "",
    description:
      "Transform your sanctuary with original handmade canvas paintings, healthy indoor houseplants, and artisan hand-painted pots. Curated for mindful spaces and creative souls.",
    primaryCta: { label: "Shop Art & Plants", href: "/shop" },
    secondaryCta: { label: "Explore Bundles 🎁", href: "/shop?category=plant-art-bundles" },
  },
  plants: {
    badgeText: "Lush Indoor Plants • Hand-Painted Planters",
    headlineStart: "Breathe Life Into Your Space with ",
    headlineHighlight: "Lush Plants.",
    headlineEnd: "",
    description:
      "Healthy, easy-to-care indoor houseplants potted in hand-painted terracotta planters. Delivered carefully across India with soil-safe, eco-friendly packaging.",
    primaryCta: { label: "Browse Live Plants 🌿", href: "/shop?category=indoor-plants" },
    secondaryCta: { label: "Hand-Painted Pots 🏺", href: "/shop?category=planters" },
  },
  art: {
    badgeText: "Original Storytelling Paintings on Canvas",
    headlineStart: "Fill Your Walls with ",
    headlineHighlight: "Soulful Stories.",
    headlineEnd: "",
    description:
      "Original acrylic and oil paintings celebrating sunsets, celestial astronomy, botanical wonder, and human emotion. Each canvas is 100% handcrafted and unique.",
    primaryCta: { label: "Browse Paintings 🎨", href: "/shop?category=paintings" },
    secondaryCta: { label: "Botanical Prints 🍃", href: "/shop?category=botanical-art" },
  },
};

export function HeroSection() {
  const [activeVibe, setActiveVibe] = useState<VibeMode>("both");
  const current = vibeData[activeVibe];

  return (
    <section className="relative min-h-[94vh] overflow-hidden flex items-center justify-center pt-24 pb-16">
      {/* ☀️ Day Mode Background Image */}
      <div className="absolute inset-0 block dark:hidden">
        <Image
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80"
          alt="Sunlit botanical art studio canvas"
          fill
          className="object-cover object-center scale-105"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/50 via-emerald-50/20 to-transparent" />
      </div>

      {/* 🌙 Night Mode Background Image */}
      <div className="absolute inset-0 hidden dark:block">
        <Image
          src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80"
          alt="Midnight starry botanical art canvas"
          fill
          className="object-cover object-center brightness-75 contrast-125"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
        
        {/* Luminous Ambient Glowing Light Orbs */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-emerald-600/20 blur-[130px] pointer-events-none animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-terracotta/25 blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/3 h-64 w-64 rounded-full bg-amber-500/15 blur-[100px] pointer-events-none" />
      </div>

      {/* Playful Floating Stickers (Leaf, Palette, Sparkles) */}
      <div className="absolute top-28 left-8 hidden lg:flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 backdrop-blur-md animate-sway shadow-sm z-10">
        <Leaf className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          Fresh Living Plants
        </span>
      </div>

      <div className="absolute bottom-28 left-12 hidden lg:flex items-center gap-2 rounded-full bg-terracotta/10 border border-terracotta/25 px-3 py-1.5 backdrop-blur-md animate-bounce-soft shadow-sm z-10">
        <Palette className="h-4 w-4 text-terracotta" />
        <span className="text-xs font-semibold text-terracotta">
          Hand-Painted Canvases
        </span>
      </div>

      <div className="absolute top-32 right-12 hidden lg:flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 backdrop-blur-md animate-float shadow-sm z-10">
        <Sparkles className="h-4 w-4 text-amber-500" />
        <span className="text-xs font-semibold text-amber-600 dark:text-amber-300">
          Artisan Made with Love
        </span>
      </div>

      {/* Floating Art & Plant Cards */}
      {floatingCards.map((item, i) => (
        <motion.div
          key={item.caption}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: i * 0.15 }}
          className="absolute hidden animate-float lg:block z-10"
          style={{
            top: `${14 + i * 19}%`,
            left: i % 2 === 0 ? `${3.5 + i * 3.5}%` : "auto",
            right: i % 2 !== 0 ? `${3.5 + i * 2.5}%` : "auto",
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${5.5 + i}s`,
          }}
        >
          <div className="group relative h-40 w-40 rotate-1 rounded-3xl p-1.5 transition-all duration-500 hover:scale-110 hover:rotate-0
            bg-white/85 shadow-[0_12px_32px_rgba(61,48,40,0.12)] ring-1 ring-white/80 backdrop-blur-md
            dark:bg-[#161311]/90 dark:ring-1 dark:ring-white/20 dark:shadow-[0_0_30px_rgba(201,124,93,0.3)] dark:border dark:border-white/10"
          >
            <div className="relative h-full w-full overflow-hidden rounded-2xl">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="160px"
                loading="lazy"
              />
              <div className="absolute top-2 left-2 z-10">
                <span className="rounded-full bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium text-white shadow-xs">
                  {item.badge}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-90 transition-opacity duration-300 flex items-end p-2.5">
                <span className="text-[11px] font-semibold text-white/95 leading-tight">
                  {item.caption}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Hero Center Content */}
      <div className="relative z-20 mx-auto max-w-4xl px-4 text-center flex flex-col items-center justify-center">
        
        {/* Dynamic Mode Badge */}
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 mb-6
          bg-amber-100/90 text-amber-900 border border-amber-200/80 shadow-xs
          dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700/40 dark:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          <span className="inline-flex items-center gap-1.5 dark:hidden text-amber-800 font-medium">
            <Sun className="h-3.5 w-3.5 text-amber-600" /> Botanical Studio & Art House
          </span>
          <span className="hidden dark:inline-flex items-center gap-1.5 text-emerald-300 font-medium">
            <Moon className="h-3.5 w-3.5 text-emerald-400" /> Midnight Garden & Art Gallery
          </span>
        </div>

        {/* Fun Interactive Vibe Switcher Pills */}
        <div className="mb-6 inline-flex rounded-full bg-card/80 p-1 border border-border/80 shadow-sm backdrop-blur-md">
          <button
            onClick={() => setActiveVibe("both")}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
              activeVibe === "both"
                ? "bg-terracotta text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>✨ Art & Plants</span>
          </button>
          <button
            onClick={() => setActiveVibe("plants")}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
              activeVibe === "plants"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>🌿 Live Plants</span>
          </button>
          <button
            onClick={() => setActiveVibe("art")}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
              activeVibe === "art"
                ? "bg-amber-700 text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>🎨 Original Art</span>
          </button>
        </div>

        {/* Animated Hero Headline */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeVibe}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center"
          >
            <h1 className="max-w-3xl font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              <span className="text-foreground">
                {current.headlineStart}
              </span>
              <span className="bg-gradient-to-r from-terracotta via-amber-600 to-emerald-600 bg-clip-text text-transparent dark:from-amber-300 dark:via-orange-400 dark:to-emerald-400">
                {current.headlineHighlight}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href={current.primaryCta.href}>
            <Button
              size="lg"
              className="gap-2.5 px-7 py-6 text-base font-semibold shadow-lg transition-all duration-300 hover:scale-105
                bg-terracotta hover:bg-terracotta/90 text-white shadow-terracotta/25 hover:shadow-terracotta/40
                dark:bg-terracotta dark:hover:bg-terracotta/90 dark:text-white dark:shadow-[0_0_25px_rgba(201,124,93,0.45)]"
            >
              <Sparkles className="h-4 w-4" />
              {current.primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Link href={current.secondaryCta.href}>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 px-7 py-6 text-base font-semibold backdrop-blur-md transition-all duration-300 hover:scale-105
                border-border bg-white/70 hover:bg-white text-foreground
                dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white"
            >
              {current.secondaryCta.label}
            </Button>
          </Link>
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            100% Alive & Thriving Plant Guarantee
          </span>
          <span className="hidden sm:inline-block opacity-40">•</span>
          <span className="inline-flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-terracotta" />
            Certified Original Canvas Art
          </span>
          <span className="hidden sm:inline-block opacity-40">•</span>
          <span className="inline-flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Zero-Spill Eco Packaging
          </span>
        </div>
      </div>
    </section>
  );
}
