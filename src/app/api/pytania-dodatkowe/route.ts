import { completeJson, hasApiKey } from "@/lib/cke/claude";
import { analyzeFollowUpsHeuristic } from "@/lib/cke/fallback";
import {
  FOLLOWUP_SYSTEM_PROMPT,
  buildFollowUpPrompt,
} from "@/lib/cke/prompt";
import { verifyQuote } from "@/lib/cke/verify";
import type { FollowUpAnalysis, FollowUpQuestion, QuestionKind } from "@/lib/types";

export const runtime = "nodejs";

interface RequestBody {
  questionTitle?: string;
  questionKind?: QuestionKind;
  cultureTextHint?: string;
  transcript?: string;
}

interface RawFollowUpAnalysis {
  needsFollowUp?: boolean;
  skipReason?: string;
  gaps?: Array<{ element?: string; description?: string }>;
  questions?: Array<{
    text?: string;
    basedOnQuote?: string;
    targetsGap?: string;
  }>;
}

function buildResponse(
  analysis: Omit<FollowUpAnalysis, "questions"> & { questions: FollowUpQuestion[] },
): FollowUpAnalysis {
  return {
    needsFollowUp: analysis.needsFollowUp,
    skipReason: analysis.skipReason,
    gaps: analysis.gaps,
    questions: analysis.questions,
  };
}

export async function POST(request: Request) {
  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return Response.json({ error: "Nieprawidłowe dane." }, { status: 400 });
  }

  const transcript = (body.transcript ?? "").slice(0, 12000).trim();
  const questionKind = body.questionKind === "niejawne" ? "niejawne" : "jawne";

  if (!transcript || !hasApiKey()) {
    return Response.json(
      analyzeFollowUpsHeuristic({
        transcript,
        questionKind,
        questionTitle: body.questionTitle ?? "",
      }),
    );
  }

  try {
    const raw = await completeJson<RawFollowUpAnalysis>({
      system: FOLLOWUP_SYSTEM_PROMPT,
      prompt: buildFollowUpPrompt({
        questionTitle: body.questionTitle ?? "",
        questionKind,
        cultureTextHint: body.cultureTextHint,
        transcript,
      }),
      maxTokens: 1500,
      temperature: 0.2,
    });

    const needsFollowUp = raw.needsFollowUp !== false;

    if (!needsFollowUp) {
      return Response.json(
        buildResponse({
          needsFollowUp: false,
          skipReason:
            (raw.skipReason ?? "").trim() ||
            "Wypowiedź wyczerpała wymagane elementy polecenia — komisja nie ma pytań dodatkowych.",
          gaps: [],
          questions: [],
        }),
      );
    }

    const gaps = (raw.gaps ?? [])
      .slice(0, 4)
      .map((g) => ({
        element: (g.element ?? "").trim(),
        description: (g.description ?? "").trim(),
      }))
      .filter((g) => g.element.length > 0 && g.description.length > 0);

    const questions: FollowUpQuestion[] = (raw.questions ?? [])
      .slice(0, 2)
      .map((q, index) => {
        const quote = (q.basedOnQuote ?? "").trim();
        const check = quote ? verifyQuote(quote, transcript) : { verified: false, matched: null };
        return {
          id: `fu-${index + 1}`,
          text: (q.text ?? "").trim(),
          basedOnQuote: check.verified ? (check.matched ?? quote) : undefined,
          targetsGap: (q.targetsGap ?? "").trim() || undefined,
        };
      })
      .filter((q) => q.text.length > 0);

    if (questions.length === 0) {
      return Response.json(
        analyzeFollowUpsHeuristic({
          transcript,
          questionKind,
          questionTitle: body.questionTitle ?? "",
        }),
      );
    }

    return Response.json(
      buildResponse({
        needsFollowUp: true,
        gaps,
        questions,
      }),
    );
  } catch (error) {
    console.error("Błąd analizy wypowiedzi / pytań dodatkowych:", error);
    return Response.json(
      analyzeFollowUpsHeuristic({
        transcript,
        questionKind,
        questionTitle: body.questionTitle ?? "",
      }),
    );
  }
}
