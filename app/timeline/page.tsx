"use client";

import { format, subDays } from "date-fns";
import { useState } from "react";

import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { SectionHeader } from "@/components/section-header";
import { Timeline, TimelineDateRange } from "@/components/timeline";
import { useEvents } from "@/hooks/use-events";

export default function TimelinePage() {
  const { events } = useEvents();
  const [rangeStart, setRangeStart] = useState(() => format(subDays(new Date(), 1), "yyyy-MM-dd"));
  const [rangeEnd, setRangeEnd] = useState(() => format(new Date(), "yyyy-MM-dd"));

  return (
    <AppShell title="Timeline" subtitle="Browse the activity stream.">
      {events.length === 0 ? (
        <EmptyState />
      ) : (
        <section className="space-y-4">
          <SectionHeader
            eyebrow="Activity stream"
            title="Timeline"
            description="Filter by type and date range."
            action={
              <TimelineDateRange
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                onRangeStartChange={setRangeStart}
                onRangeEndChange={setRangeEnd}
              />
            }
          />
          <Timeline events={events} rangeStart={rangeStart} rangeEnd={rangeEnd} />
        </section>
      )}
    </AppShell>
  );
}
