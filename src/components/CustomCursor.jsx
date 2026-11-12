"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE =
  "a, button, input, select, textarea, label, .interactive-zone, .tilt-card, .cap-card-row, .dock-pill";
const NATIVE_CARET = "input:not([type='checkbox']):not([type='radio']), textarea";
const DRAG_LABELS = new Set(["DRAG", "ROLL 3D", "ROLL", "ROTATE"]);
const EXPLORE_LABELS = new Set(["EXPLORE", "ABOUT"]);
const MODES = ["mode-drag", "mode-explore", "mode-lock"];
const FRAME_MS = 1000 / 60;

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // Touch devices have no cursor to replace
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const text = textRef.current;
    if (!dot || !ring || !text) return undefined;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let last = performance.now();
    let animId = 0;
    let current = null;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = (now) => {
      const f = Math.min((now - last) / FRAME_MS, 3);
      last = now;
      const k = 1 - Math.pow(1 - 0.18, f);
      ringX += (mouseX - ringX) * k;
      ringY += (mouseY - ringY) * k;
      // Transforms only: no layout work per frame
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0) translate(-50%, -50%)`;
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    const clear = () => {
      current = null;
      ring.classList.remove("hover-active", "has-label", "is-native", ...MODES);
      dot.classList.remove("hover-active", "is-native");
      text.textContent = "";
    };

    // One delegated listener instead of a handler on every element, so nothing
    // here can overwrite another component's handlers
    const onOver = (e) => {
      const el = e.target instanceof Element ? e.target.closest(INTERACTIVE) : null;
      if (el === current) return;
      if (!el) {
        clear();
        return;
      }
      current = el;

      const native = el.matches(NATIVE_CARET);
      ring.classList.toggle("is-native", native);
      dot.classList.toggle("is-native", native);
      ring.classList.add("hover-active");
      dot.classList.add("hover-active");
      ring.classList.remove("has-label", ...MODES);
      text.textContent = "";

      const label = el.getAttribute("data-cursor");
      if (label) {
        text.textContent = label;
        ring.classList.add("has-label");
        if (DRAG_LABELS.has(label)) ring.classList.add("mode-drag");
        if (EXPLORE_LABELS.has(label)) ring.classList.add("mode-explore");
        if (label === "LOCK") ring.classList.add("mode-lock");
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", clear);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", clear);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" id="cursorDot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" id="cursorRing" ref={ringRef} aria-hidden="true">
        <span id="cursorText" ref={textRef} />
      </div>
    </>
  );
}
