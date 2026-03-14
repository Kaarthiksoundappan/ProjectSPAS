import { db } from "@/lib/db";
import { OrderStatus } from "@/types/enums";
import { ShoppingBag } from "lucide-react";

interface SearchParams {
  status?: string;
}

const STATUS_TABS: { label: string; value: OrderStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Ready", value: "READY" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  READY: "bg-purple-100 text-purple-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

async function getOrders(statusFilter?: string) {
  const where = statusFilter && statusFilter !== "ALL"
    ? { status: statusFilter as OrderStatus }
    : {};

  return db.order.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      items: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export default async function AdminOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const orders = await getOrders(searchParams.status);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">{orders.length} orders</p>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <a
            key={tab.value}
            href={tab.value === "ALL" ? "/admin/orders" : `/admin/orders?status=${tab.value}`}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              (searchParams.status ?? "ALL") === tab.value
                ? "border-brand-green-500 bg-brand-green-50 text-brand-green-700 font-medium"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Table */}
      {orders.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <ShoppingBag className="mx-auto mb-3 h-10 w-10 opacity-40" />
          <p className="text-sm">No orders found.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Items</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">
                    #{order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{order.user.name ?? "—"}</p>
                    <p className="text-xs text-gray-400">{order.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{order.items.length}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      order.paymentStatus === "PAID" ? "bg-green-100 text-green-700" :
                      order.paymentStatus === "FAILED" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {order.paymentMethod} · {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    ₹{Number(order.total).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status as OrderStatus] ?? "bg-gray-100 text-gray-600"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {/* Status update form — simplified inline select */}
                    <form action={`/api/admin/orders/${order.id}`} method="POST">
                      <select
                        name="status"
                        defaultValue={order.status}
                        className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-600 bg-white"
                      >
                        {(["PENDING", "CONFIRMED", "READY", "COMPLETED", "CANCELLED"] as OrderStatus[]).map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
