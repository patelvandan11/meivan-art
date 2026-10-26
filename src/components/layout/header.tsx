"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  User,
  Heart,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useAuthStore } from "@/store/auth-store";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { cn } from "@/lib/utils";
import { getWhatsAppUrl, buildGeneralInquiryWhatsAppMessage } from "@/lib/whatsapp";

interface DropdownLink {
  label: string;
  href: string;
  description?: string;
  badge?: string;
  icon?: string;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  dropdown?: DropdownLink[];
}

const navItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
  },
  {
    id: "original-paintings",
    label: "Original Paintings",
    href: "/shop?category=paintings",
    dropdown: [
      {
        label: "All Original Paintings",
        href: "/shop?category=paintings",
        description: "100% handmade acrylic & oil paintings on stretched canvas",
        badge: "Originals",
        icon: "🎨",
      },
      {
        label: "Sunset & Skies",
        href: "/shop?category=sunsets-celestial",
        description: "Warm golden sunsets, twilight horizons, and dusk skies",
        icon: "🌅",
      },
      {
        label: "Botanical & Nature Art",
        href: "/shop?category=botanical-art",
        description: "Lush emerald foliage, calming leaves, and nature canvases",
        icon: "🍃",
      },
      {
        label: "Celestial & Galaxy Art",
        href: "/shop?category=sunsets-celestial",
        description: "Nebula skies, deep space stardust, and celestial wonders",
        icon: "🌌",
      },
      {
        label: "Textured Impasto Canvases",
        href: "/shop?category=paintings",
        description: "Heavy palette knife textured artworks with tactile depth",
        icon: "✨",
      },
    ],
  },
  {
    id: "products",
    label: "Products",
    href: "/shop",
    dropdown: [
      {
        label: "Original Paintings",
        href: "/shop?category=paintings",
        description: "One-of-a-kind signed artwork on gallery-wrapped canvas",
        icon: "🎨",
      },
      {
        label: "Fine Art Prints & Postcards",
        href: "/shop?category=prints-sketches",
        description: "Museum-grade archival cotton prints and collectible postcards",
        badge: "10% Off",
        icon: "🖼️",
      },
      {
        label: "Handbound Art Journals",
        href: "/shop?category=journals",
        description: "Archival cotton sketchbooks crafted for artists & writers",
        icon: "📖",
      },
      {
        label: "Digital Art & Printable Guides",
        href: "/shop?category=digital",
        description: "Instant downloadable coloring books & hi-res digital art",
        icon: "⚡",
      },
      {
        label: "Browse All Products",
        href: "/shop",
        description: "Explore the entire studio catalog with live stock",
        icon: "🛍️",
      },
    ],
  },
  {
    id: "gifts-for",
    label: "Gifts for",
    href: "/shop",
    dropdown: [
      {
        label: "For Art Lovers",
        href: "/shop?category=paintings",
        description: "Meaningful handcrafted canvases that elevate any home",
        icon: "💝",
      },
      {
        label: "For Plant & Nature Lovers",
        href: "/shop?category=botanical-art",
        description: "Foliage studies and calming green sanctuary artwork",
        icon: "🌿",
      },
      {
        label: "Housewarming Gifts",
        href: "/shop?category=sunsets-celestial",
        description: "Warm horizons and vibrant centerpiece paintings",
        icon: "🏡",
      },
      {
        label: "For Creative Souls & Writers",
        href: "/shop?category=journals",
        description: "Handcrafted sketchbooks & thoughtful art gifts",
        icon: "✍️",
      },
      {
        label: "AI Art Gift Finder",
        href: "/ai/gift-finder",
        description: "Get personalized artwork recommendations in 3 clicks",
        badge: "Interactive",
        icon: "✨",
      },
    ],
  },
  {
    id: "collections",
    label: "Collections",
    href: "/shop",
    dropdown: [
      {
        label: "Sunset Serenade Series",
        href: "/shop?category=sunsets-celestial",
        description: "Atmospheric golden hour & twilight horizon studies",
        icon: "🌅",
      },
      {
        label: "Emerald Whispers Botanical",
        href: "/shop?category=botanical-art",
        description: "Soothing natural greenery inspired by tropical flora",
        icon: "🍃",
      },
      {
        label: "Celestial Dreams Nebula",
        href: "/shop?category=sunsets-celestial",
        description: "Cosmic astronomy paintings with deep stardust textures",
        icon: "🌌",
      },
      {
        label: "Studio Best Sellers",
        href: "/#best-sellers",
        description: "The most loved and collected artworks in the studio",
        badge: "Popular",
        icon: "⭐",
      },
      {
        label: "New Studio Arrivals",
        href: "/shop?sort=newest",
        description: "Fresh from the easel — recently finished canvases",
        icon: "✨",
      },
    ],
  },
  {
    id: "international-store",
    label: "International Store",
    href: getWhatsAppUrl(
      buildGeneralInquiryWhatsAppMessage(
        "International Shipping & Worldwide Art Orders"
      )
    ),
  },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const pathname = usePathname();
  const hydrated = useStoreHydrated();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cartItems = useCartStore((s) => s.items);
  const wishlistItems = useWishlistStore((s) => s.items);
  const cartCount = hydrated
    ? cartItems.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0)
    : 0;
  const wishlistCount = hydrated ? wishlistItems.length : 0;

  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.loading);
  const logout = useAuthStore((s) => s.logout);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const handleMouseEnter = (id: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(id);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  return (
    <header className="w-full relative z-50 font-sans">
      {/* 1. TOP ANNOUNCEMENT & UTILITY BAR (Yellow) */}
      <div className="bg-[#fac218] text-[#1f2421] px-3 sm:px-6 lg:px-10 py-1.5 sm:py-2 text-xs sm:text-[13px] font-medium border-b border-amber-300/80 shadow-xs">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
          {/* Announcement Text (Left) */}
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-gray-900 tracking-tight">
              Special 10% discount on Postcards and ArtPrints at the checkout :)
            </span>
          </div>

          {/* Utility Links: Auth + Cart + Search (Right) */}
          <div className="flex items-center gap-3 sm:gap-5 ml-auto text-xs sm:text-[13px]">
            {/* Account / Login */}
            <div className="hidden sm:flex items-center gap-1.5 text-gray-900">
              {!authLoading && user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="hover:underline font-semibold flex items-center gap-1"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>{user.name ? `Hi, ${user.name.split(" ")[0]}` : "Account"}</span>
                  </Link>
                  <span className="text-gray-600">•</span>
                  <button
                    onClick={() => logout()}
                    className="hover:underline text-gray-800 text-[11px]"
                    title="Sign out"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Link
                    href="/login"
                    className="hover:underline font-semibold text-gray-900"
                  >
                    Log in
                  </Link>
                  <span className="text-gray-700">or</span>
                  <Link
                    href="/signup"
                    className="hover:underline font-semibold text-gray-900"
                  >
                    Create account
                  </Link>
                </div>
              )}
            </div>

            {/* Wishlist Link (Subtle) */}
            <Link
              href="/wishlist"
              className="hidden md:flex items-center gap-1 text-gray-900 hover:text-black font-semibold transition-colors"
              title="View Wishlist"
            >
              <Heart className="h-3.5 w-3.5" />
              {hydrated && wishlistCount > 0 && (
                <span className="text-[11px]">({wishlistCount})</span>
              )}
            </Link>

            {/* Cart Link with Shopping Cart Icon */}
            <Link
              href="/cart"
              className="flex items-center gap-1.5 font-bold text-gray-900 hover:text-black transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Cart</span>
              {hydrated && cartCount > 0 && (
                <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-gray-900 text-white text-[10px] font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Inline Search Bar */}
            <form
              action="/shop"
              method="GET"
              className="relative flex items-center"
            >
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-gray-500 pointer-events-none" />
              <input
                type="search"
                name="search"
                placeholder="Search"
                className="h-7 w-24 sm:w-36 md:w-44 rounded-full bg-white pl-8 pr-3 text-xs text-gray-900 placeholder:text-gray-400 border border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-xs"
              />
            </form>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1 text-gray-900 hover:text-black focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN BRAND LOGO ROW (Clean White, Centered Studio Logo) */}
      <div className="bg-white dark:bg-[#151311] py-3.5 sm:py-4.5 border-b border-transparent transition-colors">
        <div className="mx-auto max-w-7xl px-4 flex flex-col items-center justify-center">
          <Link
            href="/"
            className="group flex flex-col items-center justify-center focus:outline-none"
            aria-label="Vandan Artwork Home"
          >
            {/* User's Original Logo Emblem */}
            <div className="relative h-14 w-14 sm:h-18 sm:w-18 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Vandan Artwork Logo"
                width={72}
                height={72}
                className="h-full w-full object-contain"
                priority
              />
            </div>

            {/* Studio Brand Name & Tagline */}
            <span className="mt-1 font-heading text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-none group-hover:text-[#00509d] transition-colors">
              Vandan Artwork
            </span>
            <span className="mt-0.5 text-[10px] sm:text-[11px] font-semibold text-gray-500 dark:text-gray-400 tracking-widest uppercase">
              Art That Tells a Story
            </span>
          </Link>
        </div>
      </div>

      {/* 3. CENTERED NAVIGATION BAR WITH DROPDOWNS (Framed with light blue borders) */}
      <nav className="hidden md:block bg-white dark:bg-[#151311] border-y border-[#cae0eb] dark:border-border/70 sticky top-0 shadow-xs">
        <div className="mx-auto max-w-7xl px-4">
          <ul className="flex items-center justify-center gap-6 lg:gap-10 py-2.5">
            {navItems.map((item) => {
              const isDropdown = Boolean(item.dropdown && item.dropdown.length > 0);
              const isOpen = openDropdown === item.id;
              const isExternal = item.href.startsWith("http");

              return (
                <li
                  key={item.id}
                  className="relative group"
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  {isDropdown ? (
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdown(isOpen ? null : item.id)
                      }
                      className={cn(
                        "flex items-center gap-1 text-[15px] font-semibold transition-colors py-1 focus:outline-none",
                        isOpen || (item.href !== "/" && pathname.startsWith(item.href))
                          ? "text-[#003870] font-bold"
                          : "text-[#00509d] hover:text-[#003870]"
                      )}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-200 opacity-80",
                          isOpen ? "rotate-180" : ""
                        )}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className={cn(
                        "flex items-center gap-1 text-[15px] font-semibold transition-colors py-1",
                        pathname === item.href
                          ? "text-[#003870] font-bold"
                          : "text-[#00509d] hover:text-[#003870]"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Dropdown Menu Card */}
                  {isDropdown && item.dropdown && isOpen && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-72"
                      onMouseEnter={() => handleMouseEnter(item.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="bg-white dark:bg-[#1a1715] rounded-xl shadow-xl border border-[#cae0eb] dark:border-border/80 p-2 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                        <ul className="flex flex-col gap-0.5">
                          {item.dropdown.map((sub) => (
                            <li key={sub.label}>
                              <Link
                                href={sub.href}
                                onClick={() => setOpenDropdown(null)}
                                className="group/sub flex items-start gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-[#eef7fc] dark:hover:bg-[#25201c] hover:text-[#00509d] transition-all"
                              >
                                {sub.icon && (
                                  <span className="text-base select-none mt-0.5">
                                    {sub.icon}
                                  </span>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="font-semibold text-gray-900 dark:text-gray-100 group-hover/sub:text-[#00509d] text-[13.5px]">
                                      {sub.label}
                                    </span>
                                    {sub.badge && (
                                      <span className="rounded-full bg-amber-100 dark:bg-amber-950/80 px-2 py-0.2 text-[10px] font-bold text-amber-900 dark:text-amber-300">
                                        {sub.badge}
                                      </span>
                                    )}
                                  </div>
                                  {sub.description && (
                                    <p className="text-[11.5px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5 font-normal">
                                      {sub.description}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* 4. MOBILE SLIDE-OUT / ACCORDION DRAWER */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-[#151311] border-b border-[#cae0eb] dark:border-border px-4 py-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Mobile Search Form */}
          <form
            action="/shop"
            method="GET"
            className="relative mb-4"
            onSubmit={() => setMobileOpen(false)}
          >
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="search"
              name="search"
              placeholder="Search paintings, prints, postcards..."
              className="w-full h-9 rounded-full bg-gray-50 dark:bg-gray-800 pl-9 pr-4 text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00509d]"
            />
          </form>

          {/* Mobile Nav Links with Accordions */}
          <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
            {navItems.map((item) => {
              const hasDropdown = Boolean(item.dropdown && item.dropdown.length > 0);
              const isAccordionOpen = mobileAccordion === item.id;
              const isExternal = item.href.startsWith("http");

              return (
                <div key={item.id} className="py-2">
                  {hasDropdown ? (
                    <div>
                      <button
                        onClick={() =>
                          setMobileAccordion(isAccordionOpen ? null : item.id)
                        }
                        className="flex w-full items-center justify-between text-base font-semibold text-[#00509d] py-1"
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            isAccordionOpen ? "rotate-180" : ""
                          )}
                        />
                      </button>

                      {isAccordionOpen && item.dropdown && (
                        <div className="mt-2 ml-3 flex flex-col gap-1 border-l-2 border-[#cae0eb] pl-3 py-1">
                          {item.dropdown.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              onClick={() => setMobileOpen(false)}
                              className="py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-[#00509d] flex items-center justify-between"
                            >
                              <span>{sub.label}</span>
                              {sub.badge && (
                                <span className="rounded-full bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.2 font-semibold">
                                  {sub.badge}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      onClick={() => setMobileOpen(false)}
                      className="block text-base font-semibold text-[#00509d] py-1"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile User Profile & Settings */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:divide-gray-800 flex items-center justify-between text-sm">
            {!authLoading && user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5"
                >
                  <User className="h-4 w-4" />
                  <span>My Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="text-xs text-red-600 hover:underline"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="font-semibold text-[#00509d] hover:underline"
                >
                  Log in
                </Link>
                <span className="text-gray-400">|</span>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="font-semibold text-[#00509d] hover:underline"
                >
                  Create account
                </Link>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Link
                href="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-gray-700 hover:text-black"
                title="Wishlist"
              >
                <Heart className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Direct WhatsApp / Call Support */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span className="font-medium">Direct Artist Support:</span>
            <a
              href="https://wa.me/919664792015"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#00509d] hover:underline"
            >
              +91 96647 92015
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
