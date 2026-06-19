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

export const metadata: Metadata = {
  title: {
    default: "By Vandan | Handcrafted Art for Beautiful Living",
    template: "%s | By Vandan",
  },
  description:
    "Discover paintings, journals, stickers, home decor, and gifts crafted to inspire creativity and comfort. Premium handcrafted artistic products.",
  keywords: [
    "handcrafted art",
    "paintings",
    "journals",
    "stickers",
    "home decor",
    "artisan",
    "gifts",
  ],
  authors: [{ name: "Vandan" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Artisan Haven",
    title: "Artisan Haven | Handcrafted Art for Beautiful Living",
    description:
      "Premium handcrafted artistic products for beautiful living.",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} ${cormorant.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="artisan-haven-theme"
        >
          <AuthProvider>
            <SiteShell>{children}</SiteShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
