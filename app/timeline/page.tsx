"use client";

import { format, subDays } from "date-fns";
import { useState } from "react";

import { AppShell } from "@/components/app-shell";
import { ErrorState, LoadingState, OfflineEmptyState, OfflineState } from "@/components/data-states";
import { EmptyState } from "@/components/empty-state";
import { SectionHeader } from "@/components/section-header";
import { Timeline, TimelineDateRange } from "@/components/timeline";
import { useEvents } from "@/hooks/use-events";

export default function TimelinePage() {
  const { events, isLoading, isOffline, loadError, syncedAt } = useEvents();
  const [rangeStart, setRangeStart] = useState(() => format(subDays(new Date(), 1), "yyyy-MM-dd"));
  const [rangeEnd, setRangeEnd] = useState(() => format(new Date(), "yyyy-MM-dd"));

  return (
    <AppShell title="Timeline" subtitle="Browse the activity stream.">
      {isLoading ? (
        <LoadingState />
      ) : events.length === 0 && isOffline ? (
        <OfflineEmptyState />
      ) : events.length === 0 && loadError ? (
        <ErrorState message={loadError} />
      ) : events.length === 0 ? (
        <EmptyState />
      ) : (
        <section className="space-y-4">
          {isOffline ? <OfflineState syncedAt={syncedAt} /> : null}
          {!isOffline && loadError ? <ErrorState message={loadError} /> : null}
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
