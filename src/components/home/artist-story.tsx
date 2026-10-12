"use client";

import Image from "next/image";
import Link from "next/link";
import { Leaf, Sparkles, Flower2, Palette, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const values = [
  { icon: Palette, label: "100% Original Canvases" },
  { icon: Leaf, label: "Healthy Living Plants" },
  { icon: Flower2, label: "Hand-Painted Planters" },
  { icon: ShieldCheck, label: "Safe Eco-Friendly Packaging" },
];

export function ArtistStorySection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-soft-lg">
            <Image
              src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80"
              alt="Art studio with lush plants and original canvases"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 hidden h-52 w-52 overflow-hidden rounded-3xl shadow-soft-lg md:block border-4 border-background">
            <Image
              src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80"
              alt="Handcrafted terracotta planter"
              fill
              className="object-cover"
              sizes="208px"
              loading="lazy"
            />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3.5 py-1 text-xs font-semibold text-terracotta mb-2">
            <Sparkles className="h-3.5 w-3.5" /> Handcrafted Studio
          </div>
          <h2 className="mt-2 font-heading text-4xl font-semibold md:text-5xl">
            Where Art Meets Living Nature
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Vandan Art & Plants was born from the belief that creativity flourishes best in the presence of living greenery. We blend the emotional depth of original canvas paintings with healthy, air-purifying houseplants and hand-painted terracotta planters.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Every plant is nurtured to thrive indoors and potted in nutrient-rich organic soil. Every canvas tells a heartfelt story of sunsets, starry cosmos, and peaceful mornings.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {values.map((value, idx) => (
              <div
                key={`${value.label}-${idx}`}
                className="flex items-center gap-3 rounded-2xl bg-secondary/60 p-4 border border-border/40 hover:bg-secondary transition-colors"
              >
                <value.icon className="h-5 w-5 text-terracotta shrink-0" />
                <span className="text-sm font-medium">{value.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <Link href="/shop">
              <Button size="lg" className="gap-2 bg-terracotta hover:bg-terracotta/90 text-white">
                Explore Studio Collection
              </Button>
            </Link>
            <Link href="/shop?category=indoor-plants">
              <Button size="lg" variant="outline" className="gap-2">
                Browse Plants 🌿
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
