import type { CriterionAverage } from "@/lib/panel/analytics";

export function PanelCriterionChart({
  criteria,
}: {
  criteria: CriterionAverage[];
}) {
  const hasData = criteria.some((c) => c.sessions > 0);

  if (!hasData) {
    return (
      <p className="text-sm text-graphite">
        Po pierwszej symulacji zobaczysz tu średnie wyniki w każdym kryterium
        CKE.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {criteria.map((c) => (
        <li key={c.id}>
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-display text-sm font-bold uppercase tracking-wide text-ink">
              {c.label}
            </span>
            <span className="font-mono text-sm text-stamp-red">
              {c.sessions > 0 ? `${c.averagePercent}%` : "—"}
            </span>
          </div>
          <div className="mt-2 h-2 border border-ink/20 bg-paper">
            <div
              className="h-full bg-stamp-red transition-all duration-500"
              style={{
                width: c.sessions > 0 ? `${c.averagePercent}%` : "0%",
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
