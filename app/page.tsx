"use client";

import { Clock3, Droplets, Milk, Ruler } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { MetricCard } from "@/components/metric-card";
import { Timeline } from "@/components/timeline";
import { useEvents } from "@/hooks/use-events";
import { getDashboardSummary } from "@/lib/analytics";
import {
  formatDateTime,
  formatDurationFromSeconds,
  formatLengthCm,
  formatVolumeMl,
  formatWeightKg,
} from "@/lib/format";

export default function HomePage() {
  const { events } = useEvents();
  const summary = getDashboardSummary(events);

  return (
    <AppShell
      title="Personal baby analytics, on your device"
      subtitle="Import Nara Baby CSV exports, sync them into the app database, and explore responsive dashboards over the latest data."
    >
      {events.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard title="Today's feed total" value={formatVolumeMl(summary.feedTotalMl)} detail="Bottle intake recorded since midnight." icon={Milk} />
            <MetricCard title="Sleep last 24h" value={formatDurationFromSeconds(summary.sleepSeconds)} detail="Combined sleep duration over the last day." icon={Clock3} />
            <MetricCard title="Diapers today" value={String(summary.diaperCount)} detail="Logged diaper changes since midnight." icon={Droplets} />
            <MetricCard
              title="Last growth measurement"
              value={summary.lastGrowth ? formatWeightKg(summary.lastGrowth.weightKg) : "No data"}
              detail={
                summary.lastGrowth
                  ? `${formatLengthCm(summary.lastGrowth.heightCm)} • ${formatDateTime(summary.lastGrowth.startedAt)}`
                  : "Import growth records to populate this card."
              }
              icon={Ruler}
            />
          </section>

          <section>
            <Timeline events={events} />
          </section>
        </>
      )}
    </AppShell>
  );
}
