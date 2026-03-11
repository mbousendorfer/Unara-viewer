"use client";

import { Download } from "lucide-react";

import { useAppData } from "@/components/app-data-provider";
import { Button } from "@/components/ui/button";

export function InstallAppButton() {
  const { canInstall, isStandalone, installApp } = useAppData();

  if (isStandalone || !canInstall) {
    return null;
  }

  return (
    <Button variant="outline" className="w-full sm:w-auto" onClick={() => void installApp()}>
      <Download className="h-4 w-4" />
      Install app
    </Button>
  );
}
