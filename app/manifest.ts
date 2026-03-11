import type { MetadataRoute } from "next";

import { themeColors } from "@/design-system/tokens";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Unara Insights",
    short_name: "Unara",
    description: "Personal analytics app that reads Nara app export files.",
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
