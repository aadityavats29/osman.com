/**
 * REPLACEABLE HERO ARTWORK — dark musical manuscript
 * --------------------------------------------------
 * Stand-in for the final hero photograph: a cropped, marked-up score in the
 * site's nocturnal palette — engraved staves, notation, hairpins, a
 * pencil-style performance marking. Deliberately art-directed (not clipart)
 * while remaining unmistakably a placeholder.
 *
 * To replace: drop the real image at public/images/hero.jpg and swap this
 * component for an <img>/<Image> with the same 4/5 aspect ratio. The hero's
 * clip/scale animation wrappers need no changes.
 */
export function HeroArt({ className = "" }: { className?: string }) {
  const staves = [140, 320, 500, 680, 860];
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: "4/5" }}>
      <svg
        className="h-full w-full"
        viewBox="0 0 800 1000"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Placeholder: dark close-up of a marked-up musical score"
      >
        <defs>
          <linearGradient id="ha-bg" x1="0" y1="0" x2="0.7" y2="1">
            <stop offset="0" stopColor="#141518" />
            <stop offset="0.6" stopColor="#0c0d0f" />
            <stop offset="1" stopColor="#070809" />
          </linearGradient>
          <radialGradient id="ha-lamp" cx="0.3" cy="0.18" r="0.85">
            <stop offset="0" stopColor="#aeb2b8" stopOpacity="0.14" />
            <stop offset="0.5" stopColor="#5a6068" stopOpacity="0.05" />
            <stop offset="1" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <filter id="ha-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.8  0 0 0 0 0.82  0 0 0 0 0.84  0 0 0 0.04 0" />
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
        </defs>
        <rect width="800" height="1000" fill="url(#ha-bg)" />
        <rect width="800" height="1000" fill="url(#ha-lamp)" />

        {/* Engraved staves, cropped beyond the frame */}
        <g stroke="#4b4f55" strokeWidth="1.6">
          {staves.map((y) =>
            [0, 18, 36, 54, 72].map((o) => (
              <line key={y + "-" + o} x1="-40" y1={y + o} x2="840" y2={y + o} />
            ))
          )}
        </g>
        {/* Bar lines */}
        <g stroke="#565b61" strokeWidth="2.4">
          {staves.map((y) => (
            <g key={"bars-" + y}>
              <line x1="150" y1={y} x2="150" y2={y + 72} />
              <line x1="430" y1={y} x2="430" y2={y + 72} />
              <line x1="700" y1={y} x2="700" y2={y + 72} />
            </g>
          ))}
        </g>

        {/* Notation: note heads, stems, beams — silver on graphite */}
        <g fill="#c9ccc9" stroke="#c9ccc9">
          {/* phrase 1 */}
          <ellipse cx="205" cy="176" rx="11" ry="8" transform="rotate(-18 205 176)" />
          <line x1="215" y1="172" x2="215" y2="112" strokeWidth="3" />
          <ellipse cx="265" cy="158" rx="11" ry="8" transform="rotate(-18 265 158)" />
          <line x1="275" y1="154" x2="275" y2="112" strokeWidth="3" />
          <rect x="213" y="110" width="64" height="9" transform="skewY(-3)" />
          <ellipse cx="345" cy="194" rx="11" ry="8" transform="rotate(-18 345 194)" />
          <line x1="355" y1="190" x2="355" y2="128" strokeWidth="3" />
          {/* phrase 2 */}
          <ellipse cx="500" cy="338" rx="11" ry="8" transform="rotate(-18 500 338)" />
          <line x1="510" y1="334" x2="510" y2="274" strokeWidth="3" />
          <ellipse cx="560" cy="356" rx="11" ry="8" transform="rotate(-18 560 356)" />
          <line x1="570" y1="352" x2="570" y2="274" strokeWidth="3" />
          <ellipse cx="620" cy="338" rx="11" ry="8" transform="rotate(-18 620 338)" />
          <line x1="630" y1="334" x2="630" y2="274" strokeWidth="3" />
          <rect x="508" y="272" width="124" height="9" />
          {/* phrase 3 — low register */}
          <ellipse cx="230" cy="552" rx="11" ry="8" transform="rotate(-18 230 552)" />
          <line x1="220" y1="556" x2="220" y2="616" strokeWidth="3" />
          <ellipse cx="310" cy="534" rx="11" ry="8" transform="rotate(-18 310 534)" />
          <line x1="300" y1="538" x2="300" y2="616" strokeWidth="3" />
          <rect x="218" y="608" width="84" height="9" />
          {/* whole note */}
          <ellipse cx="530" cy="716" rx="14" ry="10" fill="none" strokeWidth="4" transform="rotate(-18 530 716)" />
        </g>

        {/* Crescendo hairpin */}
        <g stroke="#9a9e9b" strokeWidth="2" fill="none">
          <path d="M200 660 L360 640 M200 660 L360 682" />
        </g>

        {/* Pencilled performance marking — oxblood, hand-drawn feel */}
        <g stroke="#a34a45" strokeWidth="3.4" fill="none" strokeLinecap="round" opacity="0.85">
          <path d="M470 520 C 520 498, 600 496, 656 516" />
          <path d="M660 700 q 24 -16 44 2 q -20 20 -44 -2 Z" fill="#a34a45" opacity="0.55" />
        </g>
        <text x="472" y="500" fill="#a34a45" fontSize="26" opacity="0.9" fontStyle="italic" style={{ fontFamily: "Georgia, serif" }}>
          listen…
        </text>

        <rect width="800" height="1000" filter="url(#ha-grain)" opacity="0.45" />
        {/* crop marks — quiet placeholder signal */}
        <g stroke="#6e716c" strokeWidth="1.5" opacity="0.5">
          <path d="M28 60 v-32 h32 M772 60 v-32 h-32 M28 940 v32 h32 M772 940 v32 h-32" fill="none" />
        </g>
        <text
          x="40"
          y="978"
          fill="#6e716c"
          fontSize="15"
          letterSpacing="3"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          PLACEHOLDER — SCORE / NOTATION IMAGE
        </text>
      </svg>
    </div>
  );
}
