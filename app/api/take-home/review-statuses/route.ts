import { reviewStatuses } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * GET /api/take-home/review-statuses
 * List all review statuses
 */
export async function GET() {
  return NextResponse.json(reviewStatuses);
}
