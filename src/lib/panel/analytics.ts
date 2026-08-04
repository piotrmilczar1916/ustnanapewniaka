import type { SessionResult } from "@/lib/auth/types";

export const EXAM_DATE = new Date("2027-05-15T08:00:00+02:00");
export const JAWNE_TOTAL = 76;
export const CKE_PASS_PERCENT = 30;

const CRITERION_SHORT: Record<string, string> = {
  meritum: "Meritum",
  kompozycja: "Kompozycja",
  rozmowa: "Rozmowa",
  jezyk: "Język",
};

export interface CriterionAverage {
  id: string;
  label: string;
  averagePercent: number;
  sessions: number;
}

export interface PanelInsights {
  daysUntilExam: number;
  practicedJawne: number;
  passedSessions: number;
  streakDays: number;
  criterionAverages: CriterionAverage[];
  weakestCriterion: CriterionAverage | null;
  recentTrend: Array<{ label: string; percentage: number; date: string }>;
  recommendation: { title: string; text: string; action: string; href: string };
}

function parseQuestionNumber(code: string): number | null {
  const match = /^P-(\d+)$/i.exec(code.trim());
  if (!match) return null;
  const n = Number.parseInt(match[1]!, 10);
  return Number.isFinite(n) ? n : null;
}

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

function computeStreak(results: SessionResult[]): number {
  if (results.length === 0) return 0;

  const days = [...new Set(results.map((r) => dayKey(r.createdAt)))].sort(
    (a, b) => b.localeCompare(a),
  );

  const today = dayKey(new Date().toISOString());
  const yesterday = dayKey(
    new Date(Date.now() - 86_400_000).toISOString(),
  );

  if (days[0] !== today && days[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(`${days[i - 1]!}T12:00:00`);
    const curr = new Date(`${days[i]!}T12:00:00`);
    const diffDays = Math.round(
      (prev.getTime() - curr.getTime()) / 86_400_000,
    );
    if (diffDays === 1) streak++;
    else break;
  }
  return streak;
}

function buildRecommendation(
  weakest: CriterionAverage | null,
  results: SessionResult[],
): PanelInsights["recommendation"] {
  if (results.length === 0) {
    return {
      title: "Pierwszy krok",
      text: "Zrób darmową symulację — po niej zobaczysz tu analizę kryteriów CKE i rekomendacje dopasowane do Twoich wyników.",
      action: "Zacznij symulację",
      href: "/symulacja",
    };
  }

  const last = results[0]!;
  if (last.percentage < CKE_PASS_PERCENT) {
    return {
      title: "Priorytet: próg zdawalności",
      text: `Ostatnia sesja: ${last.percentage}% — poniżej progu 30% CKE. Powtórz to samo pytanie lub wylosuj nowe i skup się na ${weakest?.label.toLowerCase() ?? "merytoryce"}.`,
      action: "Ćwicz ponownie",
      href: "/symulacja",
    };
  }

  const tips: Record<string, string> = {
    meritum:
      "W kolejnej sesji buduj tezę, odwołuj się do lektury i dodaj funkcjonalny kontekst — to największy pakiet punktów.",
    kompozycja:
      "Zadbaj o wyraźny wstęp, rozwinięcie z przykładami i krótkie zakończenie z wnioskiem.",
    rozmowa:
      "Rozwijaj odpowiedzi w rozmowie z komisją — unikaj ogólników, doprecyzowuj pojęcia.",
    jezyk:
      "Poszerz słownictwo: synonimy, terminologia literacka i zdania złożone poprawią ocenę językową.",
  };

  const id = weakest?.id ?? "meritum";
  return {
    title: `Wzmocnij: ${weakest?.label ?? "Meritum"}`,
    text: tips[id] ?? tips.meritum!,
    action: "Losuj pytanie",
    href: "/symulacja",
  };
}

export function computePanelInsights(results: SessionResult[]): PanelInsights {
  const now = Date.now();
  const daysUntilExam = Math.max(
    0,
    Math.ceil((EXAM_DATE.getTime() - now) / 86_400_000),
  );

  const practicedNumbers = new Set<number>();
  for (const r of results) {
    if (r.questionKind !== "jawne") continue;
    const n = parseQuestionNumber(r.questionCode);
    if (n != null) practicedNumbers.add(n);
  }

  const passedSessions = results.filter(
    (r) => r.percentage >= CKE_PASS_PERCENT,
  ).length;

  const criterionMap = new Map<
    string,
    { sum: number; count: number; label: string }
  >();

  for (const r of results) {
    for (const c of r.criteria) {
      const pct =
        c.maxPoints > 0 ? Math.round((c.points / c.maxPoints) * 100) : 0;
      const prev = criterionMap.get(c.id);
      if (prev) {
        prev.sum += pct;
        prev.count += 1;
      } else {
        criterionMap.set(c.id, { sum: pct, count: 1, label: c.label });
      }
    }
  }

  const criterionAverages: CriterionAverage[] = [
    "meritum",
    "kompozycja",
    "rozmowa",
    "jezyk",
  ].map((id) => {
    const data = criterionMap.get(id);
    return {
      id,
      label: CRITERION_SHORT[id] ?? id,
      averagePercent:
        data && data.count > 0 ? Math.round(data.sum / data.count) : 0,
      sessions: data?.count ?? 0,
    };
  });

  const withData = criterionAverages.filter((c) => c.sessions > 0);
  const weakestCriterion =
    withData.length > 0
      ? withData.reduce((min, c) =>
          c.averagePercent < min.averagePercent ? c : min,
        )
      : null;

  const recentTrend = [...results]
    .slice(0, 6)
    .reverse()
    .map((r, i) => ({
      label: `#${results.length - i}`,
      percentage: r.percentage,
      date: r.createdAt,
    }));

  return {
    daysUntilExam,
    practicedJawne: practicedNumbers.size,
    passedSessions,
    streakDays: computeStreak(results),
    criterionAverages,
    weakestCriterion,
    recentTrend,
    recommendation: buildRecommendation(weakestCriterion, results),
  };
}
