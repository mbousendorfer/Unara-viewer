"use client";

import Link from "next/link";
import { Activity, ArrowUpRight, Clock3, Droplets, Milk, Ruler } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { ErrorState, LoadingState, OfflineEmptyState, OfflineState } from "@/components/data-states";
import { EmptyState } from "@/components/empty-state";
import { InsightCard } from "@/components/insight-card";
import { MetricCard } from "@/components/metric-card";
import { SectionHeader } from "@/components/section-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEvents } from "@/hooks/use-events";
import { eventTheme, type EventTone } from "@/lib/event-theme";
import { getDiaperStats, getFeedStats, getGrowthStats, getPumpStats, getSleepStats, sortEvents } from "@/lib/analytics";
import {
  formatDateTime,
  formatDurationFromSeconds,
  formatRelative,
  formatVolumeMl,
  formatWeightKg,
} from "@/lib/format";
import { cn } from "@/lib/utils";

function StatPreviewCard({
  href,
  title,
  metric,
  detail,
  icon: Icon,
  tone,
}: {
  href: string;
  title: string;
  metric: string;
  detail: string;
  icon: LucideIcon;
  tone: EventTone;
}) {
  const palette = eventTheme[tone];

  return (
    <Link href={href} className="group">
      <Card className="interactive-tile h-full overflow-hidden border-border bg-surface-elevated group-hover:-translate-y-1 group-hover:border-border-strong">
        <div className={`h-1.5 w-full ${palette.topBorder}`} />
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-text-secondary">{title}</p>
            <CardTitle className="metric-value text-2xl">{metric}</CardTitle>
          </div>
          <div className={`rounded-[1.2rem] p-3 ${palette.icon}`}>
            <Icon className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm leading-6 text-muted-foreground">{detail}</p>
          <div className="pt-2">
            <span
              className={cn(
                buttonVariants({ variant: "outline" }),
                "pointer-events-none group-hover:border-border-strong group-hover:bg-surface-elevated",
              )}
            >
              Open detailed view
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function HomePage() {
  const { events, isLoading, isOffline, loadError, syncedAt } = useEvents();
  const sortedEvents = sortEvents(events);
  const latestEvent = sortedEvents[0] ?? null;
  const feedStats = getFeedStats(events);
  const sleepStats = getSleepStats(events);
  const diaperStats = getDiaperStats(events);
  const pumpStats = getPumpStats(events);
  const growthStats = getGrowthStats(events);

  return (
      <AppShell
        title="Your baby&apos;s routine at a glance"
        subtitle="Read your Nara app export file and explore recent shifts, weekly trends, and deeper patterns in one place."
      >
      {isLoading ? (
        <LoadingState />
      ) : events.length === 0 && isOffline ? (
        <OfflineEmptyState />
      ) : events.length === 0 && loadError ? (
        <ErrorState message={loadError} />
      ) : events.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {isOffline ? <OfflineState syncedAt={syncedAt} /> : null}
          {!isOffline && loadError ? <ErrorState message={loadError} /> : null}
          <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
            <Card className="bg-surface-elevated">
              <CardHeader className="gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">Imported data</p>
                <h2 className="text-3xl leading-tight font-[family-name:var(--font-serif)] text-text-primary">
                  Latest snapshot from your export
                </h2>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-surface-muted p-4">
                  <p className="text-sm font-medium text-text-secondary">Most recent logged activity</p>
                  <p className="mt-2 text-lg font-semibold text-text-primary">
                    {latestEvent ? latestEvent.type : "No recent activity"}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-text-secondary">
                    {latestEvent ? `${formatRelative(latestEvent.startedAt)} • ${formatDateTime(latestEvent.startedAt)}` : "Import data to start the stream."}
                  </p>
                </div>
                <div className="rounded-[1.5rem] bg-secondary/70 p-4">
                  <p className="text-sm font-medium text-text-secondary">Compared with the previous week in the export</p>
                  <p className="mt-2 text-lg font-semibold text-text-primary">
                    {feedStats.weeklyVariationMl >= 0 ? "Feeding is trending up" : "Feeding is trending down"}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-text-secondary">
                    Average bottle size changed by {Math.round(Math.abs(feedStats.weeklyVariationMl))} ml between the latest two weeks captured in your imported data.
                  </p>
                </div>
              </CardContent>
            </Card>

            <InsightCard
              title="What to look at first"
              detail={sleepStats.insights[2]?.detail ?? "Review the detailed analytics pages to uncover routine changes over time."}
              tone="sleep"
            />
          </section>

          <section className="space-y-4">
            <SectionHeader
              eyebrow="Insights"
              title="What changed recently"
              description="Quick observations that summarize routine patterns without forcing you into a full dashboard workflow."
            />
            <div className="grid gap-4 lg:grid-cols-3">
              <InsightCard title={feedStats.insights[0]?.title ?? "Feed insight"} detail={feedStats.insights[0]?.detail ?? "No feed pattern available yet."} tone="feed" />
              <InsightCard title={sleepStats.insights[1]?.title ?? "Sleep insight"} detail={sleepStats.insights[1]?.detail ?? "No sleep pattern available yet."} tone="sleep" />
              <InsightCard title={diaperStats.insights[0]?.title ?? "Diaper insight"} detail={diaperStats.insights[0]?.detail ?? "No diaper pattern available yet."} tone="diaper" />
            </div>
          </section>

          <section className="space-y-4">
            <SectionHeader
              eyebrow="Statistics previews"
              title="Open the detail pages that matter most"
              description="Each card gives a quick read on the current trend before you dive into the dedicated charts."
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <StatPreviewCard
                href="/stats/feed"
                title="Feed stats"
                metric={formatVolumeMl(feedStats.averageMl)}
                detail={`Typical bottle size. ${feedStats.insights[1]?.detail ?? ""}`}
                icon={Milk}
                tone="feed"
              />
              <StatPreviewCard
                href="/stats/sleep"
                title="Sleep stats"
                metric={formatDurationFromSeconds(sleepStats.averageSeconds)}
                detail={`Typical sleep stretch. ${sleepStats.insights[2]?.detail ?? ""}`}
                icon={Clock3}
                tone="sleep"
              />
              <StatPreviewCard
                href="/stats/diaper"
                title="Diaper stats"
                metric={diaperStats.topType?.[0] ?? "No data"}
                detail={diaperStats.insights[1]?.detail ?? "No diaper timing insight available yet."}
                icon={Droplets}
                tone="diaper"
              />
              <StatPreviewCard
                href="/stats/pump"
                title="Pump stats"
                metric={formatVolumeMl(pumpStats.totalMl)}
                detail={pumpStats.insights[0]?.detail ?? "No pump trend available yet."}
                icon={Activity}
                tone="pump"
              />
              <StatPreviewCard
                href="/stats/growth"
                title="Growth stats"
                metric={formatWeightKg(growthStats.latest?.weightKg)}
                detail={growthStats.insights[0]?.detail ?? "No growth trend available yet."}
                icon={Ruler}
                tone="growth"
              />
            </div>
          </section>
        </>
      )}
    </AppShell>
  );
}
