import { NextResponse } from "next/server";
import { getAllOrders, getAdminOrderStats } from "@/lib/orders";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    const [ordersList, stats] = await Promise.all([
      getAllOrders({ status, search }),
      getAdminOrderStats(),
    ]);

    return NextResponse.json({
      success: true,
      orders: ordersList,
      stats,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Failed to load admin orders";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
