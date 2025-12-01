import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { ids, reviewStatusId } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "ids array is required" },
        { status: 400 }
      );
    }

    if (ids.length > 100) {
      return NextResponse.json(
        { error: "Maximum 100 items per batch" },
        { status: 400 }
      );
    }

    if (reviewStatusId !== null && reviewStatusId !== undefined) {
      const status = await db.reviewStatuses.findById(reviewStatusId);
      if (!status) {
        return NextResponse.json(
          { error: "Invalid review status" },
          { status: 400 }
        );
      }
    }

    let count = 0;
    await db.transaction(async () => {
      count = await db.responses.updateMany(ids, {
        reviewStatusId: reviewStatusId ?? null,
      });
    });

    return NextResponse.json({ success: true, updated: count });
  } catch (error) {
    console.error("Bulk status update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update status" },
      { status: 500 }
    );
  }
}

