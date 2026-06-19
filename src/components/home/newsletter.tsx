"use client";

import { useState } from "react";
import { Mail, Gift, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeNewsletter } from "@/actions/newsletter";

const benefits = [
  { icon: Gift, label: "Exclusive Drops" },
  { icon: BookOpen, label: "Artist Stories" },
  { icon: Sparkles, label: "Product Launches" },
];

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const result = await subscribeNewsletter(email);
      setStatus(result.success ? "success" : "error");
      if (result.success) setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-card border border-border bg-card p-8 text-center shadow-soft md:p-16">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-terracotta" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-sage" />
          </div>

          <div className="relative z-10">
            <Mail className="mx-auto h-8 w-8 text-terracotta" />
            <h2 className="mt-4 font-heading text-3xl font-semibold md:text-4xl">
              Get 10% Off Your First Order
            </h2>
            <p className="mt-3 text-muted-foreground">
              Join our community of art lovers and be the first to discover new collections.
            </p>

            <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 border-border bg-background text-foreground placeholder:text-muted-foreground"
              />
              <Button
                type="submit"
                disabled={status === "loading"}
                className="bg-terracotta hover:bg-terracotta/90"
              >
                {status === "loading" ? "Joining..." : "Join the Community"}
              </Button>
            </form>

            {status === "success" && (
              <p className="mt-3 text-sm text-sage">Welcome to Artisan Haven!</p>
            )}
            {status === "error" && (
              <p className="mt-3 text-sm text-red-300">Something went wrong. Please try again.</p>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              {benefits.map((benefit) => (
                <div key={benefit.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <benefit.icon className="h-4 w-4 text-terracotta" />
                  {benefit.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
