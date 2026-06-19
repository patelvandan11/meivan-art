"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlist-store";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";

export default function WishlistPage() {
  const hydrated = useStoreHydrated();
  const items = useWishlistStore((s) => s.items);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-muted-foreground">Loading wishlist...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <Heart className="mx-auto h-16 w-16 text-muted-foreground/30" />
        <h1 className="mt-6 font-heading text-3xl font-semibold">Your wishlist is empty</h1>
        <p className="mt-3 text-muted-foreground">
          Save your favorite products to find them later.
        </p>
        <Link href="/shop" className="mt-8 inline-block">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-semibold">Wishlist</h1>
      <p className="mt-2 text-muted-foreground">{items.length} saved items</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
