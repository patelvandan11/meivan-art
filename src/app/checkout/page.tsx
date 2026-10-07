"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CreditCard,
  ShieldCheck,
  Truck,
  Tag,
  AlertCircle,
  Check,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart-store";
import { applyCoupon, calculateShipping } from "@/actions/checkout";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Shipping Form State
  const [address, setAddress] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  });

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    type: "percent" | "fixed";
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");

  // Shipping Calculation State
  const [shippingFee, setShippingFee] = useState(0);
  const [shippingDays, setShippingDays] = useState("3-5");

  const subtotal = getTotal();

  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon) {
    discountAmount =
      appliedCoupon.type === "percent"
        ? Math.round((subtotal * appliedCoupon.discount) / 100)
        : appliedCoupon.discount;
  }

  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  // Handle Pincode change & calculate shipping
  async function handlePincodeChange(pincode: string) {
    setAddress((prev) => ({ ...prev, pincode }));
    setShippingFee(0);
    if (pincode.length === 6) {
      try {
        const result = await calculateShipping(pincode);
        setShippingFee(0);
        setShippingDays(result.estimatedDays);
      } catch {
        setShippingFee(0);
      }
    }
  }

  // Handle Coupon Application
  async function handleApplyCoupon() {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponMessage("");
    try {
      const res = await applyCoupon(couponCode);
      if (res.success && res.coupon) {
        setAppliedCoupon({
          code: couponCode.toUpperCase(),
          discount: res.coupon.discount,
          type: res.coupon.type,
        });
        setCouponMessage(`Applied ${res.coupon.discount}${res.coupon.type === "percent" ? "%" : "₹"} discount!`);
      } else {
        setCouponMessage(res.message || "Invalid coupon code");
      }
    } catch {
      setCouponMessage("Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  }

  // Handle PayU Gateway Submission
  async function handleCheckout() {
    setErrorMessage("");

    // Validate Required Fields
    if (!address.name.trim()) {
      setErrorMessage("Please enter your full name");
      return;
    }
    if (!address.email.trim() || !address.email.includes("@")) {
      setErrorMessage("Please enter a valid email address for order notifications");
      return;
    }
    if (!address.phone.trim() || address.phone.replace(/[^0-9]/g, "").length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number for delivery tracking");
      return;
    }
    if (!address.street.trim()) {
      setErrorMessage("Please enter your street address / flat details");
      return;
    }
    if (!address.city.trim() || !address.state.trim()) {
      setErrorMessage("Please enter your city and state");
      return;
    }
    if (!address.pincode.trim() || address.pincode.length < 6) {
      setErrorMessage("Please enter a valid 6-digit postal pincode");
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
          artistSlug: i.product.artistSlug,
        })),
        address,
        subtotal,
        shippingFee,
        discount: discountAmount,
        total: finalTotal,
        paymentMethod: "payu",
      };

      // 1. Request PayU hash and transaction initialization from backend
      const res = await fetch("/api/payment/payu/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to initialize PayU payment");
      }

      // 2. Submit hidden HTML form to PayU Payment Gateway
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.paymentUrl;

      Object.keys(data.payuData).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = data.payuData[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      clearCart();
      form.submit();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErrorMessage(msg);
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-heading text-3xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add artworks to your cart to proceed with checkout.</p>
        <Link href="/shop" className="mt-6 inline-block">
          <Button>Explore Artworks</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">Secure Checkout</h1>
        <p className="text-sm text-muted-foreground">
          Enter delivery details and proceed to PayU payment gateway.
        </p>
      </div>

      {errorMessage && (
        <div className="mt-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        {/* Left Column: Shipping & Delivery Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8 lg:col-span-7"
        >
          {/* Shipping Details */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-2 border-b border-border pb-4">
              <Truck className="h-5 w-5 text-terracotta" />
              <h2 className="font-heading text-lg font-semibold">1. Shipping & Delivery Address</h2>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Full Name *
                </label>
                <Input
                  placeholder="e.g. Priya Sharma"
                  value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Email Address * (For order updates & tracking)
                </label>
                <Input
                  placeholder="e.g. priya@example.com"
                  type="email"
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Mobile Number * (For courier delivery SMS/Calls)
                </label>
                <Input
                  placeholder="e.g. 9876543210"
                  type="tel"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Street Address / House No. / Building *
                </label>
                <Input
                  placeholder="e.g. 402, Lotus Residency, Near Art Gallery Road"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  City *
                </label>
                <Input
                  placeholder="e.g. Mumbai"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  State *
                </label>
                <Input
                  placeholder="e.g. Maharashtra"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Pincode * (6-digit postal code)
                </label>
                <Input
                  placeholder="e.g. 400001"
                  maxLength={6}
                  value={address.pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Estimated Delivery Time
                </label>
                <div className="flex h-10 items-center rounded-lg border border-border bg-secondary/50 px-3 text-xs text-muted-foreground">
                  ⚡ {shippingDays} business days via Express Courier
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Delivery Notes / Landmark (Optional)
                </label>
                <Input
                  placeholder="e.g. Handle with care, ring doorbell on arrival"
                  value={address.notes}
                  onChange={(e) => setAddress({ ...address, notes: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Payment Method - PayU Gateway Only */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-2 border-b border-border pb-4">
              <CreditCard className="h-5 w-5 text-terracotta" />
              <h2 className="font-heading text-lg font-semibold">2. Payment Method</h2>
            </div>

            <div className="mt-5 rounded-2xl border border-terracotta/30 bg-terracotta/5 p-5 dark:border-terracotta/40 dark:bg-terracotta/10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta text-white font-bold text-sm shadow-sm">
                    PayU
                  </div>
                  <div>
                    <span className="font-semibold text-foreground text-base">
                      PayU Payment Gateway
                    </span>
                    <p className="text-xs text-muted-foreground">
                      100% secure payment via UPI, Cards, NetBanking & Wallets
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-sage/20 px-3 py-1 text-xs font-semibold text-sage">
                  SSL 256-Bit Encrypted
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-medium">
                <div className="flex items-center gap-2 rounded-xl bg-card border border-border p-2.5 shadow-2xs">
                  <Zap className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Google Pay, PhonePe, Paytm, BHIM UPI</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-card border border-border p-2.5 shadow-2xs">
                  <CreditCard className="h-4 w-4 text-blue-500 shrink-0" />
                  <span>Visa, Mastercard, RuPay, Maestro Cards</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-card border border-border p-2.5 shadow-2xs">
                  <ShieldCheck className="h-4 w-4 text-sage shrink-0" />
                  <span>50+ Banks NetBanking & Wallets</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Order Summary & Pay Button */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6 lg:col-span-5"
        >
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-heading text-lg font-semibold border-b border-border pb-4">
              Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} Items)
            </h2>

            {/* Item List */}
            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 py-1">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity} × {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div className="mt-5 border-t border-border pt-4">
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Tag className="h-3.5 w-3.5 text-terracotta" /> Have a Coupon Code?
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. WELCOME10 or ARTISAN20"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="uppercase text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponCode}
                >
                  {couponLoading ? "..." : "Apply"}
                </Button>
              </div>
              {couponMessage && (
                <p
                  className={`mt-1.5 text-xs ${
                    appliedCoupon ? "text-sage font-medium" : "text-red-500"
                  }`}
                >
                  {couponMessage}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between font-medium text-sage">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>- {formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span className="flex items-center gap-1">
                  Shipping Fee
                  {shippingFee === 0 && (
                    <span className="rounded bg-sage/20 px-1.5 py-0.2 text-[10px] font-semibold text-sage">
                      FREE
                    </span>
                  )}
                </span>
                <span>{shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}</span>
              </div>

              <div className="flex justify-between border-t border-border pt-3 text-base font-bold text-foreground">
                <span>Grand Total</span>
                <span className="text-xl text-terracotta">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Pay with PayU Button */}
            <Button
              className="mt-6 w-full gap-2 py-6 text-base font-semibold shadow-md bg-terracotta hover:bg-terracotta/90 text-white"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <span>Connecting to PayU...</span>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  <span>Pay with PayU • {formatPrice(finalTotal)}</span>
                </>
              )}
            </Button>

            {/* Trust Badges */}
            <div className="mt-4 space-y-2 rounded-xl bg-secondary/50 p-3 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-sage shrink-0" />
                <span>256-Bit SSL Encrypted & Verified PayU Gateway</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-terracotta shrink-0" />
                <span>Instant order notification sent to <strong>vandanartwork@gmail.com</strong> for packing</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
