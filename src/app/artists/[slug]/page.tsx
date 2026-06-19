import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import {
  artists,
  getArtistBySlug,
  getProductsByArtist,
} from "@/lib/data/products";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return artists.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);
  if (!artist) return { title: "Artist Not Found" };
  return { title: artist.name, description: artist.bio };
}

export default async function ArtistProfilePage({ params }: Props) {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);
  if (!artist) notFound();

  const products = getProductsByArtist(slug);

  return (
    <div>
      <div className="relative h-64 md:h-80">
        <Image
          src={artist.coverImage || artist.image}
          alt={artist.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brown/60 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 flex flex-col items-center text-center md:flex-row md:items-end md:gap-6 md:text-left">
          <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-cream shadow-soft-lg">
            <Image
              src={artist.image}
              alt={artist.name}
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
          <div className="mt-4 md:mt-0 md:pb-2">
            <h1 className="font-heading text-3xl font-semibold md:text-4xl">
              {artist.name}
            </h1>
            <p className="text-muted-foreground">{artist.specialty}</p>
            {artist.location && (
              <p className="mt-1 flex items-center justify-center gap-1 text-sm text-muted-foreground md:justify-start">
                <MapPin className="h-3 w-3" />
                {artist.location}
              </p>
            )}
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-lg leading-relaxed text-muted-foreground md:text-left">
          {artist.bio}
        </p>

        <section className="mt-16 pb-16">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-semibold">Portfolio</h2>
            <Link href="/shop" className="text-sm text-terracotta hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {products.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">
              No products available yet.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
