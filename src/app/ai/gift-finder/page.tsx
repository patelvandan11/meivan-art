"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { getGiftSuggestions } from "@/actions/ai";
import type { GiftFinderAnswers, Product } from "@/types";

const recipients = [
  { value: "friend" as const, label: "Friend" },
  { value: "partner" as const, label: "Partner" },
  { value: "parent" as const, label: "Parent" },
  { value: "artist" as const, label: "Artist" },
  { value: "student" as const, label: "Student" },
];

const budgets = [
  { value: 500 as const, label: "₹500" },
  { value: 1000 as const, label: "₹1,000" },
  { value: 2000 as const, label: "₹2,000" },
  { value: 5000 as const, label: "₹5,000+" },
];

export default function GiftFinderPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<GiftFinderAnswers>>({});
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleFindGifts() {
    if (!answers.recipient || !answers.budget) return;
    setLoading(true);
    const suggestions = await getGiftSuggestions(answers as GiftFinderAnswers);
    setResults(suggestions);
    setStep(2);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <Gift className="mx-auto h-8 w-8 text-terracotta" />
        <h1 className="mt-4 font-heading text-4xl font-semibold">AI Gift Finder</h1>
        <p className="mt-3 text-muted-foreground">
          Tell us about your gift recipient and we&apos;ll find the perfect match.
        </p>
      </div>

      {step === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          <h2 className="text-center font-heading text-xl">Who is this gift for?</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {recipients.map((r) => (
              <button
                key={r.value}
                onClick={() => {
                  setAnswers({ ...answers, recipient: r.value });
                  setStep(1);
                }}
                className="rounded-card border border-border bg-card p-6 text-center transition-all hover:border-terracotta hover:shadow-soft"
              >
                <span className="font-medium">{r.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          <h2 className="text-center font-heading text-xl">What&apos;s your budget?</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {budgets.map((b) => (
              <button
                key={b.value}
                onClick={() => setAnswers({ ...answers, budget: b.value })}
                className={`rounded-card border p-6 text-center transition-all hover:shadow-soft ${
                  answers.budget === b.value
                    ? "border-terracotta bg-terracotta/5"
                    : "border-border bg-card"
                }`}
              >
                <span className="font-medium">{b.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <Button variant="outline" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button onClick={handleFindGifts} disabled={!answers.budget || loading}>
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Finding gifts..." : "Find Gifts"}
            </Button>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          <h2 className="font-heading text-2xl font-semibold text-center">
            Perfect Gifts for Your {answers.recipient}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" onClick={() => { setStep(0); setResults([]); }}>
              Start Over
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
