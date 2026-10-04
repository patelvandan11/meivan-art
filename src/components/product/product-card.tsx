"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, ShoppingBag, Star, ExternalLink } from "lucide-react";
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
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const hydrated = useStoreHydrated();
  const addToCart = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const wishlisted = hydrated && isInWishlist(product.id);

  const imagesList =
    product.images && product.images.length > 0
      ? product.images
      : ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80"];

  const isDigitalCard =
    product.categorySlug === "digital" ||
    Boolean(product.isDigital) ||
    Boolean(product.storagePath) ||
    Boolean(product.storage_path);
  const digitalUrlCard = product.storagePath || product.storage_path || "";

  const activeSrc = imagesList[currentImgIndex] || imagesList[0];

  return (
    <div
      className={cn(
        "group relative transition-transform duration-300 hover:-translate-y-1",
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setCurrentImgIndex(0);
      }}
    >
      <div className="relative overflow-hidden rounded-card bg-card shadow-soft border border-border/60 transition-all duration-300 dark:border-white/10 dark:bg-[#161311] dark:shadow-none dark:hover:border-terracotta/50 dark:hover:shadow-[0_0_25px_rgba(201,124,93,0.2)]">
        <Link href={`/product/${product.slug}`}>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={activeSrc}
              alt={product.name}
              fill
              className={cn(
                "object-cover transition-all duration-500",
                hovered && "scale-105"
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              loading="lazy"
            />
            {imagesList.length > 1 && hovered && (
              <div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-xs px-2 py-1 transition-opacity duration-200"
                onClick={(e) => e.preventDefault()}
              >
                {imagesList.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImgIndex(idx);
                    }}
                    onMouseEnter={() => setCurrentImgIndex(idx)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-200",
                      currentImgIndex === idx ? "w-4 bg-terracotta" : "w-1.5 bg-white/70 hover:bg-white"
                    )}
                    aria-label={`View idea slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
            {isDigitalCard && (
              <Badge className="absolute top-3 left-3 bg-blue-600 text-white font-semibold shadow-xs">
                ⚡ Digital Download
              </Badge>
            )}
            {!isDigitalCard && product.trending && (
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
          {isDigitalCard ? (
            <Button
              size="icon"
              className="h-9 w-9 rounded-full shadow-soft bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                if (digitalUrlCard) {
                  const target = digitalUrlCard.startsWith("http")
                    ? digitalUrlCard
                    : `https://${digitalUrlCard}`;
                  window.open(target, "_blank", "noopener,noreferrer");
                } else {
                  window.location.href = `/product/${product.slug}`;
                }
              }}
              aria-label="Access Digital Link"
              title="Access Digital Link"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="icon"
              className="h-9 w-9 rounded-full shadow-soft"
              onClick={() => addToCart(product)}
              aria-label="Add to cart"
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="p-4">
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-heading text-base font-medium leading-tight transition-colors hover:text-terracotta">
              {product.name}
            </h3>
          </Link>
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
