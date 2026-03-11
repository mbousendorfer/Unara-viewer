export type EventTone = "feed" | "sleep" | "diaper" | "pump" | "growth" | "routine";

export const eventTheme = {
  feed: {
    topBorder: "bg-tone-feed",
    icon: "bg-tone-feed/16 text-tone-feed-foreground",
    metric: "text-tone-feed-foreground",
    accent: "bg-tone-feed/12",
    accentText: "text-tone-feed-foreground",
  },
  sleep: {
    topBorder: "bg-tone-sleep",
    icon: "bg-tone-sleep/16 text-tone-sleep-foreground",
    metric: "text-tone-sleep-foreground",
    accent: "bg-tone-sleep/12",
    accentText: "text-tone-sleep-foreground",
  },
  diaper: {
    topBorder: "bg-tone-diaper",
    icon: "bg-tone-diaper/18 text-tone-diaper-foreground",
    metric: "text-tone-diaper-foreground",
    accent: "bg-tone-diaper/14",
    accentText: "text-tone-diaper-foreground",
  },
  pump: {
    topBorder: "bg-tone-pump",
    icon: "bg-tone-pump/16 text-tone-pump-foreground",
    metric: "text-tone-pump-foreground",
    accent: "bg-tone-pump/12",
    accentText: "text-tone-pump-foreground",
  },
  growth: {
    topBorder: "bg-tone-growth",
    icon: "bg-tone-growth/16 text-tone-growth-foreground",
    metric: "text-tone-growth-foreground",
    accent: "bg-tone-growth/12",
    accentText: "text-tone-growth-foreground",
  },
  routine: {
    topBorder: "bg-tone-routine",
    icon: "bg-tone-routine/16 text-tone-routine-foreground",
    metric: "text-tone-routine-foreground",
    accent: "bg-tone-routine/12",
    accentText: "text-tone-routine-foreground",
  },
} as const satisfies Record<EventTone, {
  topBorder: string;
  icon: string;
  metric: string;
  accent: string;
  accentText: string;
}>;
