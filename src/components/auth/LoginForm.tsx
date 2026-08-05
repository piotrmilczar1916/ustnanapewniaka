"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth/AuthProvider";

export function LoginForm() {
  return (
    <Suspense fallback={<p className="text-sm text-graphite">Ładowanie…</p>}>
      <LoginFormInner />
    </Suspense>
  );
}

function LoginFormInner() {
  const { login, ready, session } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const authError = searchParams.get("error");
    if (authError) {
      setError(decodeURIComponent(authError));
    }
  }, [searchParams]);

  useEffect(() => {
    if (ready && session) {
      router.replace("/panel");
    }
  }, [ready, session, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const result = await login({ email, password });
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
    router.replace("/panel");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="font-display text-sm font-bold uppercase tracking-wide text-ink">
          E-mail
        </span>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full border-2 border-ink bg-paper px-3 py-3 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stamp-red"
        />
      </label>

      <label className="block">
        <span className="font-display text-sm font-bold uppercase tracking-wide text-ink">
          Hasło
        </span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full border-2 border-ink bg-paper px-3 py-3 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stamp-red"
        />
      </label>

      {error ? (
        <p className="border-2 border-stamp-red/40 bg-paper p-3 text-sm text-stamp-red">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending || !ready}>
        {pending ? "Logowanie…" : "Zaloguj się"}
      </Button>

      <p className="text-center text-sm text-graphite">
        Nie masz konta?{" "}
        <Link href="/rejestracja" className="font-medium text-ink underline">
          Załóż konto
        </Link>
      </p>
    </form>
  );
}
