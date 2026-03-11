"use client";

import { useAppData } from "@/components/app-data-provider";

export function useEvents() {
  const { events, isLoading, isOffline, loadError, syncedAt } = useAppData();

  return {
    events,
    isLoading,
    isOffline,
    loadError,
    syncedAt,
  };
}
