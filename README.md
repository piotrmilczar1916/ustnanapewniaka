# UstnaNaPewniaka.pl

Symulator matury ustnej z polskiego (sesja 2026/2027). Uczeń losuje pytanie, mówi na czas, AI ocenia wg 4 kryteriów CKE z cytatami z wypowiedzi.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Supabase (Auth + Postgres)
- Anthropic Claude (ocena po stronie serwera)

## Uruchomienie

```bash
npm install
cp .env.example .env.local
# uzupełnij klucze w .env.local
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000).

## Supabase — konfiguracja (jednorazowo)

1. Załóż projekt na [supabase.com](https://supabase.com)
2. **SQL Editor** → wklej i uruchom plik `supabase/migrations/001_initial_schema.sql`
3. **Project Settings → API** → skopiuj URL i `anon` key do `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
4. **Authentication → URL Configuration** → dodaj redirect:
   - `http://localhost:3000/auth/callback`
   - `https://ustnanapewniaka.pl/auth/callback` (produkcja)
5. **Authentication → Providers → Email**:
   - na dev możesz wyłączyć „Confirm email”, żeby logować się od razu po rejestracji
   - na produkcji zostaw potwierdzenie e-mail włączone

## Co jest gotowe

- Strona główna, symulator, panel ucznia
- 76 pytań jawnych CKE
- Komisja AI (Anthropic) z weryfikacją cytatów
- Auth przez Supabase (rejestracja, logowanie, wyniki w bazie)
- Middleware chroni `/panel/*`

## Kolejność dalszych prac

1. Płatność jednorazowa 49,99 zł (Stripe / Przelewy24) + webhook → plan Max
2. Rate limit na `/api/ocena`
3. Whisper zamiast Web Speech API
4. Regulamin + polityka prywatności

## Design

Motyw: dokument egzaminacyjny + pieczątka. Kolory: `--ink`, `--paper`, `--stamp-red`, Big Shoulders Display, IBM Plex Sans/Mono.
