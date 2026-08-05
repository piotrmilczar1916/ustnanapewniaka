import type { PanelInsights } from "@/lib/panel/analytics";
import { CKE_PASS_PERCENT } from "@/lib/panel/analytics";

const CHART = {
  width: 320,
  height: 132,
  padX: 24,
  padY: 22,
};

function buildCoords(trend: PanelInsights["recentTrend"]) {
  const plotW = CHART.width - CHART.padX * 2;
  const plotH = CHART.height - CHART.padY * 2;

  return trend.map((point, i) => {
    const x =
      trend.length === 1
        ? CHART.padX + plotW / 2
        : CHART.padX + (i / (trend.length - 1)) * plotW;
    const y = CHART.padY + plotH - (point.percentage / 100) * plotH;
    return { ...point, x, y, passed: point.percentage >= CKE_PASS_PERCENT };
  });
}

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

  const coords = buildCoords(trend);
  const plotH = CHART.height - CHART.padY * 2;
  const passY =
    CHART.padY + plotH - (CKE_PASS_PERCENT / 100) * plotH;
  const linePath = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`)
    .join(" ");

  return (
    <div>
      <svg
        viewBox={`0 0 ${CHART.width} ${CHART.height}`}
        className="w-full"
        role="img"
        aria-label={`Trend wyników z ostatnich ${trend.length} sesji`}
      >
        {/* Próg zdawalności */}
        <line
          x1={CHART.padX}
          y1={passY}
          x2={CHART.width - CHART.padX}
          y2={passY}
          stroke="var(--graphite)"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.45"
        />
        <text
          x={CHART.width - CHART.padX}
          y={passY - 4}
          textAnchor="end"
          fill="var(--graphite)"
          fontSize="9"
          fontFamily="var(--font-ibm-plex-mono), monospace"
        >
          {CKE_PASS_PERCENT}%
        </text>

        {/* Linia trendu */}
        {coords.length > 1 ? (
          <path
            d={linePath}
            fill="none"
            stroke="var(--ink)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ) : null}

        {/* Punkty i etykiety */}
        {coords.map((point) => (
          <g key={point.date}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4.5"
              fill={point.passed ? "var(--success)" : "var(--stamp-red)"}
              stroke="var(--ink)"
              strokeWidth="1.5"
            />
            <text
              x={point.x}
              y={point.y - 10}
              textAnchor="middle"
              fill="var(--ink)"
              fontSize="10"
              fontFamily="var(--font-ibm-plex-mono), monospace"
              fontWeight="600"
            >
              {point.percentage}%
            </text>
            <text
              x={point.x}
              y={CHART.height - 4}
              textAnchor="middle"
              fill="var(--graphite)"
              fontSize="9"
              fontFamily="var(--font-ibm-plex-mono), monospace"
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-[10px] text-graphite">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-success" aria-hidden />
          Zdane (≥{CKE_PASS_PERCENT}%)
        </span>
        <span className="inline-flex items-center gap-1">
          <span
            className="inline-block h-2 w-2 rounded-full bg-stamp-red"
            aria-hidden
          />
          Poniżej progu
        </span>
        <span className="inline-flex items-center gap-1">
          <span
            className="inline-block w-4 border-t border-dashed border-graphite/60"
            aria-hidden
          />
          Próg CKE
        </span>
      </div>
    </div>
  );
}
