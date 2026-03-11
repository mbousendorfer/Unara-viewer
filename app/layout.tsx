import type { Metadata } from "next";
import Script from "next/script";

import { AppDataProvider } from "@/components/app-data-provider";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Nara Insights",
  description: "Personal analytics for Nara Baby CSV exports.",
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
          <AppDataProvider>{children}</AppDataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
