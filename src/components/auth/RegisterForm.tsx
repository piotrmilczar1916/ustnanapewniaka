"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { AlreadyLoggedInNotice } from "@/components/auth/AlreadyLoggedInNotice";
import { useAuth } from "@/lib/auth/AuthProvider";

export function RegisterForm() {
  const { register, ready, session } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setPending(true);
    const result = await register({ name, email, password });
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.needsEmailConfirmation) {
      setInfo(
        "Konto utworzone. Sprawdź skrzynkę e-mail i kliknij link potwierdzający, aby się zalogować.",
      );
      return;
    }
    router.push("/panel");
  }

  if (!ready) {
    return <p className="text-sm text-graphite">Sprawdzam sesję…</p>;
  }

  if (session) {
    return <AlreadyLoggedInNotice />;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="font-display text-sm font-bold uppercase tracking-wide text-ink">
          Imię
        </span>
        <input
          type="text"
          autoComplete="given-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full border-2 border-ink bg-paper px-3 py-3 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stamp-red"
        />
      </label>

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
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full border-2 border-ink bg-paper px-3 py-3 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stamp-red"
        />
        <span className="mt-1 block text-xs text-graphite">
          Minimum 6 znaków
        </span>
      </label>

      {info ? (
        <p className="border-2 border-success/40 bg-paper p-3 text-sm text-success">
          {info}
        </p>
      ) : null}

      {error ? (
        <p className="border-2 border-stamp-red/40 bg-paper p-3 text-sm text-stamp-red">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending || !ready}>
        {pending ? "Tworzenie konta…" : "Załóż konto"}
      </Button>

      <p className="text-center text-sm text-graphite">
        Masz już konto?{" "}
        <Link href="/logowanie" className="font-medium text-ink underline">
          Zaloguj się
        </Link>
      </p>
    </form>
  );
}
