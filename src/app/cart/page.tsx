"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart-store";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { applyCoupon, calculateShipping } from "@/actions/checkout";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

export default function CartPage() {
  const hydrated = useStoreHydrated();
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [pincode, setPincode] = useState("");
  const [shipping, setShipping] = useState(0);

  const subtotal = getTotal();
  const total = subtotal - discount + shipping;

  async function handleApplyCoupon() {
    const result = await applyCoupon(couponCode);
    if (result.success && result.coupon) {
      if (result.coupon.type === "percent") {
        setDiscount(subtotal * (result.coupon.discount / 100));
      } else {
        setDiscount(result.coupon.discount);
      }
      setCouponMessage("Coupon applied!");
    } else {
      setCouponMessage("Invalid coupon code");
      setDiscount(0);
    }
  }

  async function handleCalculateShipping() {
    if (pincode.length >= 6) {
      const result = await calculateShipping(pincode);
      setShipping(subtotal >= result.freeShippingThreshold ? 0 : result.rate);
    }
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-muted-foreground">Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/30" />
        <h1 className="mt-6 font-heading text-3xl font-semibold">Your cart is empty</h1>
        <p className="mt-3 text-muted-foreground">
          Discover beautiful handcrafted products in our shop.
        </p>
        <Link href="/shop" className="mt-8 inline-block">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-semibold">Shopping Cart</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 rounded-card bg-card p-4 shadow-soft"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="font-medium hover:text-terracotta"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-muted-foreground hover:text-terracotta"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center rounded-full border border-border w-fit">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="px-2 py-1"
                    aria-label="Decrease"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="px-2 py-1"
                    aria-label="Increase"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="rounded-card bg-secondary/40 p-6 h-fit">
          <h2 className="font-heading text-xl font-semibold">Order Summary</h2>

          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <Button variant="outline" size="icon" onClick={handleApplyCoupon} aria-label="Apply coupon">
              <Tag className="h-4 w-4" />
            </Button>
          </div>
          {couponMessage && (
            <p className="mt-1 text-xs text-muted-foreground">{couponMessage}</p>
          )}

          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              maxLength={6}
            />
            <Button variant="outline" onClick={handleCalculateShipping}>
              Ship
            </Button>
          </div>

          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sage">
                <span>Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 && pincode ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <Link href="/checkout" className="mt-6 block">
            <Button className="w-full">Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
