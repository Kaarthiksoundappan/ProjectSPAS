import { Role, OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
  stock: number;
}

export interface CartState {
  items: CartItem[];
  couponCode?: string;
  couponDiscount: number;
  pointsToRedeem: number;
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface ProductWithCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  images: string[];
  stock: number;
  unit: string;
  isActive: boolean;
  isFeatured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

// ─── Order ────────────────────────────────────────────────────────────────────

export interface OrderWithItems {
  id: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  discount: number;
  pointsUsed: number;
  total: number;
  createdAt: Date;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: Role;
  image: string | null;
  loyaltyPoints: {
    balance: number;
    lifetime: number;
  } | null;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockCount: number;
  revenueChange: number;
  ordersChange: number;
}
