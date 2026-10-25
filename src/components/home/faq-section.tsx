"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getWhatsAppUrl, buildGeneralInquiryWhatsAppMessage } from "@/lib/whatsapp";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I book an order via WhatsApp message?",
    answer:
      "Simply click the green 'Book Order via WhatsApp' button on any artwork page or in your shopping cart! A pre-filled WhatsApp message with the artwork title, pricing, and link will open in your WhatsApp app or browser. You can confirm delivery details, ask questions, or pay directly via UPI / Bank Transfer.",
  },
  {
    question: "Are the paintings 100% original handmade artworks?",
    answer:
      "Yes! Every painting is handcrafted by artist Vandan on premium stretched canvas using high-grade acrylics and oils. Each artwork is a unique original piece accompanied by a hand-signed Certificate of Authenticity and arrives ready to hang.",
  },
  {
    question: "How is the artwork packaged for safe transit across India?",
    answer:
      "We use rigid shockproof corner bumpers, moisture-sealed barrier wraps, and heavy-duty reinforced wooden/corrugated art boxes. Every shipment includes 100% free transit insurance, guaranteeing your painting arrives in pristine gallery condition.",
  },
  {
    question: "Can I commission a custom painting or personalized size?",
    answer:
      "Yes! Custom art commissions are our specialty. You can message artist Vandan directly on WhatsApp with your wall dimensions, desired color palette (e.g., sunset, celestial, or botanical), or inspiration images to collaborate on a bespoke canvas.",
  },
  {
    question: "What payment methods can I use?",
    answer:
      "For WhatsApp orders, we accept instant UPI (Google Pay, PhonePe, Paytm), IMPS/NEFT bank transfers, or payment links. You can also use our website's online checkout if you prefer paying directly with credit/debit cards.",
  },
  {
    question: "Do the paintings arrive ready to hang?",
    answer:
      "Yes! All stretched canvas artworks come with pre-installed heavy-duty hanging hardware and neatly painted finished edges, so you can hang them immediately upon unpacking without needing an external frame.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const whatsappUrl = getWhatsAppUrl(buildGeneralInquiryWhatsAppMessage());

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
            Answers to common questions about ordering via WhatsApp, original canvas authenticity, and safe transit.
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
                      transition={{ duration: 0.25 }}
                    >
                      <div className="border-t border-border/40 px-5 pb-5 pt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-2xl bg-secondary/40 border border-border/60 p-6 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-heading text-base font-semibold text-foreground">
              Have a specific artwork question or custom commission in mind?
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Talk directly with artist Vandan on WhatsApp for personalized advice.
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-xs transition-colors shrink-0"
          >
            <MessageCircle className="h-4 w-4 fill-current" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
