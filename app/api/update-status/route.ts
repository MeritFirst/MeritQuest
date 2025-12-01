import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { responseId, reviewStatusId } = await request.json();

    if (!responseId) {
      return NextResponse.json(
        { error: "responseId is required" },
        { status: 400 }
      );
    }

    const count = await db.responses.update(responseId, {
      reviewStatusId: reviewStatusId || null,
    });

    if (count === 0) {
      return NextResponse.json(
        { error: "Response not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, updated: count });
  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}

