"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlist-store";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { formatPrice } from "@/lib/utils";

export default function UserWishlistPage() {
  const hydrated = useStoreHydrated();
  const { items, removeItem, clearWishlist } = useWishlistStore();

  return (
    <DashboardShell allowedRole="user">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold">My Wishlist</h1>
            <p className="mt-1 text-muted-foreground">
              {hydrated ? `${items.length} saved items` : "Loading..."}
            </p>
          </div>
          {hydrated && items.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearWishlist}>
              Clear All
            </Button>
          )}
        </div>

        {!hydrated ? (
          <p className="text-muted-foreground">Loading wishlist...</p>
        ) : items.length === 0 ? (
          <div className="rounded-card border border-dashed border-border p-12 text-center">
            <Heart className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Your wishlist is empty</p>
            <Link href="/shop">
              <Button className="mt-4">Browse Shop</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-card border border-border bg-card shadow-soft"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-medium">{formatPrice(product.price)}</span>
                    <div className="flex gap-2">
                      <Link href={`/product/${product.slug}`}>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(product.id)}
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
