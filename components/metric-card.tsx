import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { eventTheme, type EventTone } from "@/lib/event-theme";

export function MetricCard({
  title,
  value,
  detail,
  icon: Icon,
  tone = "routine",
  trend,
}: {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: EventTone;
  trend?: {
    value: number;
    label: string;
    suffix?: string;
    display?: string;
  };
}) {
  const palette = eventTheme[tone];
  const trendDirection = trend ? (trend.value > 0 ? "up" : trend.value < 0 ? "down" : "flat") : null;
  const TrendIcon = trendDirection === "up" ? ArrowUpRight : trendDirection === "down" ? ArrowDownRight : Minus;
  const trendClassName =
    trendDirection === "up"
      ? "bg-success/15 text-success"
      : trendDirection === "down"
        ? "bg-tone-sleep/16 text-tone-sleep-foreground"
        : "bg-surface-muted text-text-secondary";
  const cardTintClassName =
    trendDirection === "up"
      ? "bg-[linear-gradient(180deg,var(--color-surface-elevated),color-mix(in_srgb,var(--color-surface-elevated)_82%,var(--color-success)_18%))]"
      : trendDirection === "down"
        ? "bg-[linear-gradient(180deg,var(--color-surface-elevated),color-mix(in_srgb,var(--color-surface-elevated)_82%,var(--color-tone-sleep)_18%))]"
        : "bg-surface-elevated";

  return (
    <Card className={`h-full overflow-hidden ${cardTintClassName}`}>
      <div className={`h-1.5 w-full ${palette.topBorder}`} />
      <CardHeader className="flex flex-row items-start justify-between space-y-0 gap-4">
        <div>
          <CardTitle className="text-sm font-medium text-text-secondary">{title}</CardTitle>
          <div className={`metric-value mt-3 text-3xl font-semibold tracking-tight sm:text-[2rem] ${palette.metric}`}>{value}</div>
        </div>
        <div className={`rounded-[1.25rem] p-3 ${palette.icon}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {trend ? (
          <div className="flex items-center gap-2">
            <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${trendClassName}`}>
              <TrendIcon className="h-4 w-4" />
              {trend.display ?? `${trend.value >= 0 ? "+" : ""}${Math.round(trend.value)}${trend.suffix ?? ""}`}
            </div>
            <p className="text-sm text-text-secondary">{trend.label}</p>
          </div>
        ) : null}
        <p className="text-sm leading-6 text-text-secondary">{detail}</p>
      </CardContent>
    </Card>
  );
}
