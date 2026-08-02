/**
 * Weryfikacja cytatów: każdy cytat w ocenie musi pochodzić dosłownie
 * z wypowiedzi ucznia. Chroni przed zmyślaniem cytatów przez model.
 */

/** Ujednolica zapis, żeby porównanie nie zależało od interpunkcji i typu cudzysłowu. */
export function normalizeForMatch(text: string): string {
  return text
    .toLowerCase()
    .replace(/[„”"«»‟]/g, '"')
    .replace(/[’‘‚']/g, "'")
    .replace(/[–—―]/g, "-")
    .replace(/…/g, "...")
    .replace(/[.,;:!?()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export interface QuoteCheck {
  verified: boolean;
  /** Fragment znaleziony w źródle (oryginalny zapis), jeśli udało się dopasować */
  matched: string | null;
}

/**
 * Sprawdza, czy cytat występuje w źródle. Dopuszcza różnice w interpunkcji
 * i białych znakach, ale nie w treści słów.
 */
export function verifyQuote(quote: string, source: string): QuoteCheck {
  const cleanQuote = quote.trim().replace(/^[„"']+|[”"'.…]+$/g, "").trim();
  if (!cleanQuote || !source.trim()) {
    return { verified: false, matched: null };
  }

  const normQuote = normalizeForMatch(cleanQuote);
  const normSource = normalizeForMatch(source);
  if (!normQuote) return { verified: false, matched: null };

  if (normSource.includes(normQuote)) {
    return { verified: true, matched: findOriginalSpan(cleanQuote, source) };
  }

  return { verified: false, matched: null };
}

/**
 * Odtwarza oryginalny zapis cytatu ze źródła (z interpunkcją),
 * dopasowując po sekwencji słów.
 */
function findOriginalSpan(quote: string, source: string): string | null {
  const quoteWords = normalizeForMatch(quote).split(" ").filter(Boolean);
  if (quoteWords.length === 0) return null;

  const sourceTokens = [...source.matchAll(/\S+/g)].map((m) => ({
    raw: m[0],
    norm: normalizeForMatch(m[0]),
    index: m.index ?? 0,
  }));

  for (let i = 0; i < sourceTokens.length; i++) {
    let matchedWords = 0;
    let j = i;
    while (j < sourceTokens.length && matchedWords < quoteWords.length) {
      const tokenWords = sourceTokens[j]!.norm.split(" ").filter(Boolean);
      if (tokenWords.length === 0) {
        j++;
        continue;
      }
      const expected = quoteWords.slice(
        matchedWords,
        matchedWords + tokenWords.length,
      );
      if (tokenWords.join(" ") !== expected.join(" ")) break;
      matchedWords += tokenWords.length;
      j++;
    }

    if (matchedWords >= quoteWords.length) {
      const start = sourceTokens[i]!.index;
      const lastToken = sourceTokens[j - 1]!;
      const end = lastToken.index + lastToken.raw.length;
      return source.slice(start, end);
    }
  }

  return null;
}

/** Ile słów liczy tekst (do oceny długości wypowiedzi). */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
