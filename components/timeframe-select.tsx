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
      <SelectTrigger className="h-9 w-[92px] bg-white/70 text-xs">
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
