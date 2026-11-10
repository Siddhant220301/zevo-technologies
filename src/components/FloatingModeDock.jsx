"use client";

import { useState } from "react";
import sound from "@/utils/audio";

export default function FloatingModeDock({ onFormationChange, activeSector }) {
  const [activeFormation, setActiveFormation] = useState("dice");
  const [wireframeActive, setWireframeActive] = useState(false);

  const handleFormationClick = (mode) => {
    if (mode === "wireframe") {
      const nextWire = !wireframeActive;
      setWireframeActive(nextWire);
      if (onFormationChange) onFormationChange("wireframe", nextWire);
      return;
    }

    setActiveFormation(mode);
    if (onFormationChange) onFormationChange(mode, wireframeActive);
  };

  return (
    <>
      <div className="floating-mode-dock interactive-zone">
        <span className="dock-title">ENGINE:</span>
        <button
          type="button"
          className={`dock-pill ${activeFormation === "dice" ? "active" : ""}`}
          data-formation="dice"
          data-cursor="MODE"
          onClick={() => handleFormationClick("dice")}
        >
          01 DICE RAIL
        </button>
        <button
          type="button"
          className={`dock-pill ${activeFormation === "grid" ? "active" : ""}`}
          data-formation="grid"
          data-cursor="MODE"
          onClick={() => handleFormationClick("grid")}
        >
          02 VOXEL MATRIX
        </button>
        <button
          type="button"
          className={`dock-pill ${activeFormation === "ring" ? "active" : ""}`}
          data-formation="ring"
          data-cursor="MODE"
          onClick={() => handleFormationClick("ring")}
        >
          03 DNA HELIX
        </button>
        <button
          type="button"
          className={`dock-pill ${wireframeActive ? "active" : ""}`}
          data-formation="wireframe"
          data-cursor="MODE"
          onClick={() => handleFormationClick("wireframe")}
        >
          WIREFRAME
        </button>
      </div>

      <div className="dice-telemetry-badge" id="diceReadout">
        ACTIVE SECTOR: <strong>[{activeSector || "01 // CUSTOM ERP CORE"}]</strong> — DRAG CUBE OR SCROLL
      </div>
    </>
  );
}
