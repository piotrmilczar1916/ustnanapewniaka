import type { PanelInsights } from "@/lib/panel/analytics";
import { CKE_PASS_PERCENT } from "@/lib/panel/analytics";

export function PanelScoreTrend({
  trend,
}: {
  trend: PanelInsights["recentTrend"];
}) {
  if (trend.length === 0) {
    return (
      <p className="text-sm text-graphite">
        Wykres wyników pojawi się po kilku sesjach treningowych.
      </p>
    );
  }

  return (
    <div>
      <div className="flex h-32 items-end gap-2 border-b border-ink/15 pb-1">
        {trend.map((point) => {
          const passed = point.percentage >= CKE_PASS_PERCENT;
          return (
            <div
              key={point.date}
              className="flex min-w-0 flex-1 flex-col items-center gap-1"
            >
              <span className="font-mono text-[10px] text-graphite">
                {point.percentage}%
              </span>
              <div
                className={[
                  "w-full max-w-10 transition-all duration-500",
                  passed ? "bg-success" : "bg-stamp-red/70",
                ].join(" ")}
                style={{
                  height: `${Math.max(12, point.percentage)}%`,
                  minHeight: "8px",
                }}
                title={`${point.percentage}%`}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex items-center gap-3 font-mono text-[10px] text-graphite">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-2 w-2 bg-success" aria-hidden />
          Zdane (≥{CKE_PASS_PERCENT}%)
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-2 w-2 bg-stamp-red/70" aria-hidden />
          Poniżej progu
        </span>
      </div>
    </div>
  );
}
