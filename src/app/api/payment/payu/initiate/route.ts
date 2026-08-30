import { NextResponse } from "next/server";
import { generatePayUHash } from "@/lib/payu";
import { createOrder, generateOrderId } from "@/lib/orders";
import type { ShippingAddress, OrderItem } from "@/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, address, subtotal, shippingFee, discount, total, paymentMethod } = body as {
      items: OrderItem[];
      address: ShippingAddress;
      subtotal: number;
      shippingFee: number;
      discount: number;
      total: number;
      paymentMethod?: "payu" | "stripe" | "test";
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!address || !address.name || !address.email || !address.phone || !address.street || !address.pincode) {
      return NextResponse.json(
        { error: "Please fill in all required shipping address fields (Name, Email, Phone, Street, Pincode)" },
        { status: 400 }
      );
    }

    const orderId = generateOrderId();
    const cleanFirstName = address.name.split(" ")[0].replace(/[^a-zA-Z0-9]/g, "") || "Customer";
    const productInfo = items
      .map((i) => i.productName)
      .join(", ")
      .slice(0, 100)
      .replace(/[^a-zA-Z0-9 ,]/g, "") || "Art Products";

    // 1. Create order record in Database
    await createOrder({
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
      paymentMethod: paymentMethod || "payu",
      paymentStatus: "pending",
      status: "pending",
    });

    // 2. Generate PayU Hash & Parameters
    const payuPayload = generatePayUHash({
      txnid: orderId,
      amount: total,
      productinfo: productInfo,
      firstname: cleanFirstName,
      email: address.email.trim(),
      phone: address.phone.replace(/[^0-9]/g, "").slice(-10),
      udf1: orderId,
      udf2: address.city || "",
      udf3: address.pincode || "",
    });

    return NextResponse.json({
      success: true,
      orderId,
      paymentUrl: payuPayload.paymentUrl,
      payuData: payuPayload.payuData,
      hash: payuPayload.hash,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Internal Server Error";
    console.error("[PayU Initiate Error]:", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
