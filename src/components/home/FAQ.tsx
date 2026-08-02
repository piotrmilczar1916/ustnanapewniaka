"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "Czy to oficjalny materiał CKE?",
    a: "Nie. UstnaNaPewniaka.pl to niezależny trening egzaminacyjny. Kryteria oceny bazują na oficjalnych wytycznych CKE, ale produkt nie jest powiązany z CKE.",
  },
  {
    q: "Ile kosztuje pełny dostęp?",
    a: "49,99 zł jednorazowo — bez subskrypcji. Po płatności masz nielimitowane symulacje do dnia egzaminu ustnego.",
  },
  {
    q: "Co obejmuje darmowa wersja?",
    a: "Jedną pełną symulację bez logowania: losowanie pytania, wypowiedź, pytania dodatkowe i ocenę z cytatami.",
  },
  {
    q: "Jak działa gwarancja zwrotu?",
    a: "Jeśli na maturze ustnej uzyskasz wynik poniżej 60%, możesz ubiegać się o zwrot. Szczegóły procedury i wymagane dokumenty pojawią się w regulaminie — nie zgadujemy tu finalnych zapisów prawnych.",
  },
  {
    q: "Czy działa na telefonie?",
    a: "Tak. Aplikacja jest projektowana mobile-first — mikrofon i timer działają w nowoczesnych przeglądarkach mobilnych.",
  },
  {
    q: "Czym różni się komisja AI od innych kursów?",
    a: "Nie oceniamy według generycznego szablonu. Pytania dodatkowe i feedback powstają z Twojej realnej wypowiedzi — z cytatami tego, co faktycznie powiedziałeś — i punktacją wg 4 kryteriów CKE.",
  },
  {
    q: "Skąd biorą się pytania?",
    a: "Pytania jawne pochodzą z oficjalnej bazy CKE (76 pytań). Pytania niejawne są generowane na podstawie nieznanego tekstu kultury. W obecnej wersji deweloperskiej używamy oznaczonych danych testowych.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t-2 border-ink bg-paper-dim py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
          FAQ
        </h2>
        <p className="mt-2 text-graphite">
          Krótko i konkretnie — bez marketingowego lania wody.
        </p>

        <ul className="mt-8 divide-y-2 divide-ink border-2 border-ink bg-paper">
          {FAQ_ITEMS.map((item, index) => {
            const open = openIndex === index;
            return (
              <li key={item.q}>
                <button
                  type="button"
                  className="flex w-full min-h-14 items-center justify-between gap-4 px-4 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-stamp-red"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? null : index)}
                >
                  <span className="font-display text-base font-bold uppercase tracking-wide text-ink sm:text-lg">
                    {item.q}
                  </span>
                  <span className="font-mono text-stamp-red" aria-hidden>
                    {open ? "−" : "+"}
                  </span>
                </button>
                {open ? (
                  <p className="border-t border-ink/15 px-4 pb-5 text-sm leading-relaxed text-graphite sm:text-base">
                    {item.a}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
