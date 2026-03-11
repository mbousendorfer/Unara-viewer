import { WifiOff } from "lucide-react";

import { StateCard } from "@/components/ui/state-card";

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-6">
      <div className="w-full">
        <StateCard icon={WifiOff} title="You&apos;re offline" tone="info">
          <div className="text-sm leading-6 text-text-secondary">
            Reconnect to import new CSV files. If you have already opened Nara Insights on this device, the latest cached snapshot will load as soon as the app shell is available.
          </div>
        </StateCard>
      </div>
    </main>
  );
}
