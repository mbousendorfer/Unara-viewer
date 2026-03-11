import Papa from "papaparse";

import { normalizeRow } from "@/lib/normalize";
import { syncEventsToDatabase } from "@/lib/server/repository";
import type { ImportSummary, NaraEvent, ProfileMetadata } from "@/lib/types";

function normalizeProfileSex(value: string | undefined): ProfileMetadata["sex"] {
  return value === "MALE" || value === "FEMALE" ? value : null;
}

export async function importCsv(file: File): Promise<ImportSummary> {
  const csvText = await file.text();
  const { events, profile } = await parseCsv(csvText);
  const syncSummary = syncEventsToDatabase(events, profile);

  return {
    inserted: syncSummary.inserted,
    updated: syncSummary.updated,
    deleted: syncSummary.deleted,
    errors: 0,
    totalRows: events.length,
  };
}

function parseCsv(csvText: string) {
  return new Promise<{ events: NaraEvent[]; profile: ProfileMetadata | null }>((resolve, reject) => {
    Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        try {
          const events = results.data
            .map((row) => normalizeRow(row))
            .filter((row): row is NaraEvent => row !== null);
          const profileRow = results.data.find((row) => row.Type === "Profile");
          const profile = profileRow
            ? {
                id: "profile" as const,
                sex: normalizeProfileSex(profileRow["[Profile] Sex"]),
                birthDate:
                  profileRow["[Profile] Birth Date (Adjusted)"]?.trim() ||
                  profileRow["[Profile] Birth Date"]?.trim() ||
                  null,
              }
            : null;
          resolve({ events, profile });
        } catch (error) {
          reject(error);
        }
      },
      error(error: Error) {
        reject(error);
      },
    });
  });
}
