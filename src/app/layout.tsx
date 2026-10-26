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
    default: "🎨 Vandan Artwork — Art That Tells a Story | Original Handmade Paintings",
    template: "%s | Vandan Artwork",
  },
  description:
    "Discover original handmade paintings, textured canvases, sunset horizons, celestial astronomy artwork, fine art prints, and handbound sketchbooks at Vandan Artwork. Book orders easily via WhatsApp message with free insured delivery across India.",
  keywords: [
    "Vandan Artwork",
    "handmade paintings India",
    "original canvas paintings",
    "buy paintings online",
    "sunset paintings",
    "astronomy galaxy wall art",
    "botanical leaf artwork",
    "fine art prints",
    "handbound art journals",
    "custom art commissions",
    "book order via whatsapp",
    "Indian artist canvas",
  ],
  authors: [{ name: "Vandan Artwork", url: appUrl }],
  creator: "Vandan Artwork",
  publisher: "Vandan Artwork",
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
    siteName: "Vandan Artwork",
    title: "Vandan Artwork — Art That Tells a Story | Original Handmade Paintings",
    description:
      "Original handmade acrylic & oil paintings, textured canvases, and fine art prints. Book orders directly via WhatsApp message.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Vandan Artwork — Original Handmade Canvas Paintings",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vandan Artwork — Original Handmade Paintings",
    description:
      "Original handmade paintings, textured canvases, fine art prints, and handbound sketchbooks.",
    images: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80"],
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
      name: "Vandan Artwork",
      url: appUrl,
      logo: `${appUrl}/logo.png`,
      description:
        "A boutique independent fine art studio crafting handmade original paintings, textured cotton canvases, fine art prints, and handbound sketchbooks.",
      slogan: "Art That Tells a Story",
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
      name: "Vandan Artwork",
      description: "Original Handmade Paintings, Fine Art Prints & Handbound Sketchbooks.",
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
      name: "Vandan Artwork",
      url: appUrl,
      description:
        "Fine art studio offering original handmade acrylic and oil paintings, fine art prints, and handcrafted sketchbooks. Book orders directly via WhatsApp message.",
      priceRange: "₹₹",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Fine Art Collections",
        itemListElement: [
          {
            "@type": "OfferCatalog",
            name: "Original Canvas Paintings",
          },
          {
            "@type": "OfferCatalog",
            name: "Botanical & Nature Art",
          },
          {
            "@type": "OfferCatalog",
            name: "Sunset & Celestial Horizons",
          },
          {
            "@type": "OfferCatalog",
            name: "Fine Art Prints & Sketches",
          },
          {
            "@type": "OfferCatalog",
            name: "Art Journals & Sketchbooks",
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
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <SiteShell>{children}</SiteShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
