export const EVENT_TYPES = [
  "Bottle Feed",
  "Sleep",
  "Diaper",
  "Pump",
  "Growth",
  "Routine",
  "Milestone",
  "Medical",
  "Vaccine",
  "Breastfeed",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export type FeedKind = "formula" | "breastmilk" | "unknown";

export interface BaseEvent {
  id: string;
  type: EventType;
  startedAt: string;
  startedAtEpoch: number;
  note?: string;
}

export interface BottleFeedEvent extends BaseEvent {
  type: "Bottle Feed";
  totalVolumeMl: number | null;
  formulaVolumeMl: number | null;
  breastMilkVolumeMl: number | null;
  feedKind: FeedKind;
}

export interface SleepEvent extends BaseEvent {
  type: "Sleep";
  durationSeconds: number | null;
  endAt: string | null;
}

export interface DiaperEvent extends BaseEvent {
  type: "Diaper";
  diaperType: string | null;
}

export interface PumpEvent extends BaseEvent {
  type: "Pump";
  totalVolumeMl: number | null;
  durationSeconds: number | null;
}

export interface GrowthEvent extends BaseEvent {
  type: "Growth";
  weightKg: number | null;
  heightCm: number | null;
  headSizeCm: number | null;
}

export interface RoutineEvent extends BaseEvent {
  type: "Routine";
  routine: string | null;
}

export interface MilestoneEvent extends BaseEvent {
  type: "Milestone";
  babyFirst: string | null;
}

export interface MedicalEvent extends BaseEvent {
  type: "Medical";
  temperatureC: number | null;
}

export interface VaccineEvent extends BaseEvent {
  type: "Vaccine";
  vaccine: string | null;
}

export interface BreastfeedEvent extends BaseEvent {
  type: "Breastfeed";
  beginSide: string | null;
  endSide: string | null;
  leftDurationSeconds: number | null;
  rightDurationSeconds: number | null;
  durationSeconds: number | null;
}

export type NaraEvent =
  | BottleFeedEvent
  | SleepEvent
  | DiaperEvent
  | PumpEvent
  | GrowthEvent
  | RoutineEvent
  | MilestoneEvent
  | MedicalEvent
  | VaccineEvent
  | BreastfeedEvent;

export interface ImportSummary {
  inserted: number;
  updated: number;
  deleted: number;
  errors: number;
  totalRows: number;
}

export interface TrendPoint {
  label: string;
  value: number;
}

export interface DistributionPoint {
  hour: string;
  value: number;
}

export interface InsightItem {
  title: string;
  detail: string;
}

export interface ProfileMetadata {
  id: "profile";
  sex: "MALE" | "FEMALE" | null;
  birthDate: string | null;
}
