"use client";

import { useAppData } from "@/components/app-data-provider";

export function useProfileMetadata() {
  const { profile, isLoading } = useAppData();

  return {
    profile,
    isLoading,
  };
}
