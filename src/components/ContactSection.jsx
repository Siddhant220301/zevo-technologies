"use client";

import { useState } from "react";
import sound from "@/utils/audio";

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", scope: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    sound.playMorph();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", scope: "" });

      setTimeout(() => {
        setSubmitted(false);
      }, 4000);
    }, 700);
  };

  const handleWhatsAppClick = () => {
    sound.playClick(1000);
  };

  return (
    <section className="section-wrap content-grid" id="contact">
      <div className="contact-info-col">
        <span className="section-tag">// 08 — DIRECT FOUNDER INTAKE</span>
        <h2 className="section-title">
          Let&apos;s discuss your <em>project</em>.
        </h2>
        <p className="section-subtext">
          When you get in touch, you talk directly with the founders who will architect and build your
          product. We share an initial scope breakdown and milestone estimate within 24 hours.
        </p>
        <div style={{ marginTop: "28px", fontFamily: "var(--font-mono)", fontSize: "0.8rem", lineHeight: "1.7" }}>
          <div>
            <strong style={{ color: "var(--ink)" }}>FOUNDER STUDIO LOCATIONS:</strong>
          </div>
          <div style={{ color: "var(--ink-secondary)" }}>• BENGALURU // Karnataka</div>
          <div style={{ color: "var(--ink-secondary)" }}>• MUMBAI // Maharashtra</div>
          <div style={{ marginTop: "12px" }}>
            DIRECT EMAIL:{" "}
            <a href="mailto:hello@zevotech.io" style={{ color: "var(--klein-blue)", fontWeight: 700 }}>
              hello@zevotech.io
            </a>
          </div>
        </div>

        <a
          href="https://wa.me/919820000000?text=Hi%20Zevo%20Technologies,%20we%20want%20to%20discuss%20a%20project."
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-quick-btn"
          data-cursor="WHATSAPP"
          onClick={handleWhatsAppClick}
        >
          <span>💬 QUICK CHAT ON WHATSAPP</span>
          <span>→</span>
        </a>
      </div>

      <div className="contact-form-col interactive-zone tilt-card">
        <form id="zevoIntakeForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fName">01 // YOUR NAME &amp; ORGANIZATION *</label>
            <input
              type="text"
              id="fName"
              className="form-input"
              required
              placeholder="Rohan Sharma — Founder / Operations"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="fEmail">02 // WORK EMAIL OR PHONE *</label>
            <input
              type="text"
              id="fEmail"
              className="form-input"
              required
              placeholder="rohan@company.com or +91 98200 ..."
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="fScope">03 // PROJECT SCOPE OR BRIEF *</label>
            <textarea
              id="fScope"
              rows={3}
              className="form-input"
              required
              placeholder="Tell us what you'd like to build or replace (e.g. Custom Operations Tool, 3D Web Visualizer, WhatsApp Workflow)..."
              value={formData.scope}
              onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="btn-action-primary"
            style={{
              width: "100%",
              justifyContent: "space-between",
              background: submitted ? "#10B981" : "",
            }}
            data-cursor="TRANSMIT"
            disabled={submitting}
          >
            <span id="submitBtnText">
              {submitting
                ? "DISPATCHING BRIEF..."
                : submitted
                ? "✔ INQUIRY TRANSMITTED // TALK SOON"
                : "SUBMIT INQUIRY"}
            </span>
            <span>↗</span>
          </button>
        </form>
      </div>
    </section>
  );
}
