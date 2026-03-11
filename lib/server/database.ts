import "server-only";

import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const dataDir = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), "data");
const databasePath = path.join(dataDir, "unara-insights.sqlite");

let database: DatabaseSync | null = null;

function initializeDatabase() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const db = new DatabaseSync(databasePath);
  db.exec(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      started_at TEXT NOT NULL,
      started_at_epoch INTEGER NOT NULL,
      event_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS metadata (
      id TEXT PRIMARY KEY,
      sex TEXT,
      birth_date TEXT
    );
  `);

  return db;
}

export function getDatabase() {
  if (!database) {
    database = initializeDatabase();
  }

  return database;
}

export function getDatabasePath() {
  return databasePath;
}
