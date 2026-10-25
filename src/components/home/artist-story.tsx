"use client";

import Image from "next/image";
import Link from "next/link";
import { Palette, Sparkles, MessageCircle, ShieldCheck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWhatsAppUrl, buildGeneralInquiryWhatsAppMessage } from "@/lib/whatsapp";

const values = [
  { icon: Palette, label: "100% Hand-Painted Canvases" },
  { icon: MessageCircle, label: "Direct WhatsApp Booking" },
  { icon: Award, label: "Signed Authenticity Certificate" },
  { icon: ShieldCheck, label: "Insured Transit Across India" },
];

export function ArtistStorySection() {
  const whatsappUrl = getWhatsAppUrl(buildGeneralInquiryWhatsAppMessage("Artist Story & Studio Inquiries"));

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-soft-lg">
            <Image
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80"
              alt="Artist studio with original paintings and canvas easel"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 hidden h-52 w-52 overflow-hidden rounded-3xl shadow-soft-lg md:block border-4 border-background">
            <Image
              src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80"
              alt="Textured celestial galaxy canvas"
              fill
              className="object-cover"
              sizes="208px"
              loading="lazy"
            />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3.5 py-1 text-xs font-semibold text-terracotta mb-2">
            <Sparkles className="h-3.5 w-3.5" /> Handcrafted Studio Story
          </div>
          <h2 className="mt-2 font-heading text-4xl font-semibold md:text-5xl">
            Art That Tells A Soulful Story
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Vandan Artwork is an independent fine art studio founded with a passion for heartfelt visual storytelling. From the tranquil hues of sunset horizons to the boundless depth of celestial cosmos and whispering birch forests, every canvas is born from quiet contemplation.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Each painting is sculpted with artist-grade acrylics, textured impasto, and oils on gallery-wrapped heavyweight cotton canvas. Every artwork arrives with finished edges, hanging hardware installed, and a hand-signed Certificate of Authenticity.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {values.map((value, idx) => (
              <div
                key={`${value.label}-${idx}`}
                className="flex items-center gap-3 rounded-2xl bg-secondary/60 p-4 border border-border/40 hover:bg-secondary transition-colors"
              >
                <value.icon className="h-5 w-5 text-terracotta shrink-0" />
                <span className="text-sm font-medium">{value.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/shop">
              <Button size="lg" className="w-full sm:w-auto font-semibold">
                Explore Artworks 🎨
              </Button>
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto gap-2 border-border/80 hover:bg-secondary text-[#25D366] hover:text-[#20ba59]"
              >
                <MessageCircle className="h-4 w-4 fill-current" />
                Chat with Artist on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
