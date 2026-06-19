import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { galleryImages } from "@/lib/data/products";

export function CustomerGallerySection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="font-accent text-lg italic text-muted-foreground">
            Community Inspiration
          </p>
          <h2 className="mt-2 font-heading text-4xl font-semibold md:text-5xl">
            Styled by Our Community
          </h2>
        </div>

        <div className="masonry-grid mt-16">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="masonry-item group relative overflow-hidden rounded-card"
            >
              <div className="relative" style={{ height: image.height }}>
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-brown/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex w-full items-center justify-between text-white">
                    <span className="text-sm font-medium">{image.user}</span>
                    <Heart className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/gallery"
            className="text-sm font-medium text-terracotta underline-offset-4 hover:underline"
          >
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
