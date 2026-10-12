import type { Metadata } from "next";
import { BundlesClient } from "./bundles-client";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vandanartwork.vercel.app";

export const metadata: Metadata = {
  title: "🎁 Curated Art & Plant Sanctuary Bundles",
  description:
    "Discover curated Art & Plant gift bundles at Vandan Art & Plants. Original handmade canvas paintings harmoniously paired with healthy indoor houseplants in artisan planters. Save on complete room styling.",
  keywords: [
    "art and plant gift bundles",
    "plant and painting combo India",
    "sanctuary gift hamper",
    "housewarming art and plant gift",
    "monstera and sunset painting bundle",
    "creative desk gift set",
    "curated mindful gifts",
  ],
  alternates: {
    canonical: `${appUrl}/bundles`,
  },
  openGraph: {
    title: "Curated Art & Plant Bundles | Vandan Art & Plants",
    description:
      "Original canvas paintings paired with living indoor houseplants in hand-painted pots.",
    url: `${appUrl}/bundles`,
    siteName: "Vandan Art & Plants",
    images: [
      {
        url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Vandan Art & Plants — Curated Art & Plant Bundles",
      },
    ],
  },
};

export default function BundlesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Curated Art & Plant Bundles",
    description: "Curated combinations of original canvas paintings and live indoor plants.",
    url: `${appUrl}/bundles`,
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
          name: "Art & Plant Bundles",
          item: `${appUrl}/bundles`,
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
      <BundlesClient />
    </>
  );
}
