/**
 * REPLACEABLE ABOUT ARTWORK — dark instrument study
 * -------------------------------------------------
 * Stand-in for an editorial portrait/instrument photograph in the home About
 * section: a double bass in hard side-light against backstage black —
 * rim-lit silhouette, f-hole detail, subtle grain. Vertical 3/4 crop.
 *
 * To replace: drop the real photograph at public/images/about.jpg and swap
 * this component for an <img>/<Image> with the same 3/4 aspect ratio.
 */
export function AboutArt({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: "3/4" }}>
      <svg
        className="h-full w-full"
        viewBox="0 0 600 800"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Placeholder: double bass in hard stage light, backstage"
      >
        <defs>
          <linearGradient id="aa-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#101114" />
            <stop offset="0.55" stopColor="#0a0b0d" />
            <stop offset="1" stopColor="#060708" />
          </linearGradient>
          <linearGradient id="aa-rim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#b9bdc2" stopOpacity="0" />
            <stop offset="0.85" stopColor="#b9bdc2" stopOpacity="0.55" />
            <stop offset="1" stopColor="#d9dcdf" stopOpacity="0.9" />
          </linearGradient>
          <radialGradient id="aa-spot" cx="0.78" cy="0.12" r="0.8">
            <stop offset="0" stopColor="#c8ccd1" stopOpacity="0.22" />
            <stop offset="0.5" stopColor="#5a6068" stopOpacity="0.06" />
            <stop offset="1" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <filter id="aa-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.8  0 0 0 0 0.82  0 0 0 0 0.85  0 0 0 0.045 0" />
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
        </defs>
        <rect width="600" height="800" fill="url(#aa-bg)" />
        <rect width="600" height="800" fill="url(#aa-spot)" />

        {/* Double bass body silhouette (cropped at frame bottom) */}
        <path
          d="M330 800 C 300 700 306 640 336 596 C 360 560 356 528 330 502 C 302 474 300 430 336 400 C 368 374 372 330 352 296 L 348 180 L 342 96 L 366 96 L 372 180 L 376 296 C 404 320 416 370 396 408 C 378 442 382 470 408 496 C 442 528 446 574 420 612 C 396 648 400 706 428 800 Z"
          fill="#0d0e10"
        />
        {/* Rim light along the right edge of the body */}
        <path
          d="M376 296 C 404 320 416 370 396 408 C 378 442 382 470 408 496 C 442 528 446 574 420 612 C 396 648 400 706 428 800 L 414 800 C 388 706 386 650 408 614 C 430 576 428 532 396 502 C 370 476 366 442 384 410 C 402 376 394 326 368 302 Z"
          fill="url(#aa-rim)"
        />
        {/* Strings catching light */}
        <g stroke="#c3c7cb" strokeWidth="1.4" opacity="0.7">
          <line x1="352" y1="96" x2="366" y2="640" />
          <line x1="358" y1="96" x2="374" y2="640" />
        </g>
        {/* f-hole hint */}
        <path
          d="M398 470 c 10 -14 22 -10 20 4 c -2 12 -14 18 -12 32 c 2 12 14 10 16 0"
          stroke="#3d4147"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Tuning scroll suggestion at top */}
        <path
          d="M342 96 q 12 -34 34 -18 q 14 12 -4 22"
          stroke="#8b8f94"
          strokeWidth="4"
          fill="none"
          opacity="0.8"
        />

        <rect width="600" height="800" filter="url(#aa-grain)" opacity="0.5" />
        <g stroke="#6e716c" strokeWidth="1.4" opacity="0.5">
          <path d="M22 48 v-26 h26 M578 48 v-26 h-26 M22 752 v26 h26 M578 752 v26 h-26" fill="none" />
        </g>
        <text
          x="30"
          y="782"
          fill="#6e716c"
          fontSize="13"
          letterSpacing="2.5"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          PLACEHOLDER — ARTIST / INSTRUMENT PHOTO
        </text>
      </svg>
    </div>
  );
}
