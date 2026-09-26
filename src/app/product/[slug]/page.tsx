import { getProductBySlugFromStore } from "@/lib/products-store";
import { products } from "@/lib/data/products";
import { ProductPageClient } from "@/components/product/product-detail";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugFromStore(slug);
  if (!product) return { title: "Artisan Haven Product" };

  return {
    title: `${product.name} | Artisan Haven`,
    description: product.description,
    openGraph: {
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  return <ProductPageClient slug={slug} />;
}
