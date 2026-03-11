"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const username = `${formData.get("username") ?? ""}`.trim();
        const password = `${formData.get("password") ?? ""}`;

        startTransition(async () => {
          setError(null);

          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
          });

          if (!response.ok) {
            const payload = (await response.json().catch(() => null)) as { error?: string } | null;
            setError(payload?.error ?? "Connexion impossible.");
            return;
          }

          router.push(nextPath);
          router.refresh();
        });
      }}
    >
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium text-text-primary">
          Utilisateur
        </label>
        <Input id="username" name="username" autoComplete="username" required />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-text-primary">
          Mot de passe
        </label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  );
}
