import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has("better-auth.session_token");

  // Protected routes: redirect unauthenticated users to /login
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    if (!hasSession) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Auth pages: redirect authenticated users to /dashboard
  if (pathname === "/login" || pathname === "/register") {
    if (hasSession) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
