import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";

const footerLinks = {
  shop: [
    { label: "Paintings", href: "/shop?category=paintings" },
    { label: "Calendars", href: "/shop?category=calendars" },
    { label: "Stickers", href: "/shop?category=stickers" },
    { label: "Mugs", href: "/shop?category=mugs" },
  ],
  // company: [
  //   { label: "About", href: "/about" },
  //   { label: "Artists", href: "/artists" },
  //   { label: "Blog", href: "/blog" },
  //   { label: "Contact", href: "/contact" },
  // ],
  // support: [
  //   { label: "FAQ", href: "/faq" },
  //   { label: "Shipping", href: "/shipping" },
  //   { label: "Returns", href: "/returns" },
  // ],
};

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "Pinterest", href: "https://pinterest.com", icon: null },
  { label: "TikTok", href: "https://tiktok.com", icon: null },
  { label: "Facebook", href: "https://facebook.com", icon: Facebook },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-footer">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h3 className="font-heading text-2xl font-semibold">Artisan Haven</h3>
            <p className="mt-4 max-w-sm font-accent text-lg italic opacity-70">
              Handcrafted art for beautiful living. Celebrating creativity, craftsmanship,
              and mindful living.
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
              Shop
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
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
              Company
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
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
              Support
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
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
            &copy; 2026 Artisan Haven. Crafted with passion by Vandan.
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
