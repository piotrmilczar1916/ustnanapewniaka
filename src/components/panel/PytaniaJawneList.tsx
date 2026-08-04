"use client";

import { useEffect, useMemo, useState } from "react";
import { ButtonLink } from "@/components/ButtonLink";
import {
  PYTANIA_JAWNE,
  PYTANIA_JAWNE_GROUPS,
} from "@/data/pytania-jawne";

export function PytaniaJawneList() {
  const [query, setQuery] = useState("");
  const [openLektury, setOpenLektury] = useState<Set<string>>(() => new Set());

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PYTANIA_JAWNE_GROUPS;

    return PYTANIA_JAWNE_GROUPS.map((group) => ({
      ...group,
      questions: group.questions.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.lektura.toLowerCase().includes(q) ||
          String(item.number).includes(q),
      ),
    })).filter((group) => group.questions.length > 0);
  }, [query]);

  // Przy wyszukiwaniu automatycznie rozwijaj dopasowane lektury
  useEffect(() => {
    if (!query.trim()) return;
    setOpenLektury(new Set(filteredGroups.map((g) => g.lektura)));
  }, [query, filteredGroups]);

  const visibleCount = filteredGroups.reduce(
    (sum, g) => sum + g.questions.length,
    0,
  );

  function toggleLektura(lektura: string) {
    setOpenLektury((prev) => {
      const next = new Set(prev);
      if (next.has(lektura)) next.delete(lektura);
      else next.add(lektura);
      return next;
    });
  }

  function expandAll() {
    setOpenLektury(new Set(filteredGroups.map((g) => g.lektura)));
  }

  function collapseAll() {
    setOpenLektury(new Set());
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-graphite">
            Mój panel
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
            Pytania jawne
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-graphite">
            Oficjalna lista {PYTANIA_JAWNE.length} zadań CKE na maturę ustną
            2026–2028. Rozwiń lekturę i ćwicz wybrane pytanie w symulacji.
          </p>
        </div>
        <ButtonLink href="/panel" variant="secondary" size="sm">
          Wróć do panelu
        </ButtonLink>
      </div>

      <div className="mt-8 border border-ink/15 bg-paper p-4 sm:p-5">
        <label className="block">
          <span className="font-display text-sm font-bold uppercase tracking-wide text-ink">
            Szukaj
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="np. Lalka, wolność, 42…"
            className="mt-2 w-full border border-ink/20 bg-paper px-3 py-3 text-ink placeholder:text-graphite/50 focus-visible:border-ink/40 focus-visible:outline-none"
          />
        </label>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <p className="font-mono text-xs text-graphite">
            Widoczne: {visibleCount}/{PYTANIA_JAWNE.length}
          </p>
          <button
            type="button"
            onClick={expandAll}
            className="font-mono text-xs uppercase tracking-wide text-ink underline"
          >
            Rozwiń wszystkie
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="font-mono text-xs uppercase tracking-wide text-ink underline"
          >
            Zwiń wszystkie
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {filteredGroups.length === 0 ? (
          <p className="border border-dashed border-ink/20 bg-paper p-6 text-sm text-graphite">
            Brak wyników dla „{query}”.
          </p>
        ) : (
          filteredGroups.map((group) => {
            const open = openLektury.has(group.lektura);
            const panelId = `lektura-${group.lektura.slice(0, 24).replace(/\W+/g, "-")}`;

            return (
              <section
                key={group.lektura}
                className="border border-ink/15 bg-paper"
              >
                <h2>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => toggleLektura(group.lektura)}
                    className="flex w-full min-h-12 items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-paper-dim/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink/30 sm:px-5"
                  >
                    <span>
                      <span className="block font-display text-base font-bold uppercase tracking-wide text-ink sm:text-lg">
                        {group.lektura}
                      </span>
                      <span className="mt-0.5 block font-mono text-xs text-graphite">
                        {group.questions.length}{" "}
                        {group.questions.length === 1 ? "pytanie" : "pytań"}
                      </span>
                    </span>
                    <span
                      className="font-mono text-lg text-graphite/70"
                      aria-hidden
                    >
                      {open ? "−" : "+"}
                    </span>
                  </button>
                </h2>

                {open ? (
                  <ol id={panelId} className="divide-y divide-ink/10 border-t border-ink/10">
                    {group.questions.map((item) => (
                      <li
                        key={item.number}
                        className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:px-5"
                      >
                        <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
                          <span className="font-mono text-sm tabular-nums text-graphite">
                            {String(item.number).padStart(2, "0")}
                          </span>
                          <p className="text-sm leading-relaxed text-ink">
                            {item.title}
                          </p>
                        </div>
                        <ButtonLink
                          href={`/symulacja?pytanie=${item.number}`}
                          variant="secondary"
                          size="sm"
                          className="shrink-0 self-stretch shadow-none sm:self-start"
                        >
                          Ćwicz
                        </ButtonLink>
                      </li>
                    ))}
                  </ol>
                ) : null}
              </section>
            );
          })
        )}
      </div>

      <p className="mt-8 text-xs leading-relaxed text-graphite">
        Lista zgodna z komunikatem dyrektora CKE z 30 sierpnia 2024 r. Produkt
        edukacyjny — nie jest oficjalnym materiałem CKE.
      </p>
    </div>
  );
}
