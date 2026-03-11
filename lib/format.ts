import { format, formatDistanceToNowStrict, isValid, parseISO } from "date-fns";

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "Unknown time";
  const parsed = parseISO(value);
  return isValid(parsed) ? format(parsed, "MMM d, yyyy HH:mm") : value;
}

export function formatShortDate(value: string | null | undefined) {
  if (!value) return "Unknown";
  const parsed = parseISO(value);
  return isValid(parsed) ? format(parsed, "MMM d") : value;
}

export function formatRelative(value: string | null | undefined) {
  if (!value) return "Unknown";
  const parsed = parseISO(value);
  return isValid(parsed) ? formatDistanceToNowStrict(parsed, { addSuffix: true }) : value;
}

export function formatDurationFromSeconds(seconds: number | null | undefined) {
  if (!seconds || Number.isNaN(seconds)) return "0m";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

export function formatVolumeMl(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "0 ml";
  return `${Math.round(value)} ml`;
}

export function formatWeightKg(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "No data";
  return `${value.toFixed(2)} kg`;
}

export function formatLengthCm(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "No data";
  return `${value.toFixed(1)} cm`;
}
