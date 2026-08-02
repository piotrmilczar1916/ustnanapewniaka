import type { Question } from "@/lib/types";
import { PYTANIA_JAWNE } from "@/data/pytania-jawne";

/**
 * Pytania jawne do losowania w symulatorze — z oficjalnej listy CKE.
 */
export const MOCK_JAWNE_QUESTIONS: Question[] = PYTANIA_JAWNE.map((q) => ({
  id: `cke-j-${q.number}`,
  kind: "jawne" as const,
  code: `P-${String(q.number).padStart(2, "0")}`,
  title: q.title,
  isTestData: false,
}));

export const MOCK_NIEJAWNE_QUESTIONS: Question[] = [
  {
    id: "test-n-01",
    kind: "niejawne",
    code: "N-01",
    title:
      "Na podstawie załączonego tekstu kultury omów, w jaki sposób autor buduje napięcie między jednostką a wspólnotą.",
    cultureTextHint:
      "[TEST] Fragment współczesnego eseju o relacjach w małym miasteczku — pełny tekst pojawi się po podłączeniu generatora.",
    isTestData: true,
  },
  {
    id: "test-n-02",
    kind: "niejawne",
    code: "N-02",
    title:
      "Zinterpretuj przedstawiony tekst kultury, zwracając uwagę na funkcję przestrzeni i pamięci.",
    cultureTextHint:
      "[TEST] Opis instalacji artystycznej / fragment prozy — placeholder do developmentu.",
    isTestData: true,
  },
];

export function drawQuestion(kind: "jawne" | "niejawne"): Question {
  const pool =
    kind === "jawne" ? MOCK_JAWNE_QUESTIONS : MOCK_NIEJAWNE_QUESTIONS;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index]!;
}

export function getJawneQuestionByNumber(number: number): Question | null {
  const found = MOCK_JAWNE_QUESTIONS.find(
    (q) => q.code === `P-${String(number).padStart(2, "0")}`,
  );
  return found ?? null;
}
