"use server";

import Stripe from "stripe";
import { getAppUrl } from "@/lib/env";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function createCheckoutSession(
  items: { name: string; price: number; quantity: number; image: string }[]
) {
  if (!stripe) {
    return { success: false, message: "Stripe is not configured" };
  }

  const appUrl = getAppUrl();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: `${appUrl}/checkout/success`,
    cancel_url: `${appUrl}/cart`,
  });

  return { success: true, url: session.url };
}

export async function applyCoupon(code: string) {
  const coupons: Record<string, { discount: number; type: "percent" | "fixed" }> = {
    WELCOME10: { discount: 10, type: "percent" },
    ARTISAN20: { discount: 20, type: "percent" },
    FLAT500: { discount: 500, type: "fixed" },
  };

  const coupon = coupons[code.toUpperCase()];
  if (!coupon) {
    return { success: false, message: "Invalid coupon code" };
  }

  return { success: true, coupon };
}

export async function calculateShipping(pincode: string) {
  const baseRate = 99;
  const freeShippingThreshold = 2000;

  // Simplified shipping calculator
  const isMetro = ["110", "400", "560", "600", "700"].some((p) =>
    pincode.startsWith(p)
  );

  return {
    rate: isMetro ? baseRate : baseRate + 50,
    estimatedDays: isMetro ? "3-5" : "5-8",
    freeShippingThreshold,
  };
}
