import { Stamp } from "@/components/Stamp";

const POINTS = [
  {
    n: "01",
    title: "Słucha tego, co naprawdę mówisz",
    text: "Komisja pracuje na Twojej transkrypcji — nie na gotowym szablonie „idealnej” odpowiedzi z internetu.",
  },
  {
    n: "02",
    title: "Pyta jak żywa komisja",
    text: "Pytania dodatkowe powstają z Twoich słów, argumentów i luk. To kluczowa różnica względem kursów ze sztywnym skryptem.",
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
  return (
    <section
      id="komisja-ai"
      className="border-b-2 border-ink bg-paper py-16 sm:py-20"
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

        <ol className="mt-10 grid gap-4 sm:grid-cols-2">
          {POINTS.map((point) => (
            <li
              key={point.n}
              className="border-2 border-ink bg-paper-dim p-5 shadow-[4px_4px_0_var(--ink)]"
            >
              <p className="font-mono text-sm text-stamp-red">{point.n}</p>
              <h3 className="mt-2 font-display text-xl font-bold uppercase tracking-wide text-ink">
                {point.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-graphite sm:text-base">
                {point.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
