import { FileUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <FileUp className="h-5 w-5" />
          </div>
          Import a Nara Baby CSV export to get started
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Import a Nara Baby CSV export to sync events into the app database with `_activityKey`.
      </CardContent>
    </Card>
  );
}
