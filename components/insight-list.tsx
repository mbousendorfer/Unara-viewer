import { Sparkles } from "lucide-react";

import { InsightCard } from "@/components/insight-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { eventTheme, type EventTone } from "@/lib/event-theme";
import type { InsightItem } from "@/lib/types";

export function InsightList({
  items,
  tone = "routine",
}: {
  items: InsightItem[];
  tone?: EventTone;
}) {
  const palette = eventTheme[tone];

  return (
    <Card className="overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,244,238,0.94))] dark:bg-[linear-gradient(180deg,rgba(26,31,33,0.96),rgba(19,24,25,0.94))]">
      <div className={`h-1.5 w-full ${palette.topBorder}`} />
      <CardHeader className="gap-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Sparkles className={`h-5 w-5 ${palette.accentText}`} />
          Recent insights
        </CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          Short observations to surface what changed without reading every chart first.
        </p>
      </CardHeader>
      <CardContent className="grid gap-4">
        {items.map((item) => (
          <InsightCard key={item.title} title={item.title} detail={item.detail} tone={tone} />
        ))}
      </CardContent>
    </Card>
  );
}
