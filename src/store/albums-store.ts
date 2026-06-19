import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserAlbum } from "@/types";
import { generateId } from "@/lib/utils";

interface AlbumsStore {
  albums: UserAlbum[];
  createAlbum: (name: string) => UserAlbum;
  deleteAlbum: (albumId: string) => void;
  addToAlbum: (albumId: string, productId: string) => void;
  removeFromAlbum: (albumId: string, productId: string) => void;
  getAlbumsForUser: (userId: string) => UserAlbum[];
}

export const useAlbumsStore = create<AlbumsStore>()(
  persist(
    (set, get) => ({
      albums: [],
      createAlbum: (name) => {
        const album: UserAlbum = {
          id: generateId(),
          name: name.trim(),
          productIds: [],
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ albums: [...state.albums, album] }));
        return album;
      },
      deleteAlbum: (albumId) => {
        set((state) => ({
          albums: state.albums.filter((a) => a.id !== albumId),
        }));
      },
      addToAlbum: (albumId, productId) => {
        set((state) => ({
          albums: state.albums.map((album) =>
            album.id === albumId && !album.productIds.includes(productId)
              ? { ...album, productIds: [...album.productIds, productId] }
              : album
          ),
        }));
      },
      removeFromAlbum: (albumId, productId) => {
        set((state) => ({
          albums: state.albums.map((album) =>
            album.id === albumId
              ? {
                  ...album,
                  productIds: album.productIds.filter((id) => id !== productId),
                }
              : album
          ),
        }));
      },
      getAlbumsForUser: () => get().albums,
    }),
    { name: "artisan-haven-albums" }
  )
);
