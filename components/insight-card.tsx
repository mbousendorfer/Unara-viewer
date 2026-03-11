import { Lightbulb } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { eventTheme, type EventTone } from "@/lib/event-theme";
import { cn } from "@/lib/utils";

export function InsightCard({
  title,
  detail,
  tone = "routine",
  className,
}: {
  title: string;
  detail: string;
  tone?: EventTone;
  className?: string;
}) {
  const palette = eventTheme[tone];

  return (
    <Card className={cn("h-full overflow-hidden bg-surface-elevated", className)}>
      <div className={`h-1.5 w-full ${palette.topBorder}`} />
      <CardHeader className="gap-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-full ${palette.icon}`}>
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Insight</p>
            <h3 className="text-base font-semibold text-text-primary">{title}</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-text-secondary">{detail}</p>
      </CardContent>
    </Card>
  );
}
