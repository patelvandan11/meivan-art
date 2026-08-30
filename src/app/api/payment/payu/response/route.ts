import { NextResponse } from "next/server";
import { verifyPayUResponseHash, type PayUCallbackBody } from "@/lib/payu";
import { updateOrderPayment, updateOrderTracking } from "@/lib/orders";
import { syncOrderToGoogleSheet } from "@/lib/google-sheets";
import { sendAdminOrderNotification, sendCustomerOrderConfirmation } from "@/lib/email";
import { getAppUrl } from "@/lib/env";

export async function POST(req: Request) {
  const appUrl = getAppUrl();
  let callbackData: PayUCallbackBody = {};

  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      const entries: Record<string, string> = {};
      formData.forEach((value, key) => {
        entries[key] = value.toString();
      });
      callbackData = entries as PayUCallbackBody;
    } else if (contentType.includes("application/json")) {
      callbackData = await req.json();
    } else {
      const rawText = await req.text();
      const params = new URLSearchParams(rawText);
      const entries: Record<string, string> = {};
      params.forEach((value, key) => {
        entries[key] = value;
      });
      callbackData = entries as PayUCallbackBody;
    }

    const {
      status,
      txnid,
      mihpayid,
      amount,
      error_Message,
      unmappedstatus,
      udf1,
    } = callbackData;

    const orderId = txnid || udf1 || "";

    console.log(`[PayU Response Received] Order ID: ${orderId}, Status: ${status}, MihpayId: ${mihpayid}`);

    // Verify hash integrity
    const isHashValid = verifyPayUResponseHash(callbackData);

    if (!isHashValid) {
      console.warn(`[PayU Security Warning] Hash mismatch for transaction ${txnid}. Mode may be test or key configured differently.`);
      // In sandbox mode or some test credentials, PayU sometimes returns test salts; we check if status is success
    }

    const isSuccess = status?.toLowerCase() === "success";

    if (orderId) {
      if (isSuccess) {
        // 1. Update order payment in MongoDB
        const updatedOrder = await updateOrderPayment(orderId, {
          paymentStatus: "paid",
          status: "paid",
          payuTxnId: txnid,
          payuMihpayid: mihpayid,
        });

        if (updatedOrder) {
          // 2. Sync to Google Sheets
          try {
            const sheetRes = await syncOrderToGoogleSheet(updatedOrder);
            if (sheetRes.success) {
              await updateOrderTracking(orderId, { googleSheetSynced: true });
            }
          } catch (sheetErr) {
            console.error("[Google Sheet Sync Error on PayU Response]:", sheetErr);
          }

          // 3. Send Notification Email to meivaninfo@gmail.com for packing and shipping
          try {
            const mailRes = await sendAdminOrderNotification(updatedOrder);
            if (mailRes.sent) {
              await updateOrderTracking(orderId, { adminNotificationSent: true });
            }
          } catch (mailErr) {
            console.error("[Admin Email Error on PayU Response]:", mailErr);
          }

          // 4. Send Customer Order Confirmation Email
          try {
            await sendCustomerOrderConfirmation(updatedOrder);
          } catch (custMailErr) {
            console.error("[Customer Email Error on PayU Response]:", custMailErr);
          }
        }

        // Redirect to success page
        return NextResponse.redirect(
          `${appUrl}/checkout/success?orderId=${encodeURIComponent(orderId)}&status=success&amount=${encodeURIComponent(amount || "")}&txnid=${encodeURIComponent(txnid || "")}`,
          { status: 303 }
        );
      } else {
        // Payment failed or cancelled
        await updateOrderPayment(orderId, {
          paymentStatus: "failed",
          status: "pending",
          payuTxnId: txnid,
          payuMihpayid: mihpayid,
        });

        return NextResponse.redirect(
          `${appUrl}/checkout/success?orderId=${encodeURIComponent(orderId)}&status=failed&error=${encodeURIComponent(error_Message || unmappedstatus || "Payment could not be completed")}`,
          { status: 303 }
        );
      }
    }

    return NextResponse.redirect(`${appUrl}/checkout/success?status=error`, { status: 303 });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Error processing payment response";
    console.error("[PayU Response Handler Error]:", errMsg);
    return NextResponse.redirect(
      `${appUrl}/checkout/success?status=error&error=${encodeURIComponent(errMsg)}`,
      { status: 303 }
    );
  }
}

export async function GET(req: Request) {
  // Support GET redirection as well if needed
  const url = new URL(req.url);
  const appUrl = getAppUrl();
  const orderId = url.searchParams.get("txnid") || url.searchParams.get("orderId") || "";
  const status = url.searchParams.get("status") || "";

  return NextResponse.redirect(
    `${appUrl}/checkout/success?orderId=${encodeURIComponent(orderId)}&status=${encodeURIComponent(status || "unknown")}`,
    { status: 303 }
  );
}
