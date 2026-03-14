import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const CATEGORIES = [
  { name: "Fresh Produce",   slug: "fresh-produce",   sortOrder: 1 },
  { name: "Dairy & Eggs",    slug: "dairy-eggs",       sortOrder: 2 },
  { name: "Meat & Seafood",  slug: "meat-seafood",     sortOrder: 3 },
  { name: "Bakery",          slug: "bakery",           sortOrder: 4 },
  { name: "Beverages",       slug: "beverages",        sortOrder: 5 },
  { name: "Household Items", slug: "household-items",  sortOrder: 6 },
];

const PRODUCTS = [
  // Fresh Produce
  { name: "Fresh Tomatoes",       slug: "fresh-tomatoes",       categorySlug: "fresh-produce",  price: 30,   comparePrice: 40,  stock: 100, unit: "kg",    isFeatured: true,  description: "Farm-fresh, ripe red tomatoes. Perfect for salads, curries and chutneys." },
  { name: "Baby Spinach",         slug: "baby-spinach",         categorySlug: "fresh-produce",  price: 45,   comparePrice: null, stock: 60, unit: "250g",  isFeatured: false, description: "Tender baby spinach leaves, washed and ready to use." },
  { name: "Bananas",              slug: "bananas",              categorySlug: "fresh-produce",  price: 50,   comparePrice: 60,  stock: 80, unit: "dozen", isFeatured: true,  description: "Sweet and ripe Robusta bananas, great for snacking and smoothies." },
  { name: "Onions",               slug: "onions",               categorySlug: "fresh-produce",  price: 25,   comparePrice: null, stock: 150, unit: "kg",   isFeatured: false, description: "Fresh red onions, a kitchen staple for every Indian dish." },
  { name: "Potatoes",             slug: "potatoes",             categorySlug: "fresh-produce",  price: 20,   comparePrice: null, stock: 200, unit: "kg",   isFeatured: false, description: "Fresh local potatoes, perfect for frying, boiling and curries." },

  // Dairy & Eggs
  { name: "Full Cream Milk",      slug: "full-cream-milk",      categorySlug: "dairy-eggs",     price: 68,   comparePrice: null, stock: 50, unit: "litre", isFeatured: true,  description: "Fresh and creamy full-fat milk. Pasteurised and homogenised." },
  { name: "Farm Eggs",            slug: "farm-eggs",            categorySlug: "dairy-eggs",     price: 85,   comparePrice: 95,  stock: 120, unit: "12 pcs", isFeatured: true, description: "Fresh free-range eggs from local farms. Rich in protein." },
  { name: "Salted Butter",        slug: "salted-butter",        categorySlug: "dairy-eggs",     price: 55,   comparePrice: null, stock: 40, unit: "100g",  isFeatured: false, description: "Creamy salted butter made from pasteurised milk." },
  { name: "Paneer",               slug: "paneer",               categorySlug: "dairy-eggs",     price: 90,   comparePrice: 100, stock: 35, unit: "200g",  isFeatured: false, description: "Soft and fresh cottage cheese, ideal for curries and snacks." },

  // Meat & Seafood
  { name: "Chicken Breast",       slug: "chicken-breast",       categorySlug: "meat-seafood",   price: 220,  comparePrice: 260, stock: 30, unit: "500g",  isFeatured: true,  description: "Fresh boneless chicken breast, trimmed and cleaned." },
  { name: "Rohu Fish",            slug: "rohu-fish",            categorySlug: "meat-seafood",   price: 180,  comparePrice: null, stock: 25, unit: "500g",  isFeatured: false, description: "Fresh Rohu fish, cleaned and cut into pieces. A popular Indian freshwater fish." },

  // Bakery
  { name: "Whole Wheat Bread",    slug: "whole-wheat-bread",    categorySlug: "bakery",         price: 45,   comparePrice: null, stock: 40, unit: "loaf",  isFeatured: true,  description: "Freshly baked 100% whole wheat bread with no preservatives." },
  { name: "Butter Croissant",     slug: "butter-croissant",     categorySlug: "bakery",         price: 35,   comparePrice: null, stock: 30, unit: "each",  isFeatured: false, description: "Flaky and buttery croissant baked fresh every morning." },
  { name: "Chocolate Muffin",     slug: "chocolate-muffin",     categorySlug: "bakery",         price: 40,   comparePrice: 50,  stock: 24, unit: "each",  isFeatured: false, description: "Moist chocolate muffin with chocolate chips baked fresh daily." },

  // Beverages
  { name: "Orange Juice (Fresh)", slug: "orange-juice-fresh",   categorySlug: "beverages",      price: 80,   comparePrice: null, stock: 20, unit: "500ml", isFeatured: true,  description: "Cold-pressed fresh orange juice with no added sugar or preservatives." },
  { name: "Coconut Water",        slug: "coconut-water",        categorySlug: "beverages",      price: 45,   comparePrice: null, stock: 50, unit: "330ml", isFeatured: false, description: "Natural tender coconut water, refreshing and full of electrolytes." },
  { name: "Masala Chai Mix",      slug: "masala-chai-mix",      categorySlug: "beverages",      price: 120,  comparePrice: 140, stock: 35, unit: "200g",  isFeatured: false, description: "Aromatic spiced tea blend with cardamom, ginger and cinnamon." },

  // Household
  { name: "Dish Wash Liquid",     slug: "dish-wash-liquid",     categorySlug: "household-items", price: 99,  comparePrice: 120, stock: 60, unit: "500ml", isFeatured: false, description: "Effective grease-cutting dish wash liquid. Gentle on hands." },
  { name: "Paper Towels",         slug: "paper-towels",         categorySlug: "household-items", price: 75,  comparePrice: null, stock: 80, unit: "2 rolls", isFeatured: false, description: "Strong and absorbent paper towels for everyday kitchen use." },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Upsert categories
  for (const cat of CATEGORIES) {
    await db.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    console.log(`  ✔ Category: ${cat.name}`);
  }

  // Upsert products
  for (const p of PRODUCTS) {
    const { categorySlug, ...data } = p;
    const category = await db.category.findUniqueOrThrow({ where: { slug: categorySlug } });

    await db.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        images: [],
        categoryId: category.id,
      },
    });
    console.log(`  ✔ Product: ${data.name}`);
  }

  console.log("\n✅ Seed complete — 6 categories, 19 products.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
