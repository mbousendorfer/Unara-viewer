"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppData } from "@/components/app-data-provider";

export function ClearDataButton() {
  const { clearData, isClearing, isImporting, events } = useAppData();

  if (events.length === 0) {
    return null;
  }

  return (
    <Button
      variant="outline"
      className="border-destructive/25 text-destructive hover:bg-destructive/8 hover:text-destructive"
      disabled={isClearing || isImporting}
      onClick={() => {
        if (!window.confirm("Erase all imported data from the database? This cannot be undone.")) {
          return;
        }

        void clearData();
      }}
    >
      <Trash2 className="h-4 w-4" />
      {isClearing ? "Erasing..." : "Erase all data"}
    </Button>
  );
}
