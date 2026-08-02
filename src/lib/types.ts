export type ExamSubject = "polski" | "angielski";

export type QuestionKind = "jawne" | "niejawne";

export type SimulatorStep =
  | "exam"
  | "draw"
  | "prep"
  | "record"
  | "followup"
  | "result";

export interface Question {
  id: string;
  kind: QuestionKind;
  /** Kod w stylu egzaminacyjnym, np. P-01 */
  code: string;
  title: string;
  /** Dla niejawnych: krótki opis tekstu kultury */
  cultureTextHint?: string;
  /** true = dane testowe / placeholder; false = oficjalna baza CKE */
  isTestData: boolean;
}

export interface FollowUpQuestion {
  id: string;
  text: string;
  /** Fragment wypowiedzi, z którego wynika pytanie */
  basedOnQuote?: string;
}

export type CriterionId = "meritum" | "kompozycja" | "rozmowa" | "jezyk";

export interface EvaluationQuote {
  /** Dosłowny fragment wypowiedzi ucznia */
  text: string;
  /** Czy fragment faktycznie występuje w transkrypcji */
  verified: boolean;
  source: "monolog" | "rozmowa";
  /** Do czego odnosi się cytat w ocenie */
  comment: string;
}

export interface CriterionScore {
  id: CriterionId;
  label: string;
  maxPoints: number;
  points: number;
  /** Nazwa poziomu z rubryki CKE, np. „zadowalająca argumentacja bez błędów rzeczowych” */
  levelLabel: string;
  quotes: EvaluationQuote[];
  justification: string;
  strengths: string[];
  improvements: string[];
}

export interface FactualError {
  quote: string;
  verified: boolean;
  type: "kardynalny" | "poważny";
  explanation: string;
}

export interface LanguageIssue {
  quote: string;
  verified: boolean;
  issue: string;
  suggestion: string;
}

export interface RequirementCheck {
  label: string;
  met: boolean;
  evidence: string;
}

export interface EvaluationResult {
  totalPoints: number;
  maxPoints: number;
  percentage: number;
  /** Próg zdawalności CKE to 30% */
  passed: boolean;
  criteria: CriterionScore[];
  summary: string;
  /** Realizacja elementów polecenia: zagadnienie, lektura, kontekst */
  requirements: RequirementCheck[];
  factualErrors: FactualError[];
  languageIssues: LanguageIssue[];
  /** "ai" = ocena z modelu, "heuristic" = tryb offline bez klucza API */
  source: "ai" | "heuristic";
}

export interface SessionState {
  subject: ExamSubject | null;
  questionKind: QuestionKind | null;
  question: Question | null;
  transcript: string;
  followUps: FollowUpQuestion[];
  followUpAnswers: string[];
  evaluation: EvaluationResult | null;
}
