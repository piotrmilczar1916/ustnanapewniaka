interface StampProps {
  label?: string;
  sublabel?: string;
  size?: number;
  className?: string;
  animate?: boolean;
  tone?: "red" | "gold" | "success" | "ink";
}

const toneStroke: Record<NonNullable<StampProps["tone"]>, string> = {
  red: "var(--stamp-red)",
  gold: "var(--gold)",
  success: "var(--success)",
  ink: "var(--ink)",
};

/** Okrągła pieczątka z poszarpaną krawędzią — sygnatura marki. */
export function Stamp({
  label = "PEWNIAK",
  sublabel = "USTNA",
  size = 160,
  className = "",
  animate = false,
  tone = "red",
}: StampProps) {
  const stroke = toneStroke[tone];
  const id = `stamp-edge-${tone}-${size}`;

  return (
    <div
      className={[
        "relative inline-block select-none",
        animate ? "animate-stamp-in animate-stamp-press" : "",
        className,
      ].join(" ")}
      style={{ width: size, height: size }}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label ? `${sublabel} ${label}` : undefined}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path
            id={id}
            d="M100,18
              C112,16 118,22 126,20
              C134,18 140,24 148,26
              C156,28 160,36 166,42
              C172,48 178,52 180,62
              C182,72 178,80 180,90
              C182,100 178,108 176,118
              C174,128 178,136 172,144
              C166,152 160,158 152,164
              C144,170 136,176 126,178
              C116,180 108,176 98,178
              C88,180 80,176 70,174
              C60,172 52,176 44,168
              C36,160 30,154 26,144
              C22,134 26,126 24,116
              C22,106 26,98 24,88
              C22,78 26,70 28,60
              C30,50 26,42 34,34
              C42,26 50,28 60,24
              C70,20 78,24 88,20
              C94,18 98,20 100,18 Z"
          />
        </defs>

        <use
          href={`#${id}`}
          fill="none"
          stroke={stroke}
          strokeWidth="5"
          opacity="0.92"
        />
        <circle
          cx="100"
          cy="100"
          r="68"
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeDasharray="3 5"
          opacity="0.85"
        />
        <circle
          cx="100"
          cy="100"
          r="58"
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          opacity="0.7"
        />

        <text
          x="100"
          y="78"
          textAnchor="middle"
          fill={stroke}
          style={{
            fontFamily: "var(--font-big-shoulders), sans-serif",
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: "0.18em",
          }}
        >
          {sublabel}
        </text>
        <text
          x="100"
          y="112"
          textAnchor="middle"
          fill={stroke}
          style={{
            fontFamily: "var(--font-big-shoulders), sans-serif",
            fontWeight: 800,
            fontSize: 28,
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </text>
        <text
          x="100"
          y="138"
          textAnchor="middle"
          fill={stroke}
          opacity="0.85"
          style={{
            fontFamily: "var(--font-ibm-plex-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.12em",
          }}
        >
          2026/27
        </text>
      </svg>
    </div>
  );
}

interface StampCheckProps {
  className?: string;
  label?: string;
}

export function StampCheck({
  className = "",
  label = "Zgodne z CKE",
}: StampCheckProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <Stamp label="OK" sublabel="✓" size={56} tone="success" />
      <span className="font-display text-sm font-bold uppercase tracking-wider text-ink">
        {label}
      </span>
    </div>
  );
}
