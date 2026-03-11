"use client";

import { useAppData } from "@/components/app-data-provider";

export function useImportCsv() {
  const { isImporting, importSummary, importError, importFile } = useAppData();

  return {
    isImporting,
    summary: importSummary,
    error: importError,
    handleImport: importFile,
  };
}
