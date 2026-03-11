import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const toneClassNames = {
  accent: "bg-accent-soft text-accent-foreground",
  info: "bg-tone-sleep/18 text-tone-sleep-foreground",
  danger: "bg-danger/12 text-danger",
} as const;

export function StateCard({
  icon: Icon,
  iconClassName,
  title,
  children,
  tone = "accent",
  action,
  className,
}: {
  icon: LucideIcon;
  iconClassName?: string;
  title: string;
  children: React.ReactNode;
  tone?: keyof typeof toneClassNames;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("border-dashed bg-surface-elevated", className)}>
      <CardHeader className="gap-4">
        <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
          <div className={cn("rounded-2xl p-3", toneClassNames[tone])}>
            <Icon className={cn("h-5 w-5", iconClassName)} />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-6 text-text-secondary">
        <div>{children}</div>
        {action}
      </CardContent>
    </Card>
  );
}
