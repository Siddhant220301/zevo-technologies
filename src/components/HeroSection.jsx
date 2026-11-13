"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
export default function HeroSection() {
  const m1Ref = useRef(null);
  const m3Ref = useRef(null);
  const deckRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: deckRef.current,
      start: "top 92%",
      once: true,
      onEnter: () => {
        if (m1Ref.current) {
          gsap.fromTo(
            m1Ref.current,
            { innerText: 1 },
            { innerText: 2, duration: 0.8, snap: { innerText: 1 }, ease: "power2.out" }
          );
        }
        if (m3Ref.current) {
          gsap.fromTo(
            m3Ref.current,
            { innerText: 0 },
            { innerText: 100, duration: 1.4, snap: { innerText: 1 }, ease: "power2.out" }
          );
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section className="hero-section content-grid" id="hero">
      <div className="hero-status-pill interactive-zone">
        <span className="live-dot" />
        <span>FULL-SERVICE ENGINEERING &amp; PRODUCT STUDIO // ACCEPTING SELECT NEW PROJECTS</span>
      </div>

      {/* Phones only: reserved space where the 3D die sits above the headline */}
      <div className="stage-slot stage-slot--hero" aria-hidden="true" />

      {/* Each line is its own block so it can rise in on its own with plain CSS */}
      <h1 className="hero-headline">
        <span className="hl-line">We build custom web apps,</span>{" "}
        <span className="hl-line">
          <span className="serif-em">interactive digital platforms</span>
        </span>{" "}
        <span className="hl-line">&amp; business tools.</span>
      </h1>

      <p className="hero-subhead">
        We are a dedicated engineering &amp; design studio. We help ambitious businesses replace
        chaotic spreadsheets and slow, expensive software with fast, custom-built tools and modern
        web experiences they 100% own.
      </p>

      <div className="hero-lower-deck">
        <div className="hero-manifesto-card interactive-zone tilt-card">
          <p style={{ fontSize: "0.95rem", color: "var(--ink-secondary)", lineHeight: "1.65" }}>
            Direct collaboration with our senior engineering team from day one. You keep 100% source
            code, data, and database ownership with zero monthly per-seat software fees. Shipped in
            focused, transparent 2-week milestones.
          </p>
          <div className="hero-cta-cluster">
            <a href="#capabilities" className="btn-action-primary" data-cursor="EXPLORE">
              <span>EXPLORE CAPABILITIES</span>
              <span>↘</span>
            </a>
            <a href="#estimator" className="btn-action-secondary" data-cursor="ESTIMATE">
              <span>CALCULATE ESTIMATE</span>
            </a>
          </div>
        </div>

        <div className="hero-metrics-deck interactive-zone" ref={deckRef}>
          <div className="metric-item tilt-card">
            <div className="val">
              <span id="mCount1" ref={m1Ref}>
                2
              </span>
              <span>Wks</span>
            </div>
            <span className="lbl">Agile Sprint Deployments</span>
          </div>
          <div className="metric-item tilt-card">
            <div className="val">
              <span id="mCount2">4–6</span>
              <span>Wks</span>
            </div>
            <span className="lbl">Typical Milestone Turnaround</span>
          </div>
          <div className="metric-item tilt-card">
            <div className="val">
              <span id="mCount3" ref={m3Ref}>
                100
              </span>
              <span>%</span>
            </div>
            <span className="lbl">Client Code &amp; IP Ownership</span>
          </div>
          <div className="metric-item tilt-card">
            <div className="val">
              ₹<span id="mCount4">0</span>
              <span />
            </div>
            <span className="lbl">Monthly Per-User Seat Fees</span>
          </div>
        </div>
      </div>
    </section>
  );
}
