import type { Metadata } from "next";
import Link from "next/link";
import { categories, artists } from "@/lib/data/products";
import { getAllProductsFromStore } from "@/lib/products-store";
import { 
  ShoppingBag, 
  Sparkles, 
  FileCode2, 
  Heart, 
  Compass, 
  Layers,
  User 
} from "lucide-react";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vandanartwork.vercel.app";

export const metadata: Metadata = {
  title: "Sitemap & Art Directory — Vandan Artwork",
  description:
    "Explore the complete website directory for Vandan Artwork. Discover handmade canvas paintings, artisan ceramic mugs, custom stickers, aesthetic home decor, handbound journals, digital art, and AI room visualizer.",
  keywords: [
    "Vandan Artwork sitemap",
    "handmade paintings directory",
    "buy art online category list",
    "artisan ceramic mugs",
    "custom stickers store",
    "canvas wall art directory",
    "sunset paintings",
    "astronomy canvas art",
    "AI room decor generator",
  ],
  alternates: {
    canonical: `${appUrl}/site-map`,
  },
  openGraph: {
    title: "Sitemap & Art Directory — Vandan Artwork",
    description: "Complete navigation index of Vandan Artwork store collections, artists, products, and AI visualizer tools.",
    url: `${appUrl}/site-map`,
  },
};

