"use client";

import { useMemo, useState } from "react";
import { Droplets, Filter, Milk, MoonStar, Ruler, Syringe } from "lucide-react";
import { isAfter, parseISO, subDays } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateTime, formatDurationFromSeconds, formatVolumeMl } from "@/lib/format";
import { EVENT_TYPES, type EventType, type NaraEvent } from "@/lib/types";

const filterOptions = [
  { value: "all", label: "All time" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
];

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

function eventDetail(event: NaraEvent) {
  switch (event.type) {
    case "Bottle Feed":
      return `${formatVolumeMl(event.formulaVolumeMl)} • ${event.feedKind}`;
    case "Sleep":
      return `${formatDurationFromSeconds(event.durationSeconds)}`;
    case "Diaper":
      return event.diaperType ?? "Logged diaper change";
    case "Pump":
      return `${formatVolumeMl(event.totalVolumeMl)} • ${formatDurationFromSeconds(event.durationSeconds)}`;
    case "Growth":
      return [event.weightKg ? `${event.weightKg.toFixed(2)} kg` : null, event.heightCm ? `${event.heightCm.toFixed(1)} cm` : null]
        .filter(Boolean)
        .join(" • ");
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

export function Timeline({ events }: { events: NaraEvent[] }) {
  const [type, setType] = useState<"all" | EventType>("all");
  const [window, setWindow] = useState("7");

  const filtered = useMemo(() => {
    return events.filter((event) => {
      const typeMatch = type === "all" || event.type === type;
      const dateMatch =
        window === "all" ? true : isAfter(parseISO(event.startedAt), subDays(new Date(), Number(window)));
      return typeMatch && dateMatch;
    });
  }, [events, type, window]);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Timeline</CardTitle>
          <p className="text-sm text-muted-foreground">Chronological event view with quick filters.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select value={type} onValueChange={(value) => setType(value as "all" | EventType)}>
            <SelectTrigger className="min-w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All event types</SelectItem>
              {EVENT_TYPES.map((eventType) => (
                <SelectItem key={eventType} value={eventType}>
                  {eventType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={window} onValueChange={setWindow}>
            <SelectTrigger className="min-w-36">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[26rem] pr-4">
          <div className="space-y-4">
            {filtered.map((event) => {
              const Icon = eventIcon(event.type);
              return (
                <div key={event.id} className="flex gap-4 rounded-[1.25rem] bg-muted/50 p-4">
                  <div className="rounded-2xl bg-white p-3 text-primary shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{event.type}</p>
                      <Badge variant="outline">{formatDateTime(event.startedAt)}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{eventDetail(event)}</p>
                    {"note" in event && event.note ? <p className="mt-2 text-sm">{event.note}</p> : null}
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 ? (
              <p className="rounded-[1.25rem] bg-muted/50 p-4 text-sm text-muted-foreground">
                No events match the current filters.
              </p>
            ) : null}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
