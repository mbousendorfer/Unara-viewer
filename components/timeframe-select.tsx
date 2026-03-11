"use client";

import { CHART_TIMEFRAMES, type ChartTimeframe } from "@/lib/analytics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function formatTimeframeLabel(value: ChartTimeframe) {
  return value === "all" ? "All" : `${value}d`;
}

export function TimeframeSelect({
  value,
  onChange,
}: {
  value: ChartTimeframe;
  onChange: (value: ChartTimeframe) => void;
}) {
  return (
    <Select value={String(value)} onValueChange={(next) => onChange(next === "all" ? "all" : Number(next) as ChartTimeframe)}>
      <SelectTrigger className="min-h-11 w-full bg-card/80 text-xs sm:w-[92px] dark:bg-card">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {CHART_TIMEFRAMES.map((timeframe) => (
          <SelectItem key={String(timeframe)} value={String(timeframe)}>
            {formatTimeframeLabel(timeframe)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
