import { getStats } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * GET /api/take-home/stats
 * Get aggregate statistics about the dataset
 */
export async function GET() {
  return NextResponse.json(getStats());
}
