"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SimpleBarChart } from "@/components/dashboard/stat-card";
import { monthlySales, orders } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils";

export default function AdminAnalyticsPage() {
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalProfit = orders.reduce((s, o) => s + o.profit, 0);
  const margin = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0;

  return (
    <DashboardShell allowedRole="admin">
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Analytics</h1>
          <p className="mt-1 text-muted-foreground">Profit trends and sales performance</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-card border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Profit Margin</p>
            <p className="mt-2 font-heading text-3xl font-semibold">{margin}%</p>
          </div>
          <div className="rounded-card border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Avg Order Value</p>
            <p className="mt-2 font-heading text-3xl font-semibold">
              {formatPrice(Math.round(totalRevenue / orders.length))}
            </p>
          </div>
          <div className="rounded-card border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Orders This Month</p>
            <p className="mt-2 font-heading text-3xl font-semibold">
              {monthlySales[monthlySales.length - 1].orders}
            </p>
          </div>
        </div>

        <div className="rounded-card border border-border bg-card p-6 shadow-soft">
          <h2 className="font-heading text-xl font-semibold">Orders per Month</h2>
          <div className="mt-6">
            <SimpleBarChart
              data={monthlySales.map((m) => ({ label: m.month, value: m.orders }))}
            />
          </div>
        </div>

        <div className="rounded-card border border-border bg-card p-6 shadow-soft">
          <h2 className="font-heading text-xl font-semibold">Revenue vs Profit</h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-sm text-muted-foreground">Revenue</p>
              <SimpleBarChart
                data={monthlySales.map((m) => ({ label: m.month, value: m.revenue }))}
                valuePrefix="₹"
              />
            </div>
            <div>
              <p className="mb-4 text-sm text-muted-foreground">Profit</p>
              <SimpleBarChart
                data={monthlySales.map((m) => ({ label: m.month, value: m.profit }))}
                valuePrefix="₹"
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
