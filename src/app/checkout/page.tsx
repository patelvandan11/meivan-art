"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MessageCircle,
  ShieldCheck,
  Truck,
  Tag,
  AlertCircle,
  Check,
  Zap,
  Phone,
  Mail,
  User,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart-store";
import { applyCoupon, calculateShipping } from "@/actions/checkout";
import { formatPrice } from "@/lib/utils";
import { getWhatsAppUrl, buildFullOrderWhatsAppMessage } from "@/lib/whatsapp";

export default function CheckoutPage() {
  const router = useRouter();
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
        setCouponMessage(
          `Applied ${res.coupon.discount}${res.coupon.type === "percent" ? "%" : "₹"} discount!`
        );
      } else {
        setCouponMessage(res.message || "Invalid coupon code");
      }
    } catch {
      setCouponMessage("Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  }

  // Handle WhatsApp Checkout Submission
  async function handleCheckout() {
    setErrorMessage("");

    // Validate Required Fields
    if (!address.name.trim()) {
      setErrorMessage("Please enter your full name");
      return;
    }
    const cleanPhone = address.phone.replace(/[^0-9]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number for order delivery");
      return;
    }
    if (!address.email.trim() || !address.email.includes("@")) {
      setErrorMessage("Please enter a valid email address for invoice & order receipt");
      return;
    }
    if (!address.street.trim()) {
      setErrorMessage("Please enter your street address / flat & building name");
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
        paymentMethod: "whatsapp" as const,
      };

      // 1. Record the order in database & trigger email notifications
      let orderId = `VAN-${Date.now().toString().slice(-6)}`;
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        });
        const data = await res.json();
        if (data.success && data.orderId) {
          orderId = data.orderId;
        }
      } catch (saveErr) {
        console.warn("Order saved locally, proceeding to WhatsApp message:", saveErr);
      }

      // 2. Build formatted WhatsApp message with complete order information
      const whatsappMessage = buildFullOrderWhatsAppMessage({
        orderId,
        customer: address,
        items: items.map((i) => ({
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
        })),
        subtotal,
        discount: discountAmount,
        couponCode: appliedCoupon?.code,
        shippingFee,
        total: finalTotal,
      });

      // 3. Clear cart
      clearCart();

      // 4. Open WhatsApp directly to artist mobile: +91 96647 92015
      const whatsappUrl = getWhatsAppUrl(whatsappMessage);
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      // 5. Navigate to order confirmation page
      router.push(`/checkout/success?orderId=${orderId}&status=success`);
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
        <p className="mt-2 text-muted-foreground">Add artworks to your cart to proceed with order booking.</p>
        <Link href="/shop" className="mt-6 inline-block">
          <Button className="bg-[#00509d] hover:bg-[#003870] text-white">Explore Artworks</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-1.5 border-b border-[#cae0eb] pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00509d] bg-sky-50 px-3 py-1 rounded-full w-fit">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Direct Artist Order Booking</span>
        </div>
        <h1 className="font-heading text-3xl font-bold sm:text-4xl text-gray-900">
          Complete Your Art Order
        </h1>
        <p className="text-sm text-gray-600">
          Enter your delivery details below. All order and address information will be sent directly to the artist on WhatsApp (<strong>+91 96647 92015</strong>) for payment confirmation & packing.
        </p>
      </div>

      {errorMessage && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        {/* Left Column: Delivery Details Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6 lg:col-span-7"
        >
          {/* Shipping Address Form */}
          <div className="rounded-2xl border border-[#cae0eb] bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
              <Truck className="h-5 w-5 text-[#00509d]" />
              <h2 className="font-heading text-lg font-bold text-gray-900">
                1. Delivery & Contact Details
              </h2>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <User className="h-3.5 w-3.5 text-gray-500" />
                  <span>Full Name *</span>
                </label>
                <Input
                  placeholder="e.g. Priyanshu Sharma"
                  value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  className="bg-gray-50/50"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <Phone className="h-3.5 w-3.5 text-[#25D366]" />
                  <span>Mobile / WhatsApp Number *</span>
                </label>
                <Input
                  placeholder="e.g. 9876543210"
                  type="tel"
                  maxLength={10}
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="bg-gray-50/50"
                  required
                />
                <p className="mt-1 text-[11px] text-gray-500">
                  Used for WhatsApp order confirmation and courier tracking.
                </p>
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <Mail className="h-3.5 w-3.5 text-gray-500" />
                  <span>Email Address *</span>
                </label>
                <Input
                  placeholder="e.g. priyanshu@example.com"
                  type="email"
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  className="bg-gray-50/50"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <MapPin className="h-3.5 w-3.5 text-gray-500" />
                  <span>Flat / House No., Apartment & Street *</span>
                </label>
                <Input
                  placeholder="e.g. Flat 302, Palm Grove Apartments, Linking Road"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="bg-gray-50/50"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                  City *
                </label>
                <Input
                  placeholder="e.g. Mumbai"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="bg-gray-50/50"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                  State *
                </label>
                <Input
                  placeholder="e.g. Maharashtra"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="bg-gray-50/50"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Pincode * (6-digit postal code)
                </label>
                <Input
                  placeholder="e.g. 400050"
                  maxLength={6}
                  value={address.pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  className="bg-gray-50/50"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Estimated Transit Time
                </label>
                <div className="flex h-10 items-center rounded-lg border border-gray-200 bg-sky-50/60 px-3 text-xs font-medium text-[#00509d]">
                  ⚡ {shippingDays} business days via Insured Express Courier
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Landmark or Delivery Instructions (Optional)
                </label>
                <Input
                  placeholder="e.g. Near HDFC Bank, please call before delivery"
                  value={address.notes}
                  onChange={(e) => setAddress({ ...address, notes: e.target.value })}
                  className="bg-gray-50/50"
                />
              </div>
            </div>
          </div>

          {/* Payment & WhatsApp Booking Info */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-emerald-200/60 pb-4">
              <MessageCircle className="h-5 w-5 text-[#25D366]" />
              <h2 className="font-heading text-lg font-bold text-gray-900">
                2. WhatsApp Order Confirmation & Payment
              </h2>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                When you click the button below, all your <strong>selected artworks</strong> and <strong>complete delivery address</strong> will be automatically formatted and sent to artist Vandan on WhatsApp (<strong>+91 96647 92015</strong>).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs font-medium">
                <div className="flex items-center gap-2 rounded-xl bg-white border border-emerald-200/80 p-3 shadow-2xs">
                  <Zap className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Google Pay, PhonePe, Paytm, BHIM UPI</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white border border-emerald-200/80 p-3 shadow-2xs">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Direct Bank NEFT / IMPS Transfer</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white border border-emerald-200/80 p-3 shadow-2xs">
                  <Check className="h-4 w-4 text-[#00509d] shrink-0" />
                  <span>Pre-dispatch photos & videos of your art</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Order Summary & WhatsApp Button */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6 lg:col-span-5"
        >
          <div className="sticky top-20 rounded-2xl border border-[#cae0eb] bg-white p-6 shadow-xs">
            <h2 className="font-heading text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
              Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} Items)
            </h2>

            {/* Item List */}
            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1 divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 pt-3 first:pt-0">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-200">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity} × {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div className="mt-5 border-t border-gray-100 pt-4">
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                <Tag className="h-3.5 w-3.5 text-[#00509d]" /> Have a Coupon Code?
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
                  className="border-gray-300 font-semibold text-xs"
                >
                  {couponLoading ? "..." : "Apply"}
                </Button>
              </div>
              {couponMessage && (
                <p
                  className={`mt-1.5 text-xs font-semibold ${
                    appliedCoupon ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {couponMessage}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between font-semibold text-emerald-600">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>- {formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-1">
                  Insured Shipping
                  <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
                    FREE
                  </span>
                </span>
                <span className="font-semibold text-emerald-700">
                  {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-900">
                <span>Total Amount Payable</span>
                <span className="text-xl text-[#00509d]">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Primary Action Button: Send Order via WhatsApp */}
            <Button
              className="mt-6 w-full gap-2.5 py-6 text-base font-bold shadow-md bg-[#25D366] hover:bg-[#20ba59] text-white transition-all hover:scale-[1.02]"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <span>Preparing Order Message...</span>
              ) : (
                <>
                  <MessageCircle className="h-5 w-5 fill-current" />
                  <span>Send Order via WhatsApp • {formatPrice(finalTotal)}</span>
                </>
              )}
            </Button>

            {/* Trust Assurances */}
            <div className="mt-4 space-y-2 rounded-xl bg-gray-50 border border-gray-200/70 p-3.5 text-[11.5px] text-gray-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Direct WhatsApp booking to artist mobile: <strong>+91 96647 92015</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#00509d] shrink-0" />
                <span>100% Free insured transit with reinforced protective art packaging</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Signed Certificate of Authenticity included with all original artwork</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
