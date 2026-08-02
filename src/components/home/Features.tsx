import { Stamp } from "@/components/Stamp";

const FEATURES = [
  {
    title: "Ocena z cytatami",
    text: "Każde kryterium CKE dostaje uzasadnienie z fragmentem Twojej realnej wypowiedzi — nie generyczny szablon.",
  },
  {
    title: "Pytania niejawne",
    text: "Trenujesz też to, czego nie da się wykuć z listy: interpretację nieznanego tekstu kultury.",
  },
  {
    title: "Żywa komisja AI",
    text: "Pytania dodatkowe powstają z tego, co powiedziałeś — nie ze sztywnego skryptu.",
  },
  {
    title: "Bez limitu prób",
    text: "W pełnym dostępie ćwiczysz ile chcesz aż do dnia egzaminu. Jedna opłata, zero abonamentu.",
  },
];

export function Features() {
  return (
    <section
      id="wyrozniki"
      className="border-b-2 border-ink bg-ink py-16 text-paper sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
              Dlaczego to działa
            </h2>
            <p className="mt-2 max-w-xl text-paper/70">
              Stworzone pod stres kwietniowy — nie pod kolejny kurs teoretyczny.
            </p>
          </div>
          <Stamp size={88} label="CKE" sublabel="×4" tone="gold" />
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <li
              key={feature.title}
              className="border-2 border-paper/30 bg-ink p-5"
            >
              <h3 className="font-display text-xl font-bold uppercase tracking-wide text-gold">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/75 sm:text-base">
                {feature.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
