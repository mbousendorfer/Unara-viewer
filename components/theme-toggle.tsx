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
    <div className="inline-flex min-h-11 items-center gap-1 rounded-full border border-border bg-card/85 p-1 shadow-[0_12px_24px_-22px_rgba(67,73,54,0.32)] dark:border-white/12 dark:bg-[#151b1d] dark:shadow-none">
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
                ? "bg-foreground text-white shadow-[0_12px_24px_-20px_rgba(47,58,50,0.8)] dark:border dark:border-primary/28 dark:bg-primary/18 dark:text-primary dark:shadow-none"
                : "text-muted-foreground hover:bg-muted hover:text-foreground dark:text-[#d4d9d1] dark:hover:bg-[#1f2628] dark:hover:text-[#f2f4ee]",
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
