import Link from "next/link";
import { LockKeyhole } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isAuthEnabled, isAuthenticated } from "@/lib/server/auth";

type LoginPageProps = {
  searchParams?: Promise<{
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const nextPath =
    typeof resolvedSearchParams.next === "string" && resolvedSearchParams.next.startsWith("/")
      ? resolvedSearchParams.next
      : "/";
  const authEnabled = isAuthEnabled();
  const authenticated = authEnabled ? await isAuthenticated() : false;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_40%),linear-gradient(180deg,_var(--color-surface-muted),_var(--color-background))] px-4 py-10">
      <Card className="w-full max-w-md border-border bg-surface-elevated shadow-[var(--shadow-elevated)]">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/12 text-primary">
            <LockKeyhole className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              Espace protégé
            </p>
            <CardTitle className="text-3xl font-[family-name:var(--font-serif)] text-text-primary">
              Connexion
            </CardTitle>
            <p className="text-sm leading-6 text-text-secondary">
              Entrez votre utilisateur et votre mot de passe pour accéder aux données locales.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {!authEnabled ? (
            <div className="space-y-4">
              <p className="text-sm leading-6 text-text-secondary">
                L&apos;authentification est désactivée sur ce déploiement. Vous pouvez accéder directement à l&apos;application.
              </p>
              <Button asChild className="w-full">
                <Link href="/">Ouvrir l&apos;application</Link>
              </Button>
            </div>
          ) : authenticated ? (
            <div className="space-y-4">
              <p className="text-sm leading-6 text-text-secondary">
                Votre session semble déjà active. Si vous voyez encore une redirection en boucle, il y a probablement un décalage de configuration d&apos;authentification sur le serveur.
              </p>
              <Button asChild className="w-full">
                <Link href={nextPath}>Continuer</Link>
              </Button>
            </div>
          ) : (
            <LoginForm nextPath={nextPath} />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
