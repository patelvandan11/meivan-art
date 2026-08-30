import { NextResponse } from "next/server";
import { getOrderById, updateOrderTracking } from "@/lib/orders";
import { updateOrderInGoogleSheet } from "@/lib/google-sheets";
import { sendCustomerShippingUpdate } from "@/lib/email";
import type { OrderFulfillmentStatus, TrackingInfo } from "@/types";

function generateCourierTrackingUrl(courier: string, trackingNum: string): string {
  if (!trackingNum) return "";
  const c = courier.toLowerCase();

  if (c.includes("delhivery")) {
    return `https://www.delhivery.com/track/package/${encodeURIComponent(trackingNum)}`;
  }
  if (c.includes("bluedart") || c.includes("blue dart")) {
    return `https://www.bluedart.com/tracking?trackNumber=${encodeURIComponent(trackingNum)}`;
  }
  if (c.includes("dtdc")) {
    return `https://www.dtdc.in/tracking/shipment-tracking.asp?trNo=${encodeURIComponent(trackingNum)}`;
  }
  if (c.includes("india post") || c.includes("speed post")) {
    return `https://www.indiapost.gov.in/_layouts/15/dpt.cptc.va/trackconsignment.aspx`;
  }
  if (c.includes("fedex")) {
    return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(trackingNum)}`;
  }
  if (c.includes("shadowfax")) {
    return `https://tracker.shadowfax.in/#/track/${encodeURIComponent(trackingNum)}`;
  }
  if (c.includes("xpressbees")) {
    return `https://www.xpressbees.com/track?awb=${encodeURIComponent(trackingNum)}`;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(`${courier} tracking ${trackingNum}`)}`;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      status,
      courierName,
      trackingNumber,
      trackingUrl,
      estimatedDelivery,
      notes,
      notifyCustomer = true,
    } = body as {
      status?: OrderFulfillmentStatus;
      courierName?: string;
      trackingNumber?: string;
      trackingUrl?: string;
      estimatedDelivery?: string;
      notes?: string;
      notifyCustomer?: boolean;
    };

    const existingOrder = await getOrderById(id);
    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const resolvedTrackingUrl =
      trackingUrl ||
      (courierName && trackingNumber
        ? generateCourierTrackingUrl(courierName, trackingNumber)
        : existingOrder.tracking?.trackingUrl);

    const trackingData: TrackingInfo = {
      courierName: courierName !== undefined ? courierName : existingOrder.tracking?.courierName,
      trackingNumber: trackingNumber !== undefined ? trackingNumber : existingOrder.tracking?.trackingNumber,
      trackingUrl: resolvedTrackingUrl,
      shippedAt:
        status === "shipped" || existingOrder.tracking?.shippedAt
          ? existingOrder.tracking?.shippedAt || new Date().toISOString()
          : undefined,
      estimatedDelivery: estimatedDelivery !== undefined ? estimatedDelivery : existingOrder.tracking?.estimatedDelivery,
      notes: notes !== undefined ? notes : existingOrder.tracking?.notes,
    };

    const updatedOrder = await updateOrderTracking(id, {
      status: status || existingOrder.status,
      tracking: trackingData,
    });

    if (!updatedOrder) {
      return NextResponse.json({ error: "Failed to update order tracking" }, { status: 500 });
    }

    // 1. Update Google Sheet
    try {
      await updateOrderInGoogleSheet(id, {
        status: status || existingOrder.status,
        courierName: trackingData.courierName,
        trackingNumber: trackingData.trackingNumber,
        trackingUrl: trackingData.trackingUrl,
        notes: trackingData.notes,
      });
    } catch (sheetErr) {
      console.error("[Google Sheet Tracking Update Error]:", sheetErr);
    }

    // 2. Send customer shipping email if marked as shipped or tracking added
    let customerNotified = false;
    if (notifyCustomer && (status === "shipped" || status === "out_for_delivery" || trackingNumber)) {
      try {
        const mailRes = await sendCustomerShippingUpdate(updatedOrder, trackingData);
        customerNotified = mailRes.sent;
      } catch (mailErr) {
        console.error("[Customer Shipping Email Error]:", mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      customerNotified,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Internal error updating tracking";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
