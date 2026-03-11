"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ThemePreference = "light" | "dark" | "system";
type EffectiveTheme = "light" | "dark";

type ThemeContextValue = {
  preference: ThemePreference;
  effectiveTheme: EffectiveTheme;
  setPreference: (preference: ThemePreference) => void;
};

const STORAGE_KEY = "nara-theme-preference";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): EffectiveTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(preference: ThemePreference) {
  const effectiveTheme = preference === "system" ? getSystemTheme() : preference;
  const root = document.documentElement;

  root.classList.toggle("dark", effectiveTheme === "dark");
  root.style.colorScheme = effectiveTheme;
  root.dataset.themePreference = preference;

  return effectiveTheme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const nextPreference =
      stored === "light" || stored === "dark" || stored === "system" ? stored : "system";

    setPreferenceState(nextPreference);
    setEffectiveTheme(applyTheme(nextPreference));
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (preference === "system") {
        setEffectiveTheme(applyTheme("system"));
      }
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [preference]);

  function setPreference(nextPreference: ThemePreference) {
    window.localStorage.setItem(STORAGE_KEY, nextPreference);
    setPreferenceState(nextPreference);
    setEffectiveTheme(applyTheme(nextPreference));
  }

  const value = useMemo(
    () => ({
      preference,
      effectiveTheme,
      setPreference,
    }),
    [effectiveTheme, preference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }

  return context;
}
