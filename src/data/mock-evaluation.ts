import type { EvaluationResult, FollowUpQuestion } from "@/lib/types";

/**
 * Mock pytań dodatkowych — w produkcji generowane przez Claude
 * na podstawie realnej transkrypcji ucznia.
 */
export function mockFollowUps(transcript: string): FollowUpQuestion[] {
  const snippet =
    transcript.trim().slice(0, 60) || "Twojej wcześniejszej wypowiedzi";

  return [
    {
      id: "fu-1",
      text: `Wspomniałeś o „${snippet}${transcript.length > 60 ? "…" : ""}”. Czy możesz rozwinąć, jak ten motyw łączy się z kontekstem epoki?`,
    },
    {
      id: "fu-2",
      text: "Jak Twoja interpretacja zmieniłaby się, gdybyś odwołał się do innego tekstu kultury niż ten wskazany w wypowiedzi?",
    },
  ];
}

/**
 * Mock oceny CKE z cytatami z transkrypcji.
 * TODO: podłączyć Anthropic API (tylko backend).
 */
export function mockEvaluation(transcript: string): EvaluationResult {
  const clean = transcript.trim();
  const quoteSource =
    clean.length > 0
      ? clean
      : "Uczeń nie dostarczył nagrania — użyto przykładowego cytatu testowego.";

  const pickQuote = (start: number, length: number) => {
    if (quoteSource.length <= length) return quoteSource;
    const slice = quoteSource.slice(start, start + length).trim();
    return slice.length > 0 ? slice : quoteSource.slice(0, length);
  };

  const criteria = [
    {
      id: "meritum" as const,
      label: "Meritum",
      maxPoints: 6,
      points: 4,
      quote: pickQuote(0, 90),
      justification:
        "Wypowiedź zawiera rozpoznawalny temat i odwołanie do tekstu kultury, ale argumentacja mogłaby być bardziej spójna i pogłębiona.",
    },
    {
      id: "kompozycja" as const,
      label: "Kompozycja",
      maxPoints: 2,
      points: 2,
      quote: pickQuote(Math.min(40, Math.max(0, quoteSource.length - 50)), 70),
      justification:
        "Wypowiedź ma czytelny początek, rozwinięcie i domknięcie — układ jest przejrzysty.",
    },
    {
      id: "jezyk" as const,
      label: "Język",
      maxPoints: 4,
      points: 3,
      quote: pickQuote(Math.min(20, quoteSource.length), 80),
      justification:
        "Komunikatywność jest dobra; zdarzają się potknięcia stylistyczne, które nie zaburzają zrozumiałości.",
    },
    {
      id: "odpowiedzi" as const,
      label: "Odpowiedzi na pytania",
      maxPoints: 4,
      points: 3,
      quote: pickQuote(0, 60),
      justification:
        "Odpowiedzi nawiązują do wcześniejszej wypowiedzi i rozwijają wskazany wątek, choć mogłyby być bardziej precyzyjne.",
    },
  ];

  const totalPoints = criteria.reduce((sum, c) => sum + c.points, 0);
  const maxPoints = criteria.reduce((sum, c) => sum + c.maxPoints, 0);

  return {
    totalPoints,
    maxPoints,
    percentage: Math.round((totalPoints / maxPoints) * 100),
    criteria,
    summary:
      "Ocena mockowa — w produkcji komisja AI cytuje wyłącznie fragmenty z Twojej realnej transkrypcji i punktuje wg oficjalnych kryteriów CKE.",
    isMock: true,
  };
}

/** Przykładowa transkrypcja do trybu testowego (gdy brak mikrofonu). */
export const MOCK_TRANSCRIPT = `Zacznę od tezy: literatura często pokazuje konflikt pokoleń jako starcie wartości, a nie tylko wieku. W „Przedwiośniu” Cezary Baryka mierzy się z wizją ojca i z rzeczywistością odrodzonej Polski — jego bunt nie jest pustą negacją, tylko poszukiwaniem własnego miejsca. Podobny mechanizm widać w „Tangu” Mrożka, gdzie bunt młodych staje się parodią wolności. W obu tekstach konflikt domaga się decyzji etycznej: albo dialog, albo eskalacja. Dlatego uważam, że motyw ten uczy odpowiedzialności za wybór, a nie tylko sprzeciwu.`;
