import type { Order } from "@/types";

export interface GoogleSheetSyncResult {
  success: boolean;
  message?: string;
  sheetUrl?: string;
}

/**
 * Format order into flat columns for Google Sheets
 */
export function formatOrderForSheet(order: Order): Record<string, string | number> {
  const itemsSummary = order.items
    .map((item) => `${item.productName} (x${item.quantity}) - ₹${item.price * item.quantity}`)
    .join("; ");

  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const formattedDate = new Date(order.createdAt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return {
    orderId: order.id,
    dateTime: formattedDate,
    customerName: order.customerName || order.shippingAddress?.name || "",
    customerEmail: order.customerEmail || order.shippingAddress?.email || "",
    customerPhone: order.customerPhone || order.shippingAddress?.phone || "",
    streetAddress: order.shippingAddress?.street || "",
    city: order.shippingAddress?.city || "",
    state: order.shippingAddress?.state || "",
    pincode: order.shippingAddress?.pincode || "",
    productsSummary: itemsSummary,
    totalQuantity,
    subtotal: order.subtotal || order.total,
    shippingFee: order.shippingFee || 0,
    discount: order.discount || 0,
    totalAmount: order.total,
    paymentMethod: order.paymentMethod?.toUpperCase() || "PAYU",
    paymentStatus: order.paymentStatus?.toUpperCase() || "PAID",
    paymentTxnId: order.payuTxnId || order.paymentId || "",
    fulfillmentStatus: (order.status || "paid").toUpperCase(),
    courierPartner: order.tracking?.courierName || "",
    trackingNumber: order.tracking?.trackingNumber || "",
    trackingUrl: order.tracking?.trackingUrl || "",
    orderNotes: order.shippingAddress?.notes || order.tracking?.notes || "",
  };
}

/**
 * Sync an order to Google Sheets
 * Checks GOOGLE_SHEET_WEBHOOK_URL or Google Apps Script Webhook
 */
export async function syncOrderToGoogleSheet(order: Order): Promise<GoogleSheetSyncResult> {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  const payload = {
    action: "appendOrder",
    data: formatOrderForSheet(order),
    rawOrder: order,
    timestamp: new Date().toISOString(),
  };

  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log(`[Google Sheets] Order ${order.id} synced successfully via Webhook`);
        return { success: true, message: "Order synced to Google Sheets" };
      } else {
        const errorText = await response.text();
        console.error(`[Google Sheets] Webhook response failed:`, errorText);
        return { success: false, message: `Webhook error: ${errorText}` };
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`[Google Sheets] Error calling Webhook:`, errMsg);
      return { success: false, message: errMsg };
    }
  }

  // Fallback info logging if webhook URL is not configured yet
  console.log("\n=======================================================");
  console.log("📊 GOOGLE SHEET ORDER RECORD (Ready to sync)");
  console.log(`Order ID:    ${order.id}`);
  console.log(`Customer:    ${order.customerName} (${order.customerEmail})`);
  console.log(`Phone:       ${order.customerPhone || order.shippingAddress?.phone}`);
  console.log(`Address:     ${order.shippingAddress?.street}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}`);
  console.log(`Amount:      ₹${order.total} [${order.paymentMethod?.toUpperCase() || "PAYU"}]`);
  console.log(`Items:       ${order.items.map((i) => `${i.productName} (x${i.quantity})`).join(", ")}`);
  console.log("ℹ️  To automatically append into your Google Sheet, set GOOGLE_SHEET_WEBHOOK_URL in .env");
  console.log("=======================================================\n");

  return {
    success: true,
    message: sheetId
      ? "Logged for Google Sheet"
      : "Logged locally (Add GOOGLE_SHEET_WEBHOOK_URL to enable direct spreadsheet sync)",
  };
}

/**
 * Update order tracking/fulfillment status in Google Sheets
 */
export async function updateOrderInGoogleSheet(
  orderId: string,
  updateData: {
    status?: string;
    courierName?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    notes?: string;
  }
): Promise<GoogleSheetSyncResult> {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log(`[Google Sheets] Order ${orderId} update logged locally`);
    return { success: true, message: "Update recorded" };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateTracking",
        orderId,
        update: updateData,
        timestamp: new Date().toISOString(),
      }),
    });

    return { success: response.ok, message: "Google Sheet row updated" };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return { success: false, message: errMsg };
  }
}
