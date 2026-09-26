import type { MonthlySales, Order } from "@/types";

export const orders: Order[] = [];

export const monthlySales: MonthlySales[] = [];

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
