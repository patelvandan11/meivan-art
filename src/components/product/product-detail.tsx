"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Minus, Plus, ShoppingBag, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/data/products";
import { formatPrice, cn } from "@/lib/utils";
import { AIRecommendations } from "@/components/ai/ai-recommendations";

const reviews = [
  {
    id: "r1",
    userName: "Sarah M.",
    userImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80",
    rating: 5,
    comment: "Absolutely stunning quality. The colors are even more vibrant in person.",
    date: "2 weeks ago",
  },
  {
    id: "r2",
    userName: "James L.",
    userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    rating: 5,
    comment: "Fast shipping and beautiful packaging. Will definitely order again.",
    date: "1 month ago",
  },
];

interface ProductPageClientProps {
  slug: string;
}

export function ProductPageClient({ slug }: ProductPageClientProps) {
  const product = getProductBySlug(slug);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const hydrated = useStoreHydrated();

  if (!product) return null;

  const related = getRelatedProducts(product);
  const wishlisted = hydrated && isInWishlist(product.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-card">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-colors",
                    selectedImage === i ? "border-terracotta" : "border-transparent"
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <p className="text-sm text-muted-foreground">{product.category}</p>
          <h1 className="mt-2 font-heading text-3xl font-semibold md:text-4xl">
            {product.name}
          </h1>
          {product.artist && (
            <Link
              href={`/artists/${product.artistSlug}`}
              className="mt-2 inline-block text-sm text-terracotta hover:underline"
            >
              by {product.artist}
            </Link>
          )}

          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(product.rating)
                      ? "fill-terracotta text-terracotta"
                      : "text-border"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-semibold">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="h-4 w-4" />
            Free shipping on orders over ₹2,000
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-border">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              className="flex-1 gap-2"
              onClick={() => addToCart(product, quantity)}
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => toggleItem(product)}
              aria-label="Toggle wishlist"
            >
              <Heart
                className={cn("h-5 w-5", wishlisted && "fill-terracotta text-terracotta")}
              />
            </Button>
          </div>
        </motion.div>
      </div>

      <section className="mt-20">
        <h2 className="font-heading text-2xl font-semibold">Reviews</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-card bg-secondary/40 p-6">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image src={review.userImage} alt={review.userName} fill className="object-cover" sizes="40px" />
                </div>
                <div>
                  <p className="text-sm font-medium">{review.userName}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <h2 className="font-heading text-2xl font-semibold">Related Products</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <AIRecommendations productId={product.id} />
    </div>
  );
}
