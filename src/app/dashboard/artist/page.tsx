"use client";

import Link from "next/link";
import { Palette, Package, IndianRupee } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard, StatCardMoney } from "@/components/dashboard/stat-card";
import { useAuthStore } from "@/store/auth-store";
import { getArtistStats } from "@/lib/data/orders";
import { getProductsByArtist } from "@/lib/data/products";

export default function ArtistDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const artistSlug = user?.artistSlug ?? "maya-chen";
  const stats = getArtistStats(artistSlug);
  const products = getProductsByArtist(artistSlug);

  return (
    <DashboardShell allowedRole="artist">
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Artist Studio</h1>
          <p className="mt-1 text-muted-foreground">
            Track your products and sales performance
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="My Products" value={String(products.length)} icon={Palette} />
          <StatCard label="Units Sold" value={String(stats.unitsSold)} icon={Package} />
          <StatCardMoney label="Total Earnings" amount={stats.totalProfit} icon={IndianRupee} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard/artist/products"
            className="rounded-card border border-border bg-card p-6 shadow-soft transition-all hover:border-terracotta"
          >
            <Palette className="h-8 w-8 text-terracotta" />
            <h2 className="mt-4 font-heading text-xl font-semibold">My Products</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              View all your listed paintings, prints, and crafts.
            </p>
          </Link>
          <Link
            href="/dashboard/artist/sales"
            className="rounded-card border border-border bg-card p-6 shadow-soft transition-all hover:border-terracotta"
          >
            <Package className="h-8 w-8 text-terracotta" />
            <h2 className="mt-4 font-heading text-xl font-semibold">Sales History</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              See who bought your work and your earnings.
            </p>
          </Link>
        </div>

        {stats.artistOrders.length > 0 && (
          <div className="rounded-card border border-border bg-card shadow-soft">
            <div className="border-b border-border p-6">
              <h2 className="font-heading text-xl font-semibold">Recent Sales</h2>
            </div>
            <div className="divide-y divide-border">
              {stats.artistOrders.slice(0, 5).map((sale, i) => (
                <div key={`${sale.orderId}-${i}`} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{sale.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {sale.quantity}x · {sale.status}
                    </p>
                  </div>
                  <p className="font-medium text-sage">+₹{sale.profit.toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
