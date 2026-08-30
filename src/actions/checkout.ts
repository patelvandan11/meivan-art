"use server";

import { generatePayUHash } from "@/lib/payu";
import { generateOrderId } from "@/lib/orders";
import type { ShippingAddress, OrderItem } from "@/types";

export async function createPayUSession(params: {
  items: OrderItem[];
  address: ShippingAddress;
  total: number;
}) {
  const orderId = generateOrderId();
  const cleanFirstName = params.address.name.split(" ")[0].replace(/[^a-zA-Z0-9]/g, "") || "Customer";
  const productInfo = params.items
    .map((i) => i.productName)
    .join(", ")
    .slice(0, 100)
    .replace(/[^a-zA-Z0-9 ,]/g, "") || "Art Products";

  const payu = generatePayUHash({
    txnid: orderId,
    amount: params.total,
    productinfo: productInfo,
    firstname: cleanFirstName,
    email: params.address.email.trim(),
    phone: params.address.phone.replace(/[^0-9]/g, "").slice(-10),
    udf1: orderId,
    udf2: params.address.city || "",
    udf3: params.address.pincode || "",
  });

  return {
    success: true,
    orderId,
    paymentUrl: payu.paymentUrl,
    payuData: payu.payuData,
    hash: payu.hash,
  };
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
