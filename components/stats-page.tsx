"use client";

import { useState } from "react";
import { Activity, Clock3, Droplets, Milk, Ruler } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { ChartCard } from "@/components/chart-card";
import { DailyChart, HourlyChart, MultiLineChart, MultiSeriesBarChart, RollingAverageChart, WeightCurveChart } from "@/components/charts";
import { EmptyState } from "@/components/empty-state";
import { InsightList } from "@/components/insight-list";
import { MetricCard } from "@/components/metric-card";
import { TimeframeSelect } from "@/components/timeframe-select";
import { useEvents } from "@/hooks/use-events";
import { useProfileMetadata } from "@/hooks/use-profile-metadata";
import {
  buildFeedDailySeries,
  buildFeedHourlySeries,
  buildDailyAggregate,
  buildDiaperDailySeries,
  buildDiaperHourlySeries,
  buildHourlyDistribution,
  buildRollingAverage,
  type ChartTimeframe,
  DIAPER_TYPES,
  filterEventsByTimeframe,
  getDiaperStats,
  getFeedStats,
  getGrowthStats,
  getPumpStats,
  getSleepStats,
  getWeightCurveChartData,
} from "@/lib/analytics";
import {
  formatDurationFromSeconds,
  formatVolumeMl,
  formatWeightKg,
} from "@/lib/format";

type StatsKind = "feed" | "sleep" | "diaper" | "pump" | "growth";

const diaperSeriesMeta = {
  Wet: { key: "wet", label: "Wet", color: "var(--chart-1)" },
  Dirty: { key: "dirty", label: "Dirty", color: "var(--chart-3)" },
  "Dirty Wet": { key: "dirtyWet", label: "Dirty Wet", color: "var(--chart-5)" },
  Dry: { key: "dry", label: "Dry", color: "var(--chart-2)" },
} as const;

function TimeframedChartCard({
  title,
  description,
  defaultTimeframe = 14,
  children,
}: {
  title: string;
  description: string;
  defaultTimeframe?: ChartTimeframe;
  children: (timeframe: ChartTimeframe) => React.ReactNode;
}) {
  const [timeframe, setTimeframe] = useState<ChartTimeframe>(defaultTimeframe);

  return (
    <ChartCard
      title={title}
      description={description}
      action={<TimeframeSelect value={timeframe} onChange={setTimeframe} />}
    >
      {children(timeframe)}
    </ChartCard>
  );
}

