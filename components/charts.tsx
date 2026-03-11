"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DistributionPoint, TrendPoint } from "@/lib/types";

const tooltipStyle = {
  borderRadius: "16px",
  border: "1px solid var(--chart-tooltip-border)",
  backgroundColor: "var(--chart-tooltip-bg)",
  boxShadow: "var(--chart-tooltip-shadow)",
};

function useCompactChart() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const handleChange = () => setCompact(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return compact;
}

function ChartFrame({
  compact,
  tall = false,
  children,
}: {
  compact: boolean;
  tall?: boolean;
  children: React.ReactNode;
}) {
  return <div className={compact ? (tall ? "h-[19rem]" : "h-64") : tall ? "h-80" : "h-72"}>{children}</div>;
}

export function DailyChart({
  data,
  valueLabel,
}: {
  data: TrendPoint[];
  valueLabel: string;
}) {
  const compact = useCompactChart();

  return (
    <ChartFrame compact={compact}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={compact ? { top: 8, right: 4, left: -18, bottom: 4 } : { top: 8, right: 8, left: -6, bottom: 4 }}>
          <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={compact ? 20 : 12} tick={{ fontSize: compact ? 11 : 12, fill: "var(--chart-axis)" }} />
          <YAxis tickLine={false} axisLine={false} width={compact ? 28 : 36} tick={{ fontSize: compact ? 11 : 12, fill: "var(--chart-axis)" }} />
          <Tooltip formatter={(value: number) => [`${value}`, valueLabel]} contentStyle={tooltipStyle} />
          <Bar dataKey="value" fill="var(--chart-1)" radius={[12, 12, 0, 0]} maxBarSize={compact ? 22 : 30} />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function RollingAverageChart({
  data,
  valueLabel,
}: {
  data: TrendPoint[];
  valueLabel: string;
}) {
  const compact = useCompactChart();

  return (
    <ChartFrame compact={compact}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={compact ? { top: 8, right: 4, left: -18, bottom: 4 } : { top: 8, right: 8, left: -6, bottom: 4 }}>
          <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={compact ? 22 : 14} tick={{ fontSize: compact ? 11 : 12, fill: "var(--chart-axis)" }} />
          <YAxis tickLine={false} axisLine={false} width={compact ? 28 : 36} tick={{ fontSize: compact ? 11 : 12, fill: "var(--chart-axis)" }} />
          <Tooltip formatter={(value: number) => [`${value}`, valueLabel]} contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="value" stroke="var(--chart-2)" strokeWidth={compact ? 2.5 : 3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function HourlyChart({
  data,
  valueLabel,
}: {
  data: DistributionPoint[];
  valueLabel: string;
}) {
  const compact = useCompactChart();

  return (
    <ChartFrame compact={compact}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={compact ? { top: 8, right: 4, left: -18, bottom: 4 } : { top: 8, right: 8, left: -6, bottom: 4 }}>
          <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
          <XAxis dataKey="hour" tickLine={false} axisLine={false} minTickGap={compact ? 16 : 18} tick={{ fontSize: compact ? 11 : 12, fill: "var(--chart-axis)" }} />
          <YAxis tickLine={false} axisLine={false} width={compact ? 28 : 36} tick={{ fontSize: compact ? 11 : 12, fill: "var(--chart-axis)" }} />
          <Tooltip formatter={(value: number) => [`${value}`, valueLabel]} contentStyle={tooltipStyle} />
          <Bar dataKey="value" fill="var(--chart-3)" radius={[10, 10, 0, 0]} maxBarSize={compact ? 18 : 24} />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function MultiLineChart({
  data,
  lines,
}: {
  data: Array<Record<string, string | number>>;
  lines: Array<{ key: string; color: string; label: string }>;
}) {
  const compact = useCompactChart();

  return (
    <ChartFrame compact={compact}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={compact ? { top: 8, right: 4, left: -18, bottom: 4 } : { top: 8, right: 8, left: -6, bottom: 4 }}>
          <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={compact ? 22 : 14} tick={{ fontSize: compact ? 11 : 12, fill: "var(--chart-axis)" }} />
          <YAxis tickLine={false} axisLine={false} width={compact ? 28 : 36} tick={{ fontSize: compact ? 11 : 12, fill: "var(--chart-axis)" }} />
          <Tooltip contentStyle={tooltipStyle} />
          {lines.map((line) => (
            <Line key={line.key} type="monotone" dataKey={line.key} stroke={line.color} strokeWidth={compact ? 2.5 : 3} dot={!compact} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function WeightCurveChart({
  data,
  showWhoBands,
  xDomain,
  yDomain,
}: {
  data: Array<Record<string, string | number | null>>;
  showWhoBands: boolean;
  xDomain: [number, number];
  yDomain: [number, number];
}) {
  const compact = useCompactChart();

  return (
    <ChartFrame compact={compact} tall>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={compact ? { top: 8, right: 6, left: -20, bottom: 4 } : { top: 8, right: 8, left: -6, bottom: 4 }}>
          <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
          <XAxis
            dataKey="month"
            type="number"
            tickLine={false}
            axisLine={false}
            domain={xDomain}
            tick={{ fontSize: compact ? 11 : 12, fill: "var(--chart-axis)" }}
            tickFormatter={(value: number) => `${Math.round(value * 10) / 10}m`}
          />
          <YAxis tickLine={false} axisLine={false} unit="kg" domain={yDomain} width={compact ? 32 : 40} tick={{ fontSize: compact ? 11 : 12, fill: "var(--chart-axis)" }} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value: number, name: string) => [`${value} kg`, name]} />
          {showWhoBands ? (
            <>
              <Line type="monotone" dataKey="p3" name="WHO P3" stroke="var(--chart-who-soft)" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="p15" name="WHO P15" stroke="var(--chart-who-soft)" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="p50" name="WHO P50" stroke="var(--chart-who)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="p85" name="WHO P85" stroke="var(--chart-who-soft)" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="p97" name="WHO P97" stroke="var(--chart-who-soft)" strokeWidth={1.5} dot={false} />
            </>
          ) : null}
          <Line type="monotone" dataKey="weight" name="Your baby" stroke="var(--chart-3)" strokeWidth={compact ? 2.5 : 3} dot={{ r: compact ? 3 : 4 }} connectNulls />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function MultiSeriesBarChart({
  data,
  xKey,
  series,
}: {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: Array<{ key: string; label: string; color: string }>;
}) {
  const compact = useCompactChart();

  return (
    <ChartFrame compact={compact}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={compact ? { top: 8, right: 4, left: -18, bottom: 4 } : { top: 8, right: 8, left: -6, bottom: 4 }}>
          <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} minTickGap={compact ? 16 : 18} tick={{ fontSize: compact ? 11 : 12, fill: "var(--chart-axis)" }} />
          <YAxis tickLine={false} axisLine={false} width={compact ? 28 : 36} tick={{ fontSize: compact ? 11 : 12, fill: "var(--chart-axis)" }} />
          <Tooltip contentStyle={tooltipStyle} />
          {series.map((item) => (
            <Bar key={item.key} dataKey={item.key} name={item.label} fill={item.color} radius={[6, 6, 0, 0]} maxBarSize={compact ? 16 : 24} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
