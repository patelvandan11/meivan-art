"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart-store";
import { createCheckoutSession } from "@/actions/checkout";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, getTotal } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const total = getTotal();

  async function handleCheckout() {
    setLoading(true);
    try {
      const result = await createCheckoutSession(
        items.map((i) => ({
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.images[0],
        }))
      );

      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        alert(result.message || "Checkout is not configured. Add Stripe keys to .env");
      }
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-heading text-3xl font-semibold">Nothing to checkout</h1>
        <Link href="/shop" className="mt-6 inline-block">
          <Button>Go to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-semibold">Checkout</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="font-heading text-xl font-semibold">Shipping Address</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Input
              placeholder="Full Name"
              value={address.name}
              onChange={(e) => setAddress({ ...address, name: e.target.value })}
              className="sm:col-span-2"
            />
            <Input
              placeholder="Email"
              type="email"
              value={address.email}
              onChange={(e) => setAddress({ ...address, email: e.target.value })}
            />
            <Input
              placeholder="Phone"
              value={address.phone}
              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
            />
            <Input
              placeholder="Street Address"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              className="sm:col-span-2"
            />
            <Input
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />
            <Input
              placeholder="State"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
            />
            <Input
              placeholder="Pincode"
              value={address.pincode}
              onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
              className="sm:col-span-2"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-card bg-secondary/40 p-6 h-fit"
        >
          <h2 className="font-heading text-xl font-semibold">Order Summary</h2>
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3">
                <div className="relative h-14 w-14 overflow-hidden rounded-lg">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-medium">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between border-t border-border pt-4 text-lg font-semibold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <Button
            className="mt-6 w-full gap-2"
            onClick={handleCheckout}
            disabled={loading}
          >
            <CreditCard className="h-4 w-4" />
            {loading ? "Processing..." : "Pay with Stripe"}
          </Button>

          <p className="mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            Secure checkout powered by Stripe
          </p>
        </motion.div>
      </div>
    </div>
  );
}
