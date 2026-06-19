"use server";

import { getGiftRecommendations, products } from "@/lib/data/products";
import type { GiftFinderAnswers } from "@/types";

export async function getGiftSuggestions(answers: GiftFinderAnswers) {
  const recommendations = getGiftRecommendations(
    answers.recipient,
    answers.budget
  );
  return recommendations;
}

export async function getAIRecommendations(productIds: string[]) {
  const viewed = products.filter((p) => productIds.includes(p.id));
  const categories = [...new Set(viewed.map((p) => p.categorySlug))];
  const tags = [...new Set(viewed.flatMap((p) => p.tags))];

  const recommendations = products
    .filter((p) => !productIds.includes(p.id))
    .map((p) => {
      let score = 0;
      if (categories.includes(p.categorySlug)) score += 2;
      score += p.tags.filter((t) => tags.includes(t)).length;
      if (p.featured) score += 1;
      return { product: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((r) => r.product);

  return recommendations;
}

export async function generateStickerPreview(prompt: string) {
  if (!prompt.trim()) {
    return { success: false, message: "Please enter a prompt" };
  }

  // In production, call OpenAI DALL-E API
  // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // const response = await openai.images.generate({ prompt, n: 1, size: "512x512" });

  return {
    success: true,
    message: "Sticker generated successfully",
    previewUrl: `https://images.unsplash.com/photo-1611532736597-de2d90b29b83?w=512&q=80`,
    prompt,
  };
}

export async function analyzeRoomDecor(imageUrl: string) {
  if (!imageUrl) {
    return { success: false, message: "Please upload an image" };
  }

  const suggestions = {
    paintings: products.filter((p) => p.categorySlug === "paintings").slice(0, 3),
    decor: products.filter((p) => p.categorySlug === "home-decor").slice(0, 2),
    colorTheme: ["Sage Green", "Warm Beige", "Terracotta"],
    bundle: products.filter((p) => p.tags.includes("gift")).slice(0, 1),
  };

  return { success: true, suggestions };
}
