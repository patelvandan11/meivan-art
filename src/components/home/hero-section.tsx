"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Palette,
  MessageCircle,
  Truck,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWhatsAppUrl, buildGeneralInquiryWhatsAppMessage } from "@/lib/whatsapp";

const bannerSlides = [
  {
    id: "original-canvases",
    title: "Original Handmade Paintings",
    subtitle: "100% original textured acrylic & oil canvases celebrating vibrant sunsets, cosmic skies & botanical tranquility.",
    tag: "100% Original Canvas 🎨",
    ctaPrimary: { label: "Explore Paintings", href: "/shop?category=paintings" },
    ctaSecondary: { label: "Book Custom Art", href: getWhatsAppUrl(buildGeneralInquiryWhatsAppMessage("Custom Painting Commission")) },
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1600&q=80",
    quote: "“Art that tells a soulful story” — Signed by the artist and ready to hang.",
    accentColor: "#fac218",
  },
  {
    id: "sunset-skies",
    title: "Sunsets & Celestial Horizons",
    subtitle: "Warm twilight horizons, golden dusk atmospheres, and starry cosmic nebula canvas collections.",
    tag: "Studio Bestseller 🌅",
    ctaPrimary: { label: "View Sunset Horizons", href: "/shop?category=sunsets-celestial" },
    ctaSecondary: { label: "Botanical Series", href: "/shop?category=botanical-art" },
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80",
    quote: "Atmospheric depth and vibrant strokes to bring serenity to your living room.",
    accentColor: "#00509d",
  },
  {
    id: "postcards-journals",
    title: "Fine Art Prints & Postcards",
    subtitle: "Museum-grade archival cotton art prints, collectible postcards, and handbound linen sketchbooks.",
    tag: "Special 10% Off 💌",
    ctaPrimary: { label: "Claim 10% Discount", href: "/shop?category=prints-sketches" },
    ctaSecondary: { label: "Art Journals", href: "/shop?category=journals" },
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1600&q=80",
    quote: "Tactile, collectible art treasures crafted with passion and love.",
    accentColor: "#009688",
  },
];

const trustFeatures = [
  {
    icon: Truck,
    title: "Free Insured Shipping",
    subtitle: "Safe delivery across India",
    color: "text-amber-600",
  },
  {
    icon: Palette,
    title: "100% Handcrafted Art",
    subtitle: "Authentic original creations",
    color: "text-[#00509d]",
  },
  {
    icon: Award,
    title: "Artist Signed & Certified",
    subtitle: "Certificate of Authenticity",
    color: "text-teal-600",
  },
  {
    icon: MessageCircle,
    title: "Instant WhatsApp Booking",
    subtitle: "Direct personal assistance",
    color: "text-[#25D366]",
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = bannerSlides[currentSlide];

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  return (
    <section className="relative w-full bg-white dark:bg-[#151311] overflow-hidden">
      {/* MAIN HERO BANNER - Edge to edge, flush with nav */}
      <div className="relative w-full min-h-[460px] sm:min-h-[520px] md:min-h-[580px] lg:min-h-[620px] flex items-center">
        {/* Background Image Carousel with Smooth Fade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
            {/* Subtle clean gradient overlay for readability without dark muddiness */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/20 dark:from-black/90 dark:via-black/75 dark:to-black/30" />
          </motion.div>
        </AnimatePresence>

        {/* Content Container */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full">
          <div className="max-w-xl md:max-w-2xl">
            {/* Tag / Badge */}
            <motion.div
              key={`tag-${slide.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#fac218] text-[#1f2421] px-3.5 py-1 text-xs font-bold shadow-xs mb-4"
            >
              <span>{slide.tag}</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              key={`title-${slide.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.15]"
            >
              {slide.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              key={`sub-${slide.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-4 text-base sm:text-lg text-gray-700 dark:text-gray-200 leading-relaxed max-w-lg font-medium"
            >
              {slide.subtitle}
            </motion.p>

            {/* Quote Pill */}
            <motion.div
              key={`quote-${slide.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="mt-3 text-xs sm:text-sm italic text-gray-600 dark:text-gray-300 flex items-center gap-1.5"
            >
              <span>{slide.quote}</span>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              key={`cta-${slide.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-3.5"
            >
              <Link href={slide.ctaPrimary.href}>
                <Button
                  size="lg"
                  className="bg-[#00509d] hover:bg-[#003870] text-white font-bold px-7 py-6 text-base rounded-full shadow-md gap-2 transition-all hover:scale-105"
                >
                  <span>{slide.ctaPrimary.label}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link
                href={slide.ctaSecondary.href}
                target={slide.ctaSecondary.href.startsWith("http") ? "_blank" : undefined}
                rel={slide.ctaSecondary.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/90 dark:bg-black/60 hover:bg-white text-gray-900 dark:text-white font-semibold px-6 py-6 text-base rounded-full border border-gray-300 dark:border-gray-700 shadow-xs backdrop-blur-xs transition-all hover:scale-105"
                >
                  {slide.ctaSecondary.href.startsWith("http") && (
                    <MessageCircle className="h-4 w-4 text-[#25D366] mr-1.5" />
                  )}
                  <span>{slide.ctaSecondary.label}</span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-3 sm:left-6 z-20 h-10 w-10 rounded-full bg-white/80 dark:bg-black/60 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-800 dark:text-white hover:bg-white shadow-sm transition-transform hover:scale-110 focus:outline-none"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-3 sm:right-6 z-20 h-10 w-10 rounded-full bg-white/80 dark:bg-black/60 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-800 dark:text-white hover:bg-white shadow-sm transition-transform hover:scale-110 focus:outline-none"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Carousel Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {bannerSlides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none ${
                currentSlide === idx
                  ? "w-8 bg-[#00509d]"
                  : "w-2.5 bg-gray-400/60 hover:bg-gray-600"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* VALUE & TRUST STRIP - Clean, understated e-commerce features */}
      <div className="border-y border-[#cae0eb] dark:border-border/70 bg-[#fbfdfe] dark:bg-[#181513] py-4 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {trustFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="flex items-center gap-3 px-2 py-1 justify-center sm:justify-start"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-[#cae0eb] dark:border-border shadow-2xs">
                  <Icon className={`h-4 w-4 ${feat.color}`} />
                </div>
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">
                    {feat.title}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5 hidden sm:block">
                    {feat.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
