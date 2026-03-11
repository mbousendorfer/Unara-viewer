"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { sortEvents } from "@/lib/analytics";
import type { ImportSummary, NaraEvent, ProfileMetadata } from "@/lib/types";

type AppDataContextValue = {
  events: NaraEvent[];
  profile: ProfileMetadata | null;
  isLoading: boolean;
  isOffline: boolean;
  isStandalone: boolean;
  canInstall: boolean;
  isImporting: boolean;
  isClearing: boolean;
  loadError: string | null;
  importSummary: ImportSummary | null;
  importError: string | null;
  syncedAt: string | null;
  refresh: () => Promise<void>;
  importFile: (file: File) => Promise<void>;
  clearData: () => Promise<void>;
  installApp: () => Promise<boolean>;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<NaraEvent[]>([]);
  const [profile, setProfile] = useState<ProfileMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [syncedAt, setSyncedAt] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoadError(null);

      const response = await fetch("/api/data", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Unable to load data.");
      }

      const payload = (await response.json()) as {
        events: NaraEvent[];
        profile: ProfileMetadata | null;
      };

      startTransition(() => {
        setEvents(sortEvents(payload.events));
        setProfile(payload.profile);
        setSyncedAt(new Date().toISOString());
        setIsLoading(false);
      });
    } catch (error) {
      startTransition(() => {
        setLoadError(error instanceof Error ? error.message : "Unable to load data.");
        setIsLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    const updateConnectivity = () => {
      setIsOffline(typeof window !== "undefined" ? !window.navigator.onLine : false);
    };

    updateConnectivity();
    window.addEventListener("online", updateConnectivity);
    window.addEventListener("offline", updateConnectivity);

    void refresh();

    return () => {
      window.removeEventListener("online", updateConnectivity);
      window.removeEventListener("offline", updateConnectivity);
    };
  }, [refresh]);

  const importFile = useCallback(async (file: File) => {
    setIsImporting(true);
    setImportError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as ImportSummary & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to import CSV.");
      }

      setImportSummary(payload);
      await refresh();
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Unable to import CSV.");
    } finally {
      setIsImporting(false);
    }
  }, [refresh]);

  const clearData = useCallback(async () => {
    setIsClearing(true);
    setImportError(null);

    try {
      const response = await fetch("/api/data", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to erase stored data.");
      }

      startTransition(() => {
        setEvents([]);
        setProfile(null);
        setImportSummary(null);
        setSyncedAt(null);
        setLoadError(null);
      });
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Unable to erase stored data.");
    } finally {
      setIsClearing(false);
    }
  }, []);

  const value = useMemo<AppDataContextValue>(
    () => ({
      events,
      profile,
      isLoading,
      isOffline,
      isStandalone: false,
      canInstall: false,
      isImporting,
      isClearing,
      loadError,
      importSummary,
      importError,
      syncedAt,
      refresh,
      importFile,
      clearData,
      installApp: async () => false,
    }),
    [
      events,
      profile,
      isLoading,
      isOffline,
      isImporting,
      isClearing,
      loadError,
      importSummary,
      importError,
      syncedAt,
      refresh,
      importFile,
      clearData,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error("useAppData must be used within AppDataProvider.");
  }

  return context;
}
