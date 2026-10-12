"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do you package and ship live plants safely across India?",
    answer:
      "We use specialized ventilated plant pods that secure the pot and root ball firmly in place. The soil is sealed with moisture retention wrapping to prevent spillage, and foliage is cushioned. In the rare event that a plant arrives unhealthy, we offer a 100% free replacement within 48 hours.",
  },
  {
    question: "Are the paintings 100% original handmade artworks?",
    answer:
      "Yes! Every painting is handcrafted by artist Vandan on premium stretched canvas using high-grade acrylics and oils. Each artwork is a unique original piece accompanied by an authenticity certificate and arrives ready to hang.",
  },
  {
    question: "Do live plants come with the hand-painted pots shown?",
    answer:
      "Yes! Unless explicitly specified as a nursery starter, our plants arrive potted in breathable hand-painted terracotta or glazed ceramic planters with organic nutrient-rich soil and drainage holes.",
  },
  {
    question: "I have never cared for plants before. Which plant is best for beginners?",
    answer:
      "Our Variegated Snake Plant (Sansevieria) and Golden Pothos are perfect for first-time plant parents. They tolerate varying light levels, require watering only once every 1–2 weeks, and vigorously purify indoor air. Every plant comes with an easy care card.",
  },
  {
    question: "Can I commission a custom painting or personalized hand-painted planter?",
    answer:
      "Yes! We love creating bespoke pieces. Whether you want a customized sunset palette, a celestial constellation canvas, or a tailored planter motif, reach out to us at vandanartwork@gmail.com or via Instagram @vandanartwork.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary/80 px-3.5 py-1 text-xs font-semibold text-terracotta mb-3">
            <HelpCircle className="h-3.5 w-3.5" /> Frequently Asked Questions
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold">
            Everything You Need to Know
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">
            Answers to common questions about plant transit, canvas art care, and shipping guarantees.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs transition-colors hover:border-terracotta/40"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-base sm:text-lg font-semibold text-foreground"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-terracotta" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border/40 p-5 pt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
