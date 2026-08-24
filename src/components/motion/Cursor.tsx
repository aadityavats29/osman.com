"use client";

import { useEffect, useRef } from "react";

/**
 * Context-aware custom cursor — reliability-first implementation.
 *
 * Visibility: solid silver core with a dark outline ring (see globals.css) —
 * legible on the near-black site and on light surfaces alike. No blend modes
 * or filters: the previous difference+invert treatment both forced compositor
 * readback and rendered black-on-black after the nocturnal palette flip.
 *
 * Reliability contract:
 * - The NATIVE cursor is never hidden until the custom cursor has actually
 *   processed its first pointer event and painted (body.cursor-active is added
 *   only then). If anything throws during setup, cleanup restores everything —
 *   the site can never end up cursorless.
 * - Desktop fine-pointer only; never on touch or reduced motion.
 * - Mounted once in the persistent (public) layout, so route changes never
 *   re-initialise it.
 *
 * Performance contract:
 * - Zero React state; transform-only writes from a rAF loop.
 * - The loop IDLE-STOPS: once the lerp settles and no disc-spin state is
 *   active it cancels itself, restarting on the next pointer event. No
 *   always-running per-frame work.
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

    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;
    let started = false; // becomes true on the first real pointer event
    let suppressed = false; // over form fields → native cursor territory
    let spin = 0;
    let lastState: string | null = null;

    const settled = () =>
      Math.abs(tx - x) + Math.abs(ty - y) < 0.2 && el.dataset.state !== "disc";

    const tick = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      const isDisc = el.dataset.state === "disc";
      if (isDisc) spin += 0.6;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)${
        isDisc ? ` rotate(${spin.toFixed(1)}deg)` : ""
      }`;
      if (settled()) {
        raf = 0; // idle-stop: nothing left to animate
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const ensureLoop = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      if (!started) {
        started = true;
        x = tx;
        y = ty;
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        if (!suppressed) el.style.opacity = "1";
        // Only NOW is it safe to hide the native cursor: the custom one has
        // demonstrably received input and painted at the pointer position.
        document.body.classList.add("cursor-active");
      }
      ensureLoop();
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
      el.style.opacity = started ? "1" : "0";
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
        ensureLoop(); // disc state needs the loop for its rotation
      }
      if (label) labelEl.textContent = label;
    };

    const onLeave = () => {
      el.style.opacity = "0";
    };

    const onVisibility = () => {
      if (document.hidden && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    try {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerover", onOver, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      document.addEventListener("visibilitychange", onVisibility);
    } catch {
      // If anything about setup fails, leave the native cursor untouched.
      document.body.classList.remove("cursor-active");
      return;
    }

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      if (raf) cancelAnimationFrame(raf);
      document.body.classList.remove("cursor-active");
    };
  }, []);

  return (
    <div ref={ref} className="cursor-dot" style={{ opacity: 0 }} aria-hidden="true">
      <span ref={labelRef} className="cursor-label" />
    </div>
  );
}
