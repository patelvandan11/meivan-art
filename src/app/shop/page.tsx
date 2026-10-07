import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopContent } from "./shop-content";

export const metadata: Metadata = {
  title: "Handmade Paintings & Canvas Art Store",
  description:
    "Explore Vandan Artwork's full collection of original handmade paintings, sunset landscapes, astronomy art, and visual storytelling canvas prints. Handmade Art. Unique Stories.",
  keywords: [
    "Vandan Artwork shop",
    "buy paintings online",
    "handmade canvas artwork",
    "sunset paintings",
    "astronomy art",
    "nature paintings",
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
