"use client";

import { CheckCircle2, FileUp, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useImportCsv } from "@/hooks/use-import-csv";
import { cn } from "@/lib/utils";

export function ImportCard({ inline = false }: { inline?: boolean }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { handleImport, isImporting, summary, error } = useImportCsv();

  const summaryLabel = useMemo(() => {
    if (!summary) {
      return null;
    }

    return `${summary.inserted} added, ${summary.updated} updated, ${summary.deleted} removed`;
  }, [summary]);

  async function importFile(file: File) {
    await handleImport(file);
  }

  const trigger = (
    <>
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept=".csv,text/csv"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            void importFile(file);
            event.target.value = "";
          }
        }}
      />
      <Button
        className={cn("w-full sm:w-auto", inline ? "" : "sm:min-w-40")}
        onClick={() => {
          inputRef.current?.click();
        }}
        disabled={isImporting}
      >
        <Upload className="h-4 w-4" />
        {isImporting ? "Importing..." : "Choose CSV"}
      </Button>
    </>
  );

  if (inline) {
    return (
      <div className="flex flex-col items-stretch gap-2 sm:items-end">
        {trigger}
        {summaryLabel ? <p className="text-sm text-muted-foreground sm:text-right">{summaryLabel}</p> : null}
        {error ? <p className="text-sm text-destructive sm:text-right">{error}</p> : null}
      </div>
    );
  }

  return (
    <Card className="bg-surface-elevated">
      <CardHeader>
        <CardTitle>Import CSV</CardTitle>
        <CardDescription>Open the CSV from Files or Downloads to sync your local analytics database using `_activityKey`.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={cn(
            "rounded-[1.5rem] border border-dashed border-border bg-surface-muted p-4 transition-colors",
            isDragging && "border-primary bg-primary/8",
          )}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);

            const file = event.dataTransfer.files?.[0];
            if (file) {
              void importFile(file);
            }
          }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-[1.1rem] bg-primary/12 p-3 text-primary">
                <FileUp className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-text-primary">Large touch target for phone imports</p>
                <p className="text-sm leading-6 text-text-secondary">
                  Tap to pick a file, or drag a CSV here on desktop.
                </p>
              </div>
            </div>
            {trigger}
          </div>
        </div>
        {summaryLabel ? (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            {summaryLabel}
          </div>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
