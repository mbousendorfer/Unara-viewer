import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { eventTheme, type EventTone } from "@/lib/event-theme";

export function ChartCard({
  title,
  description,
  action,
  children,
  tone = "routine",
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  tone?: EventTone;
}) {
  const palette = eventTheme[tone];

  return (
    <Card className="h-full overflow-hidden bg-surface-elevated">
      <div className={`h-1.5 w-full ${palette.topBorder}`} />
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
          <CardDescription className="max-w-2xl leading-6">{description}</CardDescription>
        </div>
        {action ? <div className="w-full sm:w-auto">{action}</div> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
