import { NextResponse } from "next/server";
import { getOrderById } from "@/lib/orders";
import { getProductBySlugFromStore } from "@/lib/products-store";
import { generateSignedPdfUrl } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, productId, redirect } = body;

    if (!orderId || !productId) {
      return NextResponse.json(
        { success: false, error: "Both orderId and productId are required." },
        { status: 400 }
      );
    }

    // 1. Fetch order details from DB / store
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found. Please check your order reference." },
        { status: 404 }
      );
    }

    // 2. Verify payment status is PAID
    const isPaid =
      order.paymentStatus === "paid" ||
      order.status === "paid" ||
      order.status === "delivered" ||
      order.status === "shipped" ||
      order.status === "packing" ||
      order.status === "out_for_delivery";

    if (!isPaid) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment for this order has not been completed or verified yet.",
        },
        { status: 403 }
      );
    }

    // 3. Verify product was purchased in this order
    const matchedItem = order.items.find(
      (item) =>
        item.productId.toLowerCase() === productId.toLowerCase() ||
        (item.productName && item.productName.toLowerCase() === productId.toLowerCase())
    );

    if (!matchedItem) {
      return NextResponse.json(
        {
          success: false,
          error: `Product "${productId}" was not found in Order #${orderId}.`,
        },
        { status: 403 }
      );
    }

    // 4. Fetch product details to retrieve Supabase storage path
    const product = await getProductBySlugFromStore(matchedItem.productId);

    // Retrieve storage path from product or order item
    const storagePath =
      product?.storagePath ||
      product?.storage_path ||
      matchedItem.storagePath ||
      matchedItem.storage_path;

    if (!storagePath) {
      return NextResponse.json(
        {
          success: false,
          error: "Storage path for this digital product is not specified.",
        },
        { status: 400 }
      );
    }

    // 5. Generate Supabase signed URL valid for 300 seconds (5 minutes) or 600 seconds (10 minutes)
    const expiresInSeconds = 300; // 5 minutes
    const { signedUrl, error: supabaseError } = await generateSignedPdfUrl(
      storagePath,
      expiresInSeconds
    );

    if (supabaseError || !signedUrl) {
      return NextResponse.json(
        {
          success: false,
          error: supabaseError || "Failed to generate signed download link.",
        },
        { status: 500 }
      );
    }

    if (redirect) {
      return NextResponse.redirect(signedUrl, { status: 303 });
    }

    return NextResponse.json({
      success: true,
      downloadUrl: signedUrl,
      expiresInSeconds,
      expiresAt: new Date(Date.now() + expiresInSeconds * 1000).toISOString(),
      productName: product?.name || matchedItem.productName,
      storagePath,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Error generating download link";
    console.error("[Digital Download API Error]:", errMsg);
    return NextResponse.json(
      { success: false, error: errMsg },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const productId = searchParams.get("productId");
    const shouldRedirect = searchParams.get("redirect") !== "false";

    if (!orderId || !productId) {
      return NextResponse.json(
        { success: false, error: "Missing orderId or productId in query params" },
        { status: 400 }
      );
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    const isPaid =
      order.paymentStatus === "paid" ||
      order.status === "paid" ||
      order.status === "delivered" ||
      order.status === "shipped" ||
      order.status === "packing" ||
      order.status === "out_for_delivery";

    if (!isPaid) {
      return NextResponse.json(
        { success: false, error: "Payment not verified for this order" },
        { status: 403 }
      );
    }

    const matchedItem = order.items.find(
      (item) =>
        item.productId.toLowerCase() === productId.toLowerCase() ||
        (item.productName && item.productName.toLowerCase() === productId.toLowerCase())
    );

    if (!matchedItem) {
      return NextResponse.json(
        { success: false, error: "Product not found in this order" },
        { status: 403 }
      );
    }

    const product = await getProductBySlugFromStore(matchedItem.productId);
    const storagePath =
      product?.storagePath ||
      product?.storage_path ||
      matchedItem.storagePath ||
      matchedItem.storage_path;

    if (!storagePath) {
      return NextResponse.json(
        { success: false, error: "Digital storage path missing for product" },
        { status: 400 }
      );
    }

    const expiresInSeconds = 300; // 5 minutes
    const { signedUrl, error: supabaseError } = await generateSignedPdfUrl(
      storagePath,
      expiresInSeconds
    );

    if (supabaseError || !signedUrl) {
      return NextResponse.json(
        { success: false, error: supabaseError || "Failed to generate signed download link" },
        { status: 500 }
      );
    }

    if (shouldRedirect) {
      return NextResponse.redirect(signedUrl, { status: 303 });
    }

    return NextResponse.json({
      success: true,
      downloadUrl: signedUrl,
      expiresInSeconds,
      expiresAt: new Date(Date.now() + expiresInSeconds * 1000).toISOString(),
      productName: product?.name || matchedItem.productName,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Error generating download link";
    return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
  }
}
