"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  RefreshCw,
  FileSpreadsheet,
  Printer,
  Mail,
  Phone,
  X,
  AlertCircle,
  Save,
  IndianRupee,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderFulfillmentStatus } from "@/types";

const COURIER_OPTIONS = [
  "Delhivery",
  "Blue Dart",
  "DTDC",
  "India Post (Speed Post)",
  "FedEx",
  "Shadowfax",
  "Xpressbees",
  "Ekart",
  "Ecom Express",
  "Other Courier",
];

export default function AdminOrdersPage() {
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Selected order for tracking & fulfillment modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [savingTracking, setSavingTracking] = useState(false);
  const [syncingSheets, setSyncingSheets] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State inside modal
  const [modalStatus, setModalStatus] = useState<OrderFulfillmentStatus>("paid");
  const [modalCourier, setModalCourier] = useState("Delhivery");
  const [modalAwb, setModalAwb] = useState("");
  const [modalTrackingUrl, setModalTrackingUrl] = useState("");
  const [modalDeliveryDate, setModalDeliveryDate] = useState("");
  const [modalNotes, setModalNotes] = useState("");
  const [notifyCustomerCheck, setNotifyCustomerCheck] = useState(true);

  // Load orders
  async function loadOrders() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success && data.orders) {
        setOrdersList(data.orders);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  // Filter orders
  const filteredOrders = ordersList.filter((order) => {
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "packing_needed"
        ? order.status === "paid" || order.status === "packing"
        : order.status === statusFilter;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.customerEmail.toLowerCase().includes(q) ||
      (order.customerPhone && order.customerPhone.includes(q)) ||
      (order.shippingAddress?.city && order.shippingAddress.city.toLowerCase().includes(q)) ||
      (order.tracking?.trackingNumber && order.tracking.trackingNumber.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  // Open Edit/Tracking Modal
  function handleOpenOrderModal(order: Order) {
    setSelectedOrder(order);
    setModalStatus(order.status || "paid");
    setModalCourier(order.tracking?.courierName || "Delhivery");
    setModalAwb(order.tracking?.trackingNumber || "");
    setModalTrackingUrl(order.tracking?.trackingUrl || "");
    setModalDeliveryDate(order.tracking?.estimatedDelivery || "");
    setModalNotes(order.tracking?.notes || "");
    setNotifyCustomerCheck(true);
    setActionMessage(null);
  }

  // Save Order Tracking & Status
  async function handleSaveTracking() {
    if (!selectedOrder) return;
    setSavingTracking(true);
    setActionMessage(null);

    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/tracking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: modalStatus,
          courierName: modalCourier,
          trackingNumber: modalAwb,
          trackingUrl: modalTrackingUrl,
          estimatedDelivery: modalDeliveryDate,
          notes: modalNotes,
          notifyCustomer: notifyCustomerCheck,
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        // Update local list
        setOrdersList((prev) =>
          prev.map((o) => (o.id === selectedOrder.id ? data.order : o))
        );
        setSelectedOrder(data.order);
        setActionMessage({
          type: "success",
          text: data.customerNotified
            ? "Tracking updated & shipping email sent to customer!"
            : "Tracking updated & synced to Google Sheets successfully!",
        });
      } else {
        throw new Error(data.error || "Failed to update tracking");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating tracking";
      setActionMessage({ type: "error", text: msg });
    } finally {
      setSavingTracking(false);
    }
  }

  // Sync to Google Sheets
  async function handleSyncSheets(orderId?: string) {
    setSyncingSheets(true);
    setActionMessage(null);
    try {
      const res = await fetch("/api/admin/sheets/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      if (data.success) {
        setActionMessage({
          type: "success",
          text: data.message || "Synced to Google Sheets successfully!",
        });
        loadOrders();
      } else {
        throw new Error(data.error || "Sync failed");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sync Google Sheets";
      setActionMessage({ type: "error", text: msg });
    } finally {
      setSyncingSheets(false);
    }
  }

  // Print Packing Slip
  function handlePrintPackingSlip(order: Order) {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const itemsHtml = order.items
      .map(
        (i) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${i.productName}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${i.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${i.price}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${i.price * i.quantity}</td>
        </tr>
      `
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Packing Slip - ${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #333; }
            h1 { color: #c97c5d; margin: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            .badge { background: #eee; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #c97c5d; padding-bottom: 12px;">
            <div>
              <h1>Meivan Art</h1>
              <p style="margin: 4px 0;">Official Order Packing Slip</p>
            </div>
            <div style="text-align: right;">
              <h2 style="margin: 0;">Order #${order.id}</h2>
              <p style="margin: 4px 0;">Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
            </div>
          </div>

          <div style="margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div style="border: 1px solid #eee; padding: 12px; border-radius: 6px;">
              <strong>SHIP TO:</strong>
              <p style="margin: 4px 0; font-size: 15px; font-weight: bold;">${order.shippingAddress?.name || order.customerName}</p>
              <p style="margin: 2px 0;">${order.shippingAddress?.street || ""}</p>
              <p style="margin: 2px 0;">${order.shippingAddress?.city || ""}, ${order.shippingAddress?.state || ""} - <strong>${order.shippingAddress?.pincode || ""}</strong></p>
              <p style="margin: 2px 0;">Phone: <strong>${order.shippingAddress?.phone || order.customerPhone || ""}</strong></p>
              <p style="margin: 2px 0;">Email: ${order.shippingAddress?.email || order.customerEmail}</p>
            </div>
            <div style="border: 1px solid #eee; padding: 12px; border-radius: 6px;">
              <strong>PAYMENT & TRACKING INFO:</strong>
              <p style="margin: 4px 0;">Payment: <span class="badge">${order.paymentMethod?.toUpperCase() || "PAYU"} (${order.paymentStatus?.toUpperCase() || "PAID"})</span></p>
              <p style="margin: 4px 0;">Status: <strong>${order.status.toUpperCase()}</strong></p>
              <p style="margin: 4px 0;">Courier: ${order.tracking?.courierName || "Unassigned"}</p>
              <p style="margin: 4px 0;">AWB: ${order.tracking?.trackingNumber || "Pending"}</p>
            </div>
          </div>

          <table style="margin-top: 24px;">
            <thead>
              <tr style="background: #f8f6f4;">
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Product Item</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Qty</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Unit Price</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">Grand Total:</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold; font-size: 16px;">₹${order.total}</td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top: 32px; border-top: 1px dashed #ccc; padding-top: 16px; font-size: 12px; text-align: center; color: #777;">
            Packed with authentic craft by Meivan Art • Contact: meivaninfo@gmail.com
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  // Count stats
  const packingCount = ordersList.filter((o) => o.status === "paid" || o.status === "packing").length;
  const shippedCount = ordersList.filter((o) => o.status === "shipped" || o.status === "out_for_delivery").length;
  const totalRevenue = ordersList.reduce((sum, o) => sum + (o.paymentStatus === "failed" ? 0 : o.total), 0);

  return (
    <DashboardShell allowedRole="admin">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">Admin Order & Shipping Hub</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track packing, assign couriers & AWB numbers, sync to Google Sheets, and alert{" "}
              <span className="font-medium text-foreground">meivaninfo@gmail.com</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSyncSheets()}
              disabled={syncingSheets}
              className="gap-2 border-sage/50 text-sage hover:bg-sage/10"
            >
              <FileSpreadsheet className="h-4 w-4" />
              {syncingSheets ? "Syncing..." : "Sync All to Google Sheet"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={loadOrders}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Metric Quick Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Total Orders</span>
              <Package className="h-4 w-4 text-terracotta" />
            </div>
            <p className="mt-2 text-2xl font-bold">{ordersList.length}</p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20 p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-800 dark:text-amber-300">
                Needs Packing / Dispatch
              </span>
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-amber-700 dark:text-amber-400">{packingCount}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">In Transit / Shipped</span>
              <Truck className="h-4 w-4 text-sage" />
            </div>
            <p className="mt-2 text-2xl font-bold text-sage">{shippedCount}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Gross Sales</span>
              <IndianRupee className="h-4 w-4 text-terracotta" />
            </div>
            <p className="mt-2 text-2xl font-bold">{formatPrice(totalRevenue)}</p>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by Order ID, customer, phone, city, or AWB tracking..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 rounded-xl border border-border bg-card p-1">
            {[
              { id: "all", label: "All" },
              { id: "packing_needed", label: `Pack & Ship (${packingCount})` },
              { id: "shipped", label: "Shipped" },
              { id: "delivered", label: "Delivered" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  statusFilter === tab.id
                    ? "bg-terracotta text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40 text-xs font-semibold text-muted-foreground">
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer & Phone</th>
                  <th className="p-4">Delivery City</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Fulfillment Status</th>
                  <th className="p-4">Courier / AWB</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-muted-foreground">
                      No orders found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isPackingNeeded = order.status === "paid" || order.status === "packing";
                    return (
                      <tr
                        key={order.id}
                        className={`transition-colors hover:bg-secondary/30 ${
                          isPackingNeeded ? "bg-amber-50/20 dark:bg-amber-950/10" : ""
                        }`}
                      >
                        {/* Order ID */}
                        <td className="p-4">
                          <p className="font-mono font-bold text-terracotta">{order.id}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </td>

                        {/* Customer */}
                        <td className="p-4">
                          <p className="font-medium text-foreground">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                          {order.customerPhone && (
                            <p className="text-xs font-mono text-terracotta/90">{order.customerPhone}</p>
                          )}
                        </td>

                        {/* Delivery City */}
                        <td className="p-4">
                          <p className="text-xs font-medium">
                            {order.shippingAddress?.city || "—"}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {order.shippingAddress?.pincode}
                          </p>
                        </td>

                        {/* Items */}
                        <td className="p-4 max-w-[200px]">
                          <div className="space-y-0.5">
                            {order.items.map((i) => (
                              <p key={i.productId} className="truncate text-xs">
                                <span className="font-semibold text-foreground">{i.quantity}x</span>{" "}
                                {i.productName}
                              </p>
                            ))}
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="p-4 font-semibold text-foreground">
                          {formatPrice(order.total)}
                        </td>

                        {/* Payment */}
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ${
                              order.paymentStatus === "paid"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                                : order.paymentStatus === "failed"
                                ? "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                            }`}
                          >
                            {order.paymentMethod?.toUpperCase() || "PAYU"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                              order.status === "delivered"
                                ? "bg-sage/20 text-sage"
                                : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
                                : isPackingNeeded
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 font-semibold"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {order.status.replace("_", " ")}
                          </span>
                        </td>

                        {/* Courier / AWB */}
                        <td className="p-4 text-xs">
                          {order.tracking?.trackingNumber ? (
                            <div>
                              <p className="font-semibold text-foreground">{order.tracking.courierName}</p>
                              <p className="font-mono text-terracotta">{order.tracking.trackingNumber}</p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">Unassigned</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenOrderModal(order)}
                              className="text-xs gap-1"
                            >
                              <Truck className="h-3.5 w-3.5" />
                              Track / Pack
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handlePrintPackingSlip(order)}
                              title="Print Packing Slip"
                              className="h-8 w-8 p-0"
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Fulfillment & Packing Tracking Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl my-8">
            {/* Close Button */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-border pb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">
                Order Fulfillment & Courier Dispatch
              </span>
              <h2 className="font-heading text-2xl font-bold mt-0.5">
                Manage Order #{selectedOrder.id}
              </h2>
            </div>

            {actionMessage && (
              <div
                className={`mt-4 rounded-xl p-3 text-xs font-medium flex items-center gap-2 ${
                  actionMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-300"
                }`}
              >
                {actionMessage.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0" />
                )}
                <span>{actionMessage.text}</span>
              </div>
            )}

            {/* Customer & Address Quick View */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2 rounded-2xl bg-secondary/40 p-4 text-xs">
              <div>
                <p className="font-semibold text-foreground mb-1">Customer Details:</p>
                <p className="text-sm font-medium">{selectedOrder.customerName}</p>
                <p className="text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Mail className="h-3 w-3" /> {selectedOrder.customerEmail}
                </p>
                {selectedOrder.customerPhone && (
                  <p className="text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Phone className="h-3 w-3" />
                    <a href={`tel:${selectedOrder.customerPhone}`} className="text-terracotta hover:underline font-bold">
                      {selectedOrder.customerPhone}
                    </a>
                  </p>
                )}
              </div>

              <div>
                <p className="font-semibold text-foreground mb-1">Shipping Destination:</p>
                {selectedOrder.shippingAddress ? (
                  <div className="text-muted-foreground space-y-0.5">
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - <strong>{selectedOrder.shippingAddress.pincode}</strong></p>
                    {selectedOrder.shippingAddress.notes && (
                      <p className="text-terracotta italic mt-1">Note: {selectedOrder.shippingAddress.notes}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Standard delivery</p>
                )}
              </div>
            </div>

            {/* Itemized Packing List */}
            <div className="mt-4 border border-border rounded-xl p-3 text-xs">
              <p className="font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-terracotta" /> Items to Pack ({selectedOrder.items.reduce((s, i) => s + i.quantity, 0)} items)
              </p>
              <div className="space-y-1 divide-y divide-border">
                {selectedOrder.items.map((i) => (
                  <div key={i.productId} className="flex justify-between pt-1">
                    <span>
                      <strong className="text-foreground">{i.quantity}x</strong> {i.productName}
                    </span>
                    <span className="font-semibold">{formatPrice(i.price * i.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking / Fulfillment Form */}
            <div className="mt-5 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-foreground">
                    Fulfillment Status *
                  </label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value as OrderFulfillmentStatus)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-2 focus:ring-terracotta outline-none"
                  >
                    <option value="paid">Paid (Awaiting Packing)</option>
                    <option value="packing">Packing & Preparing</option>
                    <option value="shipped">Shipped (Handed to Courier)</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-foreground">
                    Courier Partner *
                  </label>
                  <select
                    value={modalCourier}
                    onChange={(e) => setModalCourier(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-2 focus:ring-terracotta outline-none"
                  >
                    {COURIER_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-foreground">
                    AWB / Tracking Number *
                  </label>
                  <Input
                    placeholder="e.g. 142389182390 or DEL12345"
                    value={modalAwb}
                    onChange={(e) => setModalAwb(e.target.value)}
                    className="font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-foreground">
                    Estimated Delivery Date
                  </label>
                  <Input
                    placeholder="e.g. 05 Sep 2026 or 3-4 Days"
                    value={modalDeliveryDate}
                    onChange={(e) => setModalDeliveryDate(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-foreground">
                    Custom Tracking URL (Optional - auto-generated if left blank)
                  </label>
                  <Input
                    placeholder="e.g. https://www.delhivery.com/track/package/..."
                    value={modalTrackingUrl}
                    onChange={(e) => setModalTrackingUrl(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-foreground">
                    Internal Packing Notes
                  </label>
                  <Input
                    placeholder="e.g. Packed in Bubble wrap Box #3 by Meivan Art team"
                    value={modalNotes}
                    onChange={(e) => setModalNotes(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Notify customer toggle */}
              <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={notifyCustomerCheck}
                  onChange={(e) => setNotifyCustomerCheck(e.target.checked)}
                  className="rounded border-border text-terracotta accent-terracotta"
                />
                <span>
                  Automatically send shipping email with tracking link to{" "}
                  <strong>{selectedOrder.customerEmail}</strong>
                </span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePrintPackingSlip(selectedOrder)}
                  className="gap-1.5 text-xs"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print Packing Slip
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSyncSheets(selectedOrder.id)}
                  disabled={syncingSheets}
                  className="gap-1.5 text-xs text-sage"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  Sync to Sheet
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOrder(null)}
                >
                  Cancel
                </Button>

                <Button
                  size="sm"
                  onClick={handleSaveTracking}
                  disabled={savingTracking}
                  className="gap-1.5"
                >
                  <Save className="h-3.5 w-3.5" />
                  {savingTracking ? "Updating..." : "Save & Dispatch"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
