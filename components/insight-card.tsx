import { Lightbulb } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function InsightCard({
  title,
  detail,
  className,
}: {
  title: string;
  detail: string;
  className?: string;
}) {
  return (
    <Card className={cn("h-full bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,244,238,0.98))] dark:bg-[linear-gradient(180deg,rgba(26,31,33,0.96),rgba(19,24,25,0.96))]", className)}>
      <CardHeader className="gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Insight</p>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
