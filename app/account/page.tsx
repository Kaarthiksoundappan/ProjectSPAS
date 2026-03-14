import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  User, ShoppingBag, MapPin, Heart, Star, Award, ChevronRight,
} from "lucide-react";

async function getUserData(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    include: {
      loyaltyPoints: true,
      orders: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { items: true },
      },
    },
  });
}

const MENU_ITEMS = [
  { href: "/account/orders", label: "Order History", icon: ShoppingBag, desc: "Track and manage your orders" },
  { href: "/account/loyalty", label: "Loyalty Points", icon: Award, desc: "View points balance and history" },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart, desc: "Your saved products" },
  { href: "/account/addresses", label: "Saved Addresses", icon: MapPin, desc: "Manage delivery addresses" },
  { href: "/account/reviews", label: "My Reviews", icon: Star, desc: "Reviews you have written" },
];

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await getUserData(session.user.id);
  if (!user) redirect("/login");

  const loyaltyBalance = user.loyaltyPoints?.balance ?? 0;
  const loyaltyLifetime = user.loyaltyPoints?.lifetime ?? 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">My Account</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <div className="card p-6 flex flex-col items-center text-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-green-100">
            <User className="h-8 w-8 text-brand-green-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user.name ?? "Customer"}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            {user.phone && <p className="text-sm text-gray-500">{user.phone}</p>}
          </div>
          <span className="badge-green capitalize">{user.role.toLowerCase().replace("_", " ")}</span>
        </div>

        {/* Loyalty points card */}
        <div className="card overflow-hidden lg:col-span-2">
          <div className="bg-gradient-to-r from-brand-green-700 to-brand-green-500 p-5 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-5 w-5" />
              <span className="font-semibold">Loyalty Points</span>
            </div>
            <p className="text-4xl font-bold">{loyaltyBalance.toLocaleString()}</p>
            <p className="text-sm text-brand-green-100 mt-1">
              ${(loyaltyBalance * 0.01).toFixed(2)} redeemable value
            </p>
          </div>
          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Lifetime earned</p>
              <p className="font-semibold text-gray-900">{loyaltyLifetime.toLocaleString()} pts</p>
            </div>
            <Link href="/account/loyalty" className="btn-secondary text-sm">
              View History
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <Link href="/account/orders" className="text-sm text-brand-green-600 hover:underline">
            View all
          </Link>
        </div>

        {user.orders.length === 0 ? (
          <div className="card p-8 text-center text-gray-400">
            <ShoppingBag className="mx-auto mb-3 h-10 w-10 opacity-40" />
            <p className="text-sm">No orders yet. Start shopping!</p>
            <Link href="/products" className="mt-3 inline-block btn-primary text-sm">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="card divide-y divide-gray-100">
            {user.orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""} &middot;{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900">
                    ${Number(order.total).toFixed(2)}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    order.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                    order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {order.status}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Menu Links */}
      <div className="mt-8 card divide-y divide-gray-100">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green-50">
              <item.icon className="h-5 w-5 text-brand-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}
