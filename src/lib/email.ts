import nodemailer from "nodemailer";
import type { Order, TrackingInfo } from "@/types";
import { getAppUrl } from "@/lib/env";

function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const user = process.env.SMTP_USER;
  const pass = (process.env.SMTP_PASS || "").replace(/^["']|["']$/g, "").replace(/\s+/g, "");
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true";

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

const DEFAULT_FROM = process.env.SMTP_FROM || "Meivan Art <meivaninfo@gmail.com>";
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "meivaninfo@gmail.com";

export async function sendMagicLinkEmail(email: string, magicLink: string) {
  const transporter = getTransporter();

  if (!transporter) {
    console.log("\n--- MAGIC LINK (SMTP not configured) ---");
    console.log(`Email: ${email}`);
    console.log(`Link:  ${magicLink}`);
    console.log("----------------------------------------\n");
    return { sent: false, devLink: magicLink };
  }

  try {
    await transporter.sendMail({
      from: DEFAULT_FROM,
      to: email,
      subject: "Your Meivan Art sign-in link",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px; background-color: #fdfbf7; border: 1px solid #e8dfd8; border-radius: 12px;">
          <h2 style="color: #3d3028; margin-top: 0;">Sign in to Meivan Art</h2>
          <p style="color: #5c4d42; font-size: 15px; line-height: 1.5;">Click the button below to sign in to your account. This link expires in 15 minutes.</p>
          <div style="margin: 24px 0;">
            <a href="${magicLink}" style="display: inline-block; padding: 12px 28px; background: #c97c5d; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px;">
              Sign In to Meivan Art
            </a>
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #888;">If you didn't request this sign-in link, you can safely ignore this email.</p>
        </div>
      `,
    });
    return { sent: true };
  } catch (error) {
    console.error("Failed to send magic link email:", error);
    return { sent: false, error };
  }
}

/**
 * Send instant order notification email to meivaninfo@gmail.com for packing and shipping
 */
export async function sendAdminOrderNotification(order: Order) {
  const transporter = getTransporter();
  const appUrl = getAppUrl();
  const adminUrl = `${appUrl}/dashboard/admin/orders`;

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px 8px; font-weight: 500; color: #333;">${item.productName}</td>
        <td style="padding: 10px 8px; text-align: center; color: #555;">${item.quantity}</td>
        <td style="padding: 10px 8px; text-align: right; color: #333; font-weight: 600;">₹${item.price * item.quantity}</td>
      </tr>
    `
    )
    .join("");

  const address = order.shippingAddress;
  const addressHtml = address
    ? `
      <p style="margin: 4px 0; color: #333; font-weight: bold;">${address.name}</p>
      <p style="margin: 4px 0; color: #555;">${address.street}</p>
      <p style="margin: 4px 0; color: #555;">${address.city}, ${address.state} - <strong>${address.pincode}</strong></p>
      <p style="margin: 4px 0; color: #555;">📞 Phone: <a href="tel:${address.phone}" style="color: #c97c5d; font-weight: bold;">${address.phone}</a></p>
      <p style="margin: 4px 0; color: #555;">✉️ Email: <a href="mailto:${address.email}">${address.email}</a></p>
      ${address.notes ? `<p style="margin: 6px 0; color: #84533e; background: #faede6; padding: 6px; border-radius: 4px;">📝 <em>Notes: ${address.notes}</em></p>` : ""}
    `
    : `
      <p style="margin: 4px 0; color: #333; font-weight: bold;">${order.customerName}</p>
      <p style="margin: 4px 0; color: #555;">✉️ Email: ${order.customerEmail}</p>
      ${order.customerPhone ? `<p style="margin: 4px 0; color: #555;">📞 Phone: ${order.customerPhone}</p>` : ""}
    `;

  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e2d9d2; border-radius: 12px; color: #2d2621;">
      
      <div style="background: linear-gradient(135deg, #c97c5d, #b86241); padding: 20px; border-radius: 8px; text-align: center; color: #ffffff; margin-bottom: 24px;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 700;">📦 NEW ORDER RECEIVED!</h1>
        <p style="margin: 6px 0 0 0; font-size: 15px; opacity: 0.95;">Action Required: Order Packing & Shipping</p>
      </div>

      <div style="background-color: #fcf9f6; border-left: 4px solid #c97c5d; padding: 14px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
        <p style="margin: 0 0 6px 0; font-size: 15px;"><strong>Order ID:</strong> <span style="font-family: monospace; font-size: 16px; color: #c97c5d;">${order.id}</span></p>
        <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Payment Status:</strong> <span style="color: #15803d; font-weight: bold; text-transform: uppercase;">${order.paymentStatus || "PAID"}</span> via ${order.paymentMethod?.toUpperCase() || "PAYU"}</p>
        ${order.payuTxnId ? `<p style="margin: 0; font-size: 13px; color: #666;"><strong>PayU Txn ID:</strong> ${order.payuTxnId}</p>` : ""}
      </div>

      <h3 style="color: #3d3028; border-bottom: 2px solid #f0e6de; padding-bottom: 8px; margin-top: 24px;">📍 Shipping & Packing Address</h3>
      <div style="background: #faf8f5; padding: 14px; border-radius: 8px; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
        ${addressHtml}
      </div>

      <h3 style="color: #3d3028; border-bottom: 2px solid #f0e6de; padding-bottom: 8px; margin-top: 24px;">🛍️ Items to Pack</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f5ede6; color: #5c4d42; text-align: left;">
            <th style="padding: 10px 8px; border-radius: 6px 0 0 6px;">Product</th>
            <th style="padding: 10px 8px; text-align: center;">Qty</th>
            <th style="padding: 10px 8px; text-align: right; border-radius: 0 6px 6px 0;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 12px 8px; text-align: right; font-weight: bold; font-size: 15px;">Total Order Amount:</td>
            <td style="padding: 12px 8px; text-align: right; font-weight: bold; font-size: 16px; color: #c97c5d;">₹${order.total}</td>
          </tr>
        </tfoot>
      </table>

      <div style="text-align: center; margin: 32px 0 16px 0;">
        <a href="${adminUrl}" style="display: inline-block; background-color: #c97c5d; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          Open Admin Order Tracking →
        </a>
      </div>

      <p style="font-size: 12px; color: #999; text-align: center; margin-top: 24px; border-top: 1px solid #eee; padding-top: 16px;">
        Meivan Art Automated Order Notification System • Sent to ${ADMIN_NOTIFICATION_EMAIL}
      </p>
    </div>
  `;

  if (!transporter) {
    console.log(`\n--- [EMAIL TO ${ADMIN_NOTIFICATION_EMAIL}] NEW ORDER ${order.id} ---`);
    console.log(`Customer: ${order.customerName} (${order.customerEmail})`);
    console.log(`Total: ₹${order.total}`);
    console.log(`Items: ${order.items.map((i) => `${i.productName} x${i.quantity}`).join(", ")}`);
    console.log(`Tracking Link: ${adminUrl}`);
    console.log("-----------------------------------------------------------------\n");
    return { sent: false, preview: emailHtml };
  }

  try {
    await transporter.sendMail({
      from: DEFAULT_FROM,
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: `🚨 [NEW ORDER] ${order.id} - ₹${order.total} from ${order.customerName} (Pack & Ship)`,
      html: emailHtml,
    });
    console.log(`[Email] Admin packing alert sent successfully to ${ADMIN_NOTIFICATION_EMAIL} for ${order.id}`);
    return { sent: true };
  } catch (error) {
    console.error(`[Email] Failed to send admin order notification to ${ADMIN_NOTIFICATION_EMAIL}:`, error);
    return { sent: false, error };
  }
}

/**
 * Send customer order confirmation receipt
 */
export async function sendCustomerOrderConfirmation(order: Order) {
  const customerEmail = order.customerEmail || order.shippingAddress?.email;
  if (!customerEmail) return { sent: false, message: "No customer email provided" };

  const transporter = getTransporter();
  const appUrl = getAppUrl();
  const trackingUrl = `${appUrl}/orders/${order.id}`;

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px 8px; color: #333;">${item.productName}</td>
        <td style="padding: 10px 8px; text-align: center; color: #555;">${item.quantity}</td>
        <td style="padding: 10px 8px; text-align: right; color: #333; font-weight: 600;">₹${item.price * item.quantity}</td>
      </tr>
    `
    )
    .join("");

  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e8dfd8; border-radius: 12px; color: #2d2621;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #c97c5d; margin: 0; font-size: 26px; font-weight: 700;">Meivan Art</h1>
        <p style="color: #8c7a6e; font-size: 14px; margin-top: 4px;">Thank you for supporting authentic art!</p>
      </div>

      <div style="background-color: #fbf9f6; border-radius: 8px; padding: 18px; margin-bottom: 20px; text-align: center;">
        <h2 style="color: #15803d; margin: 0 0 8px 0; font-size: 20px;">🎉 Your Order is Confirmed!</h2>
        <p style="margin: 0; color: #5c4d42; font-size: 14px;">Order ID: <strong>${order.id}</strong></p>
      </div>

      <h3 style="color: #3d3028; border-bottom: 2px solid #f0e6de; padding-bottom: 8px; margin-top: 20px;">Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f5ede6; color: #5c4d42; text-align: left;">
            <th style="padding: 10px 8px;">Product</th>
            <th style="padding: 10px 8px; text-align: center;">Qty</th>
            <th style="padding: 10px 8px; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 12px 8px; text-align: right; font-weight: bold; font-size: 15px;">Total Paid:</td>
            <td style="padding: 12px 8px; text-align: right; font-weight: bold; font-size: 16px; color: #c97c5d;">₹${order.total}</td>
          </tr>
        </tfoot>
      </table>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${trackingUrl}" style="display: inline-block; background-color: #c97c5d; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">
          Track Your Order Live →
        </a>
      </div>

      <p style="font-size: 13px; color: #777; line-height: 1.5; text-align: center;">
        Our team is currently preparing your order with care. You will receive another email as soon as your package has been handed over to the courier with live tracking.
      </p>
    </div>
  `;

  if (!transporter) {
    console.log(`\n--- [CUSTOMER ORDER CONFIRMATION TO ${customerEmail}] ---`);
    console.log(`Order: ${order.id} | Total: ₹${order.total}`);
    console.log("--------------------------------------------------------\n");
    return { sent: false };
  }

  try {
    await transporter.sendMail({
      from: DEFAULT_FROM,
      to: customerEmail,
      subject: `Order Confirmation #${order.id} - Meivan Art`,
      html: emailHtml,
    });
    return { sent: true };
  } catch (error) {
    console.error(`Failed to send customer confirmation email to ${customerEmail}:`, error);
    return { sent: false, error };
  }
}

