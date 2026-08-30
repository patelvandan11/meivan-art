import { getDb, isMongoConfigured } from "@/lib/mongodb";
import { orders as mockOrders } from "@/lib/data/orders";
import type { Order, OrderFulfillmentStatus, TrackingInfo } from "@/types";

// In-memory cache to retain newly placed orders even if MongoDB isn't reachable
const inMemoryOrders: Order[] = [...mockOrders];

/**
 * Generate a unique sequential/timestamp order ID like ORD-2026-XXXX
 */
export function generateOrderId(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${Date.now().toString().slice(-4)}${randomSuffix}`;
}

/**
 * Save new order to MongoDB and in-memory store
 */
export async function createOrder(data: {
  id?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: Order["shippingAddress"];
  items: Order["items"];
  subtotal?: number;
  shippingFee?: number;
  discount?: number;
  total: number;
  cost?: number;
  profit?: number;
  paymentMethod?: "payu" | "stripe" | "cod" | "test";
  paymentStatus?: "pending" | "paid" | "failed";
  paymentId?: string;
  payuTxnId?: string;
  payuMihpayid?: string;
  status?: OrderFulfillmentStatus;
  tracking?: TrackingInfo;
}): Promise<Order> {
  const orderId = data.id || generateOrderId();
  const subtotal = data.subtotal || data.total;
  const cost = data.cost || Math.round(data.total * 0.45);
  const profit = data.profit || data.total - cost;

  const newOrder: Order = {
    id: orderId,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone || data.shippingAddress?.phone,
    shippingAddress: data.shippingAddress,
    items: data.items,
    subtotal,
    shippingFee: data.shippingFee || 0,
    discount: data.discount || 0,
    total: data.total,
    cost,
    profit,
    paymentMethod: data.paymentMethod || "payu",
    paymentStatus: data.paymentStatus || "pending",
    paymentId: data.paymentId,
    payuTxnId: data.payuTxnId,
    payuMihpayid: data.payuMihpayid,
    status: data.status || "pending",
    tracking: data.tracking || {},
    googleSheetSynced: false,
    adminNotificationSent: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 1. Update in-memory storage
  const existingIdx = inMemoryOrders.findIndex((o) => o.id === orderId);
  if (existingIdx >= 0) {
    inMemoryOrders[existingIdx] = newOrder;
  } else {
    inMemoryOrders.unshift(newOrder);
  }

  // 2. Persist to MongoDB if configured
  if (isMongoConfigured()) {
    try {
      const db = await getDb();
      await db.collection<Order>("orders").updateOne(
        { id: orderId },
        { $set: newOrder },
        { upsert: true }
      );
    } catch (err) {
      console.error("[Orders DB] Failed to save order to MongoDB:", err);
    }
  }

  return newOrder;
}

/**
 * Find order by order ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  if (isMongoConfigured()) {
    try {
      const db = await getDb();
      const doc = await db.collection<Order>("orders").findOne({ id: orderId });
      if (doc) return doc;
    } catch (err) {
      console.error("[Orders DB] Error getting order by ID:", err);
    }
  }

  const memoryMatch = inMemoryOrders.find((o) => o.id.toLowerCase() === orderId.toLowerCase());
  return memoryMatch || null;
}

/**
 * Fetch all orders with optional search and filter
 */
export async function getAllOrders(params?: {
  status?: string;
  search?: string;
}): Promise<Order[]> {
  let list: Order[] = [];

  if (isMongoConfigured()) {
    try {
      const db = await getDb();
      const query: Record<string, unknown> = {};
      if (params?.status && params.status !== "all") {
        query.status = params.status;
      }
      if (params?.search) {
        const regex = new RegExp(params.search, "i");
        query.$or = [
          { id: regex },
          { customerName: regex },
          { customerEmail: regex },
          { customerPhone: regex },
          { "tracking.trackingNumber": regex },
        ];
      }

      const docs = await db
        .collection<Order>("orders")
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

      if (docs && docs.length > 0) {
        list = docs;
      }
    } catch (err) {
      console.error("[Orders DB] Error querying orders from MongoDB, falling back to memory:", err);
    }
  }

  if (list.length === 0) {
    list = [...inMemoryOrders];
    if (params?.status && params.status !== "all") {
      list = list.filter((o) => o.status === params.status);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          (o.customerPhone && o.customerPhone.includes(q)) ||
          (o.tracking?.trackingNumber && o.tracking.trackingNumber.toLowerCase().includes(q))
      );
    }
  }

  return list;
}

/**
 * Update order tracking and fulfillment status
 */
export async function updateOrderTracking(
  orderId: string,
  update: {
    status?: OrderFulfillmentStatus;
    tracking?: TrackingInfo;
    googleSheetSynced?: boolean;
    adminNotificationSent?: boolean;
  }
): Promise<Order | null> {
  const order = await getOrderById(orderId);
  if (!order) return null;

  const updatedOrder: Order = {
    ...order,
    ...(update.status ? { status: update.status } : {}),
    tracking: {
      ...order.tracking,
      ...(update.tracking || {}),
    },
    ...(update.googleSheetSynced !== undefined
      ? { googleSheetSynced: update.googleSheetSynced }
      : {}),
    ...(update.adminNotificationSent !== undefined
      ? { adminNotificationSent: update.adminNotificationSent }
      : {}),
    updatedAt: new Date().toISOString(),
  };

  // Update memory
  const idx = inMemoryOrders.findIndex((o) => o.id === orderId);
  if (idx >= 0) {
    inMemoryOrders[idx] = updatedOrder;
  } else {
    inMemoryOrders.unshift(updatedOrder);
  }

  // Update MongoDB
  if (isMongoConfigured()) {
    try {
      const db = await getDb();
      await db
        .collection<Order>("orders")
        .updateOne({ id: orderId }, { $set: updatedOrder });
    } catch (err) {
      console.error("[Orders DB] Failed to update order tracking in MongoDB:", err);
    }
  }

  return updatedOrder;
}

/**
 * Update payment status (e.g. after PayU callback)
 */
export async function updateOrderPayment(
  orderId: string,
  paymentData: {
    paymentStatus: "paid" | "failed";
    status?: OrderFulfillmentStatus;
    payuTxnId?: string;
    payuMihpayid?: string;
    paymentId?: string;
  }
): Promise<Order | null> {
  const order = await getOrderById(orderId);
  if (!order) return null;

  const updatedOrder: Order = {
    ...order,
    paymentStatus: paymentData.paymentStatus,
    status: paymentData.status || (paymentData.paymentStatus === "paid" ? "paid" : "pending"),
    payuTxnId: paymentData.payuTxnId || order.payuTxnId,
    payuMihpayid: paymentData.payuMihpayid || order.payuMihpayid,
    paymentId: paymentData.paymentId || order.paymentId,
    updatedAt: new Date().toISOString(),
  };

  const idx = inMemoryOrders.findIndex((o) => o.id === orderId);
  if (idx >= 0) {
    inMemoryOrders[idx] = updatedOrder;
  } else {
    inMemoryOrders.unshift(updatedOrder);
  }

  if (isMongoConfigured()) {
    try {
      const db = await getDb();
      await db
        .collection<Order>("orders")
        .updateOne({ id: orderId }, { $set: updatedOrder });
    } catch (err) {
      console.error("[Orders DB] Failed to update payment in MongoDB:", err);
    }
  }

  return updatedOrder;
}

/**
 * Get comprehensive analytics/admin stats
 */
export async function getAdminOrderStats() {
  const all = await getAllOrders();
  const totalOrders = all.length;
  const totalRevenue = all.reduce((sum, o) => sum + (o.paymentStatus === "failed" ? 0 : o.total), 0);
  const totalProfit = all.reduce((sum, o) => sum + (o.paymentStatus === "failed" ? 0 : o.profit), 0);
  const pendingOrders = all.filter((o) => o.status === "pending").length;
  const packingOrders = all.filter((o) => o.status === "paid" || o.status === "packing").length;
  const shippedOrders = all.filter((o) => o.status === "shipped" || o.status === "out_for_delivery").length;
  const deliveredOrders = all.filter((o) => o.status === "delivered").length;

  return {
    totalOrders,
    totalRevenue,
    totalProfit,
    pendingOrders,
    packingOrders,
    shippedOrders,
    deliveredOrders,
  };
}
