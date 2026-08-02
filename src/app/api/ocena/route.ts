import { hasApiKey } from "@/lib/cke/claude";
import { evaluateWithClaude } from "@/lib/cke/evaluate";
import { emptyEvaluation, heuristicEvaluation } from "@/lib/cke/fallback";
import { countWords } from "@/lib/cke/verify";
import type { QuestionKind } from "@/lib/types";

export const runtime = "nodejs";

const MAX_TRANSCRIPT_CHARS = 12000;

interface RequestBody {
  questionCode?: string;
  questionTitle?: string;
  questionKind?: QuestionKind;
  cultureTextHint?: string;
  transcript?: string;
  dialogue?: Array<{ question?: string; answer?: string }>;
}

export async function POST(request: Request) {
  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return Response.json({ error: "Nieprawidłowe dane." }, { status: 400 });
  }

  const transcript = (body.transcript ?? "").slice(0, MAX_TRANSCRIPT_CHARS).trim();
  const dialogue = (body.dialogue ?? [])
    .slice(0, 5)
    .map((d) => ({
      question: (d.question ?? "").slice(0, 1000).trim(),
      answer: (d.answer ?? "").slice(0, 4000).trim(),
    }))
    .filter((d) => d.question.length > 0);

  if (countWords(transcript) === 0) {
    return Response.json(
      emptyEvaluation(
        "Nie zarejestrowano wypowiedzi. Nagraj odpowiedź albo wpisz tekst, a komisja oceni realną treść.",
      ),
    );
  }

  if (!hasApiKey()) {
    return Response.json(heuristicEvaluation(transcript, dialogue));
  }

  try {
    const evaluation = await evaluateWithClaude({
      questionCode: body.questionCode ?? "—",
      questionTitle: body.questionTitle ?? "",
      questionKind: body.questionKind === "niejawne" ? "niejawne" : "jawne",
      cultureTextHint: body.cultureTextHint,
      transcript,
      dialogue,
    });
    return Response.json(evaluation);
  } catch (error) {
    console.error("Błąd oceny CKE:", error);
    return Response.json(heuristicEvaluation(transcript, dialogue));
  }
}
