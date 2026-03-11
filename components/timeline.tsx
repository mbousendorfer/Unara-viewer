"use client";

import { useMemo, useState } from "react";
import { Droplets, Milk, MoonStar, Ruler, Syringe } from "lucide-react";
import { endOfDay, format, isAfter, isBefore, parseISO, startOfDay } from "date-fns";

import { Input } from "@/components/ui/input";
import { formatDurationFromSeconds, formatShortDate, formatVolumeMl } from "@/lib/format";
import { EVENT_TYPES, type BottleFeedEvent, type EventType, type NaraEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

function eventIcon(type: EventType) {
  switch (type) {
    case "Bottle Feed":
      return Milk;
    case "Sleep":
      return MoonStar;
    case "Diaper":
      return Droplets;
    case "Growth":
      return Ruler;
    default:
      return Syringe;
  }
}

function eventTone(type: EventType) {
  switch (type) {
    case "Bottle Feed":
      return {
        icon: "bg-tone-feed/16 text-tone-feed-foreground",
        dot: "bg-tone-feed",
      };
    case "Sleep":
      return {
        icon: "bg-tone-sleep/16 text-tone-sleep-foreground",
        dot: "bg-tone-sleep",
      };
    case "Diaper":
      return {
        icon: "bg-tone-diaper/18 text-tone-diaper-foreground",
        dot: "bg-tone-diaper",
      };
    case "Pump":
      return {
        icon: "bg-tone-pump/16 text-tone-pump-foreground",
        dot: "bg-tone-pump",
      };
    case "Growth":
      return {
        icon: "bg-tone-growth/16 text-tone-growth-foreground",
        dot: "bg-tone-growth",
      };
    case "Milestone":
      return {
        icon: "bg-tone-milestone/16 text-tone-milestone-foreground",
        dot: "bg-tone-milestone",
      };
    case "Medical":
    case "Vaccine":
      return {
        icon: "bg-tone-medical/16 text-tone-medical-foreground",
        dot: "bg-tone-medical",
      };
    default:
      return {
        icon: "bg-tone-routine/16 text-tone-routine-foreground",
        dot: "bg-tone-routine",
      };
  }
}

function eventDetail(event: NaraEvent) {
  switch (event.type) {
    case "Bottle Feed":
      return formatBottleFeedBreakdown(event);
    case "Sleep":
      return "";
    case "Diaper":
      return event.diaperType ?? "Logged diaper change";
    case "Pump":
      return "";
    case "Growth":
      return event.heightCm ? `${event.heightCm.toFixed(1)} cm` : "";
    case "Routine":
      return event.routine ?? "Routine";
    case "Milestone":
      return event.babyFirst ?? "Milestone";
    case "Medical":
      return event.temperatureC ? `${event.temperatureC.toFixed(1)} °C` : "Medical note";
    case "Vaccine":
      return event.vaccine ?? "Vaccine";
    default:
      return "";
  }
}

function formatFeedKind(kind: string) {
  switch (kind) {
    case "formula":
      return "Formula";
    case "breastmilk":
      return "Breast milk";
    default:
      return "Bottle feed";
  }
}

function formatBottleFeedBreakdown(event: BottleFeedEvent) {
  const parts = [
    event.formulaVolumeMl ? { label: "Formula", value: formatVolumeMl(event.formulaVolumeMl) } : null,
    event.breastMilkVolumeMl ? { label: "Breast milk", value: formatVolumeMl(event.breastMilkVolumeMl) } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  if (parts.length > 0) {
    return parts;
  }

  return formatFeedKind(event.feedKind);
}

function formatEventTime(startedAt: string) {
  const date = parseISO(startedAt);
  return format(date, "HH:mm");
}

function formatEventEndTime(event: NaraEvent) {
  if (event.type === "Sleep" && event.endAt) {
    return format(parseISO(event.endAt), "HH:mm");
  }

  if ("durationSeconds" in event && event.durationSeconds) {
    const end = new Date(parseISO(event.startedAt).getTime() + event.durationSeconds * 1000);
    return format(end, "HH:mm");
  }

  return null;
}

function getEventDurationLabel(event: NaraEvent) {
  if ("durationSeconds" in event && event.durationSeconds) {
    return formatDurationFromSeconds(event.durationSeconds);
  }

  return null;
}

function getTimelinePrimaryMeta(event: NaraEvent) {
  const start = formatEventTime(event.startedAt);
  const end = formatEventEndTime(event);
  const duration = getEventDurationLabel(event);

  return {
    range: end ? `${start}-${end}` : start,
    duration,
  };
}

function getTimelineMetric(event: NaraEvent) {
  switch (event.type) {
    case "Bottle Feed":
      return {
        value: event.totalVolumeMl ? formatVolumeMl(event.totalVolumeMl) : "No data",
        label: "Total intake",
      };
    case "Sleep":
      return {
        value: event.durationSeconds ? formatDurationFromSeconds(event.durationSeconds) : "No data",
        label: "Sleep length",
      };
    case "Diaper":
      return {
        value: event.diaperType ?? "Logged",
        label: "Diaper type",
      };
    case "Pump":
      return {
        value: event.totalVolumeMl ? formatVolumeMl(event.totalVolumeMl) : "No data",
        label: "Pump yield",
      };
    case "Growth":
      return {
        value: event.weightKg ? `${event.weightKg.toFixed(2)} kg` : "No data",
        label: "Weight",
      };
    case "Routine":
      return {
        value: event.routine ?? "Routine",
        label: "Routine",
      };
    case "Milestone":
      return {
        value: event.babyFirst ?? "Milestone",
        label: "Milestone",
      };
    case "Medical":
      return {
        value: event.temperatureC ? `${event.temperatureC.toFixed(1)} °C` : "Medical",
        label: "Temperature",
      };
    case "Vaccine":
      return {
        value: event.vaccine ?? "Vaccine",
        label: "Vaccine",
      };
    case "Breastfeed":
      return {
        value: event.durationSeconds ? formatDurationFromSeconds(event.durationSeconds) : "No data",
        label: "Breastfeed",
      };
    default:
      return {
        value: "Logged",
        label: "Event",
      };
  }
}

function getTimelineContext(event: NaraEvent, primaryMeta: ReturnType<typeof getTimelinePrimaryMeta>) {
  const dateAndTime = `${formatShortDate(event.startedAt)} • ${primaryMeta.range}`;

  switch (event.type) {
    case "Bottle Feed":
      return {
        primaryLabel: "Bottle intake",
        secondary: eventDetail(event),
        metaLabel: "Logged",
        metaValue: dateAndTime,
      };
    case "Sleep":
      return {
        primaryLabel: "Sleep duration",
        secondary: primaryMeta.range,
        metaLabel: "Duration",
        metaValue: primaryMeta.duration ?? "No data",
      };
    case "Pump":
      return {
        primaryLabel: "Pump yield",
        secondary: primaryMeta.duration ? `Duration ${primaryMeta.duration}` : "",
        metaLabel: "Logged",
        metaValue: dateAndTime,
      };
    case "Diaper":
      return {
        primaryLabel: "Diaper event",
        secondary: eventDetail(event),
        metaLabel: "Logged",
        metaValue: dateAndTime,
      };
    case "Growth":
      return {
        primaryLabel: "Growth update",
        secondary: eventDetail(event),
        metaLabel: "Logged",
        metaValue: dateAndTime,
      };
    default:
      return {
        primaryLabel: "Event",
        secondary: eventDetail(event),
        metaLabel: "Logged",
        metaValue: dateAndTime,
      };
  }
}

export function TimelineDateRange({
  rangeStart,
  rangeEnd,
  onRangeStartChange,
  onRangeEndChange,
}: {
  rangeStart: string;
  rangeEnd: string;
  onRangeStartChange: (value: string) => void;
  onRangeEndChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
      <Input
        type="date"
        value={rangeStart}
        onChange={(event) => onRangeStartChange(event.target.value)}
        max={rangeEnd}
        className="min-w-0"
        aria-label="Start date"
      />
      <span className="px-1 text-center text-sm text-muted-foreground">to</span>
      <Input
        type="date"
        value={rangeEnd}
        onChange={(event) => onRangeEndChange(event.target.value)}
        min={rangeStart}
        className="min-w-0"
        aria-label="End date"
      />
    </div>
  );
}

export function Timeline({
  events,
  rangeStart,
  rangeEnd,
}: {
  events: NaraEvent[];
  rangeStart: string;
  rangeEnd: string;
}) {
  const [type, setType] = useState<"all" | EventType>("all");

  const filtered = useMemo(() => {
    const from = startOfDay(parseISO(rangeStart));
    const to = endOfDay(parseISO(rangeEnd));

    return events.filter((event) => {
      const typeMatch = type === "all" || event.type === type;
      const eventDate = parseISO(event.startedAt);
      const dateMatch = !isBefore(eventDate, from) && !isAfter(eventDate, to);
      return typeMatch && dateMatch;
    });
  }, [events, rangeEnd, rangeStart, type]);

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Event type
        </p>
        <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setType("all")}
              className={cn(
                "min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition",
                type === "all"
                  ? "border-transparent bg-primary text-primary-foreground shadow-[var(--shadow-interactive)]"
                  : "border-border bg-surface text-text-secondary hover:border-border-strong hover:bg-surface-elevated hover:text-text-primary",
              )}
            >
              All
            </button>
            {EVENT_TYPES.map((eventType) => (
              <button
                key={eventType}
                type="button"
                onClick={() => setType(eventType)}
                className={cn(
                  "min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition",
                  type === eventType
                    ? "border-transparent bg-primary text-primary-foreground shadow-[var(--shadow-interactive)]"
                    : "border-border bg-surface text-text-secondary hover:border-border-strong hover:bg-surface-elevated hover:text-text-primary",
                )}
              >
                {eventType}
              </button>
            ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((event) => {
          const Icon = eventIcon(event.type);
          const tone = eventTone(event.type);
          const primaryMeta = getTimelinePrimaryMeta(event);
          const metric = getTimelineMetric(event);
          const context = getTimelineContext(event, primaryMeta);
          return (
            <div
              key={event.id}
              className="interactive-tile relative flex flex-col gap-4 rounded-[1.5rem] border border-border bg-surface p-4 hover:border-border-strong"
            >
              <div className="flex min-w-0 flex-1 gap-4">
                <div className={`relative shrink-0 rounded-[1.15rem] p-3 shadow-sm ${tone.icon}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-text-primary">{event.type}</p>
                      <span className={`h-2.5 w-2.5 rounded-full ${tone.dot}`} aria-hidden="true" />
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
                          {context.primaryLabel}
                        </p>
                        <p className="metric-value mt-1 text-3xl font-semibold tracking-tight text-text-primary sm:text-[2rem]">
                          {metric.value}
                        </p>
                      </div>
                      <div className="rounded-[1rem] bg-surface-muted px-3 py-2 sm:min-w-28 sm:text-right">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-muted">
                          {context.metaLabel}
                        </p>
                        <p className="mt-1 whitespace-nowrap text-sm font-medium text-text-primary">
                          {context.metaValue}
                        </p>
                      </div>
                    </div>
                  </div>
                  {Array.isArray(context.secondary) ? (
                    <p className="text-sm leading-6 text-text-secondary">
                      {context.secondary.map((item, index) => (
                        <span key={`${item.label}-${item.value}`}>
                          {index > 0 ? " • " : ""}
                          {item.label} <span className="font-semibold text-text-primary">{item.value}</span>
                        </span>
                      ))}
                    </p>
                  ) : context.secondary ? (
                    <p className="text-sm leading-6 text-text-secondary">
                      {context.secondary}
                    </p>
                  ) : null}
                  {"note" in event && event.note ? (
                    <p className="text-sm leading-6 text-text-primary">{event.note}</p>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-border bg-surface p-5 text-sm leading-6 text-text-secondary">
            No events match the current filters. Try a wider date range or switch back to all event types.
          </div>
        ) : null}
      </div>
    </section>
  );
}
