"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { artists } from "@/lib/data/products";

export default function ArtistsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="font-accent text-lg italic text-muted-foreground">
          Meet the Makers
        </p>
        <h1 className="mt-2 font-heading text-4xl font-semibold md:text-5xl">
          Our Artists
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Independent creators who pour passion into every piece. Discover their
          stories and explore their collections.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {artists.map((artist, i) => (
          <motion.div
            key={artist.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              href={`/artists/${artist.slug}`}
              className="group block overflow-hidden rounded-card bg-card shadow-soft"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={artist.coverImage || artist.image}
                  alt={artist.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-beige">
                    <Image
                      src={artist.image}
                      alt={artist.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-semibold group-hover:text-terracotta transition-colors">
                      {artist.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">{artist.specialty}</p>
                  </div>
                </div>
                <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
                  {artist.bio}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  {artist.location && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {artist.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-sm font-medium text-terracotta">
                    {artist.productCount} products
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
