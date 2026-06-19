"use client";

import { create } from "zustand";
import type { AuthUser } from "@/types";

interface AuthStore {
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  fetchSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  fetchSession: async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      set({ user: data.user ?? null, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    set({ user: null });
  },
}));

export { getDashboardPath } from "@/lib/dashboard";