function DiaperTypeToggleChart({
  title,
  description,
  defaultTimeframe = 30,
  renderChart,
}: {
  title: string;
  description: string;
  defaultTimeframe?: ChartTimeframe;
  renderChart: (timeframe: ChartTimeframe, enabledTypes: typeof DIAPER_TYPES[number][]) => React.ReactNode;
}) {
  const [timeframe, setTimeframe] = useState<ChartTimeframe>(defaultTimeframe);
  const [enabledTypes, setEnabledTypes] = useState<typeof DIAPER_TYPES[number][]>([...DIAPER_TYPES]);

  function toggleType(type: typeof DIAPER_TYPES[number]) {
    setEnabledTypes((current) =>
      current.includes(type)
        ? current.length === 1
          ? current
          : current.filter((item) => item !== type)
        : [...current, type],
    );
  }

  return (
    <ChartCard
      title={title}
      description={description}
      action={<TimeframeSelect value={timeframe} onChange={setTimeframe} />}
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {DIAPER_TYPES.map((type) => {
          const meta = diaperSeriesMeta[type];
          const active = enabledTypes.includes(type);
          return (
            <button
              key={type}
              type="button"
              onClick={() => toggleType(type)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                active ? "border-transparent text-white" : "border-border bg-card/70 text-muted-foreground dark:bg-card"
              }`}
              style={active ? { backgroundColor: meta.color } : undefined}
            >
              {meta.label}
            </button>
          );
        })}
      </div>
      {renderChart(timeframe, enabledTypes)}
    </ChartCard>
  );
}

export function StatsPage({ kind }: { kind: StatsKind }) {
  const { events } = useEvents();
  const { profile } = useProfileMetadata();

  if (events.length === 0) {
    return (
      <AppShell title="Nara Insights" subtitle="Import data to unlock personal analytics.">
        <EmptyState />
      </AppShell>
    );
  }

  if (kind === "feed") {
    const stats = getFeedStats(events);
    return (
      <AppShell title="Feed Analytics" subtitle="Bottle rhythm, timing patterns, and practical feeding trends.">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Typical total bottle"
            value={formatVolumeMl(stats.averageMl)}
            detail="Average total intake per bottle across the imported log."
            icon={Milk}
            tone="feed"
            trend={{ value: stats.weeklyVariationMl, label: "vs last week", suffix: " ml" }}
          />
          <MetricCard
            title="Typical formula bottle"
            value={formatVolumeMl(stats.averageFormulaMl)}
            detail="Average formula intake when a bottle includes formula."
            icon={Milk}
            tone="feed"
            trend={{ value: stats.weeklyFormulaVariationMl, label: "vs last week", suffix: " ml" }}
          />
          <MetricCard
            title="Typical breast milk bottle"
            value={formatVolumeMl(stats.averageBreastMilkMl)}
            detail="Average breast milk intake when a bottle includes breast milk."
            icon={Milk}
            tone="feed"
            trend={{ value: stats.weeklyBreastMilkVariationMl, label: "vs last week", suffix: " ml" }}
          />
          <MetricCard
            title="Typical spacing"
            value={formatDurationFromSeconds(stats.averageGapSeconds)}
            detail="Average time between logged bottles."
            icon={Activity}
            tone="feed"
          />
        </section>
        <section className="grid gap-4 lg:grid-cols-2">
          <TimeframedChartCard title="Daily intake by source" description="Formula and breast milk intake across the selected timeframe.">
            {(timeframe) => (
              <MultiSeriesBarChart
                data={buildFeedDailySeries(stats.events, timeframe)}
                xKey="label"
                series={[
                  { key: "formula", label: "Formula", color: "var(--chart-1)" },
                  { key: "breastMilk", label: "Breast Milk", color: "var(--chart-2)" },
                ]}
              />
            )}
          </TimeframedChartCard>
          <TimeframedChartCard title="Hourly intake by source" description="When formula and breast milk intake cluster through the day.">
            {(timeframe) => (
              <MultiSeriesBarChart
                data={buildFeedHourlySeries(stats.events, timeframe)}
                xKey="hour"
                series={[
                  { key: "formula", label: "Formula", color: "var(--chart-1)" },
                  { key: "breastMilk", label: "Breast Milk", color: "var(--chart-2)" },
                ]}
              />
            )}
          </TimeframedChartCard>
        </section>
        <section className="grid gap-4 lg:grid-cols-[1.8fr_1fr]">
          <TimeframedChartCard title="Rolling average by source" description="7-day smoothing of formula and breast milk intake for the selected timeframe.">
            {(timeframe) => {
              const series = buildFeedDailySeries(stats.events, timeframe);
              const formulaRolling = buildRollingAverage(
                series.map((item) => ({ label: item.label, value: item.formula })),
              );
              const breastMilkRolling = buildRollingAverage(
                series.map((item) => ({ label: item.label, value: item.breastMilk })),
              );

              return (
                <MultiLineChart
                  data={series.map((point, index) => ({
                    label: point.label,
                    formula: formulaRolling[index]?.value ?? 0,
                    breastMilk: breastMilkRolling[index]?.value ?? 0,
                  }))}
                  lines={[
                    { key: "formula", label: "Formula", color: "var(--chart-1)" },
                    { key: "breastMilk", label: "Breast Milk", color: "var(--chart-2)" },
                  ]}
                />
              );
            }}
          </TimeframedChartCard>
          <InsightList items={stats.insights} />
        </section>
      </AppShell>
    );
  }

  if (kind === "sleep") {
    const stats = getSleepStats(events);
    return (
      <AppShell title="Sleep Analytics" subtitle="Sleep rhythm, stretch length, and timing patterns.">
        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard
            title="Typical stretch variation"
            value={formatDurationFromSeconds(stats.averageSeconds)}
            detail="Average sleep duration per logged session."
            icon={Clock3}
            tone="sleep"
            trend={{
              value: stats.weeklyTypicalStretchVariationSeconds,
              label: "vs last week",
              display: `${stats.weeklyTypicalStretchVariationSeconds >= 0 ? "+" : "-"}${formatDurationFromSeconds(Math.abs(stats.weeklyTypicalStretchVariationSeconds))}`,
            }}
          />
          <MetricCard
            title="Longest recent stretch"
            value={formatDurationFromSeconds(stats.longestSleepSeconds)}
            detail="Longest logged sleep session in the imported history."
            icon={Clock3}
            tone="sleep"
          />
          <MetricCard
            title="Longest stretch variation"
            value={formatDurationFromSeconds(Math.max(stats.longestSleepSeconds, 0))}
            detail="Longest stretch compared with the previous week."
            icon={Activity}
            tone="sleep"
            trend={{
              value: stats.weeklyLongestStretchVariationSeconds,
              label: "vs last week",
              display: `${stats.weeklyLongestStretchVariationSeconds >= 0 ? "+" : "-"}${formatDurationFromSeconds(Math.abs(stats.weeklyLongestStretchVariationSeconds))}`,
            }}
          />
        </section>
        <section className="grid gap-4 lg:grid-cols-2">
          <TimeframedChartCard title="Daily sleep hours" description="Sleep volume for the selected timeframe.">
            {(timeframe) => (
              <DailyChart
                data={buildDailyAggregate(stats.events, timeframe, (event) => (event.durationSeconds ?? 0) / 3600)}
                valueLabel="hours"
              />
            )}
          </TimeframedChartCard>
          <TimeframedChartCard title="Hourly distribution" description="Common sleep start windows for the selected timeframe.">
            {(timeframe) => (
              <HourlyChart
                data={buildHourlyDistribution(stats.events, () => 1, timeframe)}
                valueLabel="sessions"
              />
            )}
          </TimeframedChartCard>
        </section>
        <section className="grid gap-4 lg:grid-cols-[1.8fr_1fr]">
          <TimeframedChartCard title="Rolling average" description="7-day sleep average by day for the selected timeframe.">
            {(timeframe) => (
              <RollingAverageChart
                data={buildRollingAverage(buildDailyAggregate(stats.events, timeframe, (event) => (event.durationSeconds ?? 0) / 3600))}
                valueLabel="hours"
              />
            )}
          </TimeframedChartCard>
          <InsightList items={stats.insights} />
        </section>
      </AppShell>
    );
  }

  if (kind === "diaper") {
    const stats = getDiaperStats(events);
    return (
      <AppShell title="Diaper Analytics" subtitle="The essentials for diaper rhythm, poop timing, and wet-diaper monitoring.">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Most common type"
            value={stats.topType?.[0] ?? "No data"}
            detail="Most frequent diaper type across the imported log."
            icon={Droplets}
            tone="diaper"
          />
          <MetricCard
            title="Poop share"
            value={`${Math.round(stats.poopShare)}%`}
            detail="Share of diaper logs that include poop."
            icon={Droplets}
            tone="diaper"
            trend={{ value: stats.weeklyPoopShareVariation, label: "vs last week", suffix: " pts" }}
          />
          <MetricCard
            title="Typical poop window"
            value={stats.poopPeakHour.hour}
            detail={`${stats.poopPeakDaypart.label} is the most poop-heavy part of day.`}
            icon={Activity}
            tone="diaper"
          />
          <MetricCard
            title="Dirty+wet share"
            value={`${Math.round(stats.dirtyWetShare)}%`}
            detail="Share of poop diapers that are also wet."
            icon={Droplets}
            tone="diaper"
            trend={{ value: stats.weeklyDirtyWetShareVariation, label: "vs last week", suffix: " pts" }}
          />
        </section>
        <section className="grid gap-4 lg:grid-cols-2">
          <DiaperTypeToggleChart
            title="Daily diaper patterns"
            description="All diaper types across the selected timeframe."
            renderChart={(timeframe, enabledTypes) => (
              <MultiSeriesBarChart
                data={buildDiaperDailySeries(stats.events, timeframe)}
                xKey="label"
                series={enabledTypes.map((type) => diaperSeriesMeta[type])}
              />
            )}
          />
          <DiaperTypeToggleChart
            title="Diaper timing by hour"
            description="Compare when each diaper type tends to happen."
            renderChart={(timeframe, enabledTypes) => (
              <MultiSeriesBarChart
                data={buildDiaperHourlySeries(stats.events, timeframe)}
                xKey="hour"
                series={enabledTypes.map((type) => diaperSeriesMeta[type])}
              />
            )}
          />
        </section>
        <section className="grid gap-4 lg:grid-cols-[1.8fr_1fr]">
          <TimeframedChartCard title="Rolling average" description="7-day diaper change average for the selected timeframe.">
            {(timeframe) => (
              <RollingAverageChart
                data={buildRollingAverage(buildDailyAggregate(stats.events, timeframe, () => 1))}
                valueLabel="changes"
              />
            )}
          </TimeframedChartCard>
          <InsightList items={stats.insights} />
        </section>
      </AppShell>
    );
  }

  if (kind === "pump") {
    const stats = getPumpStats(events);
    return (
      <AppShell title="Pump Analytics" subtitle="Yield, duration, and session timing for pumping records.">
        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard
            title="Total yield"
            value={formatVolumeMl(stats.totalMl)}
            detail="Combined across all pump sessions."
            icon={Activity}
            tone="pump"
            trend={{ value: stats.weeklyTotalMlVariation, label: "vs last week", suffix: " ml" }}
          />
          <MetricCard
            title="Total time"
            value={formatDurationFromSeconds(stats.totalSeconds)}
            detail="Total pumping time recorded."
            icon={Clock3}
            tone="pump"
            trend={{
              value: stats.weeklyTotalSecondsVariation,
              label: "vs last week",
              display: `${stats.weeklyTotalSecondsVariation >= 0 ? "+" : "-"}${formatDurationFromSeconds(Math.abs(stats.weeklyTotalSecondsVariation))}`,
            }}
          />
          <MetricCard
            title="Sessions"
            value={String(stats.events.length)}
            detail="Logged pump events."
            icon={Activity}
            tone="pump"
            trend={{ value: stats.weeklySessionsVariation, label: "vs last week" }}
          />
        </section>
        <section className="grid gap-4 lg:grid-cols-2">
          <TimeframedChartCard title="Daily yield" description="Pump volume for the selected timeframe.">
            {(timeframe) => (
              <DailyChart
                data={buildDailyAggregate(stats.events, timeframe, (event) => event.totalVolumeMl ?? 0)}
                valueLabel="ml"
              />
            )}
          </TimeframedChartCard>
          <TimeframedChartCard title="Hourly distribution" description="When pump sessions tend to happen for the selected timeframe.">
            {(timeframe) => (
              <HourlyChart
                data={buildHourlyDistribution(stats.events, () => 1, timeframe)}
                valueLabel="sessions"
              />
            )}
          </TimeframedChartCard>
        </section>
        <section className="grid gap-4 lg:grid-cols-[1.8fr_1fr]">
          <TimeframedChartCard title="Rolling average" description="7-day smoothed volume trend for the selected timeframe.">
            {(timeframe) => (
              <RollingAverageChart
                data={buildRollingAverage(buildDailyAggregate(stats.events, timeframe, (event) => event.totalVolumeMl ?? 0))}
                valueLabel="ml"
              />
            )}
          </TimeframedChartCard>
          <InsightList items={stats.insights} />
        </section>
      </AppShell>
    );
  }

  const stats = getGrowthStats(events);

  return (
    <AppShell title="Growth Analytics" subtitle="Weight curve over age, with WHO reference curves in the background.">
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Latest weight" value={formatWeightKg(stats.latest?.weightKg)} detail="Most recent growth measurement." icon={Ruler} tone="growth" />
        <MetricCard
          title="Profile sex"
          value={profile?.sex ?? "Unknown"}
          detail="Used to select the correct WHO weight-for-age references."
          icon={Ruler}
          tone="growth"
        />
        <MetricCard
          title="Birth date"
          value={profile?.birthDate ?? "Unknown"}
          detail="Needed to convert each weight measurement to age in months."
          icon={Ruler}
          tone="growth"
        />
      </section>
      <section className="grid gap-4 lg:grid-cols-[1.8fr_1fr]">
        <TimeframedChartCard title="Weight curve" description="Weight-for-age curve with WHO percentile references for the selected timeframe." defaultTimeframe="all">
          {(timeframe) => {
            const weightChart = getWeightCurveChartData(stats.events, profile ?? null, timeframe);

            return (
              <WeightCurveChart
                data={weightChart.data}
                showWhoBands={weightChart.hasWhoReferences}
                xDomain={weightChart.xDomain}
                yDomain={weightChart.yDomain}
              />
            );
          }}
        </TimeframedChartCard>
        <InsightList
          items={
            profile?.birthDate
              ? stats.insights
              : [
                  ...stats.insights,
                  {
                    title: "WHO references unavailable",
                    detail: "Re-import a CSV containing the Profile row so birth date and sex can be used for the WHO overlay.",
                  },
                ]
          }
        />
      </section>
    </AppShell>
  );
}
