"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Baby, ChartColumnBig, Clock3, Droplets, Milk, Syringe } from "lucide-react";

import { ImportCard } from "@/components/import-card";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Overview", icon: ChartColumnBig },
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
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_24px_80px_-40px_rgba(16,32,51,0.35)] backdrop-blur">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Syringe className="h-3.5 w-3.5" />
                Nara Insights
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
                <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{subtitle}</p>
              </div>
            </div>
            <ImportCard inline />
          </div>

          <nav
            aria-label="Sections"
            className="overflow-x-auto"
          >
            <div className="inline-flex min-w-full border-b border-border">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition",
                      active
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground",
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
      {children}
    </div>
  );
}
