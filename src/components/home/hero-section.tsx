import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const floatingImages = [
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=256&q=75",
  "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=256&q=75",
  "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=256&q=75",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=256&q=75",
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1280&q=75"
          alt="Artistic collage background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      {floatingImages.map((src, i) => (
        <div
          key={src}
          className="absolute hidden animate-float lg:block"
          style={{
            top: `${15 + i * 18}%`,
            left: i % 2 === 0 ? `${5 + i * 3}%` : "auto",
            right: i % 2 !== 0 ? `${5 + i * 2}%` : "auto",
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${4 + i}s`,
          }}
        >
          <div className="relative h-32 w-32 rotate-3 overflow-hidden rounded-card shadow-soft-lg">
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="128px"
              loading="lazy"
            />
          </div>
        </div>
      ))}

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <p
          className="animate-fade-in-up font-accent text-lg italic text-muted-foreground md:text-xl"
          style={{ animationDelay: "0.2s" }}
        >
          Premium Handcrafted Art
        </p>

        <h1
          className="animate-fade-in-up mt-4 max-w-4xl font-heading text-5xl font-semibold leading-tight tracking-tight md:text-7xl lg:text-8xl"
          style={{ animationDelay: "0.4s" }}
        >
          Handcrafted Art for{" "}
          <span className="text-gradient">Beautiful Living</span>
        </h1>

        <p
          className="animate-fade-in-up mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
          style={{ animationDelay: "0.6s" }}
        >
          Discover paintings, journals, stickers, home decor, and gifts crafted
          to inspire creativity and comfort.
        </p>

        <div
          className="animate-fade-in-up mt-10 flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: "0.8s" }}
        >
          <Link href="/shop">
            <Button size="lg" className="gap-2">
              Shop Collection
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/artists">
            <Button size="lg" variant="outline" className="gap-2">
              Explore Artists
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
