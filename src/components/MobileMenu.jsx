"use client";

import { useEffect, useRef } from "react";
import SectionLink from "@/components/SectionLink";
import { setMotionMode, useMotionChoice } from "@/lib/motion";
import { NAV_LINKS } from "@/lib/nav";

// Full-screen navigation for tablet and phone widths. Holds every control the
// desktop header has, so nothing is lost when it is hidden. `home` is false on
// the inner pages, where the links lead back to the home page.
export default function MobileMenu({ open, onClose, onRollDice, home = true }) {
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
        {NAV_LINKS.map((link, i) => (
          <SectionLink key={link.id} home={home} id={link.id} style={{ "--i": i }} onClick={onClose}>
            <span className="idx">{String(i + 1).padStart(2, "0")}</span>
            <span>{link.label}</span>
          </SectionLink>
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
        <SectionLink home={home} id="contact" className="btn-action-primary" onClick={onClose}>
          <span>CONTACT //</span>
          <span>→</span>
        </SectionLink>
      </div>
    </div>
  );
}
