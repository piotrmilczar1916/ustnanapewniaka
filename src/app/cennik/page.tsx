import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";

export const metadata: Metadata = {
  title: "Cennik i płatność",
  description:
    "Plan Max — UstnaNaPewniaka.pl, 49,99 zł jednorazowo, bez subskrypcji.",
};

export default function CennikPage() {
  return (
    <div className="border-b-2 border-ink bg-paper">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-graphite">
          Checkout
        </p>
        <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
          Max
        </h1>
        <p className="mt-3 text-graphite">
          Jednorazowa opłata 49,99&nbsp;zł. Bez subskrypcji. Nielimitowane
          symulacje do dnia egzaminu ustnego.
        </p>

        <div className="mt-8 border-2 border-ink bg-paper-dim p-6 shadow-[4px_4px_0_var(--ink)]">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-display text-2xl font-bold uppercase text-ink">
                UstnaNaPewniaka · Max
              </p>
              <p className="mt-1 text-sm text-graphite">
                Dostęp do dnia egzaminu 2026/2027
              </p>
            </div>
            <p className="font-mono text-4xl font-semibold text-ink">49,99&nbsp;zł</p>
          </div>

          <ul className="mt-6 space-y-2 text-sm text-graphite">
            <li>✓ Nielimitowane symulacje</li>
            <li>✓ Szczegółowa ocena wypowiedzi według kryteriów CKE</li>
            <li>✓ Wszystkie 76 jawnych pytań CKE</li>
            <li>✓ Pytania jawne i niejawne</li>
            <li>✓ Historia wyników</li>
          </ul>

          <div className="mt-8 space-y-3">
            {/* TODO: podłączyć Przelewy24 lub Stripe — decyzja biznesowa */}
            <button
              type="button"
              disabled
              className="flex w-full min-h-12 cursor-not-allowed items-center justify-center border-2 border-ink bg-stamp-red/50 font-display text-base font-bold uppercase tracking-wide text-paper opacity-70 shadow-[4px_4px_0_var(--ink)]"
            >
              Zapłać 49,99 zł — wkrótce
            </button>
            <p className="text-xs text-graphite">
              Bramka płatności (Przelewy24 / Stripe) zostanie podłączona w
              kolejnym etapie. Daj znać, którą wybierasz.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/symulacja" variant="secondary">
            Najpierw darmowa symulacja
          </ButtonLink>
          <ButtonLink href="/#faq" variant="ghost">
            FAQ
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
