import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Admin routes — require STORE_ADMIN or INVENTORY_MANAGER
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "STORE_ADMIN" && token?.role !== "INVENTORY_MANAGER") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Staff-only admin routes — require STORE_ADMIN only
    const storeAdminOnlyPaths = [
      "/admin/staff",
      "/admin/customers",
      "/admin/promotions",
      "/admin/products/new",
      "/admin/products/",   // covers /admin/products/[id]/edit
    ];
    if (storeAdminOnlyPaths.some((p) => pathname.startsWith(p))) {
      if (token?.role !== "STORE_ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Protect account and checkout routes — must be logged in
        if (pathname.startsWith("/account") || pathname.startsWith("/checkout")) {
          return !!token;
        }

        // Admin routes — must be logged in (role check handled above)
        if (pathname.startsWith("/admin")) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/account/:path*", "/checkout/:path*", "/admin/:path*"],
};
