import { NextResponse } from "next/server";
import { getOrderById } from "@/lib/orders";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Failed to fetch order";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
