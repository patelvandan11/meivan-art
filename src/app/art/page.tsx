import type { Metadata } from "next";
import { ArtClient } from "./art-client";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vandanartwork.vercel.app";

export const metadata: Metadata = {
  title: "🎨 Original Handmade Paintings & Fine Canvas Wall Art",
  description:
    "Discover original handmade paintings, sunset canvas artworks, celestial astronomy oil paintings, and botanical wall art by artist Vandan. 100% original, ready to hang, with signed certificate of authenticity.",
  keywords: [
    "original handmade paintings India",
    "buy canvas paintings online",
    "sunset acrylic painting",
    "astronomy galaxy canvas art",
    "botanical wall paintings",
    "fine art gallery India",
    "handbound linen journals",
    "original art for living room",
    "ready to hang canvas art",
    "Vandan Artwork paintings",
  ],
  alternates: {
    canonical: `${appUrl}/art`,
  },
  openGraph: {
    title: "Original Handmade Paintings & Canvas Art | Vandan Artwork",
    description:
      "Original acrylic and oil paintings celebrating sunsets, celestial astronomy, botanical wonder, and human emotion. Each canvas is 100% handcrafted and unique.",
    url: `${appUrl}/art`,
    siteName: "Vandan Artwork",
    images: [
      {
        url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Vandan Artwork — Original Handmade Canvas Paintings",
      },
    ],
  },
};

export default function ArtPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Original Paintings & Fine Canvas Art Collection",
    description:
      "Buy original handmade paintings on canvas with certificate of authenticity and safe delivery across India.",
    url: `${appUrl}/art`,
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
          name: "Original Art",
          item: `${appUrl}/art`,
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
      <ArtClient />
    </>
  );
}
