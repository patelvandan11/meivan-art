"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const hydrated = useStoreHydrated();
  const addToCart = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const wishlisted = hydrated && isInWishlist(product.id);

  return (
    <div
      className={cn(
        "group relative transition-transform duration-300 hover:-translate-y-1",
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden rounded-card bg-card shadow-soft">
        <Link href={`/product/${product.slug}`}>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className={cn(
                "object-cover transition-transform duration-700",
                hovered && "scale-110"
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              loading="lazy"
            />
            {product.images[1] && hovered && (
              <Image
                src={product.images[1]}
                alt={`${product.name} alternate view`}
                fill
                className="object-cover transition-opacity duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            )}
            {product.trending && (
              <Badge variant="trending" className="absolute top-3 left-3">
                Trending
              </Badge>
            )}
            {product.comparePrice && (
              <Badge className="absolute top-3 right-3 bg-terracotta">
                Sale
              </Badge>
            )}
          </div>
        </Link>

        <div
          className={cn(
            "absolute top-3 right-3 z-10 flex flex-col gap-2 transition-opacity duration-200",
            hovered ? "opacity-100" : "opacity-0"
          )}
        >
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-full shadow-soft"
            onClick={() => toggleItem(product)}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={cn("h-4 w-4", wishlisted && "fill-terracotta text-terracotta")}
            />
          </Button>
          <Link href={`/product/${product.slug}`}>
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full shadow-soft"
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            size="icon"
            className="h-9 w-9 rounded-full shadow-soft"
            onClick={() => addToCart(product)}
            aria-label="Add to cart"
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-heading text-base font-medium leading-tight transition-colors hover:text-terracotta">
              {product.name}
            </h3>
          </Link>
          {product.artist && (
            <p className="mt-1 text-xs text-muted-foreground">by {product.artist}</p>
          )}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-terracotta text-terracotta" />
              {product.rating}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
