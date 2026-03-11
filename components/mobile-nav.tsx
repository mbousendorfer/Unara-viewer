"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Baby, ChartColumnBig, Clock3, Droplets, ListCollapse, Milk } from "lucide-react";

import { cn } from "@/lib/utils";

const mobileNavItems = [
  { href: "/", label: "Overview", icon: ChartColumnBig },
  { href: "/timeline", label: "Timeline", icon: ListCollapse },
  { href: "/stats/feed", label: "Feed", icon: Milk },
  { href: "/stats/sleep", label: "Sleep", icon: Clock3 },
  { href: "/stats/diaper", label: "Diaper", icon: Droplets },
  { href: "/stats/pump", label: "Pump", icon: Activity },
  { href: "/stats/growth", label: "Growth", icon: Baby },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-4 gap-2">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-[1.25rem] px-2 py-2 text-[11px] font-medium transition",
                active
                  ? "bg-foreground text-white shadow-[0_16px_28px_-22px_rgba(47,58,50,0.85)] dark:border dark:border-primary/28 dark:bg-primary/18 dark:text-primary dark:shadow-none"
                  : "bg-card/80 text-muted-foreground dark:border dark:border-white/10 dark:bg-[#151b1d] dark:text-[#d4d9d1]",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-[18px] w-[18px]" />
              <span className="leading-tight text-center">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
