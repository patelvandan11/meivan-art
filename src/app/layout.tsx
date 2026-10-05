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

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://meivan-art.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "🎨 Meivan Art — Art That Tells a Story | Original Handmade Paintings",
    template: "%s | Meivan Art",
  },
  description:
    "A digital art store where customers can discover and purchase handmade paintings and original artwork, with a focus on nature, sunsets, astronomy, emotions, and creative visual storytelling. Handmade Art. Unique Stories.",
  keywords: [
    "Meivan Art",
    "handmade paintings",
    "original artwork",
    "sunset paintings",
    "astronomy art",
    "nature canvas art",
    "emotional visual storytelling",
    "buy paintings online",
    "handcrafted art store",
    "art that tells a story",
  ],
  authors: [{ name: "Meivan Art", url: appUrl }],
  creator: "Meivan Art",
  publisher: "Meivan Art",
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
    siteName: "Meivan Art",
    title: "Meivan Art — Art That Tells a Story",
    description:
      "A digital art store where customers can discover and purchase handmade paintings and original artwork, focusing on nature, sunsets, astronomy, emotions, and creative visual storytelling.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Meivan Art — Original Handmade Paintings & Fine Art",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meivan Art — Art That Tells a Story",
    description:
      "Handmade Art. Unique Stories. Discover original paintings, sunset art, and astronomy canvas prints.",
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
      name: "Meivan Art",
      url: appUrl,
      logo: `${appUrl}/logo.png`,
      description:
        "A digital art store where customers can discover and purchase handmade paintings and original artwork, with a focus on nature, sunsets, astronomy, emotions, and creative visual storytelling.",
      slogan: "Art That Tells a Story. Handmade Art. Unique Stories.",
      email: "meivaninfo@gmail.com",
      sameAs: ["https://www.instagram.com/meivanart"],
    },
    {
      "@type": "WebSite",
      "@id": `${appUrl}/#website`,
      url: appUrl,
      name: "Meivan Art",
      description: "Art That Tells a Story. Handmade Art. Unique Stories.",
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
      name: "Meivan Art",
      url: appUrl,
      description:
        "A digital art store where customers can discover and purchase handmade paintings and original artwork.",
      priceRange: "₹₹",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80",
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
          storageKey="meivan-art-theme"
        >
          <AuthProvider>
            <SiteShell>{children}</SiteShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
