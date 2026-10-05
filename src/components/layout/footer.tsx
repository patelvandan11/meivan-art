import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook } from "lucide-react";

const footerLinks = {
  shop: [
    { label: "Paintings", href: "/shop?category=paintings" },
    { label: "Calendars", href: "/shop?category=calendars" },
    { label: "Stickers", href: "/shop?category=stickers" },
    { label: "Mugs", href: "/shop?category=mugs" },
  ],
  company: [
    { label: "About Us", href: "/shop" },
    { label: "Gallery", href: "/gallery" },
    { label: "AI Tools", href: "/ai" },
    { label: "Site Map & Directory", href: "/site-map" },
  ],
  support: [
    { label: "Track Order", href: "/checkout/success" },
    { label: "Shipping Policy", href: "/shop" },
    { label: "Contact: meivaninfo@gmail.com", href: "mailto:meivaninfo@gmail.com" },
    { label: "XML Sitemap", href: "/sitemap.xml" },
  ],
};

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/meivanart", icon: Instagram },
  { label: "Pinterest", href: "https://pinterest.com/meivanart/", icon: null },
  // { label: "Facebook", href: "https://facebook.com", icon: Facebook },
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
                alt="Meivan Art Logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
              />
              <h3 className="font-heading text-2xl font-bold tracking-tight">Meivan Art</h3>
            </Link>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-terracotta">
              Art That Tells a Story.
            </p>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground leading-relaxed">
              A digital art store where customers can discover and purchase handmade paintings and original artwork, with a focus on nature, sunsets, astronomy, emotions, and creative visual storytelling.
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
            &copy; {new Date().getFullYear()} Meivan Art. All rights reserved. Art That Tells a Story.
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
