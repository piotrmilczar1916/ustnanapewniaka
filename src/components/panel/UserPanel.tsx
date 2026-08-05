"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/Button";
import { ButtonLink } from "@/components/ButtonLink";
import { Stamp } from "@/components/Stamp";
import { PanelCriterionChart } from "@/components/panel/PanelCriterionChart";
import { PanelScoreTrend } from "@/components/panel/PanelScoreTrend";
import { PanelSessionHistory } from "@/components/panel/PanelSessionHistory";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  CKE_PASS_PERCENT,
  JAWNE_TOTAL,
  computePanelInsights,
} from "@/lib/panel/analytics";

export function UserPanel() {
  const { ready, user, progress, results, logout } = useAuth();
  const router = useRouter();

  const insights = useMemo(() => computePanelInsights(results), [results]);

  useEffect(() => {
    if (ready && !user) {
      router.replace("/logowanie");
    }
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center font-mono text-sm text-graphite">
        Ładowanie panelu…
      </div>
    );
  }

  const isFull = user.plan === "full";
  const jawneCoverage = Math.round(
    (insights.practicedJawne / JAWNE_TOTAL) * 100,
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Nagłówek */}
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-graphite">
            Mój panel
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
            Cześć, {user.name}
          </h1>
          <p className="mt-2 text-sm text-graphite">{user.email}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="border-2 border-ink bg-paper px-4 py-3 text-center shadow-[3px_3px_0_var(--ink)]">
            <p className="font-mono text-[10px] uppercase tracking-wider text-graphite">
              Do egzaminu
            </p>
            <p className="font-mono text-3xl font-semibold text-stamp-red">
              {insights.daysUntilExam}
            </p>
            <p className="font-mono text-[10px] text-graphite">dni</p>
          </div>
          <Stamp
            size={72}
            label={isFull ? "MAX" : "FREE"}
            sublabel="PLAN"
            tone={isFull ? "gold" : "ink"}
          />
        </div>
      </div>

      {/* Szybkie akcje */}
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/symulacja">Nowa symulacja</ButtonLink>
        <ButtonLink href="/panel/pytania-jawne" variant="secondary">
          76 pytań jawnych
        </ButtonLink>
      </div>

      {/* Statystyki */}
      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        {[
          { label: "Sesje", value: String(progress.sessionsCount) },
          {
            label: "Średni wynik",
            value:
              progress.averagePercentage != null
                ? `${progress.averagePercentage}%`
                : "—",
          },
          {
            label: "Rekord",
            value:
              progress.bestPercentage != null
                ? `${progress.bestPercentage}%`
                : "—",
          },
          {
            label: "Zdane sesje",
            value: `${insights.passedSessions}/${progress.sessionsCount || 0}`,
          },
          {
            label: "Seria dni",
            value: insights.streakDays > 0 ? `${insights.streakDays} 🔥` : "—",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="border-2 border-ink bg-paper-dim p-3 shadow-[2px_2px_0_var(--ink)]"
          >
            <dt className="font-mono text-[10px] uppercase tracking-wider text-graphite">
              {stat.label}
            </dt>
            <dd className="mt-1 font-mono text-xl font-semibold text-ink sm:text-2xl">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {/* Wykres trendu */}
        <section className="border-2 border-ink bg-paper-dim p-5 shadow-[4px_4px_0_var(--ink)]">
          <h2 className="font-display text-lg font-bold uppercase text-ink">
            Trend wyników
          </h2>
          <p className="mt-1 text-xs text-graphite">
            Ostatnie sesje · próg zdawalności CKE to {CKE_PASS_PERCENT}%
          </p>
          <div className="mt-4">
            <PanelScoreTrend trend={insights.recentTrend} />
          </div>
        </section>

        {/* Kryteria CKE */}
        <section className="border-2 border-ink bg-paper-dim p-5 shadow-[4px_4px_0_var(--ink)]">
          <h2 className="font-display text-lg font-bold uppercase text-ink">
            Analiza kryteriów CKE
          </h2>
          <p className="mt-1 text-xs text-graphite">
            Średni wynik w każdym kryterium ze wszystkich sesji
          </p>
          <div className="mt-4">
            <PanelCriterionChart criteria={insights.criterionAverages} />
          </div>
        </section>

        {/* Pokrycie pytań jawnych */}
        <section className="border-2 border-ink bg-paper-dim p-5 shadow-[4px_4px_0_var(--ink)]">
          <h2 className="font-display text-lg font-bold uppercase text-ink">
            Pokrycie pytań jawnych
          </h2>
          <p className="mt-1 text-xs text-graphite">
            Ile unikalnych pytań z oficjalnej listy CKE już przećwiczyłeś
          </p>
          <div className="mt-4">
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-mono text-3xl font-semibold text-ink">
                {insights.practicedJawne}
                <span className="text-lg text-graphite">/{JAWNE_TOTAL}</span>
              </p>
              <p className="font-mono text-sm text-stamp-red">
                {jawneCoverage}%
              </p>
            </div>
            <div className="mt-3 h-3 border border-ink/20 bg-paper">
              <div
                className="h-full bg-gold transition-all duration-500"
                style={{ width: `${jawneCoverage}%` }}
              />
            </div>
            <ButtonLink
              href="/panel/pytania-jawne"
              variant="secondary"
              size="sm"
              className="mt-4"
            >
              Przejdź do listy pytań
            </ButtonLink>
          </div>
        </section>

        {/* Plan */}
        <section className="border-2 border-ink bg-paper-dim p-5 shadow-[4px_4px_0_var(--ink)]">
          <h2 className="font-display text-lg font-bold uppercase text-ink">
            Aktualny plan
          </h2>
          {isFull ? (
            <p className="mt-2 text-sm text-graphite">
              Max — nielimitowane symulacje
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
                Kup Max
              </ButtonLink>
            </>
          )}
        </section>
      </div>

      {/* Historia */}
      <section className="mt-8 border-2 border-ink bg-paper-dim p-5 shadow-[4px_4px_0_var(--ink)]">
        <h2 className="font-display text-xl font-bold uppercase text-ink">
          Historia wyników
        </h2>
        <p className="mt-1 text-xs text-graphite">
          Kliknij sesję, żeby zobaczyć szczegóły kryteriów i powtórzyć pytanie
        </p>
        <div className="mt-4">
          <PanelSessionHistory results={results} />
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          variant="secondary"
          onClick={() => {
            void logout().then(() => router.push("/"));
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
  );
}
