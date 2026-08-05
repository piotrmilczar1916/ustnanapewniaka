"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "Czy to oficjalny materiał CKE?",
    a: "Nie. UstnaNaPewniaka.pl to niezależny trening egzaminacyjny. Kryteria oceny bazują na oficjalnych wytycznych CKE, ale produkt nie jest powiązany z CKE.",
  },
  {
    q: "Ile kosztuje plan Max i do kiedy mam do niego dostęp?",
    a: "Plan Max kosztuje 49,99 zł jednorazowo — bez subskrypcji i ukrytych opłat. Po płatności masz nielimitowane symulacje do dnia egzaminu ustnego w sesji 2026/2027. Nie musisz odnawiać dostępu co miesiąc.",
  },
  {
    q: "Co się dzieje z moim nagraniem głosu?",
    a: "Mikrofon służy wyłącznie do przekształcenia Twojej wypowiedzi na tekst w przeglądarce. Nie zapisujemy plików audio na serwerze ani nie udostępniamy nagrań osobom trzecim. Do oceny komisji AI trafia tylko transkrypcja — tekst tego, co powiedziałeś. Po zalogowaniu w panelu zapisujemy wynik symulacji (punktację i kryteria), nie nagranie głosu.",
  },
  {
    q: "Co obejmuje darmowa wersja?",
    a: "Jedną pełną symulację bez logowania: losowanie pytania, wypowiedź, pytania dodatkowe i ocenę z cytatami.",
  },
  {
    q: "Ile trwa symulacja?",
    a: "Jak na egzaminie: 15 minut na przygotowanie, potem wypowiedź do mikrofonu (zwykle kilka–kilkanaście minut — kończysz, gdy uznasz, że wyczerpałeś temat). Jeśli komisja AI wykryje luki, zada do 2 pytań dodatkowych. Ocena pojawia się w kilka sekund. Całość to zazwyczaj ok. 20–35 minut, w trybie testowym możesz pominąć timer przygotowania.",
  },
  {
    q: "Czym różni się komisja AI od innych kursów?",
    a: "Nie oceniamy według generycznego szablonu. Pytania dodatkowe i feedback powstają z Twojej realnej wypowiedzi — z cytatami tego, co faktycznie powiedziałeś — i punktacją wg 4 kryteriów CKE.",
  },
  {
    q: "Skąd biorą się pytania i czy baza jest aktualizowana, gdy CKE coś zmieni?",
    a: "Pytania jawne pochodzą z oficjalnej listy CKE (76 pytań na maturę ustną z polskiego). Pytania niejawne opierają się na nieznanym tekście kultury — tak jak na egzaminie. Gdy CKE opublikuje nową listę lub zmieni wymagania, aktualizujemy bazę pytań i kryteria oceny, żeby trening odzwierciedlał aktualne wytyczne.",
  },
  {
    q: "Czy działa na telefonie?",
    a: "Tak. Aplikacja jest projektowana mobile-first — mikrofon i timer działają w nowoczesnych przeglądarkach mobilnych.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t-2 border-ink bg-transparent py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
          Pytania i odpowiedzi
        </h2>

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
