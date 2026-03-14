// String-literal enums for use with SQLite schema.
// These mirror the PostgreSQL enums in prisma/schema.postgresql.prisma.

export const Role = {
  CUSTOMER: "CUSTOMER",
  INVENTORY_MANAGER: "INVENTORY_MANAGER",
  STORE_ADMIN: "STORE_ADMIN",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const OrderStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  READY: "READY",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const PaymentMethod = {
  CARD: "CARD",
  GOOGLE_PAY: "GOOGLE_PAY",
  CASH: "CASH",
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const PaymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
