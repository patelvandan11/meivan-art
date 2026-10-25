"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Palette, MessageCircle, ShieldCheck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWhatsAppUrl, buildGeneralInquiryWhatsAppMessage } from "@/lib/whatsapp";

const floatingCards = [
  {
    src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80",
    alt: "Sunset Serenade Original Canvas Painting",
    caption: "Sunset Serenade Canvas",
    badge: "🎨 100% Original",
  },
  {
    src: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80",
    alt: "Celestial Dreams Astronomy Nebula Canvas",
    caption: "Celestial Dreams Galaxy",
    badge: "🌌 Textured Impasto",
  },
  {
    src: "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=400&q=80",
    alt: "Emerald Whispers Botanical Foliage Canvas",
    caption: "Emerald Whispers Art",
    badge: "🍃 Botanical Canvas",
  },
  {
    src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
    alt: "Golden Hour Reflections Oil on Canvas",
    caption: "Golden Hour Horizon",
    badge: "✨ Artist Signed",
  },
];

export function HeroSection() {
  const whatsappUrl = getWhatsAppUrl(buildGeneralInquiryWhatsAppMessage("Original Paintings & Custom Commissions"));

  return (
    <section className="relative min-h-[92vh] overflow-hidden flex items-center justify-center pt-24 pb-16">
      {/* ☀️ Day Mode Background Image */}
      <div className="absolute inset-0 block dark:hidden">
        <Image
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80"
          alt="Sunlit fine art studio canvas background"
          fill
          className="object-cover object-center scale-105"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/65 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/50 via-terracotta/10 to-transparent" />
      </div>

      {/* 🌙 Night Mode Background Image */}
      <div className="absolute inset-0 hidden dark:block">
        <Image
          src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80"
          alt="Midnight starry fine art canvas"
          fill
          className="object-cover object-center brightness-75 contrast-125"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-terracotta/20 blur-[130px] pointer-events-none animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-amber-600/25 blur-[140px] pointer-events-none" />
      </div>

      {/* Floating Badges */}
      <div className="absolute top-28 left-8 hidden lg:flex items-center gap-2 rounded-full bg-card/85 border border-border/80 px-3.5 py-1.5 backdrop-blur-md animate-sway shadow-sm z-10">
        <Palette className="h-4 w-4 text-terracotta" />
        <span className="text-xs font-semibold text-foreground">
          100% Original Canvas Art
        </span>
      </div>

      <div className="absolute bottom-28 left-12 hidden lg:flex items-center gap-2 rounded-full bg-card/85 border border-border/80 px-3.5 py-1.5 backdrop-blur-md animate-bounce-soft shadow-sm z-10">
        <MessageCircle className="h-4 w-4 text-[#25D366]" />
        <span className="text-xs font-semibold text-foreground">
          Direct WhatsApp Order Booking
        </span>
      </div>

      <div className="absolute top-32 right-12 hidden lg:flex items-center gap-2 rounded-full bg-card/85 border border-border/80 px-3.5 py-1.5 backdrop-blur-md animate-float shadow-sm z-10">
        <Sparkles className="h-4 w-4 text-amber-500" />
        <span className="text-xs font-semibold text-foreground">
          Handcrafted by Artist Vandan
        </span>
      </div>

      {/* Floating Art Cards */}
      {floatingCards.map((item, i) => (
        <motion.div
          key={item.caption}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: i * 0.15 }}
          className="absolute hidden animate-float lg:block z-10"
          style={{
            top: `${16 + i * 18}%`,
            left: i % 2 === 0 ? `${3.5 + i * 3.5}%` : "auto",
            right: i % 2 !== 0 ? `${3.5 + i * 2.5}%` : "auto",
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${5.5 + i}s`,
          }}
        >
          <div className="group relative h-40 w-40 rotate-1 rounded-3xl p-1.5 transition-all duration-500 hover:scale-110 hover:rotate-0
            bg-white/90 shadow-[0_12px_32px_rgba(61,48,40,0.12)] ring-1 ring-white/80 backdrop-blur-md
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
      <div className="relative z-20 mx-auto max-w-3xl px-4 text-center flex flex-col items-center justify-center">
        {/* Studio Badge */}
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-6 bg-amber-100/90 text-amber-900 border border-amber-300/80 shadow-xs dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700/40">
          <Palette className="h-3.5 w-3.5 text-terracotta" />
          <span>Independent Fine Art Studio</span>
        </div>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.15]"
        >
          Original Paintings That Tell A{" "}
          <span className="relative inline-block text-terracotta">
            Soulful Story.
            <span className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-terracotta/40" />
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl"
        >
          Handcrafted canvas paintings celebrating vibrant sunsets, cosmic skies, and botanical serenity.
          Each artwork is 100% handmade on gallery-wrapped canvas, signed, and ready to hang.
        </motion.p>

        {/* Hero CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
        >
          <Link href="/shop" className="w-full sm:w-auto">
            <Button size="lg" className="w-full gap-2 px-8 py-6 text-base font-semibold shadow-md">
              Explore Artworks 🎨
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              className="w-full gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold px-8 py-6 text-base shadow-md transition-all hover:shadow-lg active:scale-98"
            >
              <MessageCircle className="h-5 w-5 fill-current" />
              Book Order via WhatsApp
            </Button>
          </a>
        </motion.div>

        {/* Value Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-muted-foreground pt-6 border-t border-border/50 w-full"
        >
          <div className="flex items-center justify-center gap-1.5 font-medium">
            <Palette className="h-4 w-4 text-terracotta" />
            <span>100% Handcrafted</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 font-medium">
            <MessageCircle className="h-4 w-4 text-[#25D366]" />
            <span>WhatsApp Order Booking</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="h-4 w-4 text-amber-500" />
            <span>Free Insured Transit</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 font-medium">
            <Award className="h-4 w-4 text-purple-500" />
            <span>Signed Certificate</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
