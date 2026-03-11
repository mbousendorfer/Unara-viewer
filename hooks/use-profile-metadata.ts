"use client";

import { useAppData } from "@/components/app-data-provider";

export function useProfileMetadata() {
  const { profile, isLoading, loadError } = useAppData();

  return {
    profile,
    isLoading,
    loadError,
  };
}
