import type { Metadata } from "next";
import { PlantsClient } from "./plants-client";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vandanartwork.vercel.app";

export const metadata: Metadata = {
  title: "🌿 Buy Healthy Indoor Houseplants & Air Purifiers Online",
  description:
    "Discover healthy, acclimated indoor houseplants, low-maintenance desk succulents, and air-purifying greens at Vandan Art & Plants. Potted in artisan planters with safe eco-friendly delivery across India.",
  keywords: [
    "buy indoor plants online India",
    "monstera deliciosa live plant",
    "variegated snake plant",
    "air purifying houseplants",
    "peace lily indoor plant",
    "golden pothos trailing vine",
    "jade bonsai desk plant",
    "low maintenance indoor plants",
    "plants in hand painted pots",
    "safe plant delivery India",
  ],
  alternates: {
    canonical: `${appUrl}/plants`,
  },
  openGraph: {
    title: "Live Indoor Houseplants & Greenery | Vandan Art & Plants",
    description:
      "Lush, healthy indoor plants that breathe life and pure oxygen into your sanctuary. Hand-potted and guaranteed healthy on arrival.",
    url: `${appUrl}/plants`,
    siteName: "Vandan Art & Plants",
    images: [
      {
        url: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Vandan Art & Plants — Healthy Live Indoor Houseplants",
      },
    ],
  },
};

export default function PlantsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Indoor Houseplants Collection",
    description:
      "Buy healthy, acclimated live houseplants and desk greenery online with safe delivery across India.",
    url: `${appUrl}/plants`,
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
          name: "Live Plants",
          item: `${appUrl}/plants`,
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
      <PlantsClient />
    </>
  );
}
