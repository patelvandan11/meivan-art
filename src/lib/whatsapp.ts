export const DEFAULT_WHATSAPP_NUMBER = "919664792015";

export function cleanWhatsAppNumber(phone?: string): string {
  const raw = phone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER;
  let cleaned = raw.replace(/[^0-9]/g, "");
  
  // If user entered 10 digits (typical Indian phone number e.g. 9876543210), prepend 91
  if (cleaned.length === 10) {
    cleaned = `91${cleaned}`;
  }
  
  return cleaned || DEFAULT_WHATSAPP_NUMBER;
}

export function getWhatsAppNumber(): string {
  return cleanWhatsAppNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);
}

export function getWhatsAppUrl(message: string, customPhone?: string): string {
  const phone = cleanWhatsAppNumber(customPhone);
  const encoded = encodeURIComponent(message.trim());
  return `https://wa.me/${phone}?text=${encoded}`;
}

export interface ProductOrderParams {
  product: {
    id: string;
    name: string;
    price: number;
    slug?: string;
    category?: string;
  };
  quantity?: number;
  productUrl?: string;
  customerNote?: string;
}

export function buildProductOrderWhatsAppMessage({
  product,
  quantity = 1,
  productUrl,
  customerNote,
}: ProductOrderParams): string {
  const total = product.price * quantity;
  const url =
    productUrl ||
    (typeof window !== "undefined"
      ? window.location.href
      : `https://vandanartwork.vercel.app/product/${product.slug || product.id}`);

  let msg = `🎨 *Order Booking Request — Vandan Artwork*\n\n`;
  msg += `Hello Vandan Artwork! I would like to book an order for this original artwork:\n\n`;
  msg += `• *Artwork:* ${product.name}\n`;
  msg += `• *Price:* ₹${product.price.toLocaleString("en-IN")}\n`;
  msg += `• *Quantity:* ${quantity}\n`;
  msg += `• *Total Amount:* ₹${total.toLocaleString("en-IN")}\n`;
  if (url) {
    msg += `• *View Artwork:* ${url}\n`;
  }
  if (customerNote && customerNote.trim()) {
    msg += `• *Note / Custom Request:* ${customerNote.trim()}\n`;
  }
  msg += `\nPlease confirm availability, shipping details, and payment options (UPI / Bank Transfer). Thank you!`;

  return msg;
}

export interface CartOrderParams {
  items: Array<{
    product: {
      name: string;
      price: number;
      slug?: string;
    };
    quantity: number;
  }>;
  total: number;
  subtotal?: number;
  discount?: number;
  shipping?: number;
  customerAddress?: {
    name?: string;
    city?: string;
    pincode?: string;
  };
}

export function buildCartOrderWhatsAppMessage({
  items,
  total,
  subtotal,
  discount = 0,
  shipping = 0,
  customerAddress,
}: CartOrderParams): string {
  let msg = `🎨 *Cart Order Booking — Vandan Artwork*\n\n`;
  msg += `Hello Vandan Artwork! I would like to book an order for the following artworks:\n\n`;

  items.forEach((item, idx) => {
    const itemTotal = item.product.price * item.quantity;
    msg += `${idx + 1}. *${item.product.name}*\n`;
    msg += `   Qty: ${item.quantity} × ₹${item.product.price.toLocaleString("en-IN")} = ₹${itemTotal.toLocaleString("en-IN")}\n`;
  });

  msg += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
  if (subtotal !== undefined) {
    msg += `• *Subtotal:* ₹${subtotal.toLocaleString("en-IN")}\n`;
  }
  if (discount > 0) {
    msg += `• *Discount:* -₹${discount.toLocaleString("en-IN")}\n`;
  }
  msg += `• *Shipping:* ${shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN")}`}\n`;
  msg += `• *Total Payable:* ₹${total.toLocaleString("en-IN")}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (customerAddress?.name || customerAddress?.city || customerAddress?.pincode) {
    msg += `📍 *Delivery Details:*\n`;
    if (customerAddress.name) msg += `• Name: ${customerAddress.name}\n`;
    if (customerAddress.city) msg += `• City: ${customerAddress.city}\n`;
    if (customerAddress.pincode) msg += `• Pincode: ${customerAddress.pincode}\n`;
    msg += `\n`;
  }

  msg += `Please confirm the order and provide payment details (UPI / Bank Transfer) & dispatch timeline. Thank you!`;

  return msg;
}

export function buildGeneralInquiryWhatsAppMessage(topic?: string): string {
  let msg = `🎨 *Hello Vandan Artwork!*\n\n`;
  if (topic) {
    msg += `I am interested in your original artwork and would love more details regarding *${topic}*.\n\n`;
  } else {
    msg += `I am interested in your original handmade paintings and custom art commissions. Could you please share more information?\n\n`;
  }
  msg += `Looking forward to your reply. Thank you!`;
  return msg;
}

export interface FullOrderWhatsAppParams {
  orderId?: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    notes?: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  discount?: number;
  couponCode?: string;
  shippingFee?: number;
  total: number;
}

export function buildFullOrderWhatsAppMessage(params: FullOrderWhatsAppParams): string {
  let msg = `🎨 *NEW ART ORDER BOOKING — Vandan Artwork*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  if (params.orderId) {
    msg += `🔖 *Order ID:* #${params.orderId}\n\n`;
  }

  msg += `👤 *Customer Details:*\n`;
  msg += `• Name: ${params.customer.name}\n`;
  msg += `• Phone: ${params.customer.phone}\n`;
  msg += `• Email: ${params.customer.email}\n\n`;

  msg += `📍 *Delivery Address:*\n`;
  msg += `• Street: ${params.customer.street}\n`;
  msg += `• City: ${params.customer.city}\n`;
  msg += `• State: ${params.customer.state}\n`;
  msg += `• Pincode: ${params.customer.pincode}\n`;
  if (params.customer.notes) {
    msg += `• Landmark/Notes: ${params.customer.notes}\n`;
  }
  msg += `\n`;

  msg += `📦 *Order Items:*\n`;
  params.items.forEach((item, idx) => {
    const itemTotal = item.price * item.quantity;
    msg += `${idx + 1}. *${item.name}*\n`;
    msg += `   Qty: ${item.quantity} × ₹${item.price.toLocaleString("en-IN")} = ₹${itemTotal.toLocaleString("en-IN")}\n`;
  });

  msg += `\n💰 *Price Breakdown:*\n`;
  msg += `• Subtotal: ₹${params.subtotal.toLocaleString("en-IN")}\n`;
  if (params.discount && params.discount > 0) {
    msg += `• Discount: -₹${params.discount.toLocaleString("en-IN")}${params.couponCode ? ` (${params.couponCode})` : ""}\n`;
  }
  msg += `• Shipping: ${!params.shippingFee || params.shippingFee === 0 ? "FREE (Insured Transit Across India)" : `₹${params.shippingFee.toLocaleString("en-IN")}`}\n`;
  msg += `• *Total Amount Payable:* ₹${params.total.toLocaleString("en-IN")}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `Hello Artist! I would like to confirm this order. Please share your UPI / Bank Transfer QR code to complete payment & dispatch. Thank you!`;

  return msg;
}
