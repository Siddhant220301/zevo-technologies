"use client";

import { useEffect, useRef } from "react";
import { setMotionMode, useMotionChoice } from "@/lib/motion";

const FORMATIONS = [
  { mode: "dice", label: "01 DICE RAIL" },
  { mode: "grid", label: "02 VOXEL MATRIX" },
  { mode: "ring", label: "03 DNA HELIX" },
  { mode: "saturn", label: "04 SATURN RINGS" },
];

const CTA_SELECTOR = ".btn-action-primary, .btn-action-secondary, .whatsapp-quick-btn";

const overlaps = (a, b) =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

export default function FloatingModeDock({
  onFormationChange,
  activeFormation,
  wireframeActive,
  activeSector,
}) {
  const dockRef = useRef(null);
  const badgeRef = useRef(null);
  // Only set for visitors whose system asks for reduced motion (or who chose a mode)
  const motionChoice = useMotionChoice();

  // Tuck the dock and read-out away whenever they would cover a call-to-action
  useEffect(() => {
    let frame = 0;

    const check = () => {
      frame = 0;
      const ctas = Array.from(document.querySelectorAll(CTA_SELECTOR))
        .map((el) => el.getBoundingClientRect())
        .filter((r) => r.bottom > 0 && r.top < window.innerHeight);

      [dockRef.current, badgeRef.current].forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0) return;
        el.classList.toggle("is-tucked", ctas.some((r) => overlaps(rect, r)));
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <>
      <div className="floating-mode-dock interactive-zone" ref={dockRef}>
        <span className="dock-title">ENGINE:</span>
        {FORMATIONS.map((f) => (
          <button
            key={f.mode}
            type="button"
            className={`dock-pill ${activeFormation === f.mode ? "active" : ""}`}
            data-formation={f.mode}
            data-cursor="MODE"
            aria-pressed={activeFormation === f.mode}
            onClick={() => onFormationChange(f.mode)}
          >
            {f.label}
          </button>
        ))}
        <button
          type="button"
          className={`dock-pill ${wireframeActive ? "active" : ""}`}
          data-formation="wireframe"
          data-cursor="MODE"
          aria-pressed={wireframeActive}
          onClick={() => onFormationChange("wireframe")}
        >
          WIREFRAME
        </button>
        {motionChoice && (
          <button
            type="button"
            className={`dock-pill dock-pill--motion ${motionChoice === "full" ? "active" : ""}`}
            data-cursor="MOTION"
            aria-pressed={motionChoice === "full"}
            title={
              motionChoice === "calm"
                ? "Your system asks for reduced motion, so the page is in its calm mode. Switch to full motion."
                : "Full motion is on. Switch back to the calm mode."
            }
            onClick={() => setMotionMode(motionChoice === "calm" ? "full" : "calm")}
          >
            {motionChoice === "calm" ? "MOTION: LITE" : "MOTION: FULL"}
          </button>
        )}
      </div>

      <div className="dice-telemetry-badge" id="diceReadout" ref={badgeRef}>
        ACTIVE SECTOR: <strong>[{activeSector || "01 // CUSTOM ERP CORE"}]</strong> — DRAG CUBE OR SCROLL
      </div>
    </>
  );
}
