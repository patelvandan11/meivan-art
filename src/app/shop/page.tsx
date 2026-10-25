import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopContent } from "./shop-content";

export const metadata: Metadata = {
  title: "Shop Original Handmade Paintings & Fine Art Collections",
  description:
    "Explore Vandan Artwork's full collection of original handmade canvas paintings, sunset landscapes, celestial astronomy art, fine art prints, and handbound journals. Handcrafted in India with free insured shipping.",
  keywords: [
    "original canvas paintings",
    "buy paintings online India",
    "handmade artwork",
    "sunset paintings",
    "astronomy galaxy canvas",
    "botanical wall art",
    "fine art prints",
    "handbound art journals",
    "Vandan Artwork shop",
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
