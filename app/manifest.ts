import type { MetadataRoute } from "next";

import { themeColors } from "@/design-system/tokens";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nara Insights",
    short_name: "Nara",
    description: "Personal analytics for Nara Baby CSV exports.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: themeColors.light.background,
    theme_color: themeColors.light.accent,
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
