"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/data/products";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export function BestSellersSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          const best = data.products.filter((p: Product) => p.bestSeller);
          setAllProducts(best.length > 0 ? best : data.products);
        }
      })
      .catch((err) => console.error("Error loading best sellers:", err))
      .finally(() => setLoading(false));
  }, []);

  const products = activeCategory
    ? allProducts.filter((p) => p.categorySlug === activeCategory)
    : allProducts;

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    emblaApi?.reInit();
  }, [activeCategory, emblaApi, products]);

  if (!loading && allProducts.length === 0) {
    return null;
  }

  const filterCategories = categories.slice(0, 5);

  return (
    <section className="section-alt overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-accent text-lg italic text-muted-foreground">
              Customer Favorites
            </p>
            <h2 className="mt-2 font-heading text-4xl font-semibold md:text-5xl">
              Best Sellers
            </h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={scrollPrev} aria-label="Previous">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={scrollNext} aria-label="Next">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              !activeCategory
                ? "bg-foreground text-background"
                : "bg-card/60 text-foreground hover:bg-card"
            )}
          >
            All
          </button>
          {filterCategories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                activeCategory === cat.slug
                  ? "bg-foreground text-background"
                  : "bg-card/60 text-foreground hover:bg-card"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-12 text-center text-muted-foreground py-12">
            Loading best sellers...
          </div>
        ) : (
          <div className="mt-8 overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {products.map((product) => (
                <div key={product.id} className="min-w-0 flex-[0_0_280px] sm:flex-[0_0_300px]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
