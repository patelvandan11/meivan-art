import { NextResponse } from "next/server";
import { getAllOrders, getOrderById, updateOrderTracking } from "@/lib/orders";
import { syncOrderToGoogleSheet } from "@/lib/google-sheets";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { orderId } = body as { orderId?: string };

    if (orderId) {
      const order = await getOrderById(orderId);
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      const res = await syncOrderToGoogleSheet(order);
      if (res.success) {
        await updateOrderTracking(orderId, { googleSheetSynced: true });
      }

      return NextResponse.json({ success: res.success, message: res.message });
    }

    // Bulk sync all orders
    const allOrders = await getAllOrders();
    let syncedCount = 0;

    for (const order of allOrders) {
      const res = await syncOrderToGoogleSheet(order);
      if (res.success) {
        await updateOrderTracking(order.id, { googleSheetSynced: true });
        syncedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${syncedCount} of ${allOrders.length} orders to Google Sheets.`,
      syncedCount,
      totalCount: allOrders.length,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Sync error";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
