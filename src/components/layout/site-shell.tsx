"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloatingButton } from "@/components/layout/whatsapp-button";

const BARE_ROUTES = ["/login", "/signup", "/dashboard"];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBare =
    BARE_ROUTES.some((route) => pathname === route) ||
    pathname.startsWith("/dashboard/");

  if (isBare) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppFloatingButton />
    </>
  );
}
