import { ButtonLink } from "@/components/ButtonLink";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-paper">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, var(--ink) 0, var(--ink) 1px, transparent 1px, transparent 28px), repeating-linear-gradient(90deg, var(--ink) 0, var(--ink) 1px, transparent 1px, transparent 28px)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24 lg:py-28">
        <p className="animate-fade-up font-display text-sm font-extrabold uppercase tracking-[0.14em] text-stamp-red sm:text-base">
          Matura ustna z polskiego · 2026/2027
        </p>

        <h1 className="animate-fade-up-delay-1 mt-3 max-w-3xl font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-7xl">
          Zdasz. To już pewniak.
        </h1>

        <p className="animate-fade-up-delay-2 mt-8 max-w-xl text-base leading-relaxed text-graphite sm:text-lg">
          Losujesz pytanie, mówisz na czas jak przed komisją, a AI ocenia
          wypowiedź wg 4 kryteriów CKE — cytując to, co faktycznie powiedziałeś.
        </p>

        <div className="animate-fade-up-delay-2 mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
          <ButtonLink href="/symulacja" size="lg">
            Zacznij darmową próbę
          </ButtonLink>
          <ButtonLink href="/#cennik" variant="secondary" size="lg">
            Zobacz cennik
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
