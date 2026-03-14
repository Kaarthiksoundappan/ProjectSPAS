import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag, BarChart3, Settings,
} from "lucide-react";

const ALL_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["STORE_ADMIN", "INVENTORY_MANAGER"] },
  { href: "/admin/products", label: "Products", icon: Package, roles: ["STORE_ADMIN", "INVENTORY_MANAGER"] },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, roles: ["STORE_ADMIN", "INVENTORY_MANAGER"] },
  { href: "/admin/customers", label: "Customers", icon: Users, roles: ["STORE_ADMIN"] },
  { href: "/admin/promotions", label: "Promotions", icon: Tag, roles: ["STORE_ADMIN"] },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3, roles: ["STORE_ADMIN"] },
  { href: "/admin/staff", label: "Staff", icon: Settings, roles: ["STORE_ADMIN"] },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "STORE_ADMIN" && session.user.role !== "INVENTORY_MANAGER")) {
    redirect("/");
  }

  const role = session.user.role;
  const navItems = ALL_NAV.filter((item) => item.roles.includes(role));

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-gray-200 bg-gray-50 lg:flex lg:flex-col">
        <div className="p-4 border-b border-gray-200">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Admin Panel</p>
          <p className="mt-1 text-sm font-medium text-gray-800">
            {role === "STORE_ADMIN" ? "Store Admin" : "Inventory Manager"}
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-brand-green-700 hover:shadow-sm"
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
