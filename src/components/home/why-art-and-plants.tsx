"use client";

import { Leaf, Palette, PackageCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Leaf,
    color: "text-emerald-600 bg-emerald-100/80 dark:bg-emerald-950/60 dark:text-emerald-400",
    title: "Living Air-Purifying Plants",
    description:
      "Every plant is acclimated for indoor life and certified for air purification. They quietly absorb common household toxins and release fresh oxygen while you rest or work.",
  },
  {
    icon: Palette,
    color: "text-amber-600 bg-amber-100/80 dark:bg-amber-950/60 dark:text-amber-400",
    title: "100% Original Canvas Art",
    description:
      "No mass-produced digital prints. Every painting is individually created with artist-grade acrylics and textured brushwork celebrating sunsets, astronomy, and wild landscapes.",
  },
  {
    icon: Sparkles,
    color: "text-terracotta bg-terracotta/15 dark:bg-terracotta/20 dark:text-amber-300",
    title: "Planters Treated as Canvases",
    description:
      "Why settle for boring plastic pots? Our terracotta and ceramic planters are individually hand-painted with sunset gradients and botanical motifs to make plants living sculptures.",
  },
  {
    icon: PackageCheck,
    color: "text-blue-600 bg-blue-100/80 dark:bg-blue-950/60 dark:text-blue-400",
    title: "Zero-Spill Plant Transit",
    description:
      "Proprietary ventilated eco-packaging locks soil in place and keeps root balls gently hydrated during delivery. We guarantee your plant arrives healthy and upright across India.",
  },
];

export function WhyArtAndPlantsSection() {
  return (
    <section id="why-art-plants" className="py-24 px-4 sm:px-6 lg:px-8 border-y border-border/40 bg-secondary/30">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto">
          <p className="font-accent text-lg italic text-muted-foreground">
            A Living Sanctuary
          </p>
          <h2 className="mt-2 font-heading text-4xl font-semibold md:text-5xl">
            Why Art & Living Plants?
          </h2>
          <p className="mt-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
            Science shows that combining living botanical greenery with original visual art reduces cortisol, sparks creative focus, and turns ordinary rooms into vibrant havens.
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
