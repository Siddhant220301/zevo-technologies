"use client";

import { useState } from "react";
import sound from "@/utils/audio";

export default function TopRail({ onRollDice }) {
  const [audioActive, setAudioActive] = useState(false);

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
    <header className="top-rail">
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
            Our Mission
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

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
          data-cursor="ROLL 3D"
          onClick={handleRollClick}
        >
          🎲 <span>ROLL 3D DIE</span>
        </button>

        <a
          href="#contact"
          className="btn-header-cta"
          data-cursor="CONTACT"
          onClick={(e) => handleNavClick(e, "#contact")}
        >
          CONTACT //
        </a>
      </div>
    </header>
  );
}
