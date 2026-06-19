"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { orders } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils";

export default function AdminOrdersPage() {
  return (
    <DashboardShell allowedRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-semibold">All Orders</h1>
          <p className="mt-1 text-muted-foreground">Complete buying & selling activity</p>
        </div>

        <div className="rounded-card border border-border bg-card shadow-soft overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Revenue</th>
                <th className="p-4 font-medium">Cost</th>
                <th className="p-4 font-medium">Profit</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border/50">
                  <td className="p-4 font-medium">{order.id}</td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="p-4">
                    <p>{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                  </td>
                  <td className="p-4">
                    {order.items.map((i) => (
                      <p key={i.productId} className="text-xs">
                        {i.quantity}x {i.productName}
                      </p>
                    ))}
                  </td>
                  <td className="p-4">{formatPrice(order.total)}</td>
                  <td className="p-4 text-muted-foreground">{formatPrice(order.cost)}</td>
                  <td className="p-4 font-medium text-sage">{formatPrice(order.profit)}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs capitalize">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
