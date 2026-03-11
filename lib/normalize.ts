import { parseISO } from "date-fns";

import { csvRowSchema } from "@/lib/schema";
import type {
  BaseEvent,
  BottleFeedEvent,
  BreastfeedEvent,
  DiaperEvent,
  EventType,
  FeedKind,
  GrowthEvent,
  MedicalEvent,
  MilestoneEvent,
  NaraEvent,
  PumpEvent,
  RoutineEvent,
  SleepEvent,
  VaccineEvent,
} from "@/lib/types";

function parseNumber(value: string | undefined) {
  if (!value) return null;
  const normalized = value.replace(",", ".").replace(/[^\d.-]/g, "");
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseEpoch(value: string | undefined) {
  const parsed = parseNumber(value);
  if (parsed == null) return null;
  return parsed > 1e12 ? parsed : parsed * 1000;
}

function normalizeVolumeToMl(value: string | undefined, unit: string | undefined) {
  const parsed = parseNumber(value);
  if (parsed == null) return null;
  const normalizedUnit = (unit ?? "").trim().toLowerCase();
  if (normalizedUnit === "oz" || normalizedUnit === "fl oz") {
    return parsed * 29.5735;
  }
  return parsed;
}

function normalizeWeightKg(value: string | undefined) {
  const parsed = parseNumber(value);
  if (parsed == null) return null;
  return parsed > 30 ? parsed / 1000 : parsed;
}

function normalizeType(type: string): EventType | null {
  const normalized = type.trim();

  switch (normalized) {
    case "Baby First":
      return "Milestone" as const;
    case "Profile":
      return null;
    case "Bottle Feed":
    case "Sleep":
    case "Diaper":
    case "Pump":
    case "Growth":
    case "Routine":
    case "Milestone":
    case "Medical":
    case "Vaccine":
    case "Breastfeed":
      return normalized;
    default:
      return null;
  }
}

function baseEventFromRow(row: Record<string, string>): BaseEvent {
  const startedAt = parseISO(row["Start Date/time"].replace(" ", "T"));
  const type = normalizeType(row.Type);
  const epochMs = parseEpoch(row["Start Date/time (Epoch)"]);

  if (!type) {
    throw new Error(`Unsupported event type: ${row.Type}`);
  }

  return {
    id: row._activityKey,
    type,
    startedAt:
      !Number.isNaN(startedAt.getTime())
        ? startedAt.toISOString()
        : new Date(epochMs ?? Date.now()).toISOString(),
    startedAtEpoch:
      epochMs ??
      (!Number.isNaN(startedAt.getTime()) ? startedAt.getTime() : Date.now()),
    note: row.Note?.trim() || undefined,
  };
}

function normalizeFeedKind(raw: string | undefined): FeedKind {
  const value = (raw ?? "").trim().toLowerCase();
  if (value.includes("formula")) return "formula";
  if (value.includes("breast")) return "breastmilk";
  return "unknown";
}

export function normalizeRow(input: Record<string, string>): NaraEvent | null {
  const parsedRow = csvRowSchema.safeParse(input);
  if (!parsedRow.success) {
    return null;
  }

  const row = parsedRow.data;
  if (!normalizeType(row.Type)) {
    return null;
  }

  const base = baseEventFromRow(row);

  switch (base.type) {
    case "Bottle Feed": {
      const formulaVolumeMl = normalizeVolumeToMl(
        row["[Bottle Feed] Formula Volume"],
        row["[Bottle Feed] Formula Volume Unit"],
      );
      const breastMilkVolumeMl = normalizeVolumeToMl(
        row["[Bottle Feed] Breast Milk Volume"],
        row["[Bottle Feed] Breast Milk Volume Unit"],
      );
      const explicitTotalVolumeMl = normalizeVolumeToMl(
        row["[Bottle Feed] Volume"],
        row["[Bottle Feed] Volume Unit"],
      );
      const totalVolumeMl =
        explicitTotalVolumeMl ??
        ((formulaVolumeMl ?? 0) + (breastMilkVolumeMl ?? 0) || null);

      return {
        ...base,
        type: "Bottle Feed",
        totalVolumeMl,
        formulaVolumeMl,
        breastMilkVolumeMl,
        feedKind: normalizeFeedKind(row["[Bottle Feed] Type"]),
      } satisfies BottleFeedEvent;
    }
    case "Sleep":
      return {
        ...base,
        type: "Sleep",
        durationSeconds: parseNumber(row["[Sleep] Duration (Seconds)"]),
        endAt: row["[Sleep] End Date/time"]
          ? parseISO(row["[Sleep] End Date/time"].replace(" ", "T")).toISOString()
          : null,
      } satisfies SleepEvent;
    case "Diaper":
      return {
        ...base,
        type: "Diaper",
        diaperType: row["[Diaper] Type"]?.trim() || null,
      } satisfies DiaperEvent;
    case "Pump": {
      const totalVolumeMl =
        normalizeVolumeToMl(row["[Pump] Total Volume"], row["[Pump] Total Volume Unit"]) ??
        ((normalizeVolumeToMl(row["[Pump] Left Volume"], row["[Pump] Left Volume Unit"]) ?? 0) +
          (normalizeVolumeToMl(row["[Pump] Right Volume"], row["[Pump] Right Volume Unit"]) ?? 0));

      return {
        ...base,
        type: "Pump",
        totalVolumeMl: totalVolumeMl === 0 ? null : totalVolumeMl,
        durationSeconds: parseNumber(row["[Pump] Duration (Seconds)"]),
      } satisfies PumpEvent;
    }
    case "Growth":
      return {
        ...base,
        type: "Growth",
        weightKg: normalizeWeightKg(row["[Growth] Weight"]),
        heightCm: parseNumber(row["[Growth] Height"]),
        headSizeCm: parseNumber(row["[Growth] Head Size"]),
      } satisfies GrowthEvent;
    case "Routine":
      return {
        ...base,
        type: "Routine",
        routine: row["[Routine] Routine"]?.trim() || null,
      } satisfies RoutineEvent;
    case "Milestone":
      return {
        ...base,
        type: "Milestone",
        babyFirst: row["[Baby First] Baby First"]?.trim() || null,
      } satisfies MilestoneEvent;
    case "Medical":
      return {
        ...base,
        type: "Medical",
        temperatureC: parseNumber(row["[Medical] Temperature"]),
      } satisfies MedicalEvent;
    case "Vaccine":
      return {
        ...base,
        type: "Vaccine",
        vaccine: row["[Vaccine] Vaccine"]?.trim() || null,
      } satisfies VaccineEvent;
    case "Breastfeed": {
      const leftDurationSeconds = parseNumber(row["[Breastfeed] Left Duration (Seconds)"]);
      const rightDurationSeconds = parseNumber(row["[Breastfeed] Right Duration (Seconds)"]);

      return {
        ...base,
        type: "Breastfeed",
        beginSide: row["[Breastfeed] Begin Side"]?.trim() || null,
        endSide: row["[Breastfeed] End Side"]?.trim() || null,
        leftDurationSeconds,
        rightDurationSeconds,
        durationSeconds: (leftDurationSeconds ?? 0) + (rightDurationSeconds ?? 0),
      } satisfies BreastfeedEvent;
    }
    default:
      return null;
  }
}
