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
}

export interface CriterionScore {
  id: "meritum" | "kompozycja" | "jezyk" | "odpowiedzi";
  label: string;
  maxPoints: number;
  points: number;
  /** Cytat z realnej transkrypcji ucznia */
  quote: string;
  justification: string;
}

export interface EvaluationResult {
  totalPoints: number;
  maxPoints: number;
  percentage: number;
  criteria: CriterionScore[];
  summary: string;
  /** TODO: podłączyć prawdziwe API Claude */
  isMock: true;
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
