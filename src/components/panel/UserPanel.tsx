"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/Button";
import { ButtonLink } from "@/components/ButtonLink";
import { Stamp } from "@/components/Stamp";
import { useAuth } from "@/lib/auth/AuthProvider";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function UserPanel() {
  const { ready, user, progress, results, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) {
      router.replace("/logowanie");
    }
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center font-mono text-sm text-graphite">
        Ładowanie panelu…
      </div>
    );
  }

  const isFull = user.plan === "full";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-graphite">
            Mój panel
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
            Cześć, {user.name}
          </h1>
          <p className="mt-2 text-sm text-graphite">{user.email}</p>
        </div>
        <Stamp
          size={72}
          label={isFull ? "FULL" : "FREE"}
          sublabel="PLAN"
          tone={isFull ? "gold" : "ink"}
        />
      </div>

      <div className="mt-8 space-y-4">
        <section className="border-2 border-ink bg-paper-dim p-5 shadow-[4px_4px_0_var(--ink)]">
          <h2 className="font-display text-xl font-bold uppercase text-ink">
            Aktualny plan
          </h2>
          {isFull ? (
            <p className="mt-2 text-sm text-graphite">
              Pełny dostęp — nielimitowane symulacje
              {user.accessUntil
                ? ` do ${new Intl.DateTimeFormat("pl-PL").format(new Date(user.accessUntil))}`
                : ""}
              .
            </p>
          ) : (
            <>
              <p className="mt-2 text-sm text-graphite">
                Free — 1 pełna symulacja. Odblokuj nielimitowany dostęp za
                49,99&nbsp;zł.
              </p>
              <ButtonLink href="/cennik" className="mt-4">
                Kup pełny dostęp
              </ButtonLink>
            </>
          )}
        </section>

        <section className="border-2 border-ink bg-paper-dim p-5 shadow-[4px_4px_0_var(--ink)]">
          <h2 className="font-display text-xl font-bold uppercase text-ink">
            Pytania jawne
          </h2>
          <p className="mt-2 text-sm text-graphite">
            Pełna lista 76 zadań CKE pogrupowanych według lektur — jak na
            egzaminie.
          </p>
          <ButtonLink href="/panel/pytania-jawne" className="mt-4">
            Otwórz spis pytań
          </ButtonLink>
        </section>

        <section className="border-2 border-ink bg-paper-dim p-5 shadow-[4px_4px_0_var(--ink)]">
          <h2 className="font-display text-xl font-bold uppercase text-ink">
            Twoje postępy
          </h2>
          <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="border-2 border-ink bg-paper p-3">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-graphite">
                Sesje
              </dt>
              <dd className="mt-1 font-mono text-2xl font-semibold text-ink">
                {progress.sessionsCount}
              </dd>
            </div>
            <div className="border-2 border-ink bg-paper p-3">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-graphite">
                Średni wynik
              </dt>
              <dd className="mt-1 font-mono text-2xl font-semibold text-ink">
                {progress.averagePercentage != null
                  ? `${progress.averagePercentage}%`
                  : "—"}
              </dd>
            </div>
            <div className="border-2 border-ink bg-paper p-3">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-graphite">
                Rekord
              </dt>
              <dd className="mt-1 font-mono text-2xl font-semibold text-ink">
                {progress.bestPercentage != null
                  ? `${progress.bestPercentage}%`
                  : "—"}
              </dd>
            </div>
            <div className="border-2 border-ink bg-paper p-3">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-graphite">
                Ostatnia
              </dt>
              <dd className="mt-1 font-mono text-sm font-semibold leading-snug text-ink">
                {progress.lastSessionAt
                  ? formatDate(progress.lastSessionAt)
                  : "—"}
              </dd>
            </div>
          </dl>
          <ButtonLink href="/symulacja" variant="secondary" className="mt-4">
            Nowa symulacja
          </ButtonLink>
        </section>

        <section className="border-2 border-ink bg-paper-dim p-5 shadow-[4px_4px_0_var(--ink)]">
          <h2 className="font-display text-xl font-bold uppercase text-ink">
            Historia wyników
          </h2>
          {results.length === 0 ? (
            <p className="mt-3 text-sm text-graphite">
              Brak zapisanych sesji. Zrób symulację po zalogowaniu — wynik
              pojawi się tutaj automatycznie.
            </p>
          ) : (
            <ul className="mt-4 divide-y-2 divide-ink border-2 border-ink bg-paper">
              {results.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-wrap items-start justify-between gap-3 px-4 py-4"
                >
                  <div>
                    <p className="font-mono text-xs text-stamp-red">
                      {r.questionCode} · {r.questionKind}
                    </p>
                    <p className="mt-1 max-w-md text-sm text-ink">
                      {r.questionTitle}
                    </p>
                    <p className="mt-1 font-mono text-xs text-graphite">
                      {formatDate(r.createdAt)}
                    </p>
                  </div>
                  <p className="font-mono text-xl font-semibold text-ink">
                    {r.totalPoints}/{r.maxPoints}
                    <span className="ml-2 text-sm text-graphite">
                      ({r.percentage}%)
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            variant="secondary"
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            Wyloguj się
          </Button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center text-sm text-graphite underline"
          >
            Wróć na stronę główną
          </Link>
        </div>
      </div>
    </div>
  );
}
