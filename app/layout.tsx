import type { Metadata, Viewport } from "next";
import Script from "next/script";

import { AppDataProvider } from "@/components/app-data-provider";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import { ThemeProvider } from "@/components/theme-provider";
import { themeColors } from "@/design-system/tokens";

import "./globals.css";

export const metadata: Metadata = {
  title: "Unara Insights",
  description: "Personal analytics app that reads Nara app export files.",
  applicationName: "Unara Insights",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Unara Insights",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-maskable.svg", type: "image/svg+xml", rel: "mask-icon" },
    ],
    apple: [{ url: "/apple-icon" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: themeColors.light.background },
    { media: "(prefers-color-scheme: dark)", color: themeColors.dark.background },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function () {
              var stored = localStorage.getItem("nara-theme-preference");
              var preference = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
              var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
              var effective = preference === "system" ? (systemDark ? "dark" : "light") : preference;
              var root = document.documentElement;
              root.classList.toggle("dark", effective === "dark");
              root.style.colorScheme = effective;
              root.dataset.themePreference = preference;
            })();
          `}
        </Script>
        <ThemeProvider>
          <AppDataProvider>
            <ServiceWorkerRegistration />
            {children}
          </AppDataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
