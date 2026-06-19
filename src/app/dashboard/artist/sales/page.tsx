"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SimpleBarChart } from "@/components/dashboard/stat-card";
import { useAuthStore } from "@/store/auth-store";
import { getArtistStats } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils";

export default function ArtistSalesPage() {
  const user = useAuthStore((s) => s.user);
  const artistSlug = user?.artistSlug ?? "maya-chen";
  const stats = getArtistStats(artistSlug);

  const salesByProduct = stats.artistOrders.reduce<Record<string, number>>((acc, sale) => {
    acc[sale.productName] = (acc[sale.productName] ?? 0) + sale.revenue;
    return acc;
  }, {});

  const chartData = Object.entries(salesByProduct).map(([label, value]) => ({
    label: label.split(" ").slice(0, 2).join(" "),
    value,
  }));

  return (
    <DashboardShell allowedRole="artist">
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Sales & Earnings</h1>
          <p className="mt-1 text-muted-foreground">Your selling activity and profits</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-card border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="mt-2 font-heading text-2xl font-semibold">
              {formatPrice(stats.totalSales)}
            </p>
          </div>
          <div className="rounded-card border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Your Earnings</p>
            <p className="mt-2 font-heading text-2xl font-semibold text-sage">
              {formatPrice(stats.totalProfit)}
            </p>
          </div>
          <div className="rounded-card border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Units Sold</p>
            <p className="mt-2 font-heading text-2xl font-semibold">{stats.unitsSold}</p>
          </div>
        </div>

        {chartData.length > 0 && (
          <div className="rounded-card border border-border bg-card p-6 shadow-soft">
            <h2 className="font-heading text-xl font-semibold">Revenue by Product</h2>
            <div className="mt-6">
              <SimpleBarChart data={chartData} valuePrefix="₹" />
            </div>
          </div>
        )}

        <div className="rounded-card border border-border bg-card shadow-soft overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Qty</th>
                <th className="p-4 font-medium">Revenue</th>
                <th className="p-4 font-medium">Earnings</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.artistOrders.map((sale, i) => (
                <tr key={`${sale.orderId}-${i}`} className="border-b border-border/50">
                  <td className="p-4">{sale.orderId}</td>
                  <td className="p-4">{sale.productName}</td>
                  <td className="p-4">{sale.quantity}</td>
                  <td className="p-4">{formatPrice(sale.revenue)}</td>
                  <td className="p-4 text-sage">{formatPrice(sale.profit)}</td>
                  <td className="p-4 capitalize">{sale.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
