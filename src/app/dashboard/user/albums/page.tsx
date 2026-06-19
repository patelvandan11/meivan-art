"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FolderPlus, Plus, Trash2, X } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAlbumsStore } from "@/store/albums-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { products } from "@/lib/data/products";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";

const SUGGESTED_NAMES = [
  "Natural Painting",
  "Canvas Painting",
  "Watercolor Collection",
  "Home Decor Ideas",
  "Gift Inspiration",
];

export default function UserAlbumsPage() {
  const hydrated = useStoreHydrated();
  const { albums, createAlbum, deleteAlbum, addToAlbum, removeFromAlbum } = useAlbumsStore();
  const wishlistItems = useWishlistStore((s) => s.items);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [expandedAlbum, setExpandedAlbum] = useState<string | null>(null);

  function handleCreateAlbum(name?: string) {
    const albumName = (name ?? newAlbumName).trim();
    if (!albumName) return;
    createAlbum(albumName);
    setNewAlbumName("");
  }

  return (
    <DashboardShell allowedRole="user">
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-semibold">My Albums</h1>
          <p className="mt-1 text-muted-foreground">
            Organize art by your own names — natural painting, canvas, and more
          </p>
        </div>

        <div className="rounded-card border border-border bg-card p-6 shadow-soft">
          <h2 className="font-medium">Create New Album</h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder='e.g. "Natural Painting" or "Canvas Art"'
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateAlbum()}
            />
            <Button onClick={() => handleCreateAlbum()} className="gap-2 shrink-0">
              <FolderPlus className="h-4 w-4" />
              Create Album
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {SUGGESTED_NAMES.map((name) => (
              <button
                key={name}
                onClick={() => handleCreateAlbum(name)}
                className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-xs transition-colors hover:border-terracotta"
              >
                + {name}
              </button>
            ))}
          </div>
        </div>

        {!hydrated ? (
          <p className="text-muted-foreground">Loading albums...</p>
        ) : albums.length === 0 ? (
          <div className="rounded-card border border-dashed border-border p-12 text-center">
            <FolderPlus className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No albums yet. Create your first collection!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {albums.map((album) => {
              const albumProducts = album.productIds
                .map((id) => products.find((p) => p.id === id))
                .filter(Boolean);
              const isExpanded = expandedAlbum === album.id;

              return (
                <div
                  key={album.id}
                  className="rounded-card border border-border bg-card shadow-soft"
                >
                  <div className="flex items-center justify-between border-b border-border p-4">
                    <div>
                      <h3 className="font-heading text-xl font-semibold">{album.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {albumProducts.length} item{albumProducts.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setExpandedAlbum(isExpanded ? null : album.id)}
                      >
                        {isExpanded ? "Close" : "Add Items"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteAlbum(album.id)}
                        aria-label="Delete album"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {albumProducts.length > 0 ? (
                    <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
                      {albumProducts.map((product) =>
                        product ? (
                          <div key={product.id} className="group relative overflow-hidden rounded-lg border border-border">
                            <div className="relative aspect-square">
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="200px"
                              />
                            </div>
                            <div className="p-2">
                              <p className="truncate text-sm font-medium">{product.name}</p>
                            </div>
                            <button
                              onClick={() => removeFromAlbum(album.id, product.id)}
                              className="absolute top-2 right-2 rounded-full bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                              aria-label="Remove from album"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : null
                      )}
                    </div>
                  ) : (
                    <p className="p-4 text-sm text-muted-foreground">No items in this album yet.</p>
                  )}

                  {isExpanded && (
                    <div className="border-t border-border bg-secondary/20 p-4">
                      <p className="mb-3 text-sm font-medium">Add from wishlist or shop</p>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {[...wishlistItems, ...products.filter((p) => !wishlistItems.find((w) => w.id === p.id))].slice(0, 9).map((product) => (
                          <button
                            key={product.id}
                            onClick={() => addToAlbum(album.id, product.id)}
                            disabled={album.productIds.includes(product.id)}
                            className="flex items-center gap-3 rounded-lg border border-border bg-card p-2 text-left text-sm transition-colors hover:border-terracotta disabled:opacity-50"
                          >
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded">
                              <Image src={product.images[0]} alt="" fill className="object-cover" sizes="40px" />
                            </div>
                            <span className="truncate">{product.name}</span>
                            <Plus className="ml-auto h-4 w-4 shrink-0 text-terracotta" />
                          </button>
                        ))}
                      </div>
                      <Link href="/shop" className="mt-3 inline-block text-sm text-terracotta hover:underline">
                        Browse more in shop →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
