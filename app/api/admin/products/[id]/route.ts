import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "STORE_ADMIN") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const {
      name, slug, description, price, comparePrice,
      categoryId, stock, unit, isActive, isFeatured, images,
    } = body;

    const product = await db.product.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
        price,
        comparePrice: comparePrice || null,
        categoryId,
        stock: stock ?? 0,
        unit: unit || "each",
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        images: images ?? [],
      },
    });

    return NextResponse.json(product);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    console.error("[PRODUCTS PUT]", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "STORE_ADMIN") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 403 });
  }

  const { id } = await params;

  try {
    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PRODUCTS DELETE]", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
