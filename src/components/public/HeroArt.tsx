/**
 * REPLACEABLE HERO ARTWORK
 * ------------------------
 * Stand-in for the final Osman hero photograph. Duotone stage-light abstract
 * with film grain — deliberately art-directed (not a grey box) so the hero
 * composition can be judged, while remaining unmistakably a placeholder.
 *
 * To replace: drop the real photograph at public/images/hero.jpg and swap
 * this component for an <img>/<Image> with the same aspect ratio (4/5).
 * The clip/scale animation wrappers in the hero do not need to change.
 */
export function HeroArt({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: "4/5" }}>
      <svg
        className="h-full w-full"
        viewBox="0 0 800 1000"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Placeholder: portrait photograph of Osman on stage"
      >
        <defs>
          <linearGradient id="ha-duo" x1="0" y1="0" x2="0.8" y2="1">
            <stop offset="0" stopColor="#26231c" />
            <stop offset="0.55" stopColor="#141310" />
            <stop offset="1" stopColor="#0c0b09" />
          </linearGradient>
          <radialGradient id="ha-light" cx="0.68" cy="0.22" r="0.9">
            <stop offset="0" stopColor="#c98a4b" stopOpacity="0.55" />
            <stop offset="0.35" stopColor="#7a3e14" stopOpacity="0.25" />
            <stop offset="1" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <filter id="ha-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.9  0 0 0 0 0.85  0 0 0 0 0.75  0 0 0 0.05 0" />
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
        </defs>
        <rect width="800" height="1000" fill="url(#ha-duo)" />
        <rect width="800" height="1000" fill="url(#ha-light)" />
        {/* suggestion of a double-bass silhouette curve */}
        <path
          d="M470 1000 C430 800 480 700 430 590 C390 500 400 430 450 380 C500 330 490 260 460 210 L470 120 L500 120 L505 210 C545 270 545 340 505 400 C465 460 470 520 505 610 C545 710 520 830 545 1000 Z"
          fill="#080706"
          opacity="0.85"
        />
        <rect width="800" height="1000" filter="url(#ha-grain)" opacity="0.5" />
        {/* crop marks — quiet signal that this is a placeholder frame */}
        <g stroke="#79766a" strokeWidth="1.5" opacity="0.55">
          <path d="M28 60 v-32 h32 M772 60 v-32 h-32 M28 940 v32 h32 M772 940 v32 h-32" fill="none" />
        </g>
        <text
          x="40"
          y="978"
          fill="#79766a"
          fontSize="15"
          letterSpacing="3"
          style={{ textTransform: "uppercase", fontFamily: "var(--font-sans)" }}
        >
          PLACEHOLDER — FINAL ARTIST PHOTOGRAPH
        </text>
      </svg>
    </div>
  );
}
