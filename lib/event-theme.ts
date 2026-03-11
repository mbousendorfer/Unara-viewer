export type EventTone = "feed" | "sleep" | "diaper" | "pump" | "growth" | "routine";

export const eventTheme = {
  feed: {
    topBorder: "bg-[#F6C453]",
    icon: "bg-[#F6C453]/20 text-[#9B6B00] dark:bg-[#F6C453]/18 dark:text-[#FFD978]",
    metric: "text-[#7D5A10] dark:text-[#FFD978]",
    accent: "bg-[#F6C453]/14 dark:bg-[#F6C453]/16",
    accentText: "text-[#8A630A] dark:text-[#FFD978]",
  },
  sleep: {
    topBorder: "bg-[#A9C3E6]",
    icon: "bg-[#A9C3E6]/24 text-[#486789] dark:bg-[#A9C3E6]/18 dark:text-[#D7E8FB]",
    metric: "text-[#36526F] dark:text-[#D7E8FB]",
    accent: "bg-[#A9C3E6]/18 dark:bg-[#A9C3E6]/16",
    accentText: "text-[#42637E] dark:text-[#D7E8FB]",
  },
  diaper: {
    topBorder: "bg-[#E6DCC8]",
    icon: "bg-[#E6DCC8]/38 text-[#7A684D] dark:bg-[#E6DCC8]/16 dark:text-[#F2E7D2]",
    metric: "text-[#5F513C] dark:text-[#F2E7D2]",
    accent: "bg-[#E6DCC8]/28 dark:bg-[#E6DCC8]/14",
    accentText: "text-[#695740] dark:text-[#F2E7D2]",
  },
  pump: {
    topBorder: "bg-[#D6A6A0]",
    icon: "bg-[#D6A6A0]/26 text-[#8D5B56] dark:bg-[#D6A6A0]/18 dark:text-[#F0C9C4]",
    metric: "text-[#724541] dark:text-[#F0C9C4]",
    accent: "bg-[#D6A6A0]/18 dark:bg-[#D6A6A0]/14",
    accentText: "text-[#7D4E49] dark:text-[#F0C9C4]",
  },
  growth: {
    topBorder: "bg-[#9CC48D]",
    icon: "bg-[#9CC48D]/24 text-[#4C7053] dark:bg-[#9CC48D]/18 dark:text-[#CDE7C4]",
    metric: "text-[#3D5C42] dark:text-[#CDE7C4]",
    accent: "bg-[#9CC48D]/18 dark:bg-[#9CC48D]/14",
    accentText: "text-[#446449] dark:text-[#CDE7C4]",
  },
  routine: {
    topBorder: "bg-[#C4B2D6]",
    icon: "bg-[#C4B2D6]/24 text-[#6C5A80] dark:bg-[#C4B2D6]/16 dark:text-[#E0D0F1]",
    metric: "text-[#58476A] dark:text-[#E0D0F1]",
    accent: "bg-[#C4B2D6]/18 dark:bg-[#C4B2D6]/14",
    accentText: "text-[#5D4D6F] dark:text-[#E0D0F1]",
  },
} as const satisfies Record<EventTone, {
  topBorder: string;
  icon: string;
  metric: string;
  accent: string;
  accentText: string;
}>;
