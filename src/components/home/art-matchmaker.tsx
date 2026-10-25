"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Palette, MessageCircle, ShoppingBag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { products } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import { getWhatsAppUrl, buildProductOrderWhatsAppMessage } from "@/lib/whatsapp";

interface ArtMatch {
  space: string;
  palette: string;
  productSlug: string;
  roomTagline: string;
}

const matchPresets: ArtMatch[] = [
  {
    space: "living-room",
    palette: "sunset",
    productSlug: "sunset-serenade-original-canvas-painting",
    roomTagline: "Warm sunset ochre tones create an inviting, contemplative focal point above sofas or consoles.",
  },
  {
    space: "living-room",
    palette: "celestial",
    productSlug: "celestial-dreams-astronomy-nebula-canvas",
    roomTagline: "Dramatic cosmic galaxy impasto commands attention and ignites evening conversation.",
  },
  {
    space: "living-room",
    palette: "botanical",
    productSlug: "emerald-whispers-botanical-foliage-art",
    roomTagline: "Lush layered monstera foliage brings the grounding vitality of ancient rainforests indoors.",
  },
  {
    space: "living-room",
    palette: "ocean",
    productSlug: "ocean-mist-coastal-tides-canvas",
    roomTagline: "Rhythmic rolling waves and sapphire turquoise ocean mist fill the room with fresh coastal breeze.",
  },
  {
    space: "bedroom",
    palette: "sunset",
    productSlug: "golden-hour-reflections-canvas",
    roomTagline: "The golden stillness of evening waters evokes tranquil calm for restful nights.",
  },
  {
    space: "bedroom",
    palette: "celestial",
    productSlug: "celestial-dreams-astronomy-nebula-canvas",
    roomTagline: "Deep indigo stardust and gentle nebulae create an ethereal midnight dreamscape.",
  },
  {
    space: "bedroom",
    palette: "botanical",
    productSlug: "eucalyptus-breeze-minimalist-botanical",
    roomTagline: "Gentle sage watercolor eucalyptus stems promote relaxation and restful sleep.",
  },
  {
    space: "bedroom",
    palette: "ocean",
    productSlug: "ocean-mist-coastal-tides-canvas",
    roomTagline: "Cool seafoam and marine tides invite peaceful meditation and soothing slumber.",
  },
  {
    space: "studio",
    palette: "sunset",
    productSlug: "sunflower-radiance-impressionist-canvas",
    roomTagline: "Sun-drenched Mediterranean sunflowers inject dynamic joyful momentum into creative work.",
  },
  {
    space: "studio",
    palette: "celestial",
    productSlug: "cosmic-horizons-archival-fine-art-print",
    roomTagline: "Archival astronomical fine art print inspires boundless curiosity and out-of-the-box thinking.",
  },
  {
    space: "studio",
    palette: "botanical",
    productSlug: "handbound-botanical-linen-journal",
    roomTagline: "Hand-sewn cotton deckle journal bound in raw linen to capture your poetic sparks and sketches.",
  },
  {
    space: "studio",
    palette: "ocean",
    productSlug: "himalayan-morning-palette-knife-canvas",
    roomTagline: "Textured Himalayan peaks symbolize monumental endurance and soaring artistic aspirations.",
  },
];

export function ArtMatchmaker() {
  const [selectedSpace, setSelectedSpace] = useState<string>("living-room");
  const [selectedPalette, setSelectedPalette] = useState<string>("sunset");
  const addToCart = useCartStore((s) => s.addItem);

  const matchedPreset =
    matchPresets.find(
      (m) => m.space === selectedSpace && m.palette === selectedPalette
    ) || matchPresets[0];

  const matchedProduct =
    products.find((p) => p.slug === matchedPreset.productSlug) || products[0];

  const handleWhatsAppBooking = () => {
    const msg = buildProductOrderWhatsAppMessage({ product: matchedProduct, quantity: 1 });
    const url = getWhatsAppUrl(msg);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-secondary/40 via-background to-background border-y border-border/40">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/25 px-4 py-1.5 text-xs font-semibold text-amber-900 dark:text-amber-300 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-terracotta" /> Interactive Artwork Stylist
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold">
            Find Your Ideal Artwork
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
            Select your room space and desired color atmosphere in 2 quick clicks. Our studio stylist recommends the ideal handcrafted canvas.
          </p>
        </div>

        {/* Filters */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="w-full md:w-auto">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 text-center md:text-left">
              1. Choose Your Room:
            </label>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { id: "living-room", label: "🛋️ Living Room" },
                { id: "bedroom", label: "🛏️ Bedroom Sanctuary" },
                { id: "studio", label: "🎨 Creative Studio / Desk" },
              ].map((space) => (
                <button
                  key={space.id}
                  onClick={() => setSelectedSpace(space.id)}
                  className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all ${
                    selectedSpace === space.id
                      ? "bg-terracotta text-white shadow-xs scale-105"
                      : "bg-card border border-border/70 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {space.label}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full md:w-auto">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 text-center md:text-left">
              2. Choose Your Color Mood:
            </label>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { id: "sunset", label: "🌅 Warm Sunsets" },
                { id: "celestial", label: "🌌 Cosmic Galaxy" },
                { id: "botanical", label: "🍃 Lush Botanical" },
                { id: "ocean", label: "🌊 Ocean Coastal" },
              ].map((pal) => (
                <button
                  key={pal.id}
                  onClick={() => setSelectedPalette(pal.id)}
                  className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all ${
                    selectedPalette === pal.id
                      ? "bg-amber-700 text-white shadow-xs scale-105"
                      : "bg-card border border-border/70 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {pal.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedSpace}-${selectedPalette}-${matchedProduct.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="mt-12 rounded-3xl bg-card border border-border/80 p-6 sm:p-8 shadow-medium max-w-4xl mx-auto"
          >
            <div className="grid gap-8 md:grid-cols-2 items-center">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary/20 shadow-inner">
                <Image
                  src={matchedProduct.images[0]}
                  alt={matchedProduct.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute top-3 left-3">
                  <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-medium text-white shadow-xs">
                    🎨 Recommended Canvas
                  </span>
                </div>
              </div>

              {/* Product Info & Actions */}
              <div className="flex flex-col justify-center">
                <span className="text-xs font-semibold text-terracotta uppercase tracking-wider">
                  Curated Match for Your Space
                </span>
                <h3 className="mt-1 font-heading text-2xl sm:text-3xl font-bold text-foreground">
                  {matchedProduct.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {matchedPreset.roomTagline}
                </p>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-foreground">
                    {formatPrice(matchedProduct.price)}
                  </span>
                  {matchedProduct.comparePrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(matchedProduct.comparePrice)}
                    </span>
                  )}
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium ml-auto">
                    🚚 Free Insured Transit
                  </span>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleWhatsAppBooking}
                    className="flex-1 gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold py-5 shadow-sm cursor-pointer"
                  >
                    <MessageCircle className="h-4 w-4 fill-current" />
                    Book via WhatsApp
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => addToCart(matchedProduct)}
                    className="gap-2 border-border/80 hover:bg-secondary py-5"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Add to Cart
                  </Button>

                  <Link href={`/product/${matchedProduct.slug}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="py-5 px-3 border border-border/60 hover:bg-secondary"
                      aria-label="View Details"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <p className="mt-3 text-[11px] text-muted-foreground">
                  Includes Hand-Signed Authenticity Certificate & Ready-to-Hang Hardware.
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
