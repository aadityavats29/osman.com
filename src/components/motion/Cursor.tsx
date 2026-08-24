"use client";

import { useEffect, useRef } from "react";

/**
 * Context-aware custom cursor (ElectraJazz direction).
 *
 * - Desktop fine-pointer only; never rendered for touch or reduced motion.
 * - Lerped follow (rAF), transform-only.
 * - Contextual labels come from the nearest [data-cursor="TICKETS|LISTEN|…"]
 *   ancestor; [data-cursor-style="disc"] switches to the record-shaped state.
 * - mix-blend-difference keeps it legible across light and dark sections.
 * - pointer-events: none — it can never block a click. Form fields keep the
 *   native cursor (CSS in globals).
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const labelEl = labelRef.current;
    if (!el || !labelEl) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    document.body.classList.add("cursor-active");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;
    let visible = false;
    let suppressed = false; // over form fields → native cursor territory
    let spin = 0;
    let lastState: string | null = null;

    const tick = () => {
      // Lerp toward the pointer; snappy but weighted.
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      const isDisc = el.dataset.state === "disc";
      if (isDisc) spin += 0.6;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)${
        isDisc ? ` rotate(${spin.toFixed(1)}deg)` : ""
      }`;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        visible = true;
        x = tx;
        y = ty;
        if (!suppressed) el.style.opacity = "1";
      }
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const source = target?.closest<HTMLElement>("[data-cursor]");
      const nativeZone = target?.closest(
        "input, textarea, select, label, [data-native-cursor]"
      );
      suppressed = Boolean(nativeZone);
      if (suppressed) {
        el.style.opacity = "0";
        return;
      }
      el.style.opacity = visible ? "1" : "0";
      const label = source?.dataset.cursor ?? null;
      const style = source?.dataset.cursorStyle ?? null;
      const state = label ? (style === "disc" ? "disc" : "label") : "dot";
      if (state !== lastState) {
        lastState = state;
        if (state === "dot") {
          delete el.dataset.state;
        } else {
          el.dataset.state = state;
        }
      }
      if (label) labelEl.textContent = label;
    };

    const onLeave = () => {
      el.style.opacity = "0";
      visible = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
      document.body.classList.remove("cursor-active");
    };
  }, []);

  return (
    <div ref={ref} className="cursor-dot" style={{ opacity: 0 }} aria-hidden="true">
      <span ref={labelRef} className="cursor-label" />
    </div>
  );
}
