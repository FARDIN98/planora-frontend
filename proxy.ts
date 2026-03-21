import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Auth checking moved to client-side layout guards (useAuth + redirect)
  // JWT lives in localStorage which is inaccessible from server middleware
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
