"use client";

import { useState } from "react";
import sound from "@/utils/audio";

const capabilities = [
  {
    face: 0,
    code: "[01 // ERP]",
    title: "Custom Operations & Inventory Portals",
    desc: "Multi-warehouse inventory tracking, automated GST e-invoicing, e-way bills & payment reconciliation.",
    cursor: "FACE 01",
  },
  {
    face: 1,
    code: "[02 // INTERACTIVE WEB]",
    title: "Interactive Web & Product Showcases",
    desc: "High-performance interactive product visualizers that let customers explore details, configure features, and buy with confidence.",
    cursor: "FACE 02",
  },
  {
    face: 2,
    code: "[03 // AUTOMATION]",
    title: "WhatsApp & Workflow Automations",
    desc: "Automated customer order alerts, dispatch notifications, and document processing.",
    cursor: "FACE 03",
  },
  {
    face: 3,
    code: "[04 // MOTION DESIGN]",
    title: "Motion Design & Visual Assets",
    desc: "Crisp product animations, explainer reels, and distinctive brand visuals.",
    cursor: "FACE 04",
  },
  {
    face: 4,
    code: "[05 // WEB APPS]",
    title: "High-Performance Web Applications",
    desc: "Modern, fast-loading web applications and landing pages built with Next.js and modern web standards.",
    cursor: "FACE 05",
  },
  {
    face: 5,
    code: "[06 // MOBILE]",
    title: "Mobile Applications (iOS & Android)",
    desc: "Responsive, smooth cross-platform mobile apps for field staff or customer-facing experiences.",
    cursor: "FACE 06",
  },
];

export default function CapabilitiesSection({ onSelectFace }) {
  const [activeFace, setActiveFace] = useState(0);

  const handleSnap = (faceIdx) => {
    setActiveFace(faceIdx);
    if (onSelectFace) {
      onSelectFace(faceIdx);
    }
  };

  return (
    <section className="section-wrap content-grid" id="capabilities">
      <div className="section-header-right">
        <span className="section-tag">// 03 — WHAT WE BUILD</span>
        <h2 className="section-title">
          Full-stack craft. <em>One</em> focused studio.
        </h2>
        <p className="section-subtext">
          Hover or click any capability to turn the interactive monolith and explore how we engineer each solution.
        </p>
      </div>

      <div className="capabilities-list-grid interactive-zone">
        {capabilities.map((cap) => (
          <div
            key={cap.face}
            className={`cap-card-row tilt-card ${activeFace === cap.face ? "active-face" : ""}`}
            data-face={cap.face}
            data-cursor={cap.cursor}
            onMouseEnter={() => handleSnap(cap.face)}
            onClick={() => handleSnap(cap.face)}
          >
            <span className="cap-face-code">{cap.code}</span>
            <div className="cap-main-title">{cap.title}</div>
            <div className="cap-subtext">{cap.desc}</div>
            <span className="cap-arrow-icon">↗</span>
          </div>
        ))}
      </div>
    </section>
  );
}
