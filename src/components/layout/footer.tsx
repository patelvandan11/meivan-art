import Link from "next/link";
import Image from "next/image";
import { Instagram, Youtube } from "lucide-react";

const footerLinks = {
  shop: [
    { label: "🌿 Live Indoor Plants", href: "/plants" },
    { label: "🎨 Original Paintings", href: "/art" },
    { label: "🏺 Hand-Painted Planters", href: "/planters" },
    { label: "🎁 Art & Plant Bundles", href: "/bundles" },
    { label: "🛍️ Complete Shop", href: "/shop" },
  ],
  company: [
    { label: "About Us & Story", href: "/shop" },
    { label: "Community Gallery", href: "/gallery" },
    { label: "AI Room Decor Visualizer", href: "/ai/room-decor" },
    { label: "AI Gift Finder", href: "/ai/gift-finder" },
    { label: "Site Map & Directory", href: "/site-map" },
  ],
  support: [
    { label: "Track Your Order", href: "/checkout/success" },
    { label: "Plant Care & Guarantee", href: "/#faq" },
    { label: "Safe Eco-Packaging", href: "/#why-art-plants" },
    { label: "Contact: vandanartwork@gmail.com", href: "mailto:vandanartwork@gmail.com" },
    { label: "XML Sitemap", href: "/sitemap.xml" },
  ],
};

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/vandanartwork", icon: Instagram },
  { label: "Pinterest", href: "https://www.pinterest.com/vandanartwork", icon: null },
  { label: "YouTube", href: "https://www.youtube.com/@vandanartwork", icon: Youtube },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-footer">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 group mb-2">
              <Image
                src="/logo.png"
                alt="Vandan Art & Plants Logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
              />
              <h3 className="font-heading text-2xl font-bold tracking-tight">Vandan Art & Plants</h3>
            </Link>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-terracotta">
              Art That Tells a Story • Plants That Breathe Life
            </p>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground leading-relaxed">
              A botanical and fine art studio where creativity grows alongside living nature. We hand-paint original canvas artworks, nurture healthy air-purifying houseplants, and paint unique terracotta planters delivered safely across India.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-current/20 transition-colors hover:bg-current/10"
                  aria-label={social.label}
                >
                  {social.icon ? (
                    <social.icon className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-medium">{social.label[0]}</span>
                  )}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider opacity-50">
              Shop Collections
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={`shop-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-sm opacity-70 transition-colors hover:opacity-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider opacity-50">
              Explore
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={`company-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-sm opacity-70 transition-colors hover:opacity-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider opacity-50">
              Customer Support
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.support.map((link) => (
                <li key={`support-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-sm opacity-70 transition-colors hover:opacity-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-current/10 pt-8 sm:flex-row">
          <p className="text-sm opacity-50">
            &copy; {new Date().getFullYear()} Vandan Artwork. All rights reserved. Art That Tells a Story.
          </p>
          <div className="flex gap-6 text-sm opacity-50">
            <Link href="/privacy" className="hover:opacity-100">
              Privacy
            </Link>
            <Link href="/terms" className="hover:opacity-100">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
