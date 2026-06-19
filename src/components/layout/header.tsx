"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import { LayoutDashboard, User } from "lucide-react";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/artists", label: "Artists" },
  { href: "/gallery", label: "Gallery" },
  { href: "/ai", label: "AI Tools" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const hydrated = useStoreHydrated();
  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.loading);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-terracotta" />
            <span className="font-heading text-xl font-semibold tracking-tight">
              Artisan Haven
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-terracotta",
                  pathname.startsWith(link.href)
                    ? "text-terracotta"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            <ThemeToggle />

            <Link href={user ? "/dashboard" : "/login"}>
              <Button variant="ghost" size="icon" aria-label={user ? "Dashboard" : "Sign in"}>
                {!authLoading && user ? (
                  <LayoutDashboard className="h-5 w-5" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            </Link>

            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
                {hydrated && wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-terracotta text-[10px] text-white">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative" aria-label="Cart">
                <ShoppingBag className="h-5 w-5" />
                {hydrated && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-terracotta text-[10px] text-white">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden border-t border-border transition-all duration-300",
            searchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <form action="/shop" className="mx-auto max-w-2xl px-4 py-3">
            <input
              name="search"
              type="search"
              placeholder="Search paintings, journals, mugs..."
              className="w-full rounded-full border border-border bg-background/80 px-5 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-terracotta/30"
            />
          </form>
        </div>
      </div>

      <nav
        className={cn(
          "glass border-b transition-all duration-300 md:hidden",
          mobileOpen
            ? "pointer-events-auto max-h-80 opacity-100"
            : "pointer-events-none max-h-0 overflow-hidden opacity-0"
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-foreground/5"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
