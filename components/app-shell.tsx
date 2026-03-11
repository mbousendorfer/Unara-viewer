"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Baby, ChartColumnBig, Clock3, Droplets, ListCollapse, Milk, ShieldCheck, Sprout, Syringe, WifiOff } from "lucide-react";

import { useAppData } from "@/components/app-data-provider";
import { ClearDataButton } from "@/components/clear-data-button";
import { ImportCard } from "@/components/import-card";
import { InstallAppButton } from "@/components/install-app-button";
import { LogoutButton } from "@/components/logout-button";
import { MobileNav } from "@/components/mobile-nav";
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
  const { isOffline, syncedAt, isStandalone } = useAppData();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 px-4 pb-[calc(7.25rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))] sm:px-6 sm:pb-8 sm:pt-6 lg:px-8">
      <header className="surface-blur overflow-hidden rounded-[1.75rem] border border-border bg-surface-elevated shadow-[var(--shadow-elevated)] sm:rounded-[2rem]">
        <div className="flex flex-col gap-5 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  <Syringe className="h-3.5 w-3.5" />
                  Unara Insights
                </div>
                <Badge variant="outline" className="gap-1.5 px-3 py-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  On-device analytics
                </Badge>
                <Badge variant="outline" className="gap-1.5 px-3 py-1">
                  <Sprout className="h-3.5 w-3.5 text-primary" />
                  Mobile-first PWA
                </Badge>
                {isOffline ? (
                  <Badge variant="outline" className="gap-1.5 border-tone-sleep/30 bg-tone-sleep/10 px-3 py-1 text-tone-sleep-foreground">
                    <WifiOff className="h-3.5 w-3.5" />
                    Offline snapshot
                  </Badge>
                ) : null}
              </div>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-3xl leading-tight font-[family-name:var(--font-serif)] tracking-tight text-text-primary sm:text-5xl">
                  {title}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
                  {subtitle}
                </p>
              </div>
              {syncedAt ? (
                <p className="text-xs leading-5 text-text-muted">
                  Last synced {new Date(syncedAt).toLocaleString()}
                  {isStandalone ? " in the installed app." : "."}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:max-w-sm lg:justify-end">
              <ThemeToggle />
              <InstallAppButton />
              <LogoutButton />
              <div className="w-full sm:min-w-56 sm:flex-1">
                <ImportCard inline />
              </div>
            </div>
          </div>

          <nav aria-label="Sections" className="hidden md:block">
            <div className="flex flex-wrap gap-2">
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
                        ? "border-transparent bg-primary text-primary-foreground shadow-[var(--shadow-interactive)]"
                        : "border-border bg-surface text-text-secondary hover:border-border-strong hover:bg-surface-elevated hover:text-text-primary",
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
      <main className="flex flex-col gap-6 pb-4 sm:gap-8">{children}</main>
      <footer className="flex justify-end pb-2">
        <ClearDataButton />
      </footer>
      <MobileNav />
    </div>
  );
}
