import { completeJson, hasApiKey } from "@/lib/cke/claude";
import { heuristicFollowUps } from "@/lib/cke/fallback";
import {
  FOLLOWUP_SYSTEM_PROMPT,
  buildFollowUpPrompt,
} from "@/lib/cke/prompt";
import { verifyQuote } from "@/lib/cke/verify";
import type { FollowUpQuestion, QuestionKind } from "@/lib/types";

export const runtime = "nodejs";

interface RequestBody {
  questionTitle?: string;
  questionKind?: QuestionKind;
  transcript?: string;
}

interface RawFollowUps {
  questions?: Array<{ text?: string; basedOnQuote?: string }>;
}

export async function POST(request: Request) {
  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return Response.json({ error: "Nieprawidłowe dane." }, { status: 400 });
  }

  const transcript = (body.transcript ?? "").slice(0, 12000).trim();

  if (!transcript || !hasApiKey()) {
    return Response.json({ questions: heuristicFollowUps(transcript) });
  }

  try {
    const raw = await completeJson<RawFollowUps>({
      system: FOLLOWUP_SYSTEM_PROMPT,
      prompt: buildFollowUpPrompt({
        questionTitle: body.questionTitle ?? "",
        questionKind: body.questionKind === "niejawne" ? "niejawne" : "jawne",
        transcript,
      }),
      maxTokens: 1000,
      temperature: 0.4,
    });

    const questions: FollowUpQuestion[] = (raw.questions ?? [])
      .slice(0, 3)
      .map((q, index) => {
        const quote = (q.basedOnQuote ?? "").trim();
        const check = verifyQuote(quote, transcript);
        return {
          id: `fu-${index + 1}`,
          text: (q.text ?? "").trim(),
          basedOnQuote: check.verified
            ? (check.matched ?? quote)
            : undefined,
        };
      })
      .filter((q) => q.text.length > 0);

    if (questions.length === 0) {
      return Response.json({ questions: heuristicFollowUps(transcript) });
    }

    return Response.json({ questions });
  } catch (error) {
    console.error("Błąd generowania pytań dodatkowych:", error);
    return Response.json({ questions: heuristicFollowUps(transcript) });
  }
}
