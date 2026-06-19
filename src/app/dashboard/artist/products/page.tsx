"use client";

import Image from "next/image";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useAuthStore } from "@/store/auth-store";
import { getProductsByArtist } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function ArtistProductsPage() {
  const user = useAuthStore((s) => s.user);
  const artistSlug = user?.artistSlug ?? "maya-chen";
  const products = getProductsByArtist(artistSlug);

  return (
    <DashboardShell allowedRole="artist">
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-semibold">My Products</h1>
          <p className="mt-1 text-muted-foreground">{products.length} items listed</p>
        </div>

        {products.length === 0 ? (
          <p className="text-muted-foreground">No products found for your artist profile.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
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
                    <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
                  </div>
                  <Link href={`/product/${product.slug}`}>
                    <Button size="sm" variant="outline" className="mt-3 w-full">
                      View Listing
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
