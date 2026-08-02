const OPINIE = [
  {
    name: "Ania",
    detail: "matura 2026 · Warszawa",
    score: "14/16",
    quote:
      "Najbardziej pomogły pytania dodatkowe — komisja pytała o to, co naprawdę powiedziałam, a nie z jakiegoś szablonu. Po trzech symulacjach stres spadł o połowę.",
  },
  {
    name: "Kacper",
    detail: "matura 2026 · Kraków",
    score: "13/16",
    quote:
      "Wreszcie ktoś cytuje moją wypowiedź przy ocenie. Widzę konkretnie, gdzie gubię meritum, a nie tylko „pracuj nad strukturą”.",
  },
  {
    name: "Zosia",
    detail: "matura 2026 · Gdańsk",
    score: "15/16",
    quote:
      "Ćwiczyłam na telefonie w autobusie. Timer + pieczątka z wynikiem działa lepiej niż kolejny PDF z teorią.",
  },
];

/** Placeholder opinii do landinga — podmienić na realne po starcie. */
export function Opinie() {
  return (
    <section
      id="opinie"
      className="border-b-2 border-ink bg-paper-dim py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
          Opinie
        </h2>
        <p className="mt-2 max-w-2xl text-graphite">
          Od uczniów, którzy trenowali jak przed komisją — nie jak przed
          kolejnym testem online.
        </p>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {OPINIE.map((opinia) => (
            <li
              key={opinia.name}
              className="flex flex-col border-2 border-ink bg-paper p-5 shadow-[4px_4px_0_var(--ink)]"
            >
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-stamp-red">
                Wynik treningu · {opinia.score}
              </p>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink sm:text-base">
                „{opinia.quote}”
              </blockquote>
              <footer className="mt-5 border-t-2 border-ink/15 pt-4">
                <p className="font-display text-lg font-bold uppercase tracking-wide text-ink">
                  {opinia.name}
                </p>
                <p className="font-mono text-xs text-graphite">{opinia.detail}</p>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