export default async function SiteMapPage() {
  const products = await getAllProductsFromStore();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
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
        name: "Sitemap",
        item: `${appUrl}/site-map`,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Header section */}
      <div className="border-b border-border/60 pb-8 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-accent text-sm font-semibold tracking-wider text-terracotta uppercase">
              SEO Website Navigation & Directory
            </p>
            <h1 className="mt-1 font-heading text-3xl font-bold tracking-tight md:text-5xl">
              Vandan Artwork Sitemap
            </h1>
            <p className="mt-3 max-w-3xl text-base text-muted-foreground leading-relaxed">
              Welcome to the complete index of <span className="font-medium text-foreground">Vandan Artwork</span>. Browse our curated collections of original handmade paintings, artisan ceramics, custom sticker packs, handbound journals, canvas tote bags, digital art, and AI room visualizers.
            </p>
          </div>
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary/60 shadow-xs"
          >
            <FileCode2 className="h-4 w-4 text-terracotta" />
            <span>XML Sitemap for Search Engines</span>
          </a>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        {/* 1. Core Navigation */}
        <section className="rounded-card border border-border/80 bg-card p-6 shadow-xs transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="rounded-lg bg-terracotta/10 p-2 text-terracotta">
              <Compass className="h-5 w-5" />
            </div>
            <h2 className="font-heading text-xl font-bold">Main Store Sections</h2>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link href="/" className="font-medium text-foreground hover:text-terracotta transition-colors">
                🎨 Home Page — Handmade Art & Storytelling
              </Link>
              <p className="text-xs text-muted-foreground mt-0.5">Discover featured canvas artworks, artisan bestsellers, and customer stories.</p>
            </li>
            <li>
              <Link href="/shop" className="font-medium text-foreground hover:text-terracotta transition-colors">
                🛍️ Online Shop — Fine Art & Artisanal Goods
              </Link>
              <p className="text-xs text-muted-foreground mt-0.5">Filter by price, category, art style, ratings, and newest releases.</p>
            </li>
            <li>
              <Link href="/gallery" className="font-medium text-foreground hover:text-terracotta transition-colors">
                🖼️ Art Gallery — Room Styling & Inspiration
              </Link>
              <p className="text-xs text-muted-foreground mt-0.5">Explore wall art mockups, aesthetic home setups, and sunset canvas gallery.</p>
            </li>
            <li>
              <Link href="/artists" className="font-medium text-foreground hover:text-terracotta transition-colors">
                👩‍🎨 Artists Showcase — Meet the Creators
              </Link>
              <p className="text-xs text-muted-foreground mt-0.5">Read painter bios, artist portfolios, and visual storytelling process.</p>
            </li>
          </ul>
        </section>

        {/* 2. Art Categories */}
        <section className="rounded-card border border-border/80 bg-card p-6 shadow-xs transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="rounded-lg bg-terracotta/10 p-2 text-terracotta">
              <Layers className="h-5 w-5" />
            </div>
            <h2 className="font-heading text-xl font-bold">Product Categories</h2>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="font-medium text-foreground hover:text-terracotta transition-colors"
                >
                  ✨ {cat.name}
                </Link>
                <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* 3. AI Powered Tools */}
        <section className="rounded-card border border-border/80 bg-card p-6 shadow-xs transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="rounded-lg bg-terracotta/10 p-2 text-terracotta">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="font-heading text-xl font-bold">AI Art & Decor Suite</h2>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link href="/ai" className="font-medium text-foreground hover:text-terracotta transition-colors">
                🤖 AI Studio Hub
              </Link>
              <p className="text-xs text-muted-foreground mt-0.5">Overview of AI-assisted art preview, custom wall matching, and gift tools.</p>
            </li>
            <li>
              <Link href="/ai/room-decor" className="font-medium text-foreground hover:text-terracotta transition-colors">
                🏡 AI Room Decorator & Wall Preview
              </Link>
              <p className="text-xs text-muted-foreground mt-0.5">Visualize paintings directly on your living room or bedroom walls in real time.</p>
            </li>
            <li>
              <Link href="/ai/gift-finder" className="font-medium text-foreground hover:text-terracotta transition-colors">
                🎁 Smart AI Art Gift Recommendation Engine
              </Link>
              <p className="text-xs text-muted-foreground mt-0.5">Find personalized art gifts based on budget, occasion, and artistic taste.</p>
            </li>
          </ul>
        </section>

        {/* 4. Products Index */}
        <section className="rounded-card border border-border/80 bg-card p-6 shadow-xs transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="rounded-lg bg-terracotta/10 p-2 text-terracotta">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <h2 className="font-heading text-xl font-bold">Product Catalog</h2>
          </div>
          {products.length > 0 ? (
            <ul className="mt-4 space-y-2.5 text-sm max-h-80 overflow-y-auto pr-2 scrollbar-thin">
              {products.map((prod) => (
                <li key={prod.id}>
                  <Link
                    href={`/product/${prod.slug}`}
                    className="font-medium text-foreground hover:text-terracotta transition-colors flex items-center justify-between"
                  >
                    <span>{prod.name}</span>
                    <span className="text-xs text-terracotta font-semibold">₹{prod.price}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Catalog items updating in real-time. Check back shortly!</p>
          )}
        </section>

        {/* 5. Featured Artists */}
        <section className="rounded-card border border-border/80 bg-card p-6 shadow-xs transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="rounded-lg bg-terracotta/10 p-2 text-terracotta">
              <User className="h-5 w-5" />
            </div>
            <h2 className="font-heading text-xl font-bold">Featured Artists</h2>
          </div>
          {artists.length > 0 ? (
            <ul className="mt-4 space-y-3 text-sm">
              {artists.map((artist) => (
                <li key={artist.id}>
                  <Link
                    href={`/artists/${artist.slug}`}
                    className="font-medium text-foreground hover:text-terracotta transition-colors"
                  >
                    🎨 {artist.name}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">{artist.bio || artist.specialty}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>Explore original works created by independent fine artists, painters, and illustrator partners.</p>
              <Link href="/artists" className="inline-block font-medium text-terracotta hover:underline">
                View All Artist Profiles →
              </Link>
            </div>
          )}
        </section>

        {/* 6. Customer Account & Utilities */}
        <section className="rounded-card border border-border/80 bg-card p-6 shadow-xs transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="rounded-lg bg-terracotta/10 p-2 text-terracotta">
              <Heart className="h-5 w-5" />
            </div>
            <h2 className="font-heading text-xl font-bold">Customer Portal & Account</h2>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link href="/login" className="font-medium text-foreground hover:text-terracotta transition-colors">
                🔐 Account Login / Sign In
              </Link>
            </li>
            <li>
              <Link href="/signup" className="font-medium text-foreground hover:text-terracotta transition-colors">
                📝 Register New Customer Account
              </Link>
            </li>
            <li>
              <Link href="/cart" className="font-medium text-foreground hover:text-terracotta transition-colors">
                🛒 Shopping Cart & Checkout
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="font-medium text-foreground hover:text-terracotta transition-colors">
                💖 Saved Favorites & Wishlist
              </Link>
            </li>
            <li>
              <Link href="/dashboard/user" className="font-medium text-foreground hover:text-terracotta transition-colors">
                📊 User Order Dashboard & History
              </Link>
            </li>
          </ul>
        </section>
      </div>

      {/* Footer SEO Keywords Bar */}
      <div className="mt-16 rounded-card border border-border/60 bg-secondary/30 p-6 text-center">
        <h3 className="font-heading text-lg font-bold text-foreground">
          SEO Keyword Index for Vandan Artwork
        </h3>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          Original Handmade Canvas Art • Aesthetic Sunset Paintings • Artisan Ceramic Coffee Mugs • Handbound Journals & Stationaries • Custom Stickers & Laptop Decals • Canvas Tote Bags • Digital Art Downloads • Personalised Gift Boxes • AI Interior Decor Preview Engine • Independent Artist Store
        </p>
      </div>
    </div>
  );
}
