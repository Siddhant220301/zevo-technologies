"use client";

import { useEffect, useRef } from "react";

const CTA_SELECTOR = ".btn-action-primary, .btn-action-secondary, .whatsapp-quick-btn";

const overlaps = (a, b) =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

// The "ACTIVE SECTOR" read-out pinned to the bottom right on desktop: which
// face of the die is in front. It steps aside whenever it would cover a
// call-to-action or the footer.
export default function SectorReadout({ activeSector }) {
  const badgeRef = useRef(null);

  useEffect(() => {
    let frame = 0;

    const check = () => {
      frame = 0;
      const badge = badgeRef.current;
      if (!badge) return;
      const rect = badge.getBoundingClientRect();
      if (rect.width === 0) return;
      // It also steps aside over the footer, where the studio details sit
      const footer = document.querySelector("footer");
      const covers =
        (footer && overlaps(rect, footer.getBoundingClientRect())) ||
        Array.from(document.querySelectorAll(CTA_SELECTOR))
          .map((el) => el.getBoundingClientRect())
          .some((r) => r.bottom > 0 && r.top < window.innerHeight && overlaps(rect, r));
      badge.classList.toggle("is-tucked", covers);
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
    <div className="dice-telemetry-badge" id="diceReadout" ref={badgeRef}>
      ACTIVE SECTOR: <strong>[{activeSector || "01 // CUSTOM ERP CORE"}]</strong> — DRAG CUBE OR SCROLL
    </div>
  );
}
