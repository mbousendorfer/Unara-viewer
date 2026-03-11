import type { Metadata } from "next";

import { AppDataProvider } from "@/components/app-data-provider";

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
        <AppDataProvider>{children}</AppDataProvider>
      </body>
    </html>
  );
}
