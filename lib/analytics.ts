import {
  differenceInDays,
  eachDayOfInterval,
  format,
  isAfter,
  isBefore,
  isSameDay,
  min as minDate,
  parseISO,
  startOfDay,
  subDays,
  subHours,
} from "date-fns";

import type {
  BottleFeedEvent,
  DiaperEvent,
  DistributionPoint,
  GrowthEvent,
  InsightItem,
  NaraEvent,
  PumpEvent,
  ProfileMetadata,
  SleepEvent,
  TrendPoint,
} from "@/lib/types";
import { WHO_WEIGHT_FOR_AGE, type WhoWeightPoint } from "@/lib/who-weight";

export const CHART_TIMEFRAMES = [7, 14, 30, 90, "all"] as const;
export type ChartTimeframe = (typeof CHART_TIMEFRAMES)[number];
export const DIAPER_TYPES = ["Wet", "Dirty", "Dirty Wet", "Dry"] as const;
export type DiaperTypeKey = (typeof DIAPER_TYPES)[number];

function asDate(value: string) {
  return parseISO(value);
}

function inWindow(startedAt: string, from: Date, to: Date) {
  const date = asDate(startedAt);
  return !isBefore(date, from) && !isAfter(date, to);
}

export function filterEventsByTimeframe<T extends NaraEvent>(
  events: T[],
  timeframe: ChartTimeframe,
  now = new Date(),
) {
  if (timeframe === "all") {
    return events;
  }

  const from = subDays(startOfDay(now), timeframe - 1);
  return events.filter((event) => inWindow(event.startedAt, from, now));
}

function round(value: number, precision = 1) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

export function sortEvents(events: NaraEvent[]) {
  return [...events].sort((a, b) => b.startedAtEpoch - a.startedAtEpoch);
}

export function getDashboardSummary(events: NaraEvent[], now = new Date()) {
  const todayStart = startOfDay(now);
  const last24h = subHours(now, 24);

  const todaysFeeds = events.filter(
    (event): event is BottleFeedEvent =>
      event.type === "Bottle Feed" && inWindow(event.startedAt, todayStart, now),
  );
  const recentSleep = events.filter(
    (event): event is SleepEvent =>
      event.type === "Sleep" && inWindow(event.startedAt, last24h, now),
  );
  const todaysDiapers = events.filter(
    (event): event is DiaperEvent => event.type === "Diaper" && inWindow(event.startedAt, todayStart, now),
  );
  const lastGrowth = sortEvents(events).find((event): event is GrowthEvent => event.type === "Growth");

  return {
    feedTotalMl: todaysFeeds.reduce((sum, event) => sum + (event.formulaVolumeMl ?? 0), 0),
    sleepSeconds: recentSleep.reduce((sum, event) => sum + (event.durationSeconds ?? 0), 0),
    diaperCount: todaysDiapers.length,
    lastGrowth,
  };
}

export function buildDailyAggregate<T extends NaraEvent>(
  events: T[],
  timeframe: ChartTimeframe,
  mapper: (event: T) => number,
  now = new Date(),
) {
  const filteredEvents = filterEventsByTimeframe(events, timeframe, now);
  const start =
    timeframe === "all"
      ? filteredEvents.length
        ? startOfDay(minDate(filteredEvents.map((event) => asDate(event.startedAt))))
        : startOfDay(now)
      : subDays(startOfDay(now), timeframe - 1);
  const range = eachDayOfInterval({ start, end: now });

  return range.map((day) => {
    const value = filteredEvents
      .filter((event) => isSameDay(asDate(event.startedAt), day))
      .reduce((sum, event) => sum + mapper(event), 0);

    return {
      label: format(day, "MMM d"),
      value: round(value, 2),
    } satisfies TrendPoint;
  });
}

export function buildRollingAverage(points: TrendPoint[], size = 7) {
  return points.map((point, index) => {
    const slice = points.slice(Math.max(0, index - size + 1), index + 1);
    const average = slice.reduce((sum, item) => sum + item.value, 0) / slice.length;
    return {
      label: point.label,
      value: round(average, 2),
    } satisfies TrendPoint;
  });
}

