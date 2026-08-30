"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Truck, ExternalLink, Clock } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import type { Order } from "@/types";

export default function UserOrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.orders) {
          // Filter to user's email if available, or show all recent
          if (user?.email) {
            const userOrders = data.orders.filter(
              (o: Order) =>
                o.customerEmail.toLowerCase() === user.email.toLowerCase() ||
                o.shippingAddress?.email.toLowerCase() === user.email.toLowerCase()
            );
            setOrders(userOrders.length > 0 ? userOrders : data.orders.slice(0, 5));
          } else {
            setOrders(data.orders);
          }
        }
      })
      .catch((err) => console.error("Error loading user orders:", err))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <DashboardShell allowedRole="user">
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-semibold">My Orders & Tracking</h1>
          <p className="mt-1 text-muted-foreground">
            Track your shipments, view packing status, and courier AWB details.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <p className="text-sm text-muted-foreground">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h2 className="mt-4 font-heading text-lg font-semibold">No orders yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              When you purchase artwork, you can track delivery updates here.
            </p>
            <Link href="/shop" className="mt-6 inline-block">
              <Button>Browse Artwork</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <span className="font-mono text-sm font-bold text-terracotta">{order.id}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-sage/20 px-3 py-1 text-xs font-semibold uppercase text-sage">
                      {order.status.replace("_", " ")}
                    </span>
                    <span className="font-semibold text-foreground">{formatPrice(order.total)}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="mt-4 divide-y divide-border/50">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex justify-between py-2 text-sm">
                      <span>
                        <strong className="text-foreground">{item.quantity}x</strong> {item.productName}
                      </span>
                      <span className="font-medium text-foreground">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Courier info or tracking button */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <div>
                    {order.tracking?.trackingNumber ? (
                      <div className="text-xs">
                        <span className="font-semibold text-foreground">Courier: {order.tracking.courierName}</span>
                        <span className="text-muted-foreground ml-2">AWB: {order.tracking.trackingNumber}</span>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                        Packaging & preparation in progress
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/orders/${order.id}`}>
                      <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                        <Truck className="h-3.5 w-3.5" />
                        Track Package
                      </Button>
                    </Link>

                    {order.tracking?.trackingUrl && (
                      <a href={order.tracking.trackingUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="gap-1.5 text-xs bg-sage hover:bg-sage/90">
                          Courier Site <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
