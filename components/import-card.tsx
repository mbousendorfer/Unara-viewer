"use client";

import { CheckCircle2, Upload } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useImportCsv } from "@/hooks/use-import-csv";
import { cn } from "@/lib/utils";

export function ImportCard({ inline = false }: { inline?: boolean }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { handleImport, isImporting, summary, error } = useImportCsv();

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
            void handleImport(file);
            event.target.value = "";
          }
        }}
      />
      <Button
        className={cn(inline ? "w-full sm:w-auto" : "w-full sm:w-auto")}
        onClick={() => inputRef.current?.click()}
        disabled={isImporting}
      >
        <Upload className="h-4 w-4" />
        {isImporting ? "Importing..." : "Import CSV"}
      </Button>
    </>
  );

  if (inline) {
    return (
      <div className="flex flex-col items-stretch gap-2 sm:items-end">
        {trigger}
        {summary ? <p className="text-sm text-muted-foreground sm:text-right">Import completed.</p> : null}
        {error ? <p className="text-sm text-destructive sm:text-right">{error}</p> : null}
      </div>
    );
  }

  return (
    <Card className="bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,244,238,0.98))] dark:bg-[linear-gradient(180deg,rgba(26,31,33,0.96),rgba(19,24,25,0.96))]">
      <CardHeader>
        <CardTitle>Import CSV</CardTitle>
        <CardDescription>Upload a Nara Baby export to sync your local analytics database using `_activityKey`.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {trigger}
        {summary ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Import completed successfully.
          </div>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
