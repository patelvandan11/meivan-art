import type { MonthlySales, Order } from "@/types";

export const orders: Order[] = [
  {
    id: "ORD-1042",
    customerName: "Priya Sharma",
    customerEmail: "priya@example.com",
    items: [
      {
        productId: "p1",
        productName: "Watercolor Landscape Print",
        quantity: 1,
        price: 2499,
        artistSlug: "maya-chen",
      },
    ],
    total: 2499,
    cost: 1200,
    profit: 1299,
    status: "delivered",
    createdAt: "2026-06-18T10:30:00Z",
  },
  {
    id: "ORD-1041",
    customerName: "Marcus Webb",
    customerEmail: "marcus@example.com",
    items: [
      {
        productId: "p3",
        productName: "Botanical Journal",
        quantity: 2,
        price: 1899,
        artistSlug: "sofia-laurent",
      },
      {
        productId: "p4",
        productName: "Custom Sticker Pack",
        quantity: 1,
        price: 599,
        artistSlug: "luna-park",
      },
    ],
    total: 4397,
    cost: 2100,
    profit: 2297,
    status: "shipped",
    createdAt: "2026-06-17T14:20:00Z",
  },
  {
    id: "ORD-1040",
    customerName: "Anika Patel",
    customerEmail: "anika@example.com",
    items: [
      {
        productId: "p6",
        productName: "Abstract Canvas Art",
        quantity: 1,
        price: 8999,
        artistSlug: "james-okonkwo",
      },
    ],
    total: 8999,
    cost: 4500,
    profit: 4499,
    status: "paid",
    createdAt: "2026-06-16T09:15:00Z",
  },
  {
    id: "ORD-1039",
    customerName: "David Kim",
    customerEmail: "david@example.com",
    items: [
      {
        productId: "p2",
        productName: "Cozy Ceramic Mug",
        quantity: 3,
        price: 1299,
        artistSlug: "elena-vasquez",
      },
    ],
    total: 3897,
    cost: 1800,
    profit: 2097,
    status: "delivered",
    createdAt: "2026-06-15T16:45:00Z",
  },
  {
    id: "ORD-1038",
    customerName: "Sneha Rao",
    customerEmail: "sneha@example.com",
    items: [
      {
        productId: "p8",
        productName: "Artisan Gift Box",
        quantity: 1,
        price: 3499,
      },
      {
        productId: "p11",
        productName: "Minimalist Line Art Print",
        quantity: 1,
        price: 1799,
        artistSlug: "james-okonkwo",
      },
    ],
    total: 5298,
    cost: 2600,
    profit: 2698,
    status: "pending",
    createdAt: "2026-06-14T11:00:00Z",
  },
  {
    id: "ORD-1037",
    customerName: "Rahul Mehta",
    customerEmail: "rahul@example.com",
    items: [
      {
        productId: "p1",
        productName: "Watercolor Landscape Print",
        quantity: 2,
        price: 2499,
        artistSlug: "maya-chen",
      },
    ],
    total: 4998,
    cost: 2400,
    profit: 2598,
    status: "delivered",
    createdAt: "2026-06-10T08:30:00Z",
  },
  {
    id: "ORD-1036",
    customerName: "Emily Chen",
    customerEmail: "emily@example.com",
    items: [
      {
        productId: "p10",
        productName: "Ceramic Vase Set",
        quantity: 1,
        price: 2799,
        artistSlug: "elena-vasquez",
      },
    ],
    total: 2799,
    cost: 1400,
    profit: 1399,
    status: "delivered",
    createdAt: "2026-06-05T13:20:00Z",
  },
];

export const monthlySales: MonthlySales[] = [
  { month: "Jan", orders: 42, revenue: 185000, profit: 92000 },
  { month: "Feb", orders: 38, revenue: 162000, profit: 81000 },
  { month: "Mar", orders: 55, revenue: 241000, profit: 120500 },
  { month: "Apr", orders: 48, revenue: 215000, profit: 107500 },
  { month: "May", orders: 61, revenue: 278000, profit: 139000 },
  { month: "Jun", orders: 34, revenue: 156000, profit: 78000 },
];

export function getAdminStats() {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalProfit = orders.reduce((sum, o) => sum + o.profit, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return { totalOrders, totalRevenue, totalProfit, pendingOrders };
}

export function getArtistStats(artistSlug: string) {
  const artistOrders = orders.flatMap((order) =>
    order.items
      .filter((item) => item.artistSlug === artistSlug)
      .map((item) => ({
        orderId: order.id,
        date: order.createdAt,
        productName: item.productName,
        quantity: item.quantity,
        revenue: item.price * item.quantity,
        profit: Math.round((item.price * item.quantity) * 0.45),
        status: order.status,
      }))
  );

  const totalSales = artistOrders.reduce((sum, o) => sum + o.revenue, 0);
  const totalProfit = artistOrders.reduce((sum, o) => sum + o.profit, 0);
  const unitsSold = artistOrders.reduce((sum, o) => sum + o.quantity, 0);

  return { artistOrders, totalSales, totalProfit, unitsSold };
}
