"use client";

import { LaptopMinimal, Moon, Sun } from "lucide-react";

import { useTheme, type ThemePreference } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const options: Array<{
  value: ThemePreference;
  label: string;
  icon: typeof Sun;
}> = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: LaptopMinimal },
];

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <div className="inline-flex min-h-11 items-center gap-1 rounded-full border border-border bg-surface p-1 shadow-[var(--shadow-soft)]">
      {options.map((option) => {
        const Icon = option.icon;
        const active = option.value === preference;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setPreference(option.value)}
            className={cn(
              "inline-flex min-h-9 items-center gap-2 rounded-full px-3 text-sm font-medium transition",
              active
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-interactive)]"
                : "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
            )}
            aria-pressed={active}
          >
            <Icon className="h-4 w-4" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
