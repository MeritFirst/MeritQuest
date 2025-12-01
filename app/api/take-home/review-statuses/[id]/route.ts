import { findReviewStatusById } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/take-home/review-statuses/:id
 * Get a single review status by ID
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const status = findReviewStatusById(id);

  if (!status) {
    return NextResponse.json(
      { error: "Review status not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(status);
}
