"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Heart,
  FolderOpen,
  Package,
  BarChart3,
  LogOut,
  Palette,
  Home,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthStore, getDashboardPath } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

const NAV: Record<UserRole, { href: string; label: string; icon: typeof Heart }[]> = {
  user: [
    { href: "/dashboard/user", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/user/wishlist", label: "Wishlist", icon: Heart },
    { href: "/dashboard/user/albums", label: "My Albums", icon: FolderOpen },
  ],
  artist: [
    { href: "/dashboard/artist", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/artist/products", label: "My Products", icon: Palette },
    { href: "/dashboard/artist/sales", label: "Sales", icon: BarChart3 },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/orders", label: "Orders", icon: Package },
    { href: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
  ],
};

export function DashboardShell({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole: UserRole;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuthStore();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== allowedRole) {
      router.replace(getDashboardPath(user.role));
    }
  }, [user, allowedRole, router, loading]);

  if (loading || !user || user.role !== allowedRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  const links = NAV[user.role];

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 flex-col border-r border-border bg-card md:flex">
        <div className="border-b border-border p-6">
          <Link href="/" className="font-heading text-xl font-semibold">
            Artisan Haven
          </Link>
          <p className="mt-1 text-xs capitalize text-muted-foreground">
            {user.role} dashboard
          </p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-terracotta/10 text-terracotta"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-2 border-t border-border p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-foreground/5"
          >
            <Home className="h-4 w-4" />
            Back to Shop
          </Link>
          <button
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-foreground/5"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-xl sm:px-6">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <p className="font-medium">{user.name}</p>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
