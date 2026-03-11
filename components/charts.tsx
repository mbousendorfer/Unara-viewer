"use client";

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
  border: "1px solid rgba(16,32,51,0.08)",
  backgroundColor: "rgba(255,255,255,0.96)",
  boxShadow: "0 12px 40px rgba(16,32,51,0.12)",
};

export function DailyChart({
  data,
  valueLabel,
}: {
  data: TrendPoint[];
  valueLabel: string;
}) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid vertical={false} stroke="rgba(16,32,51,0.08)" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip formatter={(value: number) => [`${value}`, valueLabel]} contentStyle={tooltipStyle} />
          <Bar dataKey="value" fill="var(--chart-1)" radius={[12, 12, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RollingAverageChart({
  data,
  valueLabel,
}: {
  data: TrendPoint[];
  valueLabel: string;
}) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid vertical={false} stroke="rgba(16,32,51,0.08)" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip formatter={(value: number) => [`${value}`, valueLabel]} contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="value" stroke="var(--chart-2)" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function HourlyChart({
  data,
  valueLabel,
}: {
  data: DistributionPoint[];
  valueLabel: string;
}) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid vertical={false} stroke="rgba(16,32,51,0.08)" />
          <XAxis dataKey="hour" tickLine={false} axisLine={false} minTickGap={18} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip formatter={(value: number) => [`${value}`, valueLabel]} contentStyle={tooltipStyle} />
          <Bar dataKey="value" fill="var(--chart-3)" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MultiLineChart({
  data,
  lines,
}: {
  data: Array<Record<string, string | number>>;
  lines: Array<{ key: string; color: string; label: string }>;
}) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid vertical={false} stroke="rgba(16,32,51,0.08)" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          {lines.map((line) => (
            <Line key={line.key} type="monotone" dataKey={line.key} stroke={line.color} strokeWidth={3} dot />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
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
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid vertical={false} stroke="rgba(16,32,51,0.08)" />
          <XAxis
            dataKey="month"
            type="number"
            tickLine={false}
            axisLine={false}
            domain={xDomain}
            tickFormatter={(value: number) => `${Math.round(value * 10) / 10}m`}
          />
          <YAxis tickLine={false} axisLine={false} unit="kg" domain={yDomain} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value: number, name: string) => [`${value} kg`, name]} />
          {showWhoBands ? (
            <>
              <Line type="monotone" dataKey="p3" name="WHO P3" stroke="rgba(30,94,255,0.35)" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="p15" name="WHO P15" stroke="rgba(30,94,255,0.45)" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="p50" name="WHO P50" stroke="rgba(30,94,255,0.8)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="p85" name="WHO P85" stroke="rgba(30,94,255,0.45)" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="p97" name="WHO P97" stroke="rgba(30,94,255,0.35)" strokeWidth={1.5} dot={false} />
            </>
          ) : null}
          <Line type="monotone" dataKey="weight" name="Your baby" stroke="var(--chart-3)" strokeWidth={3} dot={{ r: 4 }} connectNulls />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
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
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid vertical={false} stroke="rgba(16,32,51,0.08)" />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} minTickGap={18} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          {series.map((item) => (
            <Bar key={item.key} dataKey={item.key} name={item.label} fill={item.color} radius={[6, 6, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