/**
 * Send shipping update with tracking link to customer
 */
export async function sendCustomerShippingUpdate(order: Order, tracking: TrackingInfo) {
  const customerEmail = order.customerEmail || order.shippingAddress?.email;
  if (!customerEmail) return { sent: false, message: "No customer email provided" };

  const transporter = getTransporter();
  const appUrl = getAppUrl();
  const internalTrackingUrl = `${appUrl}/orders/${order.id}`;

  const courierUrl = tracking.trackingUrl || internalTrackingUrl;

  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e8dfd8; border-radius: 12px; color: #2d2621;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #c97c5d; margin: 0; font-size: 26px; font-weight: 700;">Meivan Art</h1>
      </div>

      <div style="background-color: #effbf4; border: 1px solid #bbf0d0; border-radius: 8px; padding: 18px; margin-bottom: 20px; text-align: center;">
        <h2 style="color: #15803d; margin: 0 0 8px 0; font-size: 20px;">🚚 Your Order Has Shipped!</h2>
        <p style="margin: 0; color: #2d6141; font-size: 14px;">Order ID: <strong>${order.id}</strong></p>
      </div>

      <div style="background: #faf8f5; border: 1px solid #eee5dc; border-radius: 8px; padding: 16px; margin-bottom: 20px; font-size: 14px;">
        <p style="margin: 4px 0;"><strong>Courier Partner:</strong> ${tracking.courierName || "Express Courier"}</p>
        <p style="margin: 4px 0;"><strong>Tracking / AWB Number:</strong> <span style="font-family: monospace; font-size: 15px; color: #c97c5d; font-weight: bold;">${tracking.trackingNumber || "Pending"}</span></p>
        ${tracking.estimatedDelivery ? `<p style="margin: 4px 0;"><strong>Estimated Delivery:</strong> ${tracking.estimatedDelivery}</p>` : ""}
        ${tracking.notes ? `<p style="margin: 4px 0; color: #666;"><em>${tracking.notes}</em></p>` : ""}
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${courierUrl}" style="display: inline-block; background-color: #15803d; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px;">
          Track Package Now →
        </a>
      </div>

      <p style="font-size: 12px; color: #888; text-align: center; margin-top: 24px;">
        Need help with your shipment? Contact us at <a href="mailto:meivaninfo@gmail.com" style="color: #c97c5d;">meivaninfo@gmail.com</a>
      </p>
    </div>
  `;

  if (!transporter) {
    console.log(`\n--- [SHIPPING UPDATE TO ${customerEmail}] ---`);
    console.log(`Order: ${order.id} | Courier: ${tracking.courierName} | AWB: ${tracking.trackingNumber}`);
    console.log("--------------------------------------------\n");
    return { sent: false };
  }

  try {
    await transporter.sendMail({
      from: DEFAULT_FROM,
      to: customerEmail,
      subject: `🚚 Shipped! Your Meivan Art Order #${order.id} is on its way`,
      html: emailHtml,
    });
    return { sent: true };
  } catch (error) {
    console.error(`Failed to send shipping update email to ${customerEmail}:`, error);
    return { sent: false, error };
  }
}
