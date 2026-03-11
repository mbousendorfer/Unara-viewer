import { CloudOff, LoaderCircle, TriangleAlert, WifiOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StateCard } from "@/components/ui/state-card";

export function LoadingState() {
  return (
    <StateCard icon={LoaderCircle} iconClassName="animate-spin" title="Loading your local analytics">
      <div className="text-sm leading-6 text-text-secondary">
        Fetching the latest imported snapshot and preparing charts for this device.
      </div>
    </StateCard>
  );
}

export function OfflineState({
  syncedAt,
  onRetry,
}: {
  syncedAt?: string | null;
  onRetry?: () => void;
}) {
  return (
    <StateCard
      icon={WifiOff}
      title="You&apos;re offline"
      tone="info"
      action={
        onRetry ? (
          <Button variant="outline" className="w-full sm:w-auto" onClick={onRetry}>
            Retry sync
          </Button>
        ) : null
      }
    >
      <div className="space-y-4 text-sm leading-6 text-text-secondary">
        <p>
          The app can keep showing the most recent imported snapshot on this phone, but CSV imports and live refreshes need a connection.
        </p>
        {syncedAt ? <p>Last synced snapshot: {new Date(syncedAt).toLocaleString()}.</p> : null}
      </div>
    </StateCard>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <StateCard
      icon={TriangleAlert}
      title="Unable to load this snapshot"
      tone="danger"
      action={
        onRetry ? (
          <Button variant="outline" className="w-full sm:w-auto" onClick={onRetry}>
            Try again
          </Button>
        ) : null
      }
    >
      <div className="space-y-4 text-sm leading-6 text-text-secondary">
        <p>{message}</p>
      </div>
    </StateCard>
  );
}

export function OfflineEmptyState() {
  return (
    <StateCard icon={CloudOff} title="No cached data is available offline yet" tone="info">
      <div className="text-sm leading-6 text-text-secondary">
        Open the app once while online, then your latest snapshot will stay available on the phone for offline viewing.
      </div>
    </StateCard>
  );
}
