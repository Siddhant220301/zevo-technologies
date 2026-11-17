"use client";

import { useState } from "react";

const capabilities = [
  {
    face: 0,
    slug: "custom-erp-software",
    code: "[01 // ERP]",
    title: "Custom Operations & Inventory Portals",
    desc: "Multi-warehouse inventory tracking, automated GST e-invoicing, e-way bills & payment reconciliation.",
    cursor: "FACE 01",
  },
  {
    face: 1,
    slug: "interactive-web-experiences",
    code: "[02 // INTERACTIVE WEB]",
    title: "Interactive Web & Product Showcases",
    desc: "High-performance interactive product visualizers that let customers explore details, configure features, and buy with confidence.",
    cursor: "FACE 02",
  },
  {
    face: 2,
    slug: "whatsapp-workflow-automation",
    code: "[03 // AUTOMATION]",
    title: "WhatsApp & Workflow Automations",
    desc: "Automated customer order alerts, dispatch notifications, and document processing.",
    cursor: "FACE 03",
  },
  {
    face: 3,
    slug: "motion-design",
    code: "[04 // MOTION DESIGN]",
    title: "Motion Design & Visual Assets",
    desc: "Crisp product animations, explainer reels, and distinctive brand visuals.",
    cursor: "FACE 04",
  },
  {
    face: 4,
    slug: "web-application-development",
    code: "[05 // WEB APPS]",
    title: "High-Performance Web Applications",
    desc: "Modern, fast-loading web applications and landing pages built with Next.js and modern web standards.",
    cursor: "FACE 05",
  },
  {
    face: 5,
    slug: "mobile-app-development",
    code: "[06 // MOBILE]",
    title: "Mobile Applications (iOS & Android)",
    desc: "Responsive, smooth cross-platform mobile apps for field staff or customer-facing experiences.",
    cursor: "FACE 06",
  },
];

export default function CapabilitiesSection({ onSelectFace }) {
  const [activeFace, setActiveFace] = useState(0);

  // Hover on desktop, tap on touch: the row lights up and the die turns to its face
  const handleSnap = (faceIdx) => {
    setActiveFace(faceIdx);
    if (onSelectFace) {
      onSelectFace(faceIdx);
    }
  };

  return (
    <section className="section-wrap content-grid" id="capabilities">
      <div className="section-header-right">
        <span className="section-tag">{"// 03 — WHAT WE BUILD"}</span>
        <h2 className="section-title">
          Full-stack craft. <em>One</em> focused studio.
        </h2>
        <p className="section-subtext">
          Custom ERP, web apps, automations, motion and mobile, designed, engineered and shipped by
          one team. Hover or tap a row to turn the die to its face; the arrow opens the details.
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
            <a
              href={`/services/${cap.slug}`}
              className="cap-arrow-icon"
              data-cursor="DETAILS"
              onClick={(e) => e.stopPropagation()}
            >
              <span aria-hidden="true">↗</span>
              <span className="sr-only">More about {cap.title}</span>
            </a>
          </div>
        ))}
        <a href="/services" className="btn-action-secondary cap-more-link" data-cursor="ALL">
          <span>ALL SERVICES IN DETAIL</span>
        </a>
      </div>
    </section>
  );
}
