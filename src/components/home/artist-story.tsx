import Image from "next/image";
import Link from "next/link";
import { Leaf, Heart, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const values = [
  { icon: Heart, label: "Handmade Quality" },
  { icon: Leaf, label: "Sustainable Materials" },
  { icon: Users, label: "Independent Artists" },
  { icon: Sparkles, label: "Thoughtful Design" },
];

export function ArtistStorySection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-card shadow-soft-lg">
            <Image
              src="https://images.unsplash.com/photo-1455393573742-b8f9b43e46cd?w=640&q=75"
              alt="Artist studio"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 hidden h-48 w-48 overflow-hidden rounded-card shadow-soft-lg md:block">
            <Image
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=320&q=75"
              alt="Handcrafted ceramics"
              fill
              className="object-cover"
              sizes="192px"
              loading="lazy"
            />
          </div>
        </div>

        <div>
          <p className="font-accent text-lg italic text-muted-foreground">
            Our Story
          </p>
          <h2 className="mt-2 font-heading text-4xl font-semibold md:text-5xl">
            Crafted with Passion
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Artisan Haven celebrates creativity, craftsmanship, and mindful living
            through handcrafted artistic products. Every piece tells a story of
            dedication, artistry, and the beauty of slow, intentional creation.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {values.map((value) => (
              <div
                key={value.label}
                className="flex items-center gap-3 rounded-card bg-secondary/60 p-4"
              >
                <value.icon className="h-5 w-5 text-terracotta" />
                <span className="text-sm font-medium">{value.label}</span>
              </div>
            ))}
          </div>

          <Link href="/artists" className="mt-8 inline-block">
            <Button className="gap-2">Meet Our Artists</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
