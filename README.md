# UstnaNaPewniaka.pl

Symulator matury ustnej z polskiego (sesja 2026/2027). Uczeń losuje pytanie, mówi na czas, AI ocenia wg 4 kryteriów CKE z cytatami z wypowiedzi.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 (tokeny designu w `src/app/globals.css`)
- Planowane: Supabase, Anthropic Claude (backend), Przelewy24/Stripe

## Uruchomienie

```bash
npm install
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000).

## Co jest gotowe (etapy 1–3)

- Strona główna: hero z pieczątką, jak działa, wyróżniki, cennik Free/49,99 zł, FAQ
- Symulator `/symulacja`: pełny mock flow (egzamin → losowanie → prep → nagranie → pytania dodatkowe → ocena z cytatami)
- Placeholdery `/konto` i `/cennik`

## Dane testowe

Pytania w `src/data/mock-questions.ts` są oznaczone `isTestData: true` — **TODO: zastąpić realną bazą 76 pytań CKE**.

Ocena w `src/data/mock-evaluation.ts` jest mockiem — **TODO: Anthropic API tylko po stronie serwera**.

## Kolejność dalszych prac

1. Supabase (auth opcjonalny, historia sesji)
2. Endpoint oceny Claude (klucz tylko na backendzie)
3. Płatność jednorazowa 49,99 zł + odblokowanie dostępu
4. SEO (sitemap), dopracowanie mobile

## Design

Motyw: dokument egzaminacyjny + pieczątka. Kolory i fonty wg briefu (`--ink`, `--paper`, `--stamp-red`, Big Shoulders Display, IBM Plex Sans/Mono).
