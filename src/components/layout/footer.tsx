import Link from "next/link";
import Image from "next/image";
import { Instagram, Youtube, MessageCircle } from "lucide-react";
import { getWhatsAppUrl, buildGeneralInquiryWhatsAppMessage } from "@/lib/whatsapp";

const footerLinks = {
  shop: [
    { label: "🎨 Original Paintings", href: "/shop?category=paintings" },
    { label: "🍃 Botanical & Nature Art", href: "/shop?category=botanical-art" },
    { label: "🌅 Sunsets & Celestial", href: "/shop?category=sunsets-celestial" },
    { label: "📖 Art Journals & Books", href: "/shop?category=journals" },
    { label: "🖼️ Fine Art Prints", href: "/shop?category=prints-sketches" },
    { label: "⚡ Digital Downloads", href: "/shop?category=digital" },
  ],
  company: [
    { label: "About the Artist", href: "/shop" },
    { label: "Community Gallery", href: "/gallery" },
    { label: "AI Room Decor Visualizer", href: "/ai/room-decor" },
    { label: "AI Art Gift Finder", href: "/ai/gift-finder" },
    { label: "Site Map & Directory", href: "/site-map" },
  ],
  support: [
    { label: "💬 Book Order via WhatsApp", href: getWhatsAppUrl(buildGeneralInquiryWhatsAppMessage()), external: true },
    { label: "📞 Call / WhatsApp: +91 96647 92015", href: "tel:+919664792015" },
    { label: "Track Your Order", href: "/checkout/success" },
    { label: "Artwork Care & Hanging FAQ", href: "/#faq" },
    { label: "Insured Art Packaging", href: "/#why-original-art" },
    { label: "Contact: vandanartwork@gmail.com", href: "mailto:vandanartwork@gmail.com" },
  ],
};

const socialLinks = [
  { label: "WhatsApp", href: getWhatsAppUrl(buildGeneralInquiryWhatsAppMessage()), icon: MessageCircle },
  { label: "Instagram", href: "https://www.instagram.com/vandanartwork", icon: Instagram },
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
                alt="Vandan Artwork Logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
              />
              <h3 className="font-heading text-2xl font-bold tracking-tight">Vandan Artwork</h3>
            </Link>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-terracotta">
              Art That Tells a Story
            </p>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground leading-relaxed">
              An independent fine art studio crafting original handmade paintings, textured canvases, fine art prints, and handcrafted sketchbooks. Each piece is painted with soulful passion, emotional depth, and meticulous craftsmanship.
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
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider opacity-50">
              Art Collections
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
              Ordering & Help
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.support.map((link) => (
                <li key={`support-${link.label}`}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[#25D366] hover:underline"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm opacity-70 transition-colors hover:opacity-100"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Vandan Artwork. All rights reserved. Handcrafted original art.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="/site-map" className="hover:text-foreground">
              Site Map
            </Link>
            <Link href="/gallery" className="hover:text-foreground">
              Art Gallery
            </Link>
            <a
              href={getWhatsAppUrl(buildGeneralInquiryWhatsAppMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] font-medium hover:underline"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
