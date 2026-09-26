"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

export function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          const featured = data.products.filter((p: Product) => p.featured);
          setProducts(featured.length > 0 ? featured : data.products.slice(0, 4));
        }
      })
      .catch((err) => console.error("Error loading featured products:", err))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="section-alt py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-accent text-lg italic text-muted-foreground">
              Handpicked for You
            </p>
            <h2 className="mt-2 font-heading text-4xl font-semibold md:text-5xl">
              Featured Products
            </h2>
          </div>
          <Link href="/shop">
            <Button variant="outline" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="mt-12 text-center text-muted-foreground py-12">
            Loading collection...
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
