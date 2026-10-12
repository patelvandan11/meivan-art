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
      title: "Art & Botanical Products | Vandan Art & Plants",
      description: "Original handmade paintings and healthy indoor plants from Vandan Art & Plants.",
    };
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80"];

  let titleSuffix = "Original Painting & Canvas Art";
  if (product.productType === "plant") {
    titleSuffix = "Healthy Indoor Plant & Hand-Painted Pot";
  } else if (product.productType === "bundle") {
    titleSuffix = "Curated Art & Living Plant Bundle";
  } else if (product.productType === "planter") {
    titleSuffix = "Artisan Hand-Painted Planter Pot";
  }

  return {
    title: `${product.name} — ${titleSuffix}`,
    description: `${product.description} Buy "${product.name}" online at Vandan Art & Plants. Safe eco-friendly plant delivery & authentic art across India.`,
    keywords: [
      product.name,
      product.category,
      "Vandan Art & Plants",
      "buy online India",
      ...(product.productType === "plant" ? ["indoor plant", "air purifying", "houseplant", "potted plant"] : []),
      ...(product.productType === "art" ? ["handmade painting", "canvas art", "original artwork"] : []),
      ...(product.tags || []),
    ],
    openGraph: {
      title: `${product.name} | Vandan Art & Plants`,
      description: product.description,
      url: `${appUrl}/product/${product.slug}`,
      siteName: "Vandan Art & Plants",
      images: images.map((img) => ({
        url: img,
        alt: `${product.name} — Vandan Art & Plants`,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Vandan Art & Plants`,
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
        category: product.category,
        brand: {
          "@type": "Brand",
          name: "Vandan Art & Plants",
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
            name: "Vandan Art & Plants",
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
