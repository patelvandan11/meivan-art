"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, getDashboardPath } from "@/store/auth-store";

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else {
      router.replace(getDashboardPath(user.role));
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  );
}
