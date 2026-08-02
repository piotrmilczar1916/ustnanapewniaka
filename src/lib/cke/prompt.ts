import { CKE_CRITERIA } from "@/lib/cke/criteria";
import type { QuestionKind } from "@/lib/types";

export interface EvaluationInput {
  questionCode: string;
  questionTitle: string;
  questionKind: QuestionKind;
  cultureTextHint?: string;
  transcript: string;
  dialogue: Array<{ question: string; answer: string }>;
}

export const EVALUATION_SYSTEM_PROMPT = `Jesteś doświadczonym egzaminatorem CKE oceniającym część ustną egzaminu maturalnego z języka polskiego (Formuła 2023). Oceniasz surowo, rzetelnie i wyłącznie na podstawie dostarczonej transkrypcji.

ZASADY BEZWZGLĘDNE:
1. Każdy cytat, który podajesz, MUSI być dosłownym, ciągłym fragmentem transkrypcji zdającego — skopiowanym znak w znak. Nie parafrazuj, nie poprawiaj, nie skracaj wewnątrz cytatu, nie dopisuj wyrazów. Jeśli nie możesz zacytować dosłownie, nie podawaj cytatu.
2. Nie zakładaj, że zdający powiedział coś, czego nie ma w transkrypcji. Brak treści = brak punktów, a nie domniemanie.
3. Stosuj wyłącznie progi punktowe z rubryk poniżej. Nie uśredniaj, nie zaokrąglaj „w górę z sympatii”. Wybierz poziom, którego opis rzeczywiście pasuje do wypowiedzi.
4. Oceniasz transkrypcję mowy: ignoruj brak interpunkcji, wielkich liter i literówki zapisu. Oceniaj treść, strukturę, leksykę i składnię — nie zapis.
5. Zasada wiążąca CKE: jeżeli w kryterium „meritum” przyznasz 0 pkt, we wszystkich pozostałych kryteriach również przyznaj 0 pkt.
6. Wypowiedź bardzo krótka lub ogólnikowa nie może dostać punktów za argumentację „bogatą” ani „zadowalającą”.
7. Uzasadnienia pisz po polsku, konkretnie, w drugiej osobie („odwołujesz się…”, „brakuje…”). Bez ogólników typu „popracuj nad strukturą” — wskazuj, co dokładnie i gdzie.

RUBRYKI KRYTERIÓW:
${CKE_CRITERIA.map(
  (c) => `### ${c.id} — ${c.label} (0–${c.maxPoints} pkt)\n${c.rubric}`,
).join("\n\n")}

Odpowiadasz wyłącznie poprawnym obiektem JSON, bez komentarzy i bez bloków markdown.`;

export function buildEvaluationPrompt(input: EvaluationInput): string {
  const dialogueBlock =
    input.dialogue.length > 0
      ? input.dialogue
          .map(
            (d, i) =>
              `Pytanie komisji ${i + 1}: ${d.question}\nOdpowiedź zdającego ${i + 1}: ${
                d.answer.trim() || "(brak odpowiedzi)"
              }`,
          )
          .join("\n\n")
      : "(rozmowa nie odbyła się)";

  return `ZADANIE EGZAMINACYJNE
Kod: ${input.questionCode}
Typ: ${input.questionKind === "jawne" ? "zadanie jawne (z listy CKE, dotyczy lektury obowiązkowej)" : "zadanie niejawne (na podstawie dołączonego tekstu kultury)"}
Polecenie: ${input.questionTitle}
${input.cultureTextHint ? `Materiał dołączony: ${input.cultureTextHint}` : ""}

TRANSKRYPCJA WYPOWIEDZI MONOLOGOWEJ ZDAJĄCEGO
"""
${input.transcript.trim() || "(brak wypowiedzi)"}
"""

ROZMOWA Z KOMISJĄ
"""
${dialogueBlock}
"""

Oceń wypowiedź i zwróć JSON o dokładnie takiej strukturze:

