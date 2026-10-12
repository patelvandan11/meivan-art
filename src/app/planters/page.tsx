import type { Metadata } from "next";
import { PlantersClient } from "./planters-client";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vandanartwork.vercel.app";

export const metadata: Metadata = {
  title: "🏺 Hand-Painted Planters & Artisan Ceramic Pots",
  description:
    "Discover artist hand-painted terracotta pots and glazed ceramic planters at Vandan Art & Plants. Breathable earthenware with built-in drainage holes designed to make your houseplants thrive.",
  keywords: [
    "hand-painted terracotta pots India",
    "artisan ceramic planters",
    "sunset painted pots",
    "indoor plant pots with drainage",
    "decorative flower pots",
    "custom planter pots",
    "botanical ceramic containers",
  ],
  alternates: {
    canonical: `${appUrl}/planters`,
  },
  openGraph: {
    title: "Hand-Painted Planters & Artisan Pots | Vandan Art & Plants",
    description:
      "Individually hand-painted terracotta and ceramic pots turning houseplants into living sculptures.",
    url: `${appUrl}/planters`,
    siteName: "Vandan Art & Plants",
    images: [
      {
        url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Vandan Art & Plants — Hand-Painted Planters & Pots",
      },
    ],
  },
};

export default function PlantersPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Hand-Painted Planters & Pots Collection",
    description:
      "Shop handcrafted, artist-painted terracotta and ceramic planters with drainage holes.",
    url: `${appUrl}/planters`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: appUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Planters & Pots",
          item: `${appUrl}/planters`,
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PlantersClient />
    </>
  );
}
