"use client";

import Link from "next/link";
import { Activity, ArrowUpRight, Clock3, Droplets, Milk, Ruler } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { InsightCard } from "@/components/insight-card";
import { MetricCard } from "@/components/metric-card";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEvents } from "@/hooks/use-events";
import { getDashboardSummary, getDiaperStats, getFeedStats, getGrowthStats, getPumpStats, getSleepStats, sortEvents } from "@/lib/analytics";
import {
  formatDateTime,
  formatDurationFromSeconds,
  formatLengthCm,
  formatRelative,
  formatVolumeMl,
  formatWeightKg,
} from "@/lib/format";

function StatPreviewCard({
  href,
  title,
  metric,
  detail,
  icon: Icon,
  toneClass,
}: {
  href: string;
  title: string;
  metric: string;
  detail: string;
  icon: LucideIcon;
  toneClass: string;
}) {
  return (
    <Link href={href} className="group">
      <Card className="h-full overflow-hidden border-border/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(245,241,234,0.98))] transition hover:-translate-y-1 hover:border-foreground/12 hover:shadow-[0_28px_60px_-34px_rgba(67,73,54,0.42)] dark:bg-[linear-gradient(180deg,rgba(26,31,33,0.98),rgba(19,24,25,0.96))] dark:hover:shadow-[0_28px_60px_-34px_rgba(0,0,0,0.8)]">
        <div className={`h-1.5 w-full ${toneClass}`} />
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <CardTitle className="text-2xl">{metric}</CardTitle>
          </div>
          <div className="rounded-[1.2rem] bg-secondary p-3 text-secondary-foreground">
            <Icon className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm leading-6 text-muted-foreground">{detail}</p>
          <div className="pt-2">
            <span className="inline-flex min-h-11 items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-white shadow-[0_16px_28px_-20px_rgba(47,58,50,0.85)] transition group-hover:bg-primary">
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
  const { events } = useEvents();
  const summary = getDashboardSummary(events);
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
      subtitle="See what happened today, what shifted this week, and where to explore deeper trends from your Nara Baby exports."
    >
      {events.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
            <Card className="bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(247,244,238,0.94))] dark:bg-[linear-gradient(135deg,rgba(26,31,33,0.96),rgba(19,24,25,0.94))]">
              <CardHeader className="gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Imported data</p>
                <h2 className="text-3xl leading-tight font-[family-name:var(--font-serif)] text-foreground">
                  Latest snapshot from your export
                </h2>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-muted/55 p-4">
                  <p className="text-sm font-medium text-muted-foreground">Most recent logged activity</p>
                  <p className="mt-2 text-lg font-semibold text-foreground">
                    {latestEvent ? latestEvent.type : "No recent activity"}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {latestEvent ? `${formatRelative(latestEvent.startedAt)} • ${formatDateTime(latestEvent.startedAt)}` : "Import data to start the stream."}
                  </p>
                </div>
                <div className="rounded-[1.5rem] bg-secondary/55 p-4">
                  <p className="text-sm font-medium text-muted-foreground">Compared with the previous week in the export</p>
                  <p className="mt-2 text-lg font-semibold text-foreground">
                    {feedStats.weeklyVariationMl >= 0 ? "Feeding is trending up" : "Feeding is trending down"}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Average bottle size changed by {Math.round(Math.abs(feedStats.weeklyVariationMl))} ml between the latest two weeks captured in your imported data.
                  </p>
                </div>
              </CardContent>
            </Card>

            <InsightCard
              title="What to look at first"
              detail={sleepStats.insights[2]?.detail ?? "Review the detailed analytics pages to uncover routine changes over time."}
            />
          </section>

          <section className="space-y-4">
            <SectionHeader
              eyebrow="Today summary"
              title="The key numbers to scan first"
              description="A quick summary pulled from the latest period in your imported data, surfaced clearly on mobile and desktop."
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard title="Today&apos;s feed total" value={formatVolumeMl(summary.feedTotalMl)} detail="Bottle intake recorded since midnight." icon={Milk} tone="feed" />
              <MetricCard title="Sleep last 24h" value={formatDurationFromSeconds(summary.sleepSeconds)} detail="Combined sleep duration over the last day." icon={Clock3} tone="sleep" />
              <MetricCard title="Diapers today" value={String(summary.diaperCount)} detail="Logged diaper changes since midnight." icon={Droplets} tone="diaper" />
              <MetricCard
                title="Last growth measurement"
                value={summary.lastGrowth ? formatWeightKg(summary.lastGrowth.weightKg) : "No data"}
                detail={
                  summary.lastGrowth
                    ? `${formatLengthCm(summary.lastGrowth.heightCm)} • ${formatDateTime(summary.lastGrowth.startedAt)}`
                    : "Import growth records to populate this card."
                }
                icon={Ruler}
                tone="growth"
              />
            </div>
          </section>

          <section className="space-y-4">
            <SectionHeader
              eyebrow="Insights"
              title="What changed recently"
              description="Quick observations that summarize routine patterns without forcing you into a full dashboard workflow."
            />
            <div className="grid gap-4 lg:grid-cols-3">
              <InsightCard title={feedStats.insights[0]?.title ?? "Feed insight"} detail={feedStats.insights[0]?.detail ?? "No feed pattern available yet."} />
              <InsightCard title={sleepStats.insights[1]?.title ?? "Sleep insight"} detail={sleepStats.insights[1]?.detail ?? "No sleep pattern available yet."} />
              <InsightCard title={diaperStats.insights[0]?.title ?? "Diaper insight"} detail={diaperStats.insights[0]?.detail ?? "No diaper pattern available yet."} />
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
                toneClass="bg-[#F6C453]"
              />
              <StatPreviewCard
                href="/stats/sleep"
                title="Sleep stats"
                metric={formatDurationFromSeconds(sleepStats.averageSeconds)}
                detail={`Typical sleep stretch. ${sleepStats.insights[2]?.detail ?? ""}`}
                icon={Clock3}
                toneClass="bg-[#A9C3E6]"
              />
              <StatPreviewCard
                href="/stats/diaper"
                title="Diaper stats"
                metric={diaperStats.topType?.[0] ?? "No data"}
                detail={diaperStats.insights[1]?.detail ?? "No diaper timing insight available yet."}
                icon={Droplets}
                toneClass="bg-[#E6DCC8]"
              />
              <StatPreviewCard
                href="/stats/pump"
                title="Pump stats"
                metric={formatVolumeMl(pumpStats.totalMl)}
                detail={pumpStats.insights[0]?.detail ?? "No pump trend available yet."}
                icon={Activity}
                toneClass="bg-[#D6A6A0]"
              />
              <StatPreviewCard
                href="/stats/growth"
                title="Growth stats"
                metric={formatWeightKg(growthStats.latest?.weightKg)}
                detail={growthStats.insights[0]?.detail ?? "No growth trend available yet."}
                icon={Ruler}
                toneClass="bg-[#9CC48D]"
              />
            </div>
          </section>
        </>
      )}
    </AppShell>
  );
}
