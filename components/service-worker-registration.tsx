"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    void navigator.serviceWorker.getRegistrations().then(async (registrations) => {
      await Promise.all(registrations.map((registration) => registration.unregister()));

      if ("caches" in window) {
        const cacheNames = await window.caches.keys();
        await Promise.all(
          cacheNames
            .filter((name) => name.startsWith("nara-insights"))
            .map((name) => window.caches.delete(name)),
        );
      }
    }).catch(() => {
      return undefined;
    });
  }, []);

  return null;
}
