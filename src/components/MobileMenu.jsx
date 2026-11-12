"use client";

import { useEffect, useRef } from "react";
import { setMotionMode, useMotionChoice } from "@/lib/motion";

const LINKS = [
  { href: "#about", label: "About Us" },
  { href: "#mission", label: "Vision & Mission" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#erp", label: "Custom ERP" },
  { href: "#motion", label: "Motion Lab" },
  { href: "#cases", label: "Case Studies" },
  { href: "#estimator", label: "Estimator" },
];

const FORMATIONS = [
  { mode: "dice", label: "01 DICE RAIL" },
  { mode: "grid", label: "02 VOXEL MATRIX" },
  { mode: "ring", label: "03 DNA HELIX" },
  { mode: "saturn", label: "04 SATURN RINGS" },
];

// Full-screen navigation for tablet and phone widths. Holds every control the
// desktop header and dock expose, so nothing is lost when they are hidden.
export default function MobileMenu({
  open,
  onClose,
  audioActive,
  onAudioToggle,
  onRollDice,
  activeFormation,
  wireframeActive,
  onFormationChange,
}) {
  const panelRef = useRef(null);
  // Only set for visitors whose system asks for reduced motion (or who chose a mode)
  const motionChoice = useMotionChoice();

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    if (!open) return undefined;

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector("a")?.focus({ preventScroll: true });

    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("menu-open");
    };
  }, [open, onClose]);

  return (
    <div
      id="mobileMenu"
      ref={panelRef}
      className={`mobile-menu ${open ? "is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      aria-hidden={!open}
    >
      <nav className="mobile-menu-nav" aria-label="Sections">
        {LINKS.map((link, i) => (
          <a key={link.href} href={link.href} style={{ "--i": i }} onClick={onClose}>
            <span className="idx">{String(i + 1).padStart(2, "0")}</span>
            <span>{link.label}</span>
          </a>
        ))}
      </nav>

      <div className="mobile-menu-group">
        <span className="mobile-menu-label">ENGINE:</span>
        <div className="mobile-menu-pills">
          {FORMATIONS.map((f) => (
            <button
              key={f.mode}
              type="button"
              className={`dock-pill ${activeFormation === f.mode ? "active" : ""}`}
              aria-pressed={activeFormation === f.mode}
              onClick={() => onFormationChange(f.mode)}
            >
              {f.label}
            </button>
          ))}
          <button
            type="button"
            className={`dock-pill ${wireframeActive ? "active" : ""}`}
            aria-pressed={wireframeActive}
            onClick={() => onFormationChange("wireframe")}
          >
            WIREFRAME
          </button>
          {motionChoice && (
            <button
              type="button"
              className={`dock-pill ${motionChoice === "full" ? "active" : ""}`}
              aria-pressed={motionChoice === "full"}
              onClick={() => setMotionMode(motionChoice === "calm" ? "full" : "calm")}
            >
              {motionChoice === "calm" ? "MOTION: LITE" : "MOTION: FULL"}
            </button>
          )}
        </div>
      </div>

      <div className="mobile-menu-actions">
        <button
          type="button"
          className={`audio-toggle-btn ${audioActive ? "active" : ""}`}
          onClick={onAudioToggle}
        >
          <span>{audioActive ? "AUDIO: ON" : "AUDIO: OFF"}</span>
        </button>
        <button
          type="button"
          className="roll-dice-header-btn"
          onClick={() => {
            onRollDice();
            onClose();
          }}
        >
          <span>ROLL DIE</span>
        </button>
        <a href="#contact" className="btn-action-primary" onClick={onClose}>
          <span>CONTACT //</span>
          <span>→</span>
        </a>
      </div>
    </div>
  );
}
