import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const toneStyles = {
  feed: {
    icon: "bg-[#F6C453]/20 text-[#9B6B00]",
    metric: "text-[#7D5A10]",
  },
  sleep: {
    icon: "bg-[#A9C3E6]/24 text-[#486789]",
    metric: "text-[#36526F]",
  },
  diaper: {
    icon: "bg-[#E6DCC8]/38 text-[#7A684D]",
    metric: "text-[#5F513C]",
  },
  pump: {
    icon: "bg-[#D6A6A0]/26 text-[#8D5B56]",
    metric: "text-[#724541]",
  },
  growth: {
    icon: "bg-[#9CC48D]/24 text-[#4C7053]",
    metric: "text-[#3D5C42]",
  },
  routine: {
    icon: "bg-[#C4B2D6]/24 text-[#6C5A80]",
    metric: "text-[#58476A]",
  },
} as const;

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
  tone?: keyof typeof toneStyles;
  trend?: {
    value: number;
    label: string;
    suffix?: string;
    display?: string;
  };
}) {
  const palette = toneStyles[tone];
  const trendDirection = trend ? (trend.value > 0 ? "up" : trend.value < 0 ? "down" : "flat") : null;
  const TrendIcon = trendDirection === "up" ? ArrowUpRight : trendDirection === "down" ? ArrowDownRight : Minus;
  const trendClassName =
    trendDirection === "up"
      ? "bg-[#9CC48D]/22 text-[#446449]"
      : trendDirection === "down"
        ? "bg-[#A9C3E6]/24 text-[#42637E]"
        : "bg-muted text-muted-foreground";
  const cardTintClassName =
    trendDirection === "up"
      ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(242,248,239,0.94))] dark:bg-[linear-gradient(180deg,rgba(26,31,33,0.96),rgba(22,31,25,0.94))]"
      : trendDirection === "down"
        ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(239,245,250,0.94))] dark:bg-[linear-gradient(180deg,rgba(26,31,33,0.96),rgba(20,26,32,0.94))]"
        : "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,244,238,0.94))] dark:bg-[linear-gradient(180deg,rgba(26,31,33,0.96),rgba(19,24,25,0.94))]";

  return (
    <Card className={`h-full ${cardTintClassName}`}>
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
