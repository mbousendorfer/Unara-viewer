import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ChartCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="h-full bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,244,238,0.94))] dark:bg-[linear-gradient(180deg,rgba(26,31,33,0.96),rgba(19,24,25,0.94))]">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
          <CardDescription className="max-w-2xl leading-6">{description}</CardDescription>
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
