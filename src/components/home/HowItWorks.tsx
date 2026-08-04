"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    n: "01",
    title: "Losujesz pytanie",
    text: "Wybierasz pytanie jawne z bazy CKE albo niejawne — na podstawie nieznanego tekstu kultury.",
  },
  {
    n: "02",
    title: "Wypowiedź",
    text: "15 minut przygotowania, potem mówisz do mikrofonu na czas — jak przed prawdziwą komisją.",
  },
  {
    n: "03",
    title: "Analiza wypowiedzi",
    text: "Nasz system analizuje Twoją wypowiedź w kilka sekund i sprawdza merytorykę, argumentację i strukturę.",
  },
  {
    n: "04",
    title: "Twój wynik i feedback",
    text: "Dostajesz punktację wg kryteriów CKE oraz konkretny feedback z cytatami z Twojej wypowiedzi.",
  },
];

export function HowItWorks() {
  const listRef = useRef<HTMLOListElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="jak-dziala" className="border-b-2 border-ink bg-transparent py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
          Jak to działa
        </h2>
        <p className="mt-2 max-w-2xl text-graphite">
          Cztery kroki. Zero niespodzianek — pełny przebieg matury ustnej z polskiego.
        </p>

        <ol
          ref={listRef}
          className="how-it-works-steps mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 [&:has(>li:hover)_li:not(:hover)]:scale-[0.98] [&:has(>li:hover)_li:not(:hover)]:opacity-55"
        >
          {STEPS.map((step, index) => (
            <li
              key={step.n}
              className={[
                "group/step border-2 border-ink bg-paper-dim p-5 shadow-[4px_4px_0_var(--ink)]",
                "transition-[transform,box-shadow,background-color,border-color,opacity] duration-200 ease-out",
                "hover:-translate-y-1.5 hover:border-stamp-red hover:bg-paper hover:shadow-[6px_6px_0_var(--stamp-red)]",
                "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                revealed ? "animate-slide-up-reveal" : "translate-y-7 opacity-0",
              ].join(" ")}
              style={revealed ? { animationDelay: `${index * 0.1}s` } : undefined}
            >
              <p className="inline-block font-mono text-sm text-stamp-red transition-[color,background-color,transform] duration-200 group-hover/step:scale-110 group-hover/step:bg-stamp-red group-hover/step:px-2 group-hover/step:py-0.5 group-hover/step:text-paper">
                {step.n}
              </p>
              <h3 className="mt-2 font-display text-xl font-bold uppercase tracking-wide text-ink transition-colors duration-200 group-hover/step:text-stamp-red sm:text-2xl">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-graphite transition-colors duration-200 group-hover/step:text-ink sm:text-base">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
