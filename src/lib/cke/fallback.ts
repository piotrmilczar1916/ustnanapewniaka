import { CKE_CRITERIA, CKE_MAX_POINTS, CKE_PASS_THRESHOLD } from "@/lib/cke/criteria";
import { countWords } from "@/lib/cke/verify";
import type {
  CriterionScore,
  EvaluationResult,
  FollowUpAnalysis,
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

/** Analiza kompletności wypowiedzi — tryb offline bez klucza API. */
export function analyzeFollowUpsHeuristic(input: {
  transcript: string;
  questionKind: "jawne" | "niejawne";
  questionTitle: string;
}): FollowUpAnalysis {
  const clean = input.transcript.trim();
  const words = countWords(clean);

  if (!clean || words < 15) {
    return {
      needsFollowUp: true,
      gaps: [
        {
          element: "wypowiedź monologowa",
          description: "Brak wypowiedzi lub wypowiedź zbyt krótka, by wyczerpać temat.",
        },
      ],
      questions: heuristicFollowUpQuestions(clean),
    };
  }

  const hasStructure =
    /\b(wstęp|zakończenie|podsumowując|dlatego|w konkluzji)\b/i.test(clean) ||
    words >= 120;
  const hasLiteraryRef =
    /\b(bohater|bohaterka|utwór|lektura|fragment|scena|autor|w\s+„|w\s+")/i.test(
      clean,
    );
  const hasContext =
    /\b(kontekst|epoka|historia|filozof|mitolog|bibl|spektakl|film|porówn)/i.test(
      clean,
    );
  const hasArgument =
    words >= 80 &&
    (/\b(bo|ponieważ|dlatego|argument|teza|uzasadn|przykład)\b/i.test(clean) ||
      clean.split(/[.!?]/).filter((s) => s.trim().length > 20).length >= 3);

  const jawneComplete =
    input.questionKind === "jawne" &&
    hasLiteraryRef &&
    hasContext &&
    hasArgument &&
    hasStructure &&
    words >= 100;

  const niejawneComplete =
    input.questionKind === "niejawne" &&
    hasLiteraryRef &&
    hasArgument &&
    hasStructure &&
    words >= 90;

  if (jawneComplete || niejawneComplete) {
    return {
      needsFollowUp: false,
      skipReason:
        "Wypowiedź zawiera odwołanie do tekstu, argumentację i wymagane elementy polecenia — w trybie offline komisja nie dopytuje. Pełna analiza wymaga klucza API.",
      gaps: [],
      questions: [],
    };
  }

  const gaps: Array<{ element: string; description: string }> = [];
  if (!hasLiteraryRef) {
    gaps.push({
      element: "lektura / tekst",
      description: "Brak konkretnego odwołania do utworu wskazanego w poleceniu.",
    });
  }
  if (input.questionKind === "jawne" && !hasContext) {
    gaps.push({
      element: "kontekst",
      description: "Brak funkcjonalnego kontekstu poszerzającego omawiane zagadnienie.",
    });
  }
  if (!hasArgument) {
    gaps.push({
      element: "argumentacja",
      description: "Argumentacja jest zbyt ogólnikowa lub zbyt krótka.",
    });
  }

  return {
    needsFollowUp: true,
    gaps,
    questions: heuristicFollowUpQuestions(clean, gaps[0]?.element),
  };
}

function heuristicFollowUpQuestions(
  transcript: string,
  primaryGap?: string,
): FollowUpQuestion[] {
  const clean = transcript.trim();

  if (!clean) {
    return [
      {
        id: "fu-1",
        text: "Nie usłyszeliśmy Twojej wypowiedzi. Czy możesz przedstawić tezę i odwołać się do wskazanej lektury?",
        targetsGap: "wypowiedź monologowa",
      },
    ];
  }

  const firstSentence = clean.split(/(?<=[.!?])\s+/)[0]?.trim() ?? clean;
  const snippet =
    firstSentence.length > 120 ? `${firstSentence.slice(0, 120)}…` : firstSentence;

  if (primaryGap === "kontekst") {
    return [
      {
        id: "fu-1",
        text: "Nie usłyszeliśmy w Twojej wypowiedzi kontekstu poszerzającego zagadnienie. Jaki kontekst — literacki, historyczny lub kulturowy — wybrałbyś i dlaczego?",
        targetsGap: "kontekst",
      },
    ];
  }

  if (primaryGap === "lektura / tekst") {
    return [
      {
        id: "fu-1",
        text: "Proszę odwołać się do konkretnego fragmentu lub sceny z utworu wskazanego w poleceniu i wyjaśnić, jak ilustruje Twoją tezę.",
        targetsGap: "lektura / tekst",
      },
    ];
  }

  return [
    {
      id: "fu-1",
      text: `Powiedziałeś: „${snippet}”. Proszę rozwinąć ten wątek odwołaniem do konkretnego przykładu z tekstu.`,
      basedOnQuote: firstSentence,
      targetsGap: primaryGap ?? "argumentacja",
    },
  ];
}

/** @deprecated Użyj analyzeFollowUpsHeuristic */
export function heuristicFollowUps(transcript: string): FollowUpQuestion[] {
  return analyzeFollowUpsHeuristic({
    transcript,
    questionKind: "jawne",
    questionTitle: "",
  }).questions;
}
