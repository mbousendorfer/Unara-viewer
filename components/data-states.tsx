import { CloudOff, LoaderCircle, TriangleAlert, WifiOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoadingState() {
  return (
    <Card className="border-dashed bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(247,244,238,0.98))] dark:bg-[linear-gradient(180deg,rgba(26,31,33,0.96),rgba(19,24,25,0.96))]">
      <CardHeader className="gap-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="rounded-[1.25rem] bg-primary/12 p-3 text-primary">
            <LoaderCircle className="h-5 w-5 animate-spin" />
          </div>
          Loading your local analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-6 text-muted-foreground">
        Fetching the latest imported snapshot and preparing charts for this device.
      </CardContent>
    </Card>
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
    <Card className="border-dashed bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(247,244,238,0.98))] dark:bg-[linear-gradient(180deg,rgba(26,31,33,0.96),rgba(19,24,25,0.96))]">
      <CardHeader className="gap-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="rounded-[1.25rem] bg-[#A9C3E6]/24 p-3 text-[#486789]">
            <WifiOff className="h-5 w-5" />
          </div>
          You&apos;re offline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
        <p>
          The app can keep showing the most recent imported snapshot on this phone, but CSV imports and live refreshes need a connection.
        </p>
        {syncedAt ? <p>Last synced snapshot: {new Date(syncedAt).toLocaleString()}.</p> : null}
        {onRetry ? (
          <Button variant="outline" className="w-full sm:w-auto" onClick={onRetry}>
            Retry sync
          </Button>
        ) : null}
      </CardContent>
    </Card>
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
    <Card className="border-dashed bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(247,244,238,0.98))] dark:bg-[linear-gradient(180deg,rgba(26,31,33,0.96),rgba(19,24,25,0.96))]">
      <CardHeader className="gap-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="rounded-[1.25rem] bg-destructive/12 p-3 text-destructive">
            <TriangleAlert className="h-5 w-5" />
          </div>
          Unable to load this snapshot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
        <p>{message}</p>
        {onRetry ? (
          <Button variant="outline" className="w-full sm:w-auto" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function OfflineEmptyState() {
  return (
    <Card className="border-dashed bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(247,244,238,0.98))] dark:bg-[linear-gradient(180deg,rgba(26,31,33,0.96),rgba(19,24,25,0.96))]">
      <CardHeader className="gap-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="rounded-[1.25rem] bg-[#A9C3E6]/24 p-3 text-[#486789]">
            <CloudOff className="h-5 w-5" />
          </div>
          No cached data is available offline yet
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-6 text-muted-foreground">
        Open the app once while online, then your latest snapshot will stay available on the phone for offline viewing.
      </CardContent>
    </Card>
  );
}