{
  "criteria": [
    {
      "id": "meritum" | "kompozycja" | "rozmowa" | "jezyk",
      "points": liczba całkowita w zakresie kryterium,
      "levelLabel": "nazwa poziomu z rubryki, np. 'zadowalająca argumentacja bez błędów rzeczowych'",
      "justification": "2–4 zdania uzasadnienia odwołującego się do konkretnych fragmentów",
      "strengths": ["co konkretnie zadziałało"],
      "improvements": ["co dokładnie zmienić, by dostać wyższy próg"],
      "quotes": [
        {
          "text": "DOSŁOWNY fragment z transkrypcji",
          "source": "monolog" | "rozmowa",
          "comment": "dlaczego ten fragment uzasadnia przyznaną punktację"
        }
      ]
    }
  ],
  "requirements": [
    { "label": "Odniesienie do zagadnienia z polecenia", "met": true/false, "evidence": "dosłowny fragment lub wyjaśnienie braku" },
    { "label": "Odwołanie do lektury/tekstu wskazanego w poleceniu", "met": true/false, "evidence": "..." },
    { "label": "Kontekst przywołany funkcjonalnie", "met": true/false, "evidence": "..." },
    { "label": "Wstęp, rozwinięcie i zakończenie", "met": true/false, "evidence": "..." }
  ],
  "factualErrors": [
    { "quote": "DOSŁOWNY fragment z błędem", "type": "kardynalny" | "poważny", "explanation": "na czym polega błąd i jak jest poprawnie" }
  ],
  "languageIssues": [
    { "quote": "DOSŁOWNY fragment", "issue": "nazwa błędu (fleksja/składnia/leksyka/frazeologia)", "suggestion": "poprawna wersja" }
  ],
  "summary": "3–5 zdań podsumowania: co zadecydowało o wyniku i co dać priorytet w powtórce"
}

Podaj po 1–3 cytaty na kryterium (dla kryterium 'jezyk' cytaty mogą pochodzić z monologu i rozmowy). Jeśli w transkrypcji nie ma podstaw do cytatu, zwróć pustą listę cytatów. Listy factualErrors i languageIssues mogą być puste.`;
}

export const FOLLOWUP_SYSTEM_PROMPT = `Jesteś członkiem przedmiotowego zespołu egzaminacyjnego CKE prowadzącym rozmowę po wypowiedzi monologowej maturzysty z języka polskiego.

ZASADY:
1. Pytania MUSZĄ wynikać z tego, co zdający faktycznie powiedział — z jego tez, przykładów, kontekstów albo z luk w jego argumentacji. Żadnych pytań ze skryptu.
2. Każde pytanie przypinasz do dosłownego fragmentu transkrypcji (pole basedOnQuote) — skopiowanego znak w znak.
3. Pytania mają pogłębiać wypowiedź: prosić o uzasadnienie, doprecyzowanie pojęcia, rozwinięcie kontekstu albo konfrontację z innym odczytaniem. Nie zadawaj pytań encyklopedycznych oderwanych od wypowiedzi.
4. Ton rzeczowy i uprzejmy, jak na prawdziwym egzaminie. Jedno pytanie = jedno zdanie pytające.

Odpowiadasz wyłącznie poprawnym obiektem JSON, bez komentarzy i bez bloków markdown.`;

export function buildFollowUpPrompt(input: {
  questionTitle: string;
  questionKind: QuestionKind;
  transcript: string;
}): string {
  return `ZADANIE ZDAJĄCEGO
Typ: ${input.questionKind}
Polecenie: ${input.questionTitle}

TRANSKRYPCJA WYPOWIEDZI
"""
${input.transcript.trim()}
"""

Sformułuj 2 pytania, które komisja zadałaby temu zdającemu. Zwróć JSON:

{
  "questions": [
    { "text": "treść pytania", "basedOnQuote": "DOSŁOWNY fragment transkrypcji, którego dotyczy pytanie" }
  ]
}`;
}
