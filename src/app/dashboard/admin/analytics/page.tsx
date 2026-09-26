"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SimpleBarChart } from "@/components/dashboard/stat-card";
import { formatPrice } from "@/lib/utils";
import type { MonthlySales, Order } from "@/types";

export default function AdminAnalyticsPage() {
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [monthlySales, setMonthlySales] = useState<MonthlySales[]>([]);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.orders) setOrdersList(data.orders);
          if (data.stats?.monthlySales) setMonthlySales(data.stats.monthlySales);
        }
      })
      .catch((err) => console.error("Error loading analytics:", err));
  }, []);

  const totalRevenue = ordersList.reduce((s, o) => s + (o.paymentStatus === "failed" ? 0 : o.total), 0);
  const totalProfit = ordersList.reduce((s, o) => s + (o.paymentStatus === "failed" ? 0 : o.profit), 0);
  const margin = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0;
  const validOrderCount = ordersList.filter((o) => o.paymentStatus !== "failed").length;
  const avgOrderValue = validOrderCount > 0 ? Math.round(totalRevenue / validOrderCount) : 0;
  const ordersThisMonth = monthlySales.length > 0 ? monthlySales[monthlySales.length - 1].orders : 0;

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
              {formatPrice(avgOrderValue)}
            </p>
          </div>
          <div className="rounded-card border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Orders This Month</p>
            <p className="mt-2 font-heading text-3xl font-semibold">
              {ordersThisMonth}
            </p>
          </div>
        </div>

        <div className="rounded-card border border-border bg-card p-6 shadow-soft">
          <h2 className="font-heading text-xl font-semibold">Orders per Month</h2>
          <div className="mt-6">
            {monthlySales.length > 0 ? (
              <SimpleBarChart
                data={monthlySales.map((m) => ({ label: m.month, value: m.orders }))}
              />
            ) : (
              <p className="text-xs text-muted-foreground py-8 text-center">No orders recorded yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-card border border-border bg-card p-6 shadow-soft">
          <h2 className="font-heading text-xl font-semibold">Revenue vs Profit</h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-sm text-muted-foreground">Revenue</p>
              {monthlySales.length > 0 ? (
                <SimpleBarChart
                  data={monthlySales.map((m) => ({ label: m.month, value: m.revenue }))}
                  valuePrefix="₹"
                />
              ) : (
                <p className="text-xs text-muted-foreground py-8 text-center">No revenue recorded yet.</p>
              )}
            </div>
            <div>
              <p className="mb-4 text-sm text-muted-foreground">Profit</p>
              {monthlySales.length > 0 ? (
                <SimpleBarChart
                  data={monthlySales.map((m) => ({ label: m.month, value: m.profit }))}
                  valuePrefix="₹"
                />
              ) : (
                <p className="text-xs text-muted-foreground py-8 text-center">No profit recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
