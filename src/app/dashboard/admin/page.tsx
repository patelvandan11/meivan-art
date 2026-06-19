"use client";

import Link from "next/link";
import { Package, IndianRupee, TrendingUp, Clock } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard, StatCardMoney, SimpleBarChart } from "@/components/dashboard/stat-card";
import { getAdminStats, orders, monthlySales } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboardPage() {
  const stats = getAdminStats();

  return (
    <DashboardShell allowedRole="admin">
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Admin Overview</h1>
          <p className="mt-1 text-muted-foreground">
            Buying, selling activity, profits, and order summary
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Orders" value={String(stats.totalOrders)} icon={Package} sub="All time orders" />
          <StatCardMoney label="Total Revenue" amount={stats.totalRevenue} icon={IndianRupee} sub="Gross sales" />
          <StatCardMoney label="Total Profit" amount={stats.totalProfit} icon={TrendingUp} sub="After costs" />
          <StatCard label="Pending Orders" value={String(stats.pendingOrders)} icon={Clock} sub="Awaiting fulfillment" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-card border border-border bg-card p-6 shadow-soft">
            <h2 className="font-heading text-xl font-semibold">Monthly Revenue</h2>
            <p className="mt-1 text-sm text-muted-foreground">Last 6 months</p>
            <div className="mt-6">
              <SimpleBarChart
                data={monthlySales.map((m) => ({ label: m.month, value: m.revenue }))}
                valuePrefix="₹"
              />
            </div>
          </div>

          <div className="rounded-card border border-border bg-card p-6 shadow-soft">
            <h2 className="font-heading text-xl font-semibold">Monthly Profit</h2>
            <p className="mt-1 text-sm text-muted-foreground">Last 6 months</p>
            <div className="mt-6">
              <SimpleBarChart
                data={monthlySales.map((m) => ({ label: m.month, value: m.profit }))}
                valuePrefix="₹"
              />
            </div>
          </div>
        </div>

        <div className="rounded-card border border-border bg-card shadow-soft">
          <div className="flex items-center justify-between border-b border-border p-6">
            <h2 className="font-heading text-xl font-semibold">Recent Orders</h2>
            <Link href="/dashboard/admin/orders" className="text-sm text-terracotta hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-4 font-medium">Order</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Profit</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b border-border/50">
                    <td className="p-4 font-medium">{order.id}</td>
                    <td className="p-4">{order.customerName}</td>
                    <td className="p-4">{formatPrice(order.total)}</td>
                    <td className="p-4 text-sage">{formatPrice(order.profit)}</td>
                    <td className="p-4 capitalize">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
