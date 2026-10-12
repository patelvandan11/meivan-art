import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopContent } from "./shop-content";

export const metadata: Metadata = {
  title: "Shop Original Paintings, Indoor Plants & Hand-Painted Pots",
  description:
    "Explore Vandan Art & Plants full collection of original handmade paintings, healthy indoor house plants, artisan hand-painted pots, and curated art & plant gift bundles. Safe plant delivery across India.",
  keywords: [
    "buy indoor plants online India",
    "handmade canvas paintings",
    "hand-painted planters",
    "monstera deliciosa live plant",
    "variegated snake plant",
    "art and plant gift bundles",
    "sunset paintings",
    "astronomy canvas art",
    "botanical wall art",
    "desk plants and pots",
  ],
  alternates: {
    canonical: "/shop",
  },
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading Vandan Artwork collection...</div>}>
      <ShopContent />
    </Suspense>
  );
}
