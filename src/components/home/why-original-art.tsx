"use client";

import { Palette, MessageCircle, Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Palette,
    color: "text-amber-600 bg-amber-100/80 dark:bg-amber-950/60 dark:text-amber-400",
    title: "100% Hand-Painted Originals",
    description:
      "No mass factory reproductions or printed canvas duplicates. Each painting is individually sculpted with artist-grade oils and acrylics, ensuring you own a singular, soulful original.",
  },
  {
    icon: MessageCircle,
    color: "text-[#25D366] bg-emerald-100/80 dark:bg-emerald-950/60 dark:text-emerald-400",
    title: "Instant WhatsApp Booking",
    description:
      "Order with a single tap on WhatsApp. Chat directly with the artist, request custom sizes or color palettes, and view live videos of your canvas before shipping.",
  },
  {
    icon: Sparkles,
    color: "text-terracotta bg-terracotta/15 dark:bg-terracotta/20 dark:text-amber-300",
    title: "Archival Museum Materials",
    description:
      "Painted on heavyweight 380 GSM stretched cotton canvases over kiln-dried pine wood frames. Sealed with non-yellowing UV archival varnish for lifetime color preservation.",
  },
  {
    icon: ShieldCheck,
    color: "text-blue-600 bg-blue-100/80 dark:bg-blue-950/60 dark:text-blue-400",
    title: "Crated & Insured Delivery",
    description:
      "Every canvas is protected with shockproof corner bumpers, moisture-sealed barrier wraps, and rigid art crates. Delivered safely across India with 100% transit insurance.",
  },
];

export function WhyOriginalArtSection() {
  return (
    <section id="why-original-art" className="py-24 px-4 sm:px-6 lg:px-8 border-y border-border/40 bg-secondary/30">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto">
          <p className="font-accent text-lg italic text-muted-foreground">
            A Story on Every Wall
          </p>
          <h2 className="mt-2 font-heading text-4xl font-semibold md:text-5xl">
            Why Choose Original Handmade Art?
          </h2>
          <p className="mt-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
            Original art carries emotional resonance and human touch that machine prints cannot replicate. Transform your living room, bedroom, or workspace into an inspiring sanctuary.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feat, idx) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl bg-card border border-border/60 p-6 shadow-soft transition-all duration-300 hover:shadow-soft-lg flex flex-col items-start"
            >
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${feat.color} mb-5`}>
                <feat.icon className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground">
                {feat.title}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {feat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
