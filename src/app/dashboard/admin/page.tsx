"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, IndianRupee, TrendingUp, Clock } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard, StatCardMoney, SimpleBarChart } from "@/components/dashboard/stat-card";
import { formatPrice } from "@/lib/utils";
import type { MonthlySales, Order } from "@/types";

export default function AdminDashboardPage() {
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProfit: 0,
    pendingOrders: 0,
  });
  const [monthlySalesList, setMonthlySalesList] = useState<MonthlySales[]>([]);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.orders) setOrdersList(data.orders);
          if (data.stats) {
            setStats({
              totalOrders: data.stats.totalOrders || 0,
              totalRevenue: data.stats.totalRevenue || 0,
              totalProfit: data.stats.totalProfit || 0,
              pendingOrders: (data.stats.pendingOrders || 0) + (data.stats.packingOrders || 0),
            });
            if (data.stats.monthlySales) {
              setMonthlySalesList(data.stats.monthlySales);
            }
          }
        }
      })
      .catch((err) => console.error("Error loading admin stats:", err));
  }, []);

  return (
    <DashboardShell allowedRole="admin">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold">Admin Overview</h1>
            <p className="mt-1 text-muted-foreground">
              Store management, product additions, profit analytics, and order fulfillment summary.
            </p>
          </div>
          <Link
            href="/dashboard/admin/products"
            className="inline-flex items-center gap-2 rounded-lg bg-terracotta px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto"
          >
            ➕ Add New Product
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Orders" value={String(stats.totalOrders)} icon={Package} sub="All time orders" />
          <StatCardMoney label="Total Revenue" amount={stats.totalRevenue} icon={IndianRupee} sub="Gross sales" />
          <StatCardMoney label="Total Profit" amount={stats.totalProfit} icon={TrendingUp} sub="After costs" />
          <StatCard label="Orders to Pack" value={String(stats.pendingOrders)} icon={Clock} sub="Awaiting packing/shipping" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-card border border-border bg-card p-6 shadow-soft">
            <h2 className="font-heading text-xl font-semibold">Monthly Revenue</h2>
            <p className="mt-1 text-sm text-muted-foreground">Recent months</p>
            <div className="mt-6">
              {monthlySalesList.length > 0 ? (
                <SimpleBarChart
                  data={monthlySalesList.map((m) => ({ label: m.month, value: m.revenue }))}
                  valuePrefix="₹"
                />
              ) : (
                <p className="text-xs text-muted-foreground py-8 text-center">No monthly sales recorded yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-card border border-border bg-card p-6 shadow-soft">
            <h2 className="font-heading text-xl font-semibold">Monthly Profit</h2>
            <p className="mt-1 text-sm text-muted-foreground">Recent months</p>
            <div className="mt-6">
              {monthlySalesList.length > 0 ? (
                <SimpleBarChart
                  data={monthlySalesList.map((m) => ({ label: m.month, value: m.profit }))}
                  valuePrefix="₹"
                />
              ) : (
                <p className="text-xs text-muted-foreground py-8 text-center">No monthly profit recorded yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-card border border-border bg-card shadow-soft">
          <div className="flex items-center justify-between border-b border-border p-6">
            <div>
              <h2 className="font-heading text-xl font-semibold">Recent Orders & Shipping</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Packing and courier tracking</p>
            </div>
            <Link href="/dashboard/admin/orders" className="text-sm text-terracotta hover:underline font-medium">
              Open Full Tracking Hub →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-4 font-medium">Order ID</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Payment</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Courier</th>
                </tr>
              </thead>
              <tbody>
                {ordersList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No orders placed yet.
                    </td>
                  </tr>
                ) : (
                  ordersList.slice(0, 6).map((order) => (
                    <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/20">
                      <td className="p-4 font-medium font-mono text-terracotta">{order.id}</td>
                      <td className="p-4">
                        <p className="font-medium text-foreground">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                      </td>
                      <td className="p-4 font-semibold">{formatPrice(order.total)}</td>
                      <td className="p-4">
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold uppercase">
                          {order.paymentMethod || "PayU"}
                        </span>
                      </td>
                      <td className="p-4 capitalize">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs ${
                            order.status === "delivered"
                              ? "bg-sage/20 text-sage font-medium"
                              : order.status === "shipped"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 font-medium"
                          }`}
                        >
                          {order.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-4 text-xs">
                        {order.tracking?.courierName ? (
                          <span>{order.tracking.courierName} ({order.tracking.trackingNumber})</span>
                        ) : (
                          <span className="text-muted-foreground">Pending Dispatch</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
