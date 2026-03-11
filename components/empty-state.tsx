import { FileUp } from "lucide-react";

import { ImportCard } from "@/components/import-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmptyState() {
  return (
    <Card className="border-dashed bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,244,238,0.98))] dark:bg-[linear-gradient(180deg,rgba(26,31,33,0.96),rgba(19,24,25,0.96))]">
      <CardHeader className="gap-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="rounded-[1.25rem] bg-primary/12 p-3 text-primary">
            <FileUp className="h-5 w-5" />
          </div>
          Import a Nara Baby CSV export to get started
        </CardTitle>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          No data yet. Import a Nara export to see today&apos;s activity, recent changes, and longer-term trends.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
        <p>The import stays local to this app and syncs events into the on-device database using `_activityKey`.</p>
        <ImportCard />
      </CardContent>
    </Card>
  );
}
