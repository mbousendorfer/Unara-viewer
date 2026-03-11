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
      ? "bg-[#9CC48D]/22 text-[#446449] dark:bg-[#9CC48D]/18 dark:text-[#D4EFCB]"
      : trendDirection === "down"
        ? "bg-[#A9C3E6]/24 text-[#42637E] dark:bg-[#A9C3E6]/18 dark:text-[#D7E8FB]"
        : "bg-muted text-muted-foreground dark:bg-muted/80 dark:text-[#E4EAE0]";
  const cardTintClassName =
    trendDirection === "up"
      ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(242,248,239,0.94))] dark:bg-[linear-gradient(180deg,rgba(24,29,31,0.98),rgba(18,30,25,0.96))]"
      : trendDirection === "down"
        ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(239,245,250,0.94))] dark:bg-[linear-gradient(180deg,rgba(24,29,31,0.98),rgba(18,24,31,0.96))]"
        : "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,244,238,0.94))] dark:bg-[linear-gradient(180deg,rgba(24,29,31,0.98),rgba(20,24,26,0.96))]";

  return (
    <Card className={`h-full overflow-hidden ${cardTintClassName}`}>
      <div className={`h-1.5 w-full ${palette.topBorder}`} />
      <CardHeader className="flex flex-row items-start justify-between space-y-0 gap-4">
        <div>
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className={`mt-3 text-3xl font-semibold tracking-tight sm:text-[2rem] ${palette.metric}`}>{value}</div>
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
            <p className="text-sm text-muted-foreground">{trend.label}</p>
          </div>
        ) : null}
        <p className="text-sm leading-6 text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
