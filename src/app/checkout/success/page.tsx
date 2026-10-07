"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Package,
  Truck,
  Check,
  ExternalLink,
  ArrowRight,
  Mail,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";
import { DigitalDownloadButton } from "@/components/digital/DigitalDownloadButton";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const statusParam = searchParams.get("status") || "success";
  const errorMessage = searchParams.get("error");
  const [order, setOrder] = useState<Order | null>(null);

  const isSuccess = statusParam === "success";

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.order) {
            setOrder(data.order);
          }
        })
        .catch((err) => console.error("Error loading order:", err));
    }
  }, [orderId]);

  if (!isSuccess) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50">
          <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="mt-6 font-heading text-3xl font-bold">Payment Unsuccessful</h1>
        <p className="mt-3 text-muted-foreground">
          {errorMessage || "We could not complete your transaction with the payment gateway. Please try again."}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/checkout">
            <Button>Return to Checkout</Button>
          </Link>
          <Link href="/cart">
            <Button variant="outline">View Cart</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Steps definition for tracker
  const steps = [
    { label: "Order Placed", active: true, icon: CheckCircle2 },
    {
      label: "Packing & Preparing",
      active: order ? ["paid", "packing", "shipped", "out_for_delivery", "delivered"].includes(order.status) : true,
      icon: Package,
    },
    {
      label: "Dispatched & In Transit",
      active: order ? ["shipped", "out_for_delivery", "delivered"].includes(order.status) : false,
      icon: Truck,
    },
    {
      label: "Delivered",
      active: order?.status === "delivered",
      icon: Check,
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Top Banner */}
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-soft">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage/20 text-sage">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <h1 className="mt-5 font-heading text-3xl font-bold">Thank You! Order Confirmed</h1>
        <p className="mt-2 text-muted-foreground">
          Your order has been received and sent to our fulfillment team for packing.
        </p>

        {orderId && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-1.5 text-sm font-medium">
            <span>Order Reference:</span>
            <span className="font-mono font-bold text-terracotta">{orderId}</span>
          </div>
        )}

        {/* Email Notification Alert Banner */}
        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-terracotta/10 p-3 text-xs font-medium text-terracotta">
          <Mail className="h-4 w-4" />
          <span>
            Notification sent to <strong>vandanartwork@gmail.com</strong> for packing & dispatch
          </span>
        </div>
      </div>

      {/* Progress Tracker Stepper */}
      <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-heading text-lg font-semibold mb-6 flex items-center gap-2">
          <Clock className="h-5 w-5 text-terracotta" /> Live Fulfillment Tracker
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.label}
                className={`flex flex-col items-center text-center p-3 rounded-2xl transition-all ${
                  step.active
                    ? "bg-sage/10 text-sage border border-sage/30 font-semibold"
                    : "bg-secondary/40 text-muted-foreground opacity-60"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full mb-2 ${
                    step.active ? "bg-sage text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs">{step.label}</span>
              </div>
            );
          })}
        </div>

        {/* Tracking Details if Shipped */}
        {order?.tracking?.trackingNumber && (
          <div className="mt-6 rounded-2xl border border-sage/30 bg-sage/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Courier Partner</p>
                <p className="text-sm font-semibold">{order.tracking.courierName || "Express Courier"}</p>
                <p className="text-xs font-mono text-terracotta font-medium mt-0.5">
                  AWB: {order.tracking.trackingNumber}
                </p>
              </div>

              {order.tracking.trackingUrl && (
                <a
                  href={order.tracking.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" className="gap-1.5 bg-sage hover:bg-sage/90">
                    Track on Courier Site <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Digital Downloads Section */}
      {order && (
        <div className="mt-8 space-y-4">
          {order.items.map((item) => (
            <DigitalDownloadButton
              key={item.productId}
              orderId={order.id}
              productId={item.productId}
              productName={item.productName}
              storagePath={item.storagePath || item.storage_path}
              isPaid={order.paymentStatus === "paid" || order.status === "paid" || order.status === "delivered" || order.status === "shipped" || order.status === "packing"}
            />
          ))}
        </div>
      )}

      {/* Order Itemized Summary */}
      {order && (
        <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-heading text-lg font-semibold border-b border-border pb-4">
            Order Items & Delivery Address
          </h2>

          <div className="mt-4 divide-y divide-border">
            {order.items.map((item) => (
              <div key={item.productId} className="flex justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
                <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-border pt-4 text-sm space-y-1.5">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal || order.total)}</span>
            </div>
            {order.shippingFee !== undefined && (
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base text-foreground pt-2 border-t border-border">
              <span>Total Paid</span>
              <span className="text-terracotta">{formatPrice(order.total)}</span>
            </div>
          </div>

          {order.shippingAddress && (
            <div className="mt-6 rounded-xl bg-secondary/40 p-4 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">Delivering to:</p>
              <p>{order.shippingAddress.name} ({order.shippingAddress.phone})</p>
              <p>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/shop">
          <Button className="gap-2">
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        {orderId && (
          <Link href={`/orders/${orderId}`}>
            <Button variant="outline">View Dedicated Tracking Page</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
