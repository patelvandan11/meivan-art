import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/data/products";

export function CategoriesSection() {
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
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group relative block overflow-hidden rounded-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={category.image}
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
                        {category.productCount} products
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110">
                      <ArrowUpRight className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