export function buildHourlyDistribution<T extends NaraEvent>(
  events: T[],
  mapper: (event: T) => number,
  timeframe: ChartTimeframe = "all",
  now = new Date(),
) {
  const filteredEvents = filterEventsByTimeframe(events, timeframe, now);
  const buckets = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour.toString().padStart(2, "0")}:00`,
    value: 0,
  }));

  filteredEvents.forEach((event) => {
    const hour = asDate(event.startedAt).getHours();
    buckets[hour].value += mapper(event);
  });

  return buckets satisfies DistributionPoint[];
}

export function buildDiaperDailySeries(events: DiaperEvent[], timeframe: ChartTimeframe) {
  const dailyByType = Object.fromEntries(
    DIAPER_TYPES.map((type) => [
      type,
      buildDailyAggregate(
        events.filter((event) => event.diaperType === type),
        timeframe,
        () => 1,
      ),
    ]),
  ) as Record<DiaperTypeKey, TrendPoint[]>;

  const length = dailyByType.Wet.length;
  return Array.from({ length }, (_, index) => ({
    label: dailyByType.Wet[index]?.label ?? "",
    wet: dailyByType.Wet[index]?.value ?? 0,
    dirty: dailyByType.Dirty[index]?.value ?? 0,
    dirtyWet: dailyByType["Dirty Wet"][index]?.value ?? 0,
    dry: dailyByType.Dry[index]?.value ?? 0,
  }));
}

export function buildDiaperHourlySeries(events: DiaperEvent[], timeframe: ChartTimeframe) {
  const hourlyByType = Object.fromEntries(
    DIAPER_TYPES.map((type) => [
      type,
      buildHourlyDistribution(
        events.filter((event) => event.diaperType === type),
        () => 1,
        timeframe,
      ),
    ]),
  ) as Record<DiaperTypeKey, DistributionPoint[]>;

  const length = hourlyByType.Wet.length;
  return Array.from({ length }, (_, index) => ({
    hour: hourlyByType.Wet[index]?.hour ?? "",
    wet: hourlyByType.Wet[index]?.value ?? 0,
    dirty: hourlyByType.Dirty[index]?.value ?? 0,
    dirtyWet: hourlyByType["Dirty Wet"][index]?.value ?? 0,
    dry: hourlyByType.Dry[index]?.value ?? 0,
  }));
}

function getAverageGapSeconds<T extends NaraEvent>(events: T[]) {
  const chronological = [...events].reverse();
  const gaps = chronological.slice(1).map((event, index) => {
    const previous = chronological[index];
    return Math.max(0, (event.startedAtEpoch - previous.startedAtEpoch) / 1000);
  });

  if (gaps.length === 0) {
    return 0;
  }

  return gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
}

function getPeakHour<T extends NaraEvent>(events: T[]) {
  return buildHourlyDistribution(events, () => 1).reduce(
    (max, item) => (item.value > max.value ? item : max),
    { hour: "00:00", value: 0 },
  );
}

function getDaypart(hour: number) {
  if (hour < 6) return "Night";
  if (hour < 12) return "Morning";
  if (hour < 18) return "Afternoon";
  return "Evening";
}

function getPeakDaypart<T extends NaraEvent>(events: T[]) {
  const buckets = {
    Night: 0,
    Morning: 0,
    Afternoon: 0,
    Evening: 0,
  };

  events.forEach((event) => {
    const hour = asDate(event.startedAt).getHours();
    buckets[getDaypart(hour)] += 1;
  });

  return Object.entries(buckets).reduce(
    (max, [label, value]) => (value > max.value ? { label, value } : max),
    { label: "Morning", value: 0 },
  );
}

function interpolateWhoValue(points: readonly WhoWeightPoint[], month: number, key: keyof WhoWeightPoint) {
  if (month <= points[0].month) {
    return points[0][key] as number;
  }

  if (month >= points[points.length - 1].month) {
    return points[points.length - 1][key] as number;
  }

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    if (month >= current.month && month <= next.month) {
      const ratio = (month - current.month) / (next.month - current.month);
      return (current[key] as number) + ((next[key] as number) - (current[key] as number)) * ratio;
    }
  }

  return points[points.length - 1][key] as number;
}

function getWeightAgeMonths(startedAt: string, birthDate: string) {
  return differenceInDays(asDate(startedAt), parseISO(birthDate)) / 30.4375;
}

export function getFeedStats(events: NaraEvent[]) {
  const feedEvents = sortEvents(events).filter((event): event is BottleFeedEvent => event.type === "Bottle Feed");
  const totalMl = feedEvents.reduce((sum, event) => sum + (event.formulaVolumeMl ?? 0), 0);
  const averageMl = feedEvents.length ? totalMl / feedEvents.length : 0;
  const daily = buildDailyAggregate(feedEvents, 14, (event) => (event as BottleFeedEvent).formulaVolumeMl ?? 0);
  const rollingAverage = buildRollingAverage(daily);
  const hourly = buildHourlyDistribution(feedEvents, (event) => (event as BottleFeedEvent).formulaVolumeMl ?? 0);
  const dailyCounts = buildDailyAggregate(feedEvents, 14, () => 1);
  const averageFeedsPerDay = dailyCounts.length
    ? dailyCounts.reduce((sum, item) => sum + item.value, 0) / dailyCounts.length
    : 0;
  const chronologicalFeeds = [...feedEvents].reverse();
  const gapSeconds = chronologicalFeeds.slice(1).map((event, index) => {
    const previous = chronologicalFeeds[index];
    return Math.max(0, (event.startedAtEpoch - previous.startedAtEpoch) / 1000);
  });
  const averageGapSeconds = gapSeconds.length
    ? gapSeconds.reduce((sum, gap) => sum + gap, 0) / gapSeconds.length
    : 0;
  const longestGapSeconds = gapSeconds.length ? Math.max(...gapSeconds) : 0;
  const latestFeed = feedEvents[0] ?? null;
  const peakHour = hourly.reduce((max, item) => (item.value > max.value ? item : max), hourly[0]);
  const currentWeekEvents = filterEventsByTimeframe(feedEvents, 7);
  const previousWeekEvents = feedEvents.filter((event) => {
    const eventDate = asDate(event.startedAt);
    const now = new Date();
    const currentWeekStart = subDays(startOfDay(now), 6);
    const previousWeekStart = subDays(currentWeekStart, 7);
    return !isBefore(eventDate, previousWeekStart) && isBefore(eventDate, currentWeekStart);
  });
  const currentWeekAverageMl = currentWeekEvents.length
    ? currentWeekEvents.reduce((sum, event) => sum + (event.formulaVolumeMl ?? 0), 0) / currentWeekEvents.length
    : 0;
  const previousWeekAverageMl = previousWeekEvents.length
    ? previousWeekEvents.reduce((sum, event) => sum + (event.formulaVolumeMl ?? 0), 0) / previousWeekEvents.length
    : 0;
  const weeklyVariationMl = currentWeekAverageMl - previousWeekAverageMl;

  const insights: InsightItem[] = [
    {
      title: "Feeding cadence",
      detail: averageGapSeconds
        ? `Bottles are spaced about ${round(averageGapSeconds / 3600, 1)} hours apart on average.`
        : "Not enough feed history yet to estimate spacing between bottles.",
    },
    {
      title: "Peak feeding window",
      detail: `${peakHour?.hour ?? "00:00"} is where intake clusters the most across your logs.`,
    },
    {
      title: "Longest stretch between bottles",
      detail: longestGapSeconds
        ? `The longest logged gap is ${round(longestGapSeconds / 3600, 1)} hours, which can help spot overnight stretches.`
        : "No gap pattern available yet.",
    },
  ];

  return {
    events: feedEvents,
    totalMl,
    averageMl,
    daily,
    hourly,
    rollingAverage,
    insights,
    latestFeed,
    averageFeedsPerDay,
    averageGapSeconds,
    longestGapSeconds,
    currentWeekAverageMl,
    previousWeekAverageMl,
    weeklyVariationMl,
  };
}

export function getSleepStats(events: NaraEvent[]) {
  const sleepEvents = sortEvents(events).filter((event): event is SleepEvent => event.type === "Sleep");
  const totalSeconds = sleepEvents.reduce((sum, event) => sum + (event.durationSeconds ?? 0), 0);
  const averageSeconds = sleepEvents.length ? totalSeconds / sleepEvents.length : 0;
  const daily = buildDailyAggregate(sleepEvents, 14, (event) => ((event as SleepEvent).durationSeconds ?? 0) / 3600);
  const rollingAverage = buildRollingAverage(daily);
  const hourly = buildHourlyDistribution(sleepEvents, () => 1);
  const latestSleep = sleepEvents[0] ?? null;
  const dailySessions = buildDailyAggregate(sleepEvents, 14, () => 1);
  const averageSessionsPerDay = dailySessions.length
    ? dailySessions.reduce((sum, item) => sum + item.value, 0) / dailySessions.length
    : 0;
  const longestSleepSeconds = sleepEvents.length
    ? Math.max(...sleepEvents.map((event) => event.durationSeconds ?? 0))
    : 0;
  const currentWeekEvents = filterEventsByTimeframe(sleepEvents, 7);
  const previousWeekEvents = sleepEvents.filter((event) => {
    const eventDate = asDate(event.startedAt);
    const now = new Date();
    const currentWeekStart = subDays(startOfDay(now), 6);
    const previousWeekStart = subDays(currentWeekStart, 7);
    return !isBefore(eventDate, previousWeekStart) && isBefore(eventDate, currentWeekStart);
  });
  const currentWeekAverageSeconds = currentWeekEvents.length
    ? currentWeekEvents.reduce((sum, event) => sum + (event.durationSeconds ?? 0), 0) / currentWeekEvents.length
    : 0;
  const previousWeekAverageSeconds = previousWeekEvents.length
    ? previousWeekEvents.reduce((sum, event) => sum + (event.durationSeconds ?? 0), 0) / previousWeekEvents.length
    : 0;
  const currentWeekLongestSeconds = currentWeekEvents.length
    ? Math.max(...currentWeekEvents.map((event) => event.durationSeconds ?? 0))
    : 0;
  const previousWeekLongestSeconds = previousWeekEvents.length
    ? Math.max(...previousWeekEvents.map((event) => event.durationSeconds ?? 0))
    : 0;
  const weeklyTypicalStretchVariationSeconds = currentWeekAverageSeconds - previousWeekAverageSeconds;
  const weeklyLongestStretchVariationSeconds = currentWeekLongestSeconds - previousWeekLongestSeconds;
  const peakHour = hourly.reduce((max, item) => (item.value > max.value ? item : max), hourly[0]);
  const insights: InsightItem[] = [
    {
      title: "Typical sleep stretch",
      detail: `${round(averageSeconds / 3600, 2)} hours per logged sleep session.`,
    },
    {
      title: "Most common sleep start",
      detail: `${peakHour?.hour ?? "00:00"} is the most frequent sleep start window.`,
    },
    {
      title: "Longest recent stretch",
      detail: longestSleepSeconds
        ? `The longest logged sleep lasted ${round(longestSleepSeconds / 3600, 2)} hours, useful for spotting overnight consolidation.`
        : "No sleep duration pattern available yet.",
    },
  ];

  return {
    events: sleepEvents,
    totalSeconds,
    averageSeconds,
    daily,
    hourly,
    rollingAverage,
    insights,
    latestSleep,
    averageSessionsPerDay,
    longestSleepSeconds,
    weeklyTypicalStretchVariationSeconds,
    weeklyLongestStretchVariationSeconds,
  };
}

export function getDiaperStats(events: NaraEvent[]) {
  const diaperEvents = sortEvents(events).filter((event): event is DiaperEvent => event.type === "Diaper");
  const daily = buildDailyAggregate(diaperEvents, 14, () => 1);
  const rollingAverage = buildRollingAverage(daily);
  const hourly = buildHourlyDistribution(diaperEvents, () => 1);
  const typeCounts = diaperEvents.reduce<Record<string, number>>((acc, event) => {
    const key = event.diaperType || "Unknown";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const normalizedTypeCounts = {
    wet: typeCounts["Wet"] ?? 0,
    dirty: typeCounts["Dirty"] ?? 0,
    dirtyWet: typeCounts["Dirty Wet"] ?? 0,
    dry: typeCounts["Dry"] ?? 0,
  };
  const groupedByType = {
    wet: diaperEvents.filter((event) => event.diaperType === "Wet"),
    dirty: diaperEvents.filter((event) => event.diaperType === "Dirty"),
    dirtyWet: diaperEvents.filter((event) => event.diaperType === "Dirty Wet"),
    dry: diaperEvents.filter((event) => event.diaperType === "Dry"),
  };
  const poopEvents = diaperEvents.filter(
    (event) => event.diaperType === "Dirty" || event.diaperType === "Dirty Wet",
  );
  const timingByType = {
    wet: {
      averageGapSeconds: getAverageGapSeconds(groupedByType.wet),
      peakHour: getPeakHour(groupedByType.wet),
    },
    dirty: {
      averageGapSeconds: getAverageGapSeconds(groupedByType.dirty),
      peakHour: getPeakHour(groupedByType.dirty),
    },
    dirtyWet: {
      averageGapSeconds: getAverageGapSeconds(groupedByType.dirtyWet),
      peakHour: getPeakHour(groupedByType.dirtyWet),
    },
    dry: {
      averageGapSeconds: getAverageGapSeconds(groupedByType.dry),
      peakHour: getPeakHour(groupedByType.dry),
    },
  };
  const latestDiaper = diaperEvents[0] ?? null;
  const latestPoop = poopEvents[0] ?? null;
  const poopPeakHour = getPeakHour(poopEvents);
  const poopPeakDaypart = getPeakDaypart(poopEvents);
  const poopHourly = buildHourlyDistribution(poopEvents, () => 1);
  const poopShare = diaperEvents.length ? (poopEvents.length / diaperEvents.length) * 100 : 0;
  const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
  const dirtyWetShare = poopEvents.length
    ? ((normalizedTypeCounts.dirtyWet / poopEvents.length) * 100)
    : 0;
  const insights: InsightItem[] = [
    {
      title: "When poop usually happens",
      detail:
        poopPeakHour.value > 0
          ? `Poop diapers are logged most often around ${poopPeakHour.hour}.`
          : "No poop timing pattern available yet.",
    },
    {
      title: "Strongest poop time of day",
      detail:
        poopPeakDaypart.value > 0
          ? `${poopPeakDaypart.label} is the most common part of day for poop diapers.`
          : "No time-of-day poop pattern available yet.",
    },
    {
      title: "Most common diaper type",
      detail: topType ? `${topType[0]} is the most frequent diaper type in the log.` : "No diaper type pattern available yet.",
    },
    {
      title: "Poop share",
      detail: `${round(poopShare, 1)}% of diaper logs include poop (dirty or dirty+wet).`,
    },
  ];

  return {
    events: diaperEvents,
    totalCount: diaperEvents.length,
    daily,
    hourly,
    rollingAverage,
    typeCounts,
    normalizedTypeCounts,
    insights,
    latestDiaper,
    timingByType,
    latestPoop,
    poopPeakHour,
    poopPeakDaypart,
    poopHourly,
    poopShare,
    topType,
    dirtyWetShare,
  };
}

export function getPumpStats(events: NaraEvent[]) {
  const pumpEvents = sortEvents(events).filter((event): event is PumpEvent => event.type === "Pump");
  const totalMl = pumpEvents.reduce((sum, event) => sum + (event.totalVolumeMl ?? 0), 0);
  const totalSeconds = pumpEvents.reduce((sum, event) => sum + (event.durationSeconds ?? 0), 0);
  const daily = buildDailyAggregate(pumpEvents, 14, (event) => event.totalVolumeMl ?? 0);
  const rollingAverage = buildRollingAverage(daily);
  const hourly = buildHourlyDistribution(pumpEvents, () => 1);
  const insights: InsightItem[] = [
    {
      title: "Average pump yield",
      detail: `${round(pumpEvents.length ? totalMl / pumpEvents.length : 0)} ml per session.`,
    },
    {
      title: "Average pump duration",
      detail: `${round(pumpEvents.length ? totalSeconds / pumpEvents.length / 60 : 0)} minutes per session.`,
    },
  ];

  return { events: pumpEvents, totalMl, totalSeconds, daily, hourly, rollingAverage, insights };
}

export function getGrowthStats(events: NaraEvent[]) {
  const growthEvents = sortEvents(events).filter((event): event is GrowthEvent => event.type === "Growth");
  const latest = growthEvents[0] ?? null;
  const insights: InsightItem[] = [
    {
      title: "Latest recorded weight",
      detail: latest?.weightKg ? `${latest.weightKg.toFixed(2)} kg on ${format(asDate(latest.startedAt), "MMM d")}.` : "No weight data yet.",
    },
    {
      title: "Weight curve focus",
      detail: "This chart is optimized for weight-for-age tracking against WHO reference curves.",
    },
  ];

  return { events: growthEvents, latest, insights };
}

export function getWeightCurveChartData(
  growthEvents: GrowthEvent[],
  profile: ProfileMetadata | null,
  timeframe: ChartTimeframe,
) {
  const birthDate = profile?.birthDate;
  const sex = profile?.sex;
  const references = sex ? WHO_WEIGHT_FOR_AGE[sex] : null;

  if (!birthDate) {
    return {
      data: [],
      hasWhoReferences: false,
      xDomain: [0, 1] as [number, number],
      yDomain: [0, 1] as [number, number],
    };
  }

  const measurementPoints = growthEvents
    .filter((event) => event.weightKg != null)
    .map((event) => ({
      month: round(getWeightAgeMonths(event.startedAt, birthDate), 2),
      weight: event.weightKg ?? null,
    }))
    .sort((a, b) => a.month - b.month);

  const latestMonth = measurementPoints.length
    ? measurementPoints[measurementPoints.length - 1].month
    : round(getWeightAgeMonths(new Date().toISOString(), birthDate), 2);
  const timeframeInMonths = timeframe === "all" ? null : timeframe / 30.4375;
  const domainStart = timeframeInMonths == null ? 0 : Math.max(0, round(latestMonth - timeframeInMonths, 2));
  const domainEnd = Math.max(domainStart + 0.5, round(latestMonth + 0.25, 2));

  const filteredMeasurements = measurementPoints.filter(
    (point) => point.month >= domainStart && point.month <= domainEnd,
  );

  const referenceMonths = references
    ? references
        .filter((point) => point.month >= domainStart && point.month <= domainEnd)
        .map((point) => point.month)
    : [];
  const months = Array.from(
    new Set([domainStart, domainEnd, ...filteredMeasurements.map((point) => point.month), ...referenceMonths]),
  ).sort((a, b) => a - b);

  const data = months.map((month) => {
    const measurement = filteredMeasurements.find((point) => point.month === month);

    if (!references) {
      return {
        month,
        weight: measurement?.weight ?? null,
        p3: null,
        p15: null,
        p50: null,
        p85: null,
        p97: null,
      };
    }

    return {
      month,
      weight: measurement?.weight ?? null,
      p3: round(interpolateWhoValue(references, month, "p3"), 2),
      p15: round(interpolateWhoValue(references, month, "p15"), 2),
      p50: round(interpolateWhoValue(references, month, "p50"), 2),
      p85: round(interpolateWhoValue(references, month, "p85"), 2),
      p97: round(interpolateWhoValue(references, month, "p97"), 2),
    };
  });

  const yValues = data.flatMap((point) =>
    [point.weight, point.p3, point.p15, point.p50, point.p85, point.p97].filter(
      (value): value is number => typeof value === "number",
    ),
  );
  const minY = yValues.length ? Math.min(...yValues) : 0;
  const maxY = yValues.length ? Math.max(...yValues) : 1;

  return {
    data,
    hasWhoReferences: Boolean(references),
    xDomain: [domainStart, domainEnd] as [number, number],
    yDomain: [Math.max(0, Math.floor((minY - 0.4) * 2) / 2), Math.ceil((maxY + 0.4) * 2) / 2] as [number, number],
  };
}
