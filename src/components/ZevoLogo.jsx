import { LOGO_LETTERS, SUB_GLYPHS, subLayout } from "@/lib/logo";

// "full" is the master lockup. "compact" is the small-size version for the
// header: TECHNOLOGIES is drawn larger so it stays readable at 40px tall.
const VARIANTS = {
  full: { viewBox: "0 0 400 131", subScale: 1.15, subY: 106 },
  compact: { viewBox: "0 6 400 124", subScale: 1.7, subY: 104 },
};

// Static, all-vector Zevo logo. Colours come from --logo-ink, --logo-accent
// and --logo-sub, so one component works on light and dark backgrounds.
export default function ZevoLogo({ variant = "full", className = "", title = "Zevo Technologies" }) {
  const v = VARIANTS[variant] || VARIANTS.full;
  return (
    <svg className={`zevo-logo ${className}`} viewBox={v.viewBox} role="img" aria-label={title}>
      {LOGO_LETTERS.map((letter, i) => (
        <g key={letter.key} transform={`translate(${i * 100} 0)`}>
          <g className="zl-letter" data-key={letter.key} style={{ "--i": i }}>
            <path className="zl-main" fillRule={letter.evenOdd ? "evenodd" : undefined} d={letter.main} />
            {letter.accent && <path className="zl-accent" d={letter.accent} />}
          </g>
        </g>
      ))}
      <g className="zl-sub">
        {subLayout(v.subScale).map(({ ch, x }, i) => (
          <path
            key={i}
            style={{ "--i": i }}
            transform={`translate(${x} ${v.subY}) scale(${v.subScale})`}
            d={SUB_GLYPHS[ch]}
          />
        ))}
      </g>
    </svg>
  );
}
