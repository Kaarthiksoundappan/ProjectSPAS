import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import {
  ShoppingBag, Users, Package, TrendingUp, AlertTriangle, DollarSign,
} from "lucide-react";

async function getDashboardStats() {
  const [
    totalOrders,
    pendingOrders,
    totalCustomers,
    lowStockProducts,
    recentOrders,
  ] = await Promise.all([
    db.order.count(),
    db.order.count({ where: { status: "PENDING" } }),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.product.count({ where: { stock: { lte: 5 }, isActive: true } }),
    db.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } }, items: true },
    }),
  ]);

  const revenue = await db.order.aggregate({
    _sum: { total: true },
    where: { paymentStatus: "PAID" },
  });

  return {
    totalOrders,
    pendingOrders,
    totalCustomers,
    lowStockProducts,
    totalRevenue: Number(revenue._sum.total ?? 0),
    recentOrders,
  };
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  const stats = await getDashboardStats();
  const isAdmin = session?.user.role === "STORE_ADMIN";

  const STAT_CARDS = [
    ...(isAdmin ? [
      { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-brand-green-600 bg-brand-green-50" },
      { label: "Total Customers", value: stats.totalCustomers.toString(), icon: Users, color: "text-blue-600 bg-blue-50" },
    ] : []),
    { label: "Total Orders", value: stats.totalOrders.toString(), icon: ShoppingBag, color: "text-purple-600 bg-purple-50" },
    { label: "Pending Orders", value: stats.pendingOrders.toString(), icon: TrendingUp, color: "text-yellow-600 bg-yellow-50" },
    { label: "Low Stock Items", value: stats.lowStockProducts.toString(), icon: AlertTriangle, color: "text-red-600 bg-red-50", href: "/admin/products?filter=low-stock" },
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {session?.user.name?.split(" ")[0]}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {STAT_CARDS.map((card) => (
          <div key={card.label} className="card p-5">
            <div className={`inline-flex rounded-lg p-2 ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Low stock alert */}
      {stats.lowStockProducts > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800">
              {stats.lowStockProducts} product{stats.lowStockProducts !== 1 ? "s" : ""} running low on stock
            </p>
            <Link href="/admin/products?filter=low-stock" className="text-xs text-yellow-700 underline">
              View products
            </Link>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-brand-green-600 hover:underline">
            View all
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="card p-8 text-center text-gray-400 text-sm">
            No orders yet.
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-gray-800">{order.user.name ?? order.user.email}</td>
                    <td className="px-4 py-3 text-gray-500">{order.items.length}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      ${Number(order.total).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        order.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                        order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                        order.status === "CONFIRMED" ? "bg-blue-100 text-blue-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Link href="/admin/products/new" className="card p-5 flex items-center gap-3 hover:border-brand-green-300 transition">
          <Package className="h-5 w-5 text-brand-green-600" />
          <span className="text-sm font-medium text-gray-700">Add Product</span>
        </Link>
        <Link href="/admin/orders" className="card p-5 flex items-center gap-3 hover:border-brand-green-300 transition">
          <ShoppingBag className="h-5 w-5 text-brand-green-600" />
          <span className="text-sm font-medium text-gray-700">Manage Orders</span>
        </Link>
        {isAdmin && (
          <Link href="/admin/promotions/new" className="card p-5 flex items-center gap-3 hover:border-brand-green-300 transition">
            <TrendingUp className="h-5 w-5 text-brand-green-600" />
            <span className="text-sm font-medium text-gray-700">Add Promotion</span>
          </Link>
        )}
      </div>
    </div>
  );
}
