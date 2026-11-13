"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MobileMenu from "@/components/MobileMenu";
import ZevoLogo from "@/components/ZevoLogo";

export default function TopRail({ onRollDice }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const railRef = useRef(null);

  // On phones and tablets the bar slides away while reading and returns on scroll-up
  useEffect(() => {
    const compact = window.matchMedia("(max-width: 1024px)");
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rail = railRef.current;
      if (!rail) return;
      const y = window.scrollY;
      const open = document.documentElement.classList.contains("menu-open");
      const hide = compact.matches && !open && y > 160 && y > lastY + 4;
      const show = !compact.matches || open || y < lastY - 4 || y <= 160;
      if (hide) rail.classList.add("is-hidden");
      else if (show) rail.classList.remove("is-hidden");
      lastY = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleRollClick = () => {
    if (onRollDice) onRollDice();
  };

  return (
    <>
    <header className="top-rail" ref={railRef}>
      <a href="#hero" className="brand-cluster" data-cursor="HOME">
        <ZevoLogo variant="compact" className="brand-logo" />
      </a>

      <ul className="nav-menu">
        <li>
          <a href="#about" data-cursor="ABOUT">
            About Us
          </a>
        </li>
        <li>
          <a href="#mission" data-cursor="MISSION">
            Vision &amp; Mission
          </a>
        </li>
        <li>
          <a href="#capabilities" data-cursor="CAPS">
            Capabilities
          </a>
        </li>
        <li>
          <a href="#erp" data-cursor="ERP">
            Custom ERP
          </a>
        </li>
        <li>
          <a href="#motion" data-cursor="MOTION">
            Motion Lab
          </a>
        </li>
        <li>
          <a href="#cases" data-cursor="CASES">
            Case Studies
          </a>
        </li>
        <li>
          <a href="#estimator" data-cursor="ESTIMATOR">
            Estimator
          </a>
        </li>
      </ul>

      <div className="nav-cta-zone">
        <button
          type="button"
          className="roll-dice-header-btn"
          id="rollDiceBtn"
          data-cursor="ROLL"
          onClick={handleRollClick}
        >
          🎲 <span>ROLL DIE</span>
        </button>

        <a href="#contact" className="btn-header-cta" data-cursor="CONTACT">
          CONTACT //
        </a>

        <button
          type="button"
          className="menu-toggle-btn"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobileMenu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
    <MobileMenu open={menuOpen} onClose={closeMenu} onRollDice={handleRollClick} />
    </>
  );
}
