"use client";

import { Upload } from "lucide-react";
import { useRef } from "react";

import { Badge } from "@/components/ui/badge";
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
        {summary ? (
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Badge>{summary.inserted} imported</Badge>
            <Badge variant="secondary">{summary.updated} updated</Badge>
            <Badge variant="outline">{summary.deleted} removed</Badge>
          </div>
        ) : null}
        {error ? <p className="text-sm text-destructive sm:text-right">{error}</p> : null}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import CSV</CardTitle>
        <CardDescription>Upload a Nara Baby export to sync the SQLite database using `_activityKey`.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {trigger}
        {summary ? (
          <div className="flex flex-wrap gap-2">
            <Badge>{summary.inserted} imported</Badge>
            <Badge variant="secondary">{summary.updated} updated</Badge>
            <Badge variant="outline">{summary.deleted} removed</Badge>
            <Badge variant="outline">{summary.totalRows} rows in CSV</Badge>
          </div>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
