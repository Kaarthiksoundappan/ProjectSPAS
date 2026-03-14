import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductForm } from "@/app/admin/products/_components/ProductForm";

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "STORE_ADMIN") redirect("/admin");

  const categories = await db.category.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
          <p className="text-sm text-gray-500">Create a new product listing</p>
        </div>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
