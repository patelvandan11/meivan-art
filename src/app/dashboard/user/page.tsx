"use client";

import Link from "next/link";
import { Heart, FolderOpen, ShoppingBag } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { useWishlistStore } from "@/store/wishlist-store";
import { useAlbumsStore } from "@/store/albums-store";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";

export default function UserDashboardPage() {
  const hydrated = useStoreHydrated();
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const albumCount = useAlbumsStore((s) => s.albums.length);

  return (
    <DashboardShell allowedRole="user">
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-semibold">My Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your wishlist and custom art albums
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Wishlist Items"
            value={hydrated ? String(wishlistCount) : "—"}
            icon={Heart}
            sub="Saved for later"
          />
          <StatCard
            label="My Albums"
            value={hydrated ? String(albumCount) : "—"}
            icon={FolderOpen}
            sub="Custom collections"
          />
          <StatCard label="Shop" value="Browse" icon={ShoppingBag} sub="Discover new art" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard/user/wishlist"
            className="rounded-card border border-border bg-card p-6 shadow-soft transition-all hover:border-terracotta hover:shadow-soft-lg"
          >
            <Heart className="h-8 w-8 text-terracotta" />
            <h2 className="mt-4 font-heading text-xl font-semibold">Wishlist</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              View paintings, mugs, journals and more you&apos;ve saved.
            </p>
          </Link>
          <Link
            href="/dashboard/user/albums"
            className="rounded-card border border-border bg-card p-6 shadow-soft transition-all hover:border-terracotta hover:shadow-soft-lg"
          >
            <FolderOpen className="h-8 w-8 text-terracotta" />
            <h2 className="mt-4 font-heading text-xl font-semibold">My Albums</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Create albums like &quot;Natural Painting&quot; or &quot;Canvas Art&quot; with your favorite pieces.
            </p>
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
