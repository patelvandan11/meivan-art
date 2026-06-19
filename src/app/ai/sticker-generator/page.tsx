"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sticker, Sparkles, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateStickerPreview } from "@/actions/ai";

export default function StickerGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    const result = await generateStickerPreview(prompt);
    if (result.success && result.previewUrl) {
      setPreviewUrl(result.previewUrl);
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <Sticker className="mx-auto h-8 w-8 text-terracotta" />
        <h1 className="mt-4 font-heading text-4xl font-semibold">AI Sticker Generator</h1>
        <p className="mt-3 text-muted-foreground">
          Describe your dream sticker and our AI will create a unique design.
        </p>
      </div>

      <div className="mt-12 space-y-6">
        <div className="flex gap-3">
          <Input
            placeholder='e.g. "cute cat reading books"'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            className="flex-1"
          />
          <Button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
            <Sparkles className="mr-2 h-4 w-4" />
            {loading ? "Creating..." : "Generate"}
          </Button>
        </div>

        {previewUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-card bg-card p-8 shadow-soft text-center"
          >
            <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-card">
              <Image
                src={previewUrl}
                alt="Generated sticker"
                fill
                className="object-cover"
                sizes="256px"
              />
            </div>
            <p className="mt-4 text-sm text-muted-foreground italic">
              &ldquo;{prompt}&rdquo;
            </p>
            <Button className="mt-6 gap-2" variant="outline">
              <Download className="h-4 w-4" />
              Download Print-Ready Asset
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
