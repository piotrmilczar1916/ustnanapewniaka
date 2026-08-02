import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-ink bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-extrabold uppercase tracking-tight">
            UstnaNaPewniaka.pl
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-paper/75">
            Symulator matury ustnej z polskiego. Trening jak przed komisją —
            z oceną wg kryteriów CKE.
          </p>
        </div>

        <div>
          <p className="font-display text-sm font-bold uppercase tracking-wider text-gold">
            Nawigacja
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/symulacja" className="hover:underline">
                Symulacja
              </Link>
            </li>
            <li>
              <Link href="/cennik" className="hover:underline">
                Cennik
              </Link>
            </li>
            <li>
              <Link href="/logowanie" className="hover:underline">
                Zaloguj
              </Link>
            </li>
            <li>
              <Link href="/panel" className="hover:underline">
                Mój panel
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-display text-sm font-bold uppercase tracking-wider text-gold">
            Informacje
          </p>
          <ul className="mt-3 space-y-2 text-sm text-paper/75">
            <li>Sesja 2026/2027</li>
            <li>Cena: 49,99 zł jednorazowo</li>
            <li className="text-xs">
              {/* TODO: podmienić na finalne teksty prawne */}
              Regulamin i polityka prywatności — w przygotowaniu
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/20">
        <p className="mx-auto max-w-6xl px-4 py-4 font-mono text-xs text-paper/50 sm:px-6">
          © {new Date().getFullYear()} UstnaNaPewniaka.pl — produkt edukacyjny,
          nie jest oficjalnym materiałem CKE.
        </p>
      </div>
    </footer>
  );
}
