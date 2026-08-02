import "server-only";

import { completeJson } from "@/lib/cke/claude";
import {
  CKE_CRITERIA,
  CKE_MAX_POINTS,
  CKE_PASS_THRESHOLD,
  getCriterion,
} from "@/lib/cke/criteria";
import {
  EVALUATION_SYSTEM_PROMPT,
  buildEvaluationPrompt,
  type EvaluationInput,
} from "@/lib/cke/prompt";
import { verifyQuote } from "@/lib/cke/verify";
import type {
  CriterionId,
  CriterionScore,
  EvaluationQuote,
  EvaluationResult,
  FactualError,
  LanguageIssue,
  RequirementCheck,
} from "@/lib/types";

interface RawCriterion {
  id?: string;
  points?: number;
  levelLabel?: string;
  justification?: string;
  strengths?: unknown;
  improvements?: unknown;
  quotes?: Array<{ text?: string; source?: string; comment?: string }>;
}

interface RawEvaluation {
  criteria?: RawCriterion[];
  requirements?: Array<{ label?: string; met?: boolean; evidence?: string }>;
  factualErrors?: Array<{
    quote?: string;
    type?: string;
    explanation?: string;
  }>;
  languageIssues?: Array<{
    quote?: string;
    issue?: string;
    suggestion?: string;
  }>;
  summary?: string;
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function clampPoints(value: unknown, max: number): number {
  const n = typeof value === "number" ? Math.round(value) : 0;
  return Math.min(Math.max(n, 0), max);
}

export async function evaluateWithClaude(
  input: EvaluationInput,
): Promise<EvaluationResult> {
  const raw = await completeJson<RawEvaluation>({
    system: EVALUATION_SYSTEM_PROMPT,
    prompt: buildEvaluationPrompt(input),
    maxTokens: 4000,
  });

  const dialogueText = input.dialogue
    .map((d) => d.answer)
    .join("\n")
    .trim();

  const checkQuote = (text: string, source: "monolog" | "rozmowa") => {
    const haystack = source === "rozmowa" ? dialogueText : input.transcript;
    const primary = verifyQuote(text, haystack);
    if (primary.verified) return primary;
    // Cytat mógł zostać przypisany do złej części wypowiedzi.
    return verifyQuote(text, `${input.transcript}\n${dialogueText}`);
  };

  const criteria: CriterionScore[] = CKE_CRITERIA.map((definition) => {
    const rawCriterion = raw.criteria?.find((c) => c.id === definition.id);
    const points = clampPoints(rawCriterion?.points, definition.maxPoints);

    const quotes: EvaluationQuote[] = (rawCriterion?.quotes ?? [])
      .slice(0, 3)
      .map((q) => {
        const text = (q.text ?? "").trim();
        const source: "monolog" | "rozmowa" =
          q.source === "rozmowa" ? "rozmowa" : "monolog";
        const check = checkQuote(text, source);
        return {
          text: check.matched ?? text,
          verified: check.verified,
          source,
          comment: (q.comment ?? "").trim(),
        };
      })
      .filter((q) => q.text.length > 0);

    return {
      id: definition.id,
      label: definition.label,
      maxPoints: definition.maxPoints,
      points,
      levelLabel: (rawCriterion?.levelLabel ?? "").trim(),
      justification: (rawCriterion?.justification ?? "").trim(),
      strengths: asStringList(rawCriterion?.strengths),
      improvements: asStringList(rawCriterion?.improvements),
      // Cytaty niezweryfikowane odrzucamy — lepiej brak cytatu niż zmyślony.
      quotes: quotes.filter((q) => q.verified),
    };
  });

  const withCkeRules = applyCkeBindingRules(criteria);

  const factualErrors: FactualError[] = (raw.factualErrors ?? [])
    .slice(0, 6)
    .map((e) => {
      const quote = (e.quote ?? "").trim();
      const check = checkQuote(quote, "monolog");
      return {
        quote: check.matched ?? quote,
        verified: check.verified,
        type: e.type === "kardynalny" ? ("kardynalny" as const) : ("poważny" as const),
        explanation: (e.explanation ?? "").trim(),
      };
    })
    .filter((e) => e.verified && e.explanation.length > 0);

  const languageIssues: LanguageIssue[] = (raw.languageIssues ?? [])
    .slice(0, 6)
    .map((e) => {
      const quote = (e.quote ?? "").trim();
      const check = checkQuote(quote, "monolog");
      return {
        quote: check.matched ?? quote,
        verified: check.verified,
        issue: (e.issue ?? "").trim(),
        suggestion: (e.suggestion ?? "").trim(),
      };
    })
    .filter((e) => e.verified && e.issue.length > 0);

  const requirements: RequirementCheck[] = (raw.requirements ?? [])
    .slice(0, 6)
    .map((r) => ({
      label: (r.label ?? "").trim(),
      met: Boolean(r.met),
      evidence: (r.evidence ?? "").trim(),
    }))
    .filter((r) => r.label.length > 0);

  const totalPoints = withCkeRules.reduce((sum, c) => sum + c.points, 0);
  const percentage = Math.round((totalPoints / CKE_MAX_POINTS) * 100);

  return {
    totalPoints,
    maxPoints: CKE_MAX_POINTS,
    percentage,
    passed: percentage >= CKE_PASS_THRESHOLD * 100,
    criteria: withCkeRules,
    summary: (raw.summary ?? "").trim(),
    requirements,
    factualErrors,
    languageIssues,
    source: "ai",
  };
}

/**
 * Zasada z informatora: 0 pkt za meritum ⇒ 0 pkt we wszystkich kryteriach.
 * Egzekwujemy po stronie serwera, niezależnie od tego, co zwrócił model.
 */
function applyCkeBindingRules(criteria: CriterionScore[]): CriterionScore[] {
  const meritum = criteria.find((c) => c.id === "meritum");
  if (!meritum || meritum.points > 0) return criteria;

  return criteria.map((c) =>
    c.id === "meritum"
      ? c
      : {
          ...c,
          points: 0,
          levelLabel: "0 pkt — konsekwencja zerowej oceny meritum (zasada CKE)",
        },
  );
}

export function criterionLabel(id: CriterionId): string {
  return getCriterion(id).label;
}
