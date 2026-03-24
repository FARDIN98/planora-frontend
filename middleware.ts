import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Decode JWT payload without verification (Edge-compatible).
 * Real auth validation happens on the backend — this is purely for route gating.
 */
function decodePayload(token: string) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function isExpired(payload: { exp: number }) {
  return payload.exp * 1000 < Date.now();
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  // ── Protected routes: require valid token ──────────────────────
  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const payload = decodePayload(token);
    if (!payload || isExpired(payload)) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }

    // Admin routes: require admin role
    if (isAdminRoute && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // ── Auth routes: redirect to dashboard if already logged in ───
  if (isAuthRoute && token) {
    const payload = decodePayload(token);
    if (payload && !isExpired(payload)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
