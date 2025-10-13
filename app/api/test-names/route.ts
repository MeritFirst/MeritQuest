import { NextResponse } from "next/server";
import { getTestNames } from "@/lib/data";

/**
 * API Route that returns unique test names.
 *
 * Note: Requires 'x-tenant: demo-employer' header.
 */
export async function GET() {
  const testNames = await getTestNames();
  return NextResponse.json({ testNames });
}
