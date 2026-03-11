"use client";

import { useAppData } from "@/components/app-data-provider";

export function useEvents() {
  const { events, isLoading } = useAppData();

  return {
    events,
    isLoading,
  };
}
