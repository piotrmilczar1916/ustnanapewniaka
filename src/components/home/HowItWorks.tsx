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
  return (
    <section id="jak-dziala" className="border-b-2 border-ink bg-paper py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
          Jak to działa
        </h2>
        <p className="mt-2 max-w-2xl text-graphite">
          Cztery kroki. Zero niespodzianek — pełny przebieg egzaminu ustnego.
        </p>

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <li
              key={step.n}
              className="border-2 border-ink bg-paper-dim p-5 shadow-[4px_4px_0_var(--ink)]"
            >
              <p className="font-mono text-sm text-stamp-red">{step.n}</p>
              <h3 className="mt-2 font-display text-xl font-bold uppercase tracking-wide text-ink sm:text-2xl">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-graphite sm:text-base">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
