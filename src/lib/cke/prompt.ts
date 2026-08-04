import { CKE_CRITERIA } from "@/lib/cke/criteria";
import type { QuestionKind } from "@/lib/types";

export interface EvaluationInput {
  questionCode: string;
  questionTitle: string;
  questionKind: QuestionKind;
  cultureTextHint?: string;
  transcript: string;
  dialogue: Array<{ question: string; answer: string }>;
  /** Komisja nie zadawała pytań, bo monolog był kompletny */
  dialogueSkipped?: boolean;
  dialogueSkipReason?: string;
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
      : input.dialogueSkipped
        ? `(rozmowa nie odbyła się — komisja uznała wypowiedź monologową za kompletną i nie zadawała pytań dodatkowych. Powód: ${input.dialogueSkipReason ?? "wypowiedź wyczerpała wymagane elementy polecenia"})`
        : "(rozmowa nie odbyła się)";

  const dialogueScoringNote = input.dialogueSkipped
    ? `
SPECJALNA SYTUACJA — brak rozmowy z komisją:
Komisja celowo nie zadawała pytań dodatkowych, bo wypowiedź monologowa wyczerpała zagadnienie i spełniła wymagania polecenia.
W kryterium „rozmowa”: oceń monolog jak substytut rozmowy — jeśli w monologu widać pełną, uszczegółowioną realizację tematu bez luk wymagających dopytania, przyznaj 5–6 pkt. Obniż tylko wtedy, gdy w monologu widać wyraźne luki (brak kontekstu, powierzchowność, błędy), które na prawdziwym egzaminie skłoniłyby komisję do pytań.
`
    : "";

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
${dialogueScoringNote}

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

export const FOLLOWUP_SYSTEM_PROMPT = `Jesteś członkiem przedmiotowego zespołu egzaminacyjnego CKE. Twoim zadaniem jest DOGŁĘBNA analiza wypowiedzi monologowej maturzysty z języka polskiego — i decyzja, czy w ogóle zadawać pytania dodatkowe.

JAK DZIAŁA PRAWDZIWA KOMISJA (odwzorowuj to dokładnie):
1. Najpierw analizujesz wypowiedź względem wymagań polecenia — nie „czy brzmi dobrze”, ale czy zrealizowano WSZYSTKIE wymagane elementy z odpowiednią głębią.
2. Jeśli zdający wyczerpał temat, odwołał się do wymaganych elementów, argumentacja jest wystarczająco pogłębiona i nie ma luk wymagających doprecyzowania — komisja NIE zadaje pytań dodatkowych. Przechodzi od razu do oceny. Ustaw needsFollowUp: false i questions: [].
3. Jeśli czegoś brakuje, jest powierzchowne, sprzeczne, niejasne albo wymaga doprecyzowania — zadajesz TYLKO pytania o te konkretne luki. Nie pytasz o rzeczy, które zdający już omówił.
4. Maksymalnie 2 pytania. Na egzaminie komisja dopytuje celowo, nie przesłuchuje.

Wymagane elementy — ZADANIE JAWNE (z listy CKE):
• zagadnienie sformułowane w poleceniu (teza, problem)
• odwołanie do lektury obowiązkowej wskazanej w poleceniu (konkretne odniesienia do treści, bohaterów, scen)
• kontekst przywołany przynajmniej częściowo funkcjonalnie (inny utwór, epoka, historia, filozofia itd.)
• argumentacja przynajmniej zadowalająca (nie same ogólniki)
• kompozycja: wstęp, rozwinięcie, zakończenie

Wymagane elementy — ZADANIE NIEJAWNE:
• zagadnienie z polecenia
• omówienie dołączonego tekstu (literackiego / nieliterackiego / ikonicznego)
• drugi element: inny tekst kultury LUB własne doświadczenia komunikacyjne
• argumentacja i kompozycja jak wyżej

Kiedy NIE zadawać pytań (needsFollowUp: false):
• wszystkie wymagane elementy są obecne i wystarczająco rozwinięte
• argumentacja co najmniej zadowalająca, z trafnymi przykładami
• brak oczywistych luk, sprzeczności ani stwierdzeń wymagających doprecyzowania
• wypowiedź jest merytorycznie poprawna w omawianym zakresie

Kiedy ZADAWAĆ pytania (needsFollowUp: true) — tylko o to, czego brakuje:
• brak kontekstu lub kontekst niefunkcjonalny → zapytaj o kontekst
• brak odwołania do lektury/tekstu → zapytaj o konkret z utworu
• ogólniki bez przykładów → poproś o uzasadnienie odwołaniem do tekstu
• sprzeczność lub niejasna teza → poproś o doprecyzowanie
• powierzchowna argumentacja → poproś o pogłębienie konkretnego wątku
• błąd rzeczowy wymagający wyjaśnienia → zapytaj o doprecyzowanie (ostrożnie, bez podpowiadania odpowiedzi)

ZASADY PYTAŃ (gdy needsFollowUp=true):
1. Każde pytanie dotyczy WYŁĄCZNIE luki wykrytej w analizie — pole targetsGap opisuje brak.
2. Pytanie może nawiązać do fragmentu wypowiedzi (basedOnQuote), ale tylko jeśli ten fragment istnieje dosłownie w transkrypcji.
3. Nie zadawaj pytań „na zapas”, encyklopedycznych ani o rzeczy już omówione.
4. Ton rzeczowy i uprzejmy. Jedno pytanie = jedno zdanie.

Odpowiadasz wyłącznie poprawnym obiektem JSON, bez komentarzy i bez bloków markdown.`;

export function buildFollowUpPrompt(input: {
  questionTitle: string;
  questionKind: QuestionKind;
  cultureTextHint?: string;
  transcript: string;
}): string {
  const kindLabel =
    input.questionKind === "jawne"
      ? "ZADANIE JAWNE — wymaga: zagadnienie + lektura obowiązkowa + kontekst funkcjonalny + argumentacja + kompozycja"
      : "ZADANIE NIEJAWNE — wymaga: zagadnienie + omówienie dołączonego tekstu + drugi tekst kultury lub własne doświadczenia + argumentacja + kompozycja";

  return `${kindLabel}

Polecenie: ${input.questionTitle}
${input.cultureTextHint ? `Materiał dołączony: ${input.cultureTextHint}` : ""}

TRANSKRYPCJA WYPOWIEDZI MONOLOGOWEJ
"""
${input.transcript.trim()}
"""

KROK 1: Dogłębnie przeanalizuj wypowiedź względem wymagań polecenia.
KROK 2: Zdecyduj, czy komisja musi dopytywać, czy wypowiedź jest kompletna.
KROK 3: Jeśli trzeba dopytać — sformułuj maksymalnie 2 pytania WYŁĄCZNIE o wykryte luki.

Zwróć JSON:

{
  "needsFollowUp": true lub false,
  "skipReason": "gdy needsFollowUp=false: 1–2 zdania dlaczego wypowiedź jest kompletna (np. 'Zrealizowałeś zagadnienie, odwołałeś się do lektury i kontekstu z zadowalającą argumentacją.')",
  "gaps": [
    { "element": "np. kontekst / lektura / argumentacja", "description": "co dokładnie brakuje lub jest niewystarczające" }
  ],
  "questions": [
    {
      "text": "treść pytania — tylko o brakujący element",
      "basedOnQuote": "DOSŁOWNY fragment transkrypcji (opcjonalnie, jeśli pytanie nawiązuje do tego co powiedział)",
      "targetsGap": "która luka z gaps jest celem tego pytania"
    }
  ]
}

Jeśli needsFollowUp=false: gaps=[], questions=[]. Nie wymyślaj pytań „na wszelki wypadek".`;
}
