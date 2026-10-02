"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/data/products";
import type { Product } from "@/types";

export function CategoriesSection() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error("Error loading products for categories:", err));
  }, []);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="font-accent text-lg italic text-muted-foreground">
            Curated Collections
          </p>
          <h2 className="mt-2 font-heading text-4xl font-semibold md:text-5xl">
            Shop by Category
          </h2>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const matchingProducts = products.filter(
              (p) =>
                p.categorySlug?.toLowerCase() === category.slug.toLowerCase() ||
                p.category?.toLowerCase() === category.name.toLowerCase()
            );
            const count = matchingProducts.length;
            const displayImage =
              matchingProducts.length > 0 && matchingProducts[0].images?.[0]
                ? matchingProducts[0].images[0]
                : category.image;

            return (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group relative block overflow-hidden rounded-card border border-border/40 dark:border-white/10 dark:hover:border-terracotta/50 dark:hover:shadow-[0_0_30px_rgba(201,124,93,0.3)] transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={displayImage}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brown/70 via-brown/20 to-transparent transition-opacity group-hover:from-brown/80" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="font-heading text-2xl font-semibold text-white">
                          {category.name}
                        </h3>
                        <p className="mt-1 text-sm text-white/70">
                          {count} {count === 1 ? "product" : "products"}
                        </p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110">
                        <ArrowUpRight className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
