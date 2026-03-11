"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Baby, ChartColumnBig, Clock3, Droplets, ListCollapse, Milk, ShieldCheck, Syringe } from "lucide-react";

import { ClearDataButton } from "@/components/clear-data-button";
import { ImportCard } from "@/components/import-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Overview", icon: ChartColumnBig },
  { href: "/timeline", label: "Timeline", icon: ListCollapse },
  { href: "/stats/feed", label: "Feed", icon: Milk },
  { href: "/stats/sleep", label: "Sleep", icon: Clock3 },
  { href: "/stats/diaper", label: "Diaper", icon: Droplets },
  { href: "/stats/pump", label: "Pump", icon: Activity },
  { href: "/stats/growth", label: "Growth", icon: Baby },
];

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <header className="overflow-hidden rounded-[2rem] border border-[#e8e2d8] bg-[#f8f5ef] shadow-[0_28px_80px_-48px_rgba(67,73,54,0.24)] dark:border-white/10 dark:bg-[#171c1d] dark:shadow-[0_28px_80px_-48px_rgba(0,0,0,0.75)]">
        <div className="flex flex-col gap-6 p-5 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    <Syringe className="h-3.5 w-3.5" />
                    Nara Insights
                  </div>
                  <Badge variant="outline" className="gap-1.5 px-3 py-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    On-device analytics
                  </Badge>
                </div>
                <div className="space-y-3">
                  <h1 className="max-w-3xl text-4xl leading-tight font-[family-name:var(--font-serif)] tracking-tight text-foreground sm:text-5xl">
                    {title}
                  </h1>
                  <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                    {subtitle}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-stretch gap-3 sm:items-end">
                <ThemeToggle />
                <ImportCard inline />
              </div>
            </div>

            <nav aria-label="Sections" className="-mx-1 overflow-x-auto px-1">
              <div className="inline-flex min-w-full gap-2 pb-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition",
                        active
                          ? "border-transparent bg-foreground text-white shadow-[0_16px_28px_-20px_rgba(47,58,50,0.8)]"
                          : "border-border bg-card/70 text-muted-foreground hover:bg-card hover:text-foreground dark:bg-card/90 dark:hover:bg-card",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </nav>
        </div>
      </header>
      <main className="flex flex-col gap-8 pb-8">{children}</main>
      <footer className="flex justify-end pb-4">
        <ClearDataButton />
      </footer>
    </div>
  );
}
