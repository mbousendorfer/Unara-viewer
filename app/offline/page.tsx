import { WifiOff } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-6">
      <Card className="w-full bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,244,238,0.96))] dark:bg-[linear-gradient(180deg,rgba(26,31,33,0.96),rgba(19,24,25,0.96))]">
        <CardHeader className="gap-4">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="rounded-[1.25rem] bg-[#A9C3E6]/24 p-3 text-[#486789]">
              <WifiOff className="h-6 w-6" />
            </div>
            You&apos;re offline
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-muted-foreground">
          Reconnect to import new CSV files. If you have already opened Nara Insights on this device, the latest cached snapshot will load as soon as the app shell is available.
        </CardContent>
      </Card>
    </main>
  );
}
