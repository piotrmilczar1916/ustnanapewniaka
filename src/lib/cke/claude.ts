import "server-only";

import Anthropic from "@anthropic-ai/sdk";

const DEFAULT_MODEL = "claude-sonnet-4-5";

export function hasApiKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

let client: Anthropic | null = null;

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Brak ANTHROPIC_API_KEY po stronie serwera.");
  }
  client ??= new Anthropic({ apiKey });
  return client;
}

/** Wywołuje model i zwraca sparsowany JSON z odpowiedzi. */
export async function completeJson<T>(options: {
  system: string;
  prompt: string;
  maxTokens: number;
  temperature?: number;
}): Promise<T> {
  const message = await getClient().messages.create({
    model: process.env.ANTHROPIC_MODEL || DEFAULT_MODEL,
    max_tokens: options.maxTokens,
    temperature: options.temperature ?? 0,
    system: options.system,
    messages: [
      { role: "user", content: options.prompt },
      // Prefill wymusza start odpowiedzi od obiektu JSON.
      { role: "assistant", content: "{" },
    ],
  });

  const text = message.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("");

  return parseJson<T>(`{${text}`);
}

function parseJson<T>(raw: string): T {
  const trimmed = raw.trim().replace(/^```json\s*/i, "").replace(/```$/, "");
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start === -1 || end <= start) {
      throw new Error("Model nie zwrócił poprawnego JSON-a.");
    }
    return JSON.parse(trimmed.slice(start, end + 1)) as T;
  }
}
