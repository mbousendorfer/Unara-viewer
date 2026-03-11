import { NextResponse } from "next/server";

import { importCsv } from "@/lib/import-csv";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing CSV file." }, { status: 400 });
  }

  try {
    const summary = await importCsv(file);
    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to import CSV.",
      },
      { status: 500 },
    );
  }
}
