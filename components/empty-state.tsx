import { FileUp } from "lucide-react";

import { ImportCard } from "@/components/import-card";
import { StateCard } from "@/components/ui/state-card";

export function EmptyState() {
  return (
    <StateCard icon={FileUp} title="Import a Nara Baby CSV export to get started">
      <p className="max-w-2xl text-sm leading-6 text-text-secondary">
        No data yet. Import a Nara export to see recent changes, weekly trends, and longer-term patterns.
      </p>
      <div className="space-y-4 text-sm leading-6 text-text-secondary">
        <p>The import stays local to this app and syncs events into the on-device database using `_activityKey`.</p>
        <ImportCard />
      </div>
    </StateCard>
  );
}
