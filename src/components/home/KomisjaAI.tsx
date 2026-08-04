"use client";

import { useEffect, useRef, useState } from "react";
import { Stamp } from "@/components/Stamp";

const POINTS = [
  {
    n: "01",
    title: "Słucha tego, co naprawdę mówisz",
    text: "Komisja pracuje na Twojej transkrypcji — nie na gotowym szablonie „idealnej” odpowiedzi z internetu.",
  },
  {
    n: "02",
    title: "Pyta tylko, gdy trzeba",
    text: "Najpierw analizuje kompletność wypowiedzi. Jeśli wyczerpałeś temat — przechodzi do oceny bez pytań. Jeśli czegoś brakuje — dopytuje wyłącznie o tę lukę.",
  },
  {
    n: "03",
    title: "Punktuje wg kart oceny CKE",
    text: "Aspekt merytoryczny, kompozycja, rozmowa z komisją i środki językowe — dokładnie te progi punktowe, których używa egzaminator.",
  },
  {
    n: "04",
    title: "Cytuje Twoją wypowiedź — dosłownie",
    text: "Każdy cytat w ocenie jest porównywany z Twoją transkrypcją. Jeśli fragment się nie zgadza, nie trafia do feedbacku.",
  },
];

export function KomisjaAI() {
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
    <section
      id="komisja-ai"
      className="border-b-2 border-ink bg-transparent py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-stamp-red">
              Nasz wyróżnik
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
              Jak działa komisja AI
            </h2>
            <p className="mt-3 text-base leading-relaxed text-graphite sm:text-lg">
              Inne narzędzia dają ogólną ocenę albo gotowe opracowania. My
              budujemy doświadczenie jak przed prawdziwą komisją: słuchamy
              Ciebie, dopytujemy i punktujemy to, co faktycznie powiedziałeś.
            </p>
          </div>
          <Stamp size={100} label="AI" sublabel="KOMISJA" tone="red" />
        </div>

        <ol
          ref={listRef}
          className="komisja-ai-steps mt-10 grid gap-4 sm:grid-cols-2 [&:has(>li:hover)_li:not(:hover)]:scale-[0.98] [&:has(>li:hover)_li:not(:hover)]:opacity-55"
        >
          {POINTS.map((point, index) => (
            <li
              key={point.n}
              className={[
                "group/point border-2 border-ink bg-paper-dim p-5 shadow-[4px_4px_0_var(--ink)]",
                "transition-[transform,box-shadow,background-color,border-color,opacity] duration-200 ease-out",
                "hover:-translate-y-1.5 hover:border-stamp-red hover:bg-paper hover:shadow-[6px_6px_0_var(--stamp-red)]",
                "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                revealed ? "animate-slide-up-reveal" : "translate-y-7 opacity-0",
              ].join(" ")}
              style={revealed ? { animationDelay: `${index * 0.1}s` } : undefined}
            >
              <p className="inline-block font-mono text-sm text-stamp-red transition-[color,background-color,transform] duration-200 group-hover/point:scale-110 group-hover/point:bg-stamp-red group-hover/point:px-2 group-hover/point:py-0.5 group-hover/point:text-paper">
                {point.n}
              </p>
              <h3 className="mt-2 font-display text-xl font-bold uppercase tracking-wide text-ink transition-colors duration-200 group-hover/point:text-stamp-red">
                {point.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-graphite transition-colors duration-200 group-hover/point:text-ink sm:text-base">
                {point.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
