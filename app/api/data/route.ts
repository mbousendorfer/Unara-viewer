import { NextResponse } from "next/server";

import { clearAllData, getProfileMetadata, listEvents } from "@/lib/server/repository";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    events: listEvents(),
    profile: getProfileMetadata(),
  });
}

export async function DELETE() {
  clearAllData();

  return NextResponse.json({
    ok: true,
  });
}
