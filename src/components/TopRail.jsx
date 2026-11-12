"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import sound from "@/utils/audio";
import MobileMenu from "@/components/MobileMenu";

export default function TopRail({ onRollDice, activeFormation, wireframeActive, onFormationChange }) {
  const [audioActive, setAudioActive] = useState(false);
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

  const handleAudioToggle = () => {
    const active = sound.toggle();
    setAudioActive(active);
    if (active) sound.playClick(1100);
  };

  const handleNavClick = (e, href) => {
    sound.playClick(850);
  };

  const handleRollClick = () => {
    if (onRollDice) onRollDice();
  };

  return (
    <>
    <header className="top-rail" ref={railRef}>
      <a
        href="#hero"
        className="brand-cluster"
        data-cursor="HOME"
        onClick={(e) => handleNavClick(e, "#hero")}
      >
        <div className="brand-cube-badge">Z</div>
        <div className="brand-text-block">
          <span className="brand-name">ZEVO TECHNOLOGIES</span>
          <span className="brand-tagline">DIGITAL PRODUCT &amp; CREATIVE STUDIO</span>
        </div>
      </a>

      <ul className="nav-menu">
        <li>
          <a href="#about" data-cursor="ABOUT" onClick={(e) => handleNavClick(e, "#about")}>
            About Us
          </a>
        </li>
        <li>
          <a href="#mission" data-cursor="MISSION" onClick={(e) => handleNavClick(e, "#mission")}>
            Vision &amp; Mission
          </a>
        </li>
        <li>
          <a href="#capabilities" data-cursor="CAPS" onClick={(e) => handleNavClick(e, "#capabilities")}>
            Capabilities
          </a>
        </li>
        <li>
          <a href="#erp" data-cursor="ERP" onClick={(e) => handleNavClick(e, "#erp")}>
            Custom ERP
          </a>
        </li>
        <li>
          <a href="#motion" data-cursor="MOTION" onClick={(e) => handleNavClick(e, "#motion")}>
            Motion Lab
          </a>
        </li>
        <li>
          <a href="#cases" data-cursor="CASES" onClick={(e) => handleNavClick(e, "#cases")}>
            Case Studies
          </a>
        </li>
        <li>
          <a href="#estimator" data-cursor="ESTIMATOR" onClick={(e) => handleNavClick(e, "#estimator")}>
            Estimator
          </a>
        </li>
      </ul>

      <div className="nav-cta-zone">
        <button
          type="button"
          className={`audio-toggle-btn ${audioActive ? "active" : ""}`}
          id="sfxToggle"
          data-cursor="AUDIO"
          onClick={handleAudioToggle}
        >
          <span className="audio-icon" id="sfxIcon">
            {audioActive ? "🔊" : "🔈"}
          </span>
          <span id="sfxLabel">{audioActive ? "AUDIO: ON" : "AUDIO: OFF"}</span>
        </button>

        <button
          type="button"
          className="roll-dice-header-btn"
          id="rollDiceBtn"
          data-cursor="ROLL"
          onClick={handleRollClick}
        >
          🎲 <span>ROLL DIE</span>
        </button>

        <a
          href="#contact"
          className="btn-header-cta"
          data-cursor="CONTACT"
          onClick={(e) => handleNavClick(e, "#contact")}
        >
          CONTACT //
        </a>

        <button
          type="button"
          className="menu-toggle-btn"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobileMenu"
          onClick={() => {
            sound.playClick(900);
            setMenuOpen((v) => !v);
          }}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
    <MobileMenu
      open={menuOpen}
      onClose={closeMenu}
      audioActive={audioActive}
      onAudioToggle={handleAudioToggle}
      onRollDice={handleRollClick}
      activeFormation={activeFormation}
      wireframeActive={wireframeActive}
      onFormationChange={onFormationChange}
    />
    </>
  );
}
