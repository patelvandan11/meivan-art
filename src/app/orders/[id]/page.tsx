"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Package,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Calendar,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setError(data.error || "Order not found");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-terracotta border-r-transparent"></div>
        <p className="mt-4 text-sm text-muted-foreground">Fetching tracking status...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h1 className="mt-4 font-heading text-2xl font-bold">Order Not Found</h1>
        <p className="mt-2 text-muted-foreground">We couldn&apos;t find any order matching ID &ldquo;{id}&rdquo;.</p>
        <Link href="/shop" className="mt-6 inline-block">
          <Button variant="outline">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const steps = [
    {
      key: "pending",
      label: "Order Placed",
      sub: "Order details received",
      done: true,
    },
    {
      key: "packing",
      label: "Packing & Quality Check",
      sub: "Preparing authentic art package",
      done: ["paid", "packing", "shipped", "out_for_delivery", "delivered"].includes(order.status),
    },
    {
      key: "shipped",
      label: "Handed Over to Courier",
      sub: order.tracking?.courierName ? `Via ${order.tracking.courierName}` : "In transit",
      done: ["shipped", "out_for_delivery", "delivered"].includes(order.status),
    },
    {
      key: "delivered",
      label: "Delivered to Customer",
      sub: "Successfully completed",
      done: order.status === "delivered",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Return to Store
        </Link>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">
              Live Shipment Tracking
            </span>
            <h1 className="mt-1 font-heading text-2xl sm:text-3xl font-bold">
              Order #{order.id}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-sage/15 px-3 py-1 text-xs font-semibold uppercase text-sage">
              Status: {order.status.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Courier Details Card if Shipped */}
        {order.tracking?.trackingNumber && (
          <div className="mt-6 rounded-2xl border border-sage/40 bg-sage/5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-medium text-sage">COURIER DISPATCH DETAILS</span>
                <h3 className="text-lg font-bold text-foreground mt-0.5">
                  {order.tracking.courierName || "Express Courier Partner"}
                </h3>
                <p className="font-mono text-sm font-semibold text-terracotta mt-1">
                  AWB / Tracking No: {order.tracking.trackingNumber}
                </p>
                {order.tracking.estimatedDelivery && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-terracotta" /> Est. Delivery: {order.tracking.estimatedDelivery}
                  </p>
                )}
              </div>

              {order.tracking.trackingUrl && (
                <a
                  href={order.tracking.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="gap-2 bg-sage hover:bg-sage/90">
                    Track on Courier Site <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Tracking Timeline */}
        <div className="mt-8">
          <h2 className="font-heading text-base font-semibold mb-6 flex items-center gap-2">
            <Clock className="h-4 w-4 text-terracotta" /> Shipment Milestones
          </h2>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            {steps.map((step) => (
              <div key={step.key} className="relative flex items-start gap-4">
                <div
                  className={`absolute -left-6 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    step.done
                      ? "border-sage bg-sage text-white"
                      : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {step.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${step.done ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address & Item Summary */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 border-t border-border pt-6">
          <div className="rounded-2xl bg-secondary/40 p-4">
            <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
              <MapPin className="h-3.5 w-3.5 text-terracotta" /> Shipping Address
            </h3>
            {order.shippingAddress ? (
              <div className="text-xs text-muted-foreground space-y-0.5">
                <p className="font-semibold text-foreground">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                <p>Phone: {order.shippingAddress.phone}</p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">{order.customerName}</p>
            )}
          </div>

          <div className="rounded-2xl bg-secondary/40 p-4">
            <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
              <Package className="h-3.5 w-3.5 text-terracotta" /> Items in this Package
            </h3>
            <div className="space-y-1 text-xs">
              {order.items.map((i) => (
                <div key={i.productId} className="flex justify-between text-muted-foreground">
                  <span>{i.quantity}x {i.productName}</span>
                  <span className="font-medium text-foreground">{formatPrice(i.price * i.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-1.5 flex justify-between font-bold text-foreground">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
