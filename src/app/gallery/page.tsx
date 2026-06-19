"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { galleryImages } from "@/lib/data/products";

const ITEMS_PER_LOAD = 6;

export default function GalleryPage() {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const visibleImages = galleryImages.slice(0, visibleCount);
  const hasMore = visibleCount < galleryImages.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + ITEMS_PER_LOAD);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="font-accent text-lg italic text-muted-foreground">
          Community Inspiration
        </p>
        <h1 className="mt-2 font-heading text-4xl font-semibold md:text-5xl">
          Gallery
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          See how our community styles their spaces with Artisan Haven products.
        </p>
      </div>

      <div className="masonry-grid mt-16">
        {visibleImages.map((image, i) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % ITEMS_PER_LOAD) * 0.05 }}
            className="masonry-item group relative overflow-hidden rounded-card"
          >
            <div className="relative" style={{ height: image.height }}>
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-brown/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex w-full items-center justify-between text-white">
                  <div>
                    <p className="text-sm font-medium">{image.user}</p>
                    <p className="text-xs text-white/70">{image.alt}</p>
                  </div>
                  <Heart className="h-4 w-4" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={loadMore}
            className="rounded-full border border-border px-8 py-3 text-sm font-medium transition-colors hover:bg-secondary/60"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
