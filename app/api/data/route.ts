import { NextResponse } from "next/server";

import { listEvents, getProfileMetadata } from "@/lib/server/repository";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    events: listEvents(),
    profile: getProfileMetadata(),
  });
}
