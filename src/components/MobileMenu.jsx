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

// Full-screen navigation for tablet and phone widths. Holds every control the
// desktop header has, so nothing is lost when it is hidden.
export default function MobileMenu({ open, onClose, onRollDice }) {
  const panelRef = useRef(null);
  // "full" | "calm" once the page is running (null while rendering on the server)
  const motion = useMotionChoice();

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

      <div className="mobile-menu-actions">
        {motion && (
          <button
            type="button"
            className="motion-toggle-btn"
            aria-pressed={motion === "full"}
            title={motion === "full" ? "Switch to lighter motion" : "Switch to full motion"}
            onClick={() => setMotionMode(motion === "full" ? "calm" : "full")}
          >
            {motion === "full" ? "MOTION: FULL" : "MOTION: LITE"}
          </button>
        )}
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
