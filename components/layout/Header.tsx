"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, Menu, X, Store } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/products", label: "Shop" },
  { href: "/store", label: "Store Info" },
];

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Store className="h-7 w-7 text-brand-green-600" />
            <span className="text-lg font-bold text-brand-green-700">
              SPAS Super Store
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-brand-green-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-brand-green-700"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>

            {/* Auth */}
            {session ? (
              <div className="relative hidden md:flex items-center gap-3">
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <User className="h-4 w-4" />
                  {session.user.name?.split(" ")[0] ?? "Account"}
                </Link>
                {(session.user.role === "STORE_ADMIN" ||
                  session.user.role === "INVENTORY_MANAGER") && (
                  <Link href="/admin" className="btn-secondary text-xs px-3 py-1.5">
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-gray-500 hover:text-red-600"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="btn-secondary">
                  Sign in
                </Link>
                <Link href="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm font-medium text-gray-700 hover:text-brand-green-700"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-gray-200" />
          {session ? (
            <>
              <Link
                href="/account"
                className="block text-sm font-medium text-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                My Account
              </Link>
              {(session.user.role === "STORE_ADMIN" ||
                session.user.role === "INVENTORY_MANAGER") && (
                <Link
                  href="/admin"
                  className="block text-sm font-medium text-gray-700"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="block text-sm text-red-600"
              >
                Sign out
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="btn-secondary flex-1 text-center">
                Sign in
              </Link>
              <Link href="/register" className="btn-primary flex-1 text-center">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
