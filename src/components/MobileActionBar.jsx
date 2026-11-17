"use client";

import { useEffect, useState } from "react";

// Thumb-zone call-to-action for phones and tablets. It appears once the hero
// buttons have scrolled away and steps aside when the element with id
// `untilId` arrives (the enquiry form on the home page). `href` is an in-page
// anchor on the home page and a link back to the form on the inner pages
// (a plain link, see SectionLink.jsx).
export default function MobileActionBar({ href = "#contact", untilId = "contact" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".hero-cta-cluster");
    const end = document.getElementById(untilId);
    if (!hero || !end) return undefined;

    // Measured on scroll rather than observed: a jump from the menu skips
    // straight past the hero, which an intersection observer never reports
    let frame = 0;
    const measure = () => {
      frame = 0;
      const vh = window.innerHeight;
      const heroPassed = hero.getBoundingClientRect().bottom < 0;
      const endReached = end.getBoundingClientRect().top < vh * 0.9;
      setVisible(heroPassed && !endReached);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [untilId]);

  return (
    <div className={`mobile-action-bar ${visible ? "is-visible" : ""}`} aria-hidden={!visible}>
      <a href={href} className="btn-action-primary" tabIndex={visible ? 0 : -1}>
        <span>START A PROJECT</span>
        <span>→</span>
      </a>
    </div>
  );
}
