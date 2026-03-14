import Link from "next/link";
import { ShoppingBag, Star, Truck, Shield, Tag } from "lucide-react";

const CATEGORIES = [
  { name: "Fresh Produce", slug: "fresh-produce", emoji: "🥦" },
  { name: "Dairy & Eggs", slug: "dairy-eggs", emoji: "🥛" },
  { name: "Meat & Seafood", slug: "meat-seafood", emoji: "🥩" },
  { name: "Bakery", slug: "bakery", emoji: "🍞" },
  { name: "Beverages", slug: "beverages", emoji: "🧃" },
  { name: "Household", slug: "household-items", emoji: "🧹" },
];

const FEATURES = [
  {
    icon: ShoppingBag,
    title: "Wide Selection",
    desc: "Thousands of products across all grocery categories.",
  },
  {
    icon: Star,
    title: "Loyalty Rewards",
    desc: "Earn points on every purchase and redeem for discounts.",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    desc: "Fresh products sourced from trusted local suppliers.",
  },
  {
    icon: Tag,
    title: "Weekly Deals",
    desc: "New promotions and coupons every week.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-green-700 to-brand-green-500 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Fresh Groceries,
              <br />
              Right at Your Door
            </h1>
            <p className="mt-4 text-lg text-brand-green-100">
              Shop from thousands of fresh, quality products at SPAS Super
              Store. Earn loyalty points with every order.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/products" className="btn-primary bg-white text-brand-green-700 hover:bg-brand-green-50">
                Shop Now
              </Link>
              <Link href="/register" className="btn-secondary border-white text-white bg-transparent hover:bg-white hover:text-brand-green-700">
                Join & Earn Points
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="card flex flex-col items-center gap-3 p-5 text-center transition hover:border-brand-green-300 hover:shadow-md"
            >
              <span className="text-4xl">{cat.emoji}</span>
              <span className="text-sm font-medium text-gray-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products placeholder */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link href="/products?featured=true" className="text-sm font-medium text-brand-green-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center text-gray-400">
          <ShoppingBag className="mx-auto mb-3 h-10 w-10 opacity-40" />
          <p className="text-sm">Featured products will appear here once added via the Admin Panel.</p>
        </div>
      </section>

      {/* Weekly Deals placeholder */}
      <section className="bg-brand-green-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Weekly Deals</h2>
            <Link href="/products?deals=true" className="text-sm font-medium text-brand-green-600 hover:underline">
              See all deals
            </Link>
          </div>
          <div className="rounded-xl border-2 border-dashed border-brand-green-200 bg-white p-12 text-center text-gray-400">
            <Tag className="mx-auto mb-3 h-10 w-10 opacity-40" />
            <p className="text-sm">Weekly deals and promotions will be shown here.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
          Why Shop With Us?
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6 text-center">
              <f.icon className="mx-auto mb-3 h-8 w-8 text-brand-green-600" />
              <h3 className="mb-1 font-semibold text-gray-900">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Loyalty CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="card overflow-hidden bg-gradient-to-r from-brand-green-700 to-brand-green-500 p-8 text-white sm:p-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold">Join Our Loyalty Program</h2>
              <p className="mt-2 text-brand-green-100">
                Earn 10 points for every $1 spent. Redeem for discounts on your next order.
              </p>
            </div>
            <Link
              href="/register"
              className="btn-primary shrink-0 bg-white text-brand-green-700 hover:bg-brand-green-50"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
