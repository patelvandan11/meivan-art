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
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vandanartwork.vercel.app";

  if (!product) {
    return {
      title: "Handmade Artwork | Vandan Artwork",
      description: "Original handmade painting and fine artwork from Vandan Artwork.",
    };
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80"];

  return {
    title: `${product.name} — Original Painting & Canvas Art`,
    description: `${product.description} Buy "${product.name}" online at Vandan Artwork. Art That Tells a Story.`,
    keywords: [
      product.name,
      product.category,
      "handmade painting",
      "original artwork",
      "Vandan Artwork",
      "buy art online",
      ...(product.tags || []),
    ],
    openGraph: {
      title: `${product.name} | Vandan Artwork`,
      description: product.description,
      url: `${appUrl}/product/${product.slug}`,
      siteName: "Vandan Artwork",
      images: images.map((img) => ({
        url: img,
        alt: `${product.name} — Vandan Artwork`,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Vandan Artwork`,
      description: product.description,
      images: [images[0]],
    },
    alternates: {
      canonical: `/product/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlugFromStore(slug);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vandanartwork.vercel.app";

  const productJsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: product.images,
        description: product.description,
        sku: product.id,
        brand: {
          "@type": "Brand",
          name: "Vandan Artwork",
        },
        offers: {
          "@type": "Offer",
          url: `${appUrl}/product/${product.slug}`,
          priceCurrency: "INR",
          price: product.price,
          availability:
            product.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          seller: {
            "@type": "Organization",
            name: "Vandan Artwork",
          },
        },
      }
    : null;

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      <ProductPageClient slug={slug} />
    </>
  );
}
