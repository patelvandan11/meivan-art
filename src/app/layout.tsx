import type { Metadata } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { SiteShell } from "@/components/layout/site-shell";
import "@/styles/globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vandanartwork.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "🎨🌿 Vandan Art & Plants — Original Handmade Paintings, Living Plants & Hand-Painted Pots",
    template: "%s | Vandan Art & Plants",
  },
  description:
    "Discover original handmade paintings, healthy indoor plants, hand-painted ceramic planters, botanical artwork, and curated art & plant gift bundles at Vandan Art & Plants. Where art meets nature. Safe eco-friendly plant delivery across India.",
  keywords: [
    "Vandan Art & Plants",
    "Vandan Artwork",
    "buy indoor plants online",
    "handmade paintings India",
    "hand-painted planters",
    "air purifying plants",
    "monstera deliciosa buy online",
    "variegated snake plant",
    "peace lily indoor plant",
    "jade bonsai plant",
    "original canvas paintings",
    "sunset paintings",
    "astronomy galaxy wall art",
    "botanical leaf artwork",
    "art and plant gift bundles",
    "hand-painted terracotta pots",
    "nature home decor",
    "buy paintings online",
    "botanical studio",
  ],
  authors: [{ name: "Vandan Art & Plants", url: appUrl }],
  creator: "Vandan Art & Plants",
  publisher: "Vandan Art & Plants",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: appUrl,
    siteName: "Vandan Art & Plants",
    title: "Vandan Art & Plants — Art That Tells a Story, Plants That Breathe Life",
    description:
      "Original handmade paintings, lush indoor houseplants, artisan hand-painted pots, and curated nature bundles. Delivered safely to your doorstep.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Vandan Art & Plants — Original Handmade Paintings & Indoor Living Plants",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vandan Art & Plants — Where Art Meets Nature",
    description:
      "Original handmade paintings, lush indoor houseplants, artisan hand-painted pots, and mindful art & plant bundles.",
    images: ["https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&q=80"],
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "./",
  },
  other: {
    "p:domain_verify": "fee14a4b3a5e7d65723af11993b51441",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${appUrl}/#organization`,
      name: "Vandan Art & Plants",
      url: appUrl,
      logo: `${appUrl}/logo.png`,
      description:
        "A boutique art and botanical studio crafting handmade original paintings, propagating healthy indoor plants, and hand-painting terracotta planters for mindful, nature-inspired living.",
      slogan: "Art That Tells a Story • Plants That Breathe Life",
      email: "vandanartwork@gmail.com",
      sameAs: [
        "https://www.instagram.com/vandanartwork",
        "https://www.pinterest.com/vandanartwork",
        "https://www.youtube.com/@vandanartwork",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${appUrl}/#website`,
      url: appUrl,
      name: "Vandan Art & Plants",
      description: "Original Handmade Paintings, Indoor Plants & Hand-Painted Pots.",
      publisher: { "@id": `${appUrl}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${appUrl}/shop?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "OnlineStore",
      "@id": `${appUrl}/#store`,
      name: "Vandan Art & Plants",
      url: appUrl,
      description:
        "Digital art and plant store offering original paintings, live indoor house plants, hand-painted ceramic and terracotta pots, and botanical gifts.",
      priceRange: "₹₹",
      image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&q=80",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Art & Plants Collections",
        itemListElement: [
          {
            "@type": "OfferCatalog",
            name: "Original Paintings & Canvas Art",
          },
          {
            "@type": "OfferCatalog",
            name: "Indoor & Air-Purifying Plants",
          },
          {
            "@type": "OfferCatalog",
            name: "Hand-Painted Planters & Pots",
          },
          {
            "@type": "OfferCatalog",
            name: "Art & Plant Bundles",
          },
        ],
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="p:domain_verify" content="fee14a4b3a5e7d65723af11993b51441" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} ${cormorant.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="vandan-artwork-theme"
        >
          <AuthProvider>
            <SiteShell>{children}</SiteShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
