import { CKE_CRITERIA, CKE_MAX_POINTS, CKE_PASS_THRESHOLD } from "@/lib/cke/criteria";
import { countWords } from "@/lib/cke/verify";
import type {
  CriterionScore,
  EvaluationResult,
  FollowUpQuestion,
} from "@/lib/types";

/**
 * Ocena zapasowa używana, gdy backend nie ma klucza do modelu
 * (np. lokalny development). Jest wyraźnie oznaczona jako orientacyjna
 * i nie udaje pełnej analizy merytorycznej.
 */
export function heuristicEvaluation(
  transcript: string,
  dialogue: Array<{ question: string; answer: string }>,
): EvaluationResult {
  const clean = transcript.trim();
  const words = countWords(clean);
  const answered = dialogue.filter((d) => countWords(d.answer) >= 5).length;

  if (words === 0) {
    return emptyEvaluation(
      "Nie zarejestrowano wypowiedzi. Nagraj odpowiedź albo wpisz tekst, a komisja oceni realną treść.",
    );
  }

  const meritum = words < 60 ? 1 : words < 150 ? 3 : words < 280 ? 5 : 6;
  const kompozycja = words < 80 ? 0 : words < 200 ? 1 : 2;
  const rozmowa =
    answered === 0 ? 0 : answered >= dialogue.length && answered > 1 ? 4 : 2;
  const jezyk = words < 60 ? 1 : words < 200 ? 2 : 3;

  const pointsById: Record<string, number> = {
    meritum,
    kompozycja,
    rozmowa,
    jezyk,
  };

  const criteria: CriterionScore[] = CKE_CRITERIA.map((definition) => ({
    id: definition.id,
    label: definition.label,
    maxPoints: definition.maxPoints,
    points: Math.min(pointsById[definition.id] ?? 0, definition.maxPoints),
    levelLabel: "Szacunek orientacyjny (tryb offline)",
    quotes: [],
    justification:
      "Ocena zapasowa liczona bez analizy merytorycznej — serwer nie ma dostępu do modelu oceniającego. Podłącz ANTHROPIC_API_KEY, aby otrzymać pełną ocenę z cytatami.",
    strengths: [],
    improvements: [],
  }));

  const totalPoints = criteria.reduce((sum, c) => sum + c.points, 0);
  const percentage = Math.round((totalPoints / CKE_MAX_POINTS) * 100);

  return {
    totalPoints,
    maxPoints: CKE_MAX_POINTS,
    percentage,
    passed: percentage >= CKE_PASS_THRESHOLD * 100,
    criteria,
    summary:
      "To wynik orientacyjny z trybu offline — oparty na długości i kompletności wypowiedzi, nie na jej treści. Pełna ocena CKE z cytatami wymaga podłączonego modelu.",
    requirements: [],
    factualErrors: [],
    languageIssues: [],
    source: "heuristic",
  };
}

export function emptyEvaluation(summary: string): EvaluationResult {
  const criteria: CriterionScore[] = CKE_CRITERIA.map((definition) => ({
    id: definition.id,
    label: definition.label,
    maxPoints: definition.maxPoints,
    points: 0,
    levelLabel: "0 pkt — brak wypowiedzi",
    quotes: [],
    justification: "Brak materiału do oceny w tym kryterium.",
    strengths: [],
    improvements: [],
  }));

  return {
    totalPoints: 0,
    maxPoints: CKE_MAX_POINTS,
    percentage: 0,
    passed: false,
    criteria,
    summary,
    requirements: [],
    factualErrors: [],
    languageIssues: [],
    source: "heuristic",
  };
}

/** Pytania zapasowe, gdy model jest niedostępny. */
export function heuristicFollowUps(transcript: string): FollowUpQuestion[] {
  const clean = transcript.trim();

  if (!clean) {
    return [
      {
        id: "fu-1",
        text: "Nie usłyszeliśmy Twojej wypowiedzi. Czy możesz przedstawić tezę i odwołać się do wskazanej lektury?",
      },
      {
        id: "fu-2",
        text: "Jaki kontekst wybrałbyś do tego zagadnienia i dlaczego akurat ten?",
      },
    ];
  }

  const firstSentence = clean.split(/(?<=[.!?])\s+/)[0]?.trim() ?? clean;
  const snippet =
    firstSentence.length > 140 ? `${firstSentence.slice(0, 140)}…` : firstSentence;

  return [
    {
      id: "fu-1",
      text: `Powiedziałeś: „${snippet}”. Jak uzasadnisz to stanowisko odwołaniem do konkretnej sceny lub fragmentu utworu?`,
      basedOnQuote: firstSentence,
    },
    {
      id: "fu-2",
      text: "Jaki inny kontekst — historyczny, filozoficzny lub kulturowy — potwierdza albo podważa Twoją tezę?",
    },
  ];
}
