import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-ink bg-paper-dim/90 text-ink backdrop-blur-sm">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-extrabold uppercase tracking-tight">
            Ustna<span className="text-stamp-red">NaPewniaka</span>
            <span className="text-graphite">.pl</span>
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-graphite">
            Symulator matury ustnej z polskiego. Trening jak przed komisją —
            z oceną wg kryteriów CKE.
          </p>
        </div>

        <div>
          <p className="font-display text-sm font-bold uppercase tracking-wider text-stamp-red">
            Nawigacja
          </p>
          <ul className="mt-3 space-y-2 text-sm text-ink">
            <li>
              <Link href="/symulacja" className="hover:text-stamp-red">
                Symulacja
              </Link>
            </li>
            <li>
              <Link href="/cennik" className="hover:text-stamp-red">
                Cennik
              </Link>
            </li>
            <li>
              <Link href="/logowanie" className="hover:text-stamp-red">
                Zaloguj
              </Link>
            </li>
            <li>
              <Link href="/panel" className="hover:text-stamp-red">
                Mój panel
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-display text-sm font-bold uppercase tracking-wider text-stamp-red">
            Informacje
          </p>
          <ul className="mt-3 space-y-2 text-sm text-graphite">
            <li>Sesja 2026/2027</li>
            <li>Cena: 49,99 zł jednorazowo</li>
            <li className="text-xs">
              {/* TODO: podmienić na finalne teksty prawne */}
              Regulamin i polityka prywatności — w przygotowaniu
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink/15">
        <p className="mx-auto max-w-6xl px-4 py-4 font-mono text-xs text-graphite sm:px-6">
          © {new Date().getFullYear()} UstnaNaPewniaka.pl — produkt edukacyjny,
          nie jest oficjalnym materiałem CKE.
        </p>
      </div>
    </footer>
  );
}
