import { getTestNames } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * GET /api/take-home/test-names
 * List all unique test/assessment names
 */
export async function GET() {
  return NextResponse.json(getTestNames());
}
