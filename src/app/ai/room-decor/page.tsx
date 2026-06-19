"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Home, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { analyzeRoomDecor } from "@/actions/ai";
import type { Product } from "@/types";

export default function RoomDecorPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    paintings: Product[];
    decor: Product[];
    colorTheme: string[];
    bundle: Product[];
  } | null>(null);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  }

  async function handleAnalyze() {
    if (!imageUrl) return;
    setLoading(true);
    const result = await analyzeRoomDecor(imageUrl);
    if (result.success && result.suggestions) {
      setSuggestions(result.suggestions);
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <Home className="mx-auto h-8 w-8 text-terracotta" />
        <h1 className="mt-4 font-heading text-4xl font-semibold">Room Decor Assistant</h1>
        <p className="mt-3 text-muted-foreground">
          Upload a photo of your room and get AI-powered decor suggestions.
        </p>
      </div>

      <div className="mt-12">
        {!imageUrl ? (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed border-border bg-secondary/30 p-16 transition-colors hover:border-terracotta/50">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="mt-4 font-medium">Upload a room photo</p>
            <p className="mt-1 text-sm text-muted-foreground">JPG, PNG up to 10MB</p>
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
        ) : (
          <div className="space-y-6">
            <div className="relative aspect-video overflow-hidden rounded-card">
              <Image src={imageUrl} alt="Room preview" fill className="object-cover" sizes="800px" />
            </div>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => { setImageUrl(""); setSuggestions(null); }}>
                Change Photo
              </Button>
              <Button onClick={handleAnalyze} disabled={loading}>
                <Sparkles className="mr-2 h-4 w-4" />
                {loading ? "Analyzing..." : "Analyze Room"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {suggestions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 space-y-12"
        >
          <div>
            <h2 className="font-heading text-xl font-semibold">Suggested Color Theme</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {suggestions.colorTheme.map((color) => (
                <span
                  key={color}
                  className="rounded-full bg-secondary/60 px-4 py-2 text-sm font-medium"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold">Matching Paintings</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {suggestions.paintings.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold">Wall Decor</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {suggestions.decor.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
