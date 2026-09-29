"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Minus, Plus, ShoppingBag, Star, Truck, ChevronLeft, ChevronRight, Play, Pause, Sparkles, Layers } from "lucide-react";
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
import type { Product } from "@/types";

const reviews: Array<{
  id: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  date: string;
}> = [];

interface ProductPageClientProps {
  slug: string;
}

export function ProductPageClient({ slug }: ProductPageClientProps) {
  const initialProduct = getProductBySlug(slug);
  const [product, setProduct] = useState<Product | undefined>(initialProduct);
  const [loading, setLoading] = useState(!initialProduct);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const addToCart = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const hydrated = useStoreHydrated();

  useEffect(() => {
    if (!product) {
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.products) {
            const found = data.products.find((p: Product) => p.slug === slug || p.id === slug);
            if (found) setProduct(found);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [slug, product]);

  // Auto-play slideshow timer
  useEffect(() => {
    if (!isPlaying || !product || !product.images || product.images.length <= 1) return;
    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPlaying, product]);

  const handleNextImage = () => {
    if (!product || !product.images || product.images.length === 0) return;
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const handlePrevImage = () => {
    if (!product || !product.images || product.images.length === 0) return;
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center text-muted-foreground">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h2 className="font-heading text-2xl font-semibold">Product Not Found</h2>
        <p className="mt-2 text-muted-foreground">The requested product does not exist or has been removed.</p>
      </div>
    );
  }

  const related = getRelatedProducts(product);
  const wishlisted = hydrated && isInWishlist(product.id);
  const productImages = product.images && product.images.length > 0 ? product.images : ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Product Slideshow Showcase */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-card border border-border/60 bg-card group shadow-medium">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative h-full w-full"
              >
                <Image
                  src={productImages[selectedImage] || productImages[0]}
                  alt={`${product.name} - View ${selectedImage + 1}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>
            </AnimatePresence>

            {/* Badges on top of image */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-medium text-white shadow-sm border border-white/10">
                <Sparkles className="h-3 w-3 text-terracotta" />
                {selectedImage === 0 ? "Main View" : `Decor / Style Idea #${selectedImage}`}
              </span>
            </div>

            {/* Slide Counter & Auto-Play Toggle */}
            {productImages.length > 1 && (
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-white/90 border border-white/10">
                  {selectedImage + 1} / {productImages.length}
                </span>
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  title={isPlaying ? "Pause Slideshow" : "Auto-Play Slideshow Ideas"}
                  className={cn(
                    "rounded-full p-2 backdrop-blur-md transition-all border border-white/10",
                    isPlaying ? "bg-terracotta text-white shadow-lg animate-pulse" : "bg-black/60 text-white hover:bg-black/80"
                  )}
                >
                  {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                </button>
              </div>
            )}

            {/* Prev & Next Navigation Arrows */}
            {productImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 hover:bg-black/80 p-2.5 text-white backdrop-blur-xs transition-all opacity-80 group-hover:opacity-100 hover:scale-110"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 hover:bg-black/80 p-2.5 text-white backdrop-blur-xs transition-all opacity-80 group-hover:opacity-100 hover:scale-110"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Bottom Slide Indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-xs px-3 py-1.5 border border-white/10">
                  {productImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        selectedImage === idx ? "w-6 bg-terracotta" : "w-2 bg-white/60 hover:bg-white"
                      )}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails Bar */}
          {productImages.length > 1 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground px-1">
                <span className="flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 text-terracotta" />
                  Compare frame & interior decor ideas:
                </span>
                <span>{productImages.length} slideshow views</span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {productImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 group/thumb",
                      selectedImage === i
                        ? "border-terracotta ring-2 ring-terracotta/30 scale-105"
                        : "border-border opacity-75 hover:opacity-100 hover:border-border/80"
                    )}
                  >
                    <Image src={img} alt={`Idea view ${i + 1}`} fill className="object-cover" sizes="80px" />
                    <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-transparent transition-colors" />
                    <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[9px] font-semibold text-white">
                      {i === 0 ? "Main" : `Idea ${i}`}
                    </span>
                  </button>
                ))}
              </div>
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

          {/* Stock Status Badge */}
          <div className="mt-4 flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border",
                (product.stock ?? 10) > 5
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                  : (product.stock ?? 10) > 0
                  ? "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400"
                  : "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400"
              )}
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  (product.stock ?? 10) > 5
                    ? "bg-emerald-500"
                    : (product.stock ?? 10) > 0
                    ? "bg-amber-500"
                    : "bg-red-500"
                )}
              />
              {(product.stock ?? 10) === 1
                ? "Only 1 left in stock!"
                : (product.stock ?? 10) > 1 && (product.stock ?? 10) <= 5
                ? `Only ${product.stock} left in stock!`
                : (product.stock ?? 10) > 5
                ? `In Stock (${product.stock} available)`
                : "Out of Stock"}
            </span>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="h-4 w-4" />
            Free shipping on orders over ₹2,000
          </div>

          <div className="mt-8 flex items-center gap-4">
            {/* Quantity Selector - Enforces stock limit e.g. stock=1 allows max 1 */}
            <div
              className={cn(
                "flex items-center rounded-full border border-border",
                (product.stock ?? 10) <= 0 && "opacity-40 pointer-events-none"
              )}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || (product.stock ?? 10) <= 0}
                className="px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-medium">
                {(product.stock ?? 10) <= 0 ? 0 : quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock ?? 10, quantity + 1))
                }
                disabled={
                  quantity >= (product.stock ?? 10) || (product.stock ?? 10) <= 0
                }
                className="px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                aria-label="Increase quantity"
                title={
                  quantity >= (product.stock ?? 10)
                    ? `Maximum available stock is ${product.stock}`
                    : "Increase quantity"
                }
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              className="flex-1 gap-2"
              disabled={(product.stock ?? 10) <= 0}
              onClick={() => addToCart(product, quantity)}
            >
              <ShoppingBag className="h-4 w-4" />
              {(product.stock ?? 10) <= 0 ? "Out of Stock" : "Add to Cart"}
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
