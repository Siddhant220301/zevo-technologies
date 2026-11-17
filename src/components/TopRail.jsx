"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MobileMenu from "@/components/MobileMenu";
import SectionLink from "@/components/SectionLink";
import ZevoLogo from "@/components/ZevoLogo";
import { NAV_LINKS } from "@/lib/nav";

// The header. `home` is false on the inner pages, where its links lead back to
// the sections of the home page.
export default function TopRail({ onRollDice, home = true }) {
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
      <SectionLink home={home} className="brand-cluster" data-cursor="HOME">
        <ZevoLogo variant="compact" className="brand-logo" />
      </SectionLink>

      <ul className="nav-menu">
        {NAV_LINKS.map((link) => (
          <li key={link.id}>
            <SectionLink home={home} id={link.id} data-cursor={link.cursor}>
              {link.label}
            </SectionLink>
          </li>
        ))}
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

        <SectionLink home={home} id="contact" className="btn-header-cta" data-cursor="CONTACT">
          CONTACT //
        </SectionLink>

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
    <MobileMenu open={menuOpen} onClose={closeMenu} onRollDice={handleRollClick} home={home} />
    </>
  );
}
