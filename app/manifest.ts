import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nara Insights",
    short_name: "Nara",
    description: "Personal analytics for Nara Baby CSV exports.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f7f6f3",
    theme_color: "#7b8f72",
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
