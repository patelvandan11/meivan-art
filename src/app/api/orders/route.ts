import { NextResponse } from "next/server";
import { createOrder, generateOrderId, getAllOrders } from "@/lib/orders";
import { syncOrderToGoogleSheet } from "@/lib/google-sheets";
import { sendAdminOrderNotification, sendCustomerOrderConfirmation } from "@/lib/email";
import type { ShippingAddress, OrderItem } from "@/types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    const orders = await getAllOrders({ status, search });
    return NextResponse.json({ success: true, orders });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Failed to fetch orders";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      items,
      address,
      subtotal,
      shippingFee,
      discount,
      total,
      paymentMethod = "test",
    } = body as {
      items: OrderItem[];
      address: ShippingAddress;
      subtotal: number;
      shippingFee: number;
      discount: number;
      total: number;
      paymentMethod?: "payu" | "stripe" | "cod" | "test";
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!address || !address.name || !address.email || !address.phone) {
      return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 });
    }

    const orderId = generateOrderId();
    const isInstantPaid = paymentMethod === "test" || paymentMethod === "stripe";

    // 1. Create order
    const order = await createOrder({
      id: orderId,
      customerName: address.name,
      customerEmail: address.email,
      customerPhone: address.phone,
      shippingAddress: address,
      items,
      subtotal,
      shippingFee,
      discount,
      total,
      paymentMethod,
      paymentStatus: isInstantPaid ? "paid" : "pending",
      status: isInstantPaid ? "paid" : "pending",
      paymentId: isInstantPaid ? `TEST_PAY_${Date.now()}` : undefined,
    });

    // 2. Sync to Google Sheets
    try {
      await syncOrderToGoogleSheet(order);
    } catch (sheetErr) {
      console.error("[Google Sheet Sync Error]:", sheetErr);
    }

    // 3. Send Packing & Shipping Alert to vandanartwork@gmail.com
    try {
      await sendAdminOrderNotification(order);
    } catch (mailErr) {
      console.error("[Admin Order Mail Error]:", mailErr);
    }

    // 4. Send Confirmation to Customer
    try {
      await sendCustomerOrderConfirmation(order);
    } catch (custErr) {
      console.error("[Customer Order Mail Error]:", custErr);
    }

    return NextResponse.json({ success: true, orderId, order });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
