"use client";

import { useEffect, useState } from "react";

// Thumb-zone call-to-action for phones and tablets, for where the visitor is.
// It appears once the hero buttons have scrolled away and steps aside from
// the contact form onwards.
export default function MobileActionBar() {
  const [visible, setVisible] = useState(false);
  const [inEstimator, setInEstimator] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".hero-cta-cluster");
    const estimator = document.getElementById("estimator");
    const contact = document.getElementById("contact");
    if (!hero || !estimator || !contact) return undefined;

    // Measured on scroll rather than observed: a jump from the menu skips
    // straight past the hero, which an intersection observer never reports
    let frame = 0;
    const measure = () => {
      frame = 0;
      const vh = window.innerHeight;
      const heroPassed = hero.getBoundingClientRect().bottom < 0;
      const contactReached = contact.getBoundingClientRect().top < vh * 0.9;
      const est = estimator.getBoundingClientRect();
      setVisible(heroPassed && !contactReached);
      setInEstimator(est.top < vh * 0.9 && est.bottom > vh * 0.1);
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
  }, []);

  const tabIndex = visible ? 0 : -1;

  return (
    <div className={`mobile-action-bar ${visible ? "is-visible" : ""}`} aria-hidden={!visible}>
      {inEstimator ? (
        <a href="#contact" className="btn-action-primary" tabIndex={tabIndex}>
          <span>DISCUSS THIS PROJECT</span>
          <span>→</span>
        </a>
      ) : (
        <a href="#estimator" className="btn-action-primary" tabIndex={tabIndex}>
          <span>CALCULATE ESTIMATE</span>
          <span>→</span>
        </a>
      )}
    </div>
  );
}
