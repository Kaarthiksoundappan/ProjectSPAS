import Link from "next/link";
import { Store, MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Store className="h-6 w-6 text-brand-green-600" />
              <span className="font-bold text-brand-green-700">SPAS Super Store</span>
            </div>
            <p className="text-sm text-gray-500">
              Your neighbourhood grocery store for fresh produce, dairy, meat,
              bakery and everyday essentials.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              {[
                { href: "/products", label: "All Products" },
                { href: "/products?category=fresh-produce", label: "Fresh Produce" },
                { href: "/products?category=dairy-eggs", label: "Dairy & Eggs" },
                { href: "/products?category=meat-seafood", label: "Meat & Seafood" },
                { href: "/products?category=bakery", label: "Bakery" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-brand-green-700">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Account</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              {[
                { href: "/account", label: "My Account" },
                { href: "/account/orders", label: "Order History" },
                { href: "/account/loyalty", label: "Loyalty Points" },
                { href: "/account/wishlist", label: "Wishlist" },
                { href: "/store", label: "Store Info" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-brand-green-700">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-600" />
                <a
                  href="https://maps.app.goo.gl/wUfHXHs8LzEx6WXdA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-green-700"
                >
                  View on Google Maps
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-brand-green-600" />
                <Link href="/store" className="hover:text-brand-green-700">
                  See store contact
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-brand-green-600" />
                <Link href="/store#contact" className="hover:text-brand-green-700">
                  Send us a message
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-brand-green-600" />
                <Link href="/store#hours" className="hover:text-brand-green-700">
                  Opening hours
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} SPAS Super Store. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-600">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
