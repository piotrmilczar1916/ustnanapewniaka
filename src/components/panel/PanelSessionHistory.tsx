"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/ButtonLink";
import type { SessionResult } from "@/lib/auth/types";
import { CKE_PASS_PERCENT } from "@/lib/panel/analytics";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function PanelSessionHistory({ results }: { results: SessionResult[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (results.length === 0) {
    return (
      <p className="text-sm text-graphite">
        Brak zapisanych sesji. Zrób symulację po zalogowaniu — wynik pojawi się
        tutaj automatycznie.
      </p>
    );
  }

  return (
    <ul className="divide-y-2 divide-ink border-2 border-ink bg-paper">
      {results.map((r) => {
        const open = openId === r.id;
        const passed = r.percentage >= CKE_PASS_PERCENT;
        return (
          <li key={r.id}>
            <button
              type="button"
              className="flex w-full flex-wrap items-start justify-between gap-3 px-4 py-4 text-left hover:bg-paper-dim/60"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : r.id)}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-xs text-stamp-red">
                    {r.questionCode} · {r.questionKind}
                  </p>
                  <span
                    className={[
                      "border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                      passed
                        ? "border-success bg-success/10 text-success"
                        : "border-stamp-red/40 bg-stamp-red/5 text-stamp-red",
                    ].join(" ")}
                  >
                    {passed ? "Zdane" : "Poniżej progu"}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-ink">
                  {r.questionTitle}
                </p>
                <p className="mt-1 font-mono text-xs text-graphite">
                  {formatDate(r.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xl font-semibold text-ink">
                  {r.totalPoints}/{r.maxPoints}
                </p>
                <p className="font-mono text-sm text-graphite">
                  {r.percentage}%
                </p>
                <p className="mt-1 font-mono text-xs text-graphite">
                  {open ? "Zwiń ▲" : "Szczegóły ▼"}
                </p>
              </div>
            </button>
            {open ? (
              <div className="border-t border-ink/15 bg-paper-dim/50 px-4 py-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-graphite">
                  Punktacja wg kryteriów CKE
                </p>
                <ul className="mt-3 space-y-2">
                  {r.criteria.map((c) => {
                    const pct =
                      c.maxPoints > 0
                        ? Math.round((c.points / c.maxPoints) * 100)
                        : 0;
                    return (
                      <li key={c.id} className="flex items-center gap-3">
                        <span className="min-w-0 flex-1 text-sm text-ink">
                          {c.label}
                        </span>
                        <span className="font-mono text-xs text-graphite">
                          {c.points}/{c.maxPoints}
                        </span>
                        <div className="h-1.5 w-16 border border-ink/15 bg-paper">
                          <div
                            className="h-full bg-stamp-red"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <ButtonLink
                  href={`/symulacja?pytanie=${r.questionCode.replace(/^P-/i, "")}`}
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                >
                  Ćwicz to pytanie ponownie
                </ButtonLink>
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
