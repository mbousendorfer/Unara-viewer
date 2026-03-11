import "server-only";

import type { NaraEvent, ProfileMetadata } from "@/lib/types";
import { getDatabase } from "@/lib/server/database";

export function listEvents() {
  const db = getDatabase();
  const rows = db
    .prepare("SELECT event_json FROM events ORDER BY started_at_epoch DESC")
    .all() as Array<{ event_json: string }>;

  return rows.map((row) => JSON.parse(row.event_json) as NaraEvent);
}

export function getProfileMetadata() {
  const db = getDatabase();
  const row = db
    .prepare("SELECT id, sex, birth_date FROM metadata WHERE id = 'profile'")
    .get() as { id: string; sex: ProfileMetadata["sex"]; birth_date: string | null } | undefined;

  if (!row) {
    return null;
  }

  return {
    id: "profile",
    sex: row.sex ?? null,
    birthDate: row.birth_date ?? null,
  } satisfies ProfileMetadata;
}

export function syncEventsToDatabase(events: NaraEvent[], profile: ProfileMetadata | null) {
  const db = getDatabase();

  const existingIds = new Set(
    (db.prepare("SELECT id FROM events").all() as Array<{ id: string }>).map((row) => row.id),
  );
  const incomingIds = new Set(events.map((event) => event.id));

  let inserted = 0;
  let updated = 0;

  const upsertEvent = db.prepare(`
    INSERT INTO events (id, type, started_at, started_at_epoch, event_json)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      type = excluded.type,
      started_at = excluded.started_at,
      started_at_epoch = excluded.started_at_epoch,
      event_json = excluded.event_json
  `);

  const deleteMissing = db.prepare("DELETE FROM events WHERE id = ?");
  const replaceProfile = db.prepare(`
    INSERT INTO metadata (id, sex, birth_date)
    VALUES ('profile', ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      sex = excluded.sex,
      birth_date = excluded.birth_date
  `);
  const clearProfile = db.prepare("DELETE FROM metadata WHERE id = 'profile'");

  db.exec("BEGIN");

  try {
    for (const event of events) {
      if (existingIds.has(event.id)) {
        updated += 1;
      } else {
        inserted += 1;
      }

      upsertEvent.run(
        event.id,
        event.type,
        event.startedAt,
        event.startedAtEpoch,
        JSON.stringify(event),
      );
    }

    let deleted = 0;
    for (const id of existingIds) {
      if (!incomingIds.has(id)) {
        deleteMissing.run(id);
        deleted += 1;
      }
    }

    if (profile) {
      replaceProfile.run(profile.sex, profile.birthDate);
    } else {
      clearProfile.run();
    }

    db.exec("COMMIT");

    return {
      inserted,
      updated,
      deleted,
    };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function clearAllData() {
  const db = getDatabase();

  db.exec("BEGIN");

  try {
    db.prepare("DELETE FROM events").run();
    db.prepare("DELETE FROM metadata").run();
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
