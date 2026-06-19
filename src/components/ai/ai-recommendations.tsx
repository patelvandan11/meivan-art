"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { getAIRecommendations } from "@/actions/ai";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types";

interface AIRecommendationsProps {
  productId: string;
}

export function AIRecommendations({ productId }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAIRecommendations([productId]).then((recs) => {
      setRecommendations(recs);
      setLoading(false);
    });
  }, [productId]);

  if (loading) {
    return (
      <section className="mt-20">
        <h2 className="font-heading text-2xl font-semibold">AI Recommendations</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5]" />
          ))}
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <section className="mt-20">
      <p className="text-sm text-terracotta font-medium">Powered by AI</p>
      <h2 className="mt-1 font-heading text-2xl font-semibold">
        You Might Also Love
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {recommendations.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
