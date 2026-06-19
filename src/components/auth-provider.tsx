"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchSession = useAuthStore((s) => s.fetchSession);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return <>{children}</>;
}
