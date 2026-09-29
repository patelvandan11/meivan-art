import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopContent } from "./shop-content";

export const metadata: Metadata = {
  title: "Handmade Paintings & Canvas Art Store",
  description:
    "Explore Meivan Art's full collection of original handmade paintings, sunset landscapes, astronomy art, and visual storytelling canvas prints. Handmade Art. Unique Stories.",
  keywords: [
    "Meivan Art shop",
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
    <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading Meivan Art collection...</div>}>
      <ShopContent />
    </Suspense>
  );
}
