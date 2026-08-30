import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const floatingImages = [
  {
    src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&q=80",
    alt: "Classic Floral Painting",
    caption: "Original Painting",
  },
  {
    src: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300&q=80",
    alt: "Artisan Ceramic Mug",
    caption: "Handmade Ceramics",
  },
  {
    src: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=300&q=80",
    alt: "Botanical Journal",
    caption: "Handbound Journals",
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
    alt: "Artist Crafting",
    caption: "Artist Workshop",
  },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden flex items-center justify-center">
      {/* ☀️ Day Mode Background Image */}
      <div className="absolute inset-0 block dark:hidden">
        <Image
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80"
          alt="Daytime artistic canvas"
          fill
          className="object-cover object-center scale-105"
          priority
          sizes="100vw"
        />
        {/* Day Mode Warm Soft Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf7f2]/75 via-[#faf7f2]/55 to-[#faf7f2]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/40 via-transparent to-transparent" />
      </div>

      {/* 🌙 Night Mode Background Image */}
      <div className="absolute inset-0 hidden dark:block">
        <Image
          src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80"
          alt="Midnight starry artistic canvas"
          fill
          className="object-cover object-center brightness-75 contrast-125"
          priority
          sizes="100vw"
        />
        {/* Night Mode Deep Obsidian Overlay with Cosmic Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908]/90 via-[#0a0908]/75 to-[#0a0908]" />
        
        {/* Luminous Ambient Glowing Light Orbs for Night Mode */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-terracotta/20 blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-600/15 blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/3 h-64 w-64 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
      </div>

      {/* Floating Art Cards (Day & Night Adaptive Styling) */}
      {floatingImages.map((item, i) => (
        <div
          key={item.src}
          className="absolute hidden animate-float lg:block z-10"
          style={{
            top: `${14 + i * 19}%`,
            left: i % 2 === 0 ? `${4 + i * 3.5}%` : "auto",
            right: i % 2 !== 0 ? `${4 + i * 2.5}%` : "auto",
            animationDelay: `${i * 0.6}s`,
            animationDuration: `${5 + i}s`,
          }}
        >
          <div className="group relative h-36 w-36 rotate-2 rounded-3xl p-1.5 transition-all duration-500 hover:scale-110 hover:rotate-0
            /* Day Mode Card */
            bg-white/80 shadow-[0_12px_32px_rgba(61,48,40,0.14)] ring-1 ring-white/80 backdrop-blur-md
            /* Night Mode Card */
            dark:bg-[#161311]/85 dark:ring-1 dark:ring-white/20 dark:shadow-[0_0_30px_rgba(201,124,93,0.35)] dark:border dark:border-white/10"
          >
            <div className="relative h-full w-full overflow-hidden rounded-2xl">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="144px"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-2">
                <span className="text-[10px] font-medium text-white/90">{item.caption}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Hero Center Content */}
      <div className="relative z-20 mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
        
        {/* Dynamic Mode Badge */}
        <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300
          /* Day Mode Badge */
          bg-amber-100/80 text-brown border border-amber-200/80 shadow-xs
          /* Night Mode Badge */
          dark:bg-terracotta/15 dark:text-amber-300 dark:border-terracotta/40 dark:shadow-[0_0_20px_rgba(201,124,93,0.3)]"
          style={{ animationDelay: "0.15s" }}
        >
          {/* Day icon */}
          <span className="inline-flex items-center gap-1.5 dark:hidden text-amber-700 font-medium">
            <Sun className="h-3.5 w-3.5" /> Daylight Studio Collection
          </span>
          {/* Night icon */}
          <span className="hidden dark:inline-flex items-center gap-1.5 text-amber-300 font-medium">
            <Moon className="h-3.5 w-3.5 text-amber-400" /> Midnight Gallery Edition
          </span>
        </div>

        {/* Hero Main Heading with Distinct Day vs Night Typography */}
        <h1
          className="animate-fade-in-up mt-6 max-w-4xl font-heading text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ animationDelay: "0.35s" }}
        >
          {/* Day Mode Text */}
          <span className="block dark:hidden text-foreground">
            Handcrafted Art for{" "}
            <span className="bg-gradient-to-r from-terracotta via-[#964B00] to-terracotta bg-clip-text text-transparent">
              Beautiful Living
            </span>
          </span>

          {/* Night Mode Text */}
          <span className="hidden dark:block text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            Handcrafted Art for{" "}
            <span className="bg-gradient-to-r from-amber-200 via-orange-400 to-rose-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(201,124,93,0.5)]">
              Beautiful Living
            </span>
          </span>
        </h1>

        {/* Hero Description */}
        <p
          className="animate-fade-in-up mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground"
          style={{ animationDelay: "0.55s" }}
        >
          Discover original paintings, handcrafted journals, custom stickers, ceramic mugs, and curated gifts designed to bring warmth and authentic creativity to your space.
        </p>

        {/* Hero CTAs */}
        <div
          className="animate-fade-in-up mt-10 flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: "0.75s" }}
        >
          <Link href="/shop">
            <Button
              size="lg"
              className="gap-2.5 px-8 py-6 text-base font-semibold shadow-lg transition-all duration-300
                /* Day Mode Button */
                bg-terracotta hover:bg-terracotta/90 text-white shadow-terracotta/20 hover:shadow-terracotta/30
                /* Night Mode Button */
                dark:bg-terracotta dark:hover:bg-terracotta/90 dark:text-white dark:shadow-[0_0_25px_rgba(201,124,93,0.45)] dark:hover:shadow-[0_0_35px_rgba(201,124,93,0.65)]"
            >
              <Sparkles className="h-4 w-4" />
              Shop Collection
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Link href="/artists">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 px-8 py-6 text-base font-semibold backdrop-blur-md transition-all duration-300
                /* Day Mode Outline */
                border-border bg-white/70 hover:bg-white text-foreground
                /* Night Mode Outline */
                dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white dark:hover:border-white/35"
            >
              Explore Artists
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
