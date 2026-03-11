"use client";

import { LaptopMinimal, Moon, Sun } from "lucide-react";

import { useTheme, type ThemePreference } from "@/components/theme-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const options: Array<{
  value: ThemePreference;
  label: string;
  icon: typeof Sun;
}> = [
  { value: "system", label: "System", icon: LaptopMinimal },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();
  const selected = options.find((option) => option.value === preference) ?? options[0];

  return (
    <Select value={preference} onValueChange={(value) => setPreference(value as ThemePreference)}>
      <SelectTrigger className="min-w-32 bg-card/80">
        <SelectValue>{selected.label}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <SelectItem key={option.value} value={option.value}>
              <span className="inline-flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {option.label}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
