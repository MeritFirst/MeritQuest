/**
 * DO NOT MODIFY THIS FILE
 *
 * Middleware that enforces tenant header validation for API routes.
 * This is provided for the mock data layer infrastructure.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { REQUIRED_TENANT } from "./lib/data";

export function middleware(request: NextRequest) {
  const tenant = request.headers.get("x-tenant");

  if (!tenant || tenant !== REQUIRED_TENANT) {
    return NextResponse.json(
      {
        error: "Missing or invalid x-tenant header",
        required: REQUIRED_TENANT,
      },
      { status: 403 },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
