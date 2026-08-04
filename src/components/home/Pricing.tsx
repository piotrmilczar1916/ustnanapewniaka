import { ButtonLink } from "@/components/ButtonLink";

export function Pricing() {
  return (
    <section id="cennik" className="border-b-2 border-ink bg-transparent py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
          Cennik
        </h2>
        <p className="mt-2 max-w-2xl text-graphite">
          Płacisz raz. Korzystasz, ile chcesz, aż do dnia egzaminu.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Free */}
          <article className="flex flex-col border-2 border-ink bg-paper-dim p-6 shadow-[4px_4px_0_var(--ink)]">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-graphite">
              Plan
            </p>
            <h3 className="mt-1 font-display text-3xl font-extrabold uppercase text-ink">
              Free
            </h3>
            <p className="mt-4 font-mono text-4xl font-semibold text-ink">
              0&nbsp;zł
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-graphite">
              <li className="flex gap-2">
                <span className="text-success" aria-hidden>
                  ✓
                </span>
                1 pełna symulacja
              </li>
              <li className="flex gap-2">
                <span className="text-success" aria-hidden>
                  ✓
                </span>
                Bez logowania
              </li>
              <li className="flex gap-2">
                <span className="text-success" aria-hidden>
                  ✓
                </span>
                Ocena z cytatami
              </li>
            </ul>
            <ButtonLink href="/symulacja" variant="secondary" className="mt-8 w-full">
              Zacznij za darmo
            </ButtonLink>
          </article>

          {/* Full */}
          <article className="relative flex flex-col border-2 border-ink bg-paper p-6 shadow-[4px_4px_0_var(--ink)]">
            <div className="absolute -top-3 right-4 border-2 border-ink bg-gold px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-ink shadow-[2px_2px_0_var(--ink)]">
              Polecany
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-graphite">
              Plan
            </p>
            <h3 className="mt-1 font-display text-3xl font-extrabold uppercase text-ink">
              Max
            </h3>
            <p className="mt-4 font-mono text-4xl font-semibold text-ink">
              49,99&nbsp;zł
              <span className="ml-2 text-base font-normal text-graphite">
                jednorazowo
              </span>
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-graphite">
              <li className="flex gap-2">
                <span className="text-success" aria-hidden>
                  ✓
                </span>
                Nielimitowane symulacje do dnia egzaminu
              </li>
              <li className="flex gap-2">
                <span className="text-success" aria-hidden>
                  ✓
                </span>
                Szczegółowa ocena wypowiedzi według kryteriów CKE
              </li>
              <li className="flex gap-2">
                <span className="text-success" aria-hidden>
                  ✓
                </span>
                Wszystkie 76 jawnych pytań CKE
              </li>
              <li className="flex gap-2">
                <span className="text-success" aria-hidden>
                  ✓
                </span>
                Pytania jawne i niejawne
              </li>
              <li className="flex gap-2">
                <span className="text-success" aria-hidden>
                  ✓
                </span>
                Historia wyników na koncie
              </li>
            </ul>
            <ButtonLink href="/cennik" className="mt-8 w-full">
              Kup Max
            </ButtonLink>
          </article>
        </div>
      </div>
    </section>
  );
}
