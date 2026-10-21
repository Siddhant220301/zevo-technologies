"use client";

import { useState } from "react";
import sound from "@/utils/audio";

const erpSpecs = {
  supply: {
    title: "Multi-Warehouse & Barcode Dispatch Tracking",
    desc: "Track inventory items in real time across multiple distribution hubs. Automatically generate purchase orders when stock reaches reorder levels, and sync barcode scanner input with zero lag.",
    m1: "Live Sync",
    m2: "Zero Spreadsheet Drift",
    m3: "Unlimited Users (No Extra Fee)",
  },
  finance: {
    title: "GST e-Invoicing, e-Way Bills & Payment Tracking",
    desc: "Generate approved GST invoices with IRN and QR codes automatically. Direct sync with the GST portal, automated e-way bills for dispatches, and real-time reconciliation with your bank feeds.",
    m1: "Auto IRN Generation",
    m2: "100% GST Compliant",
    m3: "Zero Manual Errors",
  },
  hrms: {
    title: "Team Attendance, Shift Rosters & Payroll",
    desc: "Track daily team check-ins, floor attendance, and shifts without manual registers. Calculate payroll and generate payslips with accurate statutory PF/ESIC deductions in one click.",
    m1: "Easy Biometric/Mobile Sync",
    m2: "PF & ESIC Compliant",
    m3: "1-Click Direct Slip Export",
  },
  bi: {
    title: "Operational Dashboard & Daily Business Summary",
    desc: "View real-time daily sales, pending dispatches, low-stock alerts, and margin summaries in one clear executive dashboard, with automated daily reports delivered directly to WhatsApp.",
    m1: "Daily Executive Digest",
    m2: "Live Gross Margins",
    m3: "Instant WhatsApp Alerts",
  },
};

export default function ErpSection({ onSelectFace }) {
  const [activeTab, setActiveTab] = useState("supply");

  const handleTabClick = (key) => {
    sound.playClick(950);
    setActiveTab(key);
    if (onSelectFace) {
      onSelectFace(0);
    }
  };

  const current = erpSpecs[activeTab];

  return (
    <section className="section-wrap content-grid" id="erp">
      <div className="section-header-left">
        <span className="section-tag">// 04 — ENTERPRISE BACKBONE</span>
        <h2 className="section-title">
          Replace rigid software with a system you <em>own</em>.
        </h2>
        <p className="section-subtext">
          Off-the-shelf software vendors force you into complicated setups and expensive per-user fees
          every month. We build clean, fast custom ERPs tailored exactly to how your business
          operates—delivered in 4 to 6 weeks.
        </p>
      </div>

      <div className="erp-cards-deck interactive-zone">
        <div className="erp-card tilt-card">
          <span className="erp-pill-badge">OFF-THE-SHELF (SAP / ZOHO / ORACLE)</span>
          <h3>Expensive &amp; Rigid</h3>
          <ul>
            <li>— Heavy recurring monthly per-user license fees</li>
            <li>— Long, painful customization cycles</li>
            <li>— Clunky screens that your staff struggle to use</li>
          </ul>
        </div>

        <div className="erp-card zevo-card tilt-card">
          <span className="erp-pill-badge">ZEVO CUSTOM ARCHITECTURE</span>
          <h3>100% Owned &amp; Fast</h3>
          <ul>
            <li>+ Zero recurring per-user fees forever</li>
            <li>+ Tailored GST invoicing &amp; warehouse sync in 4–6 weeks</li>
            <li>+ Instant loading speeds with 100% code ownership</li>
          </ul>
        </div>
      </div>

      <div className="erp-interactive-console interactive-zone tilt-card">
        <div className="erp-tabs">
          <button
            type="button"
            className={`erp-tab-btn ${activeTab === "supply" ? "active" : ""}`}
            data-erp="supply"
            data-cursor="TAB"
            onClick={() => handleTabClick("supply")}
          >
            01 // INVENTORY &amp; WAREHOUSE
          </button>
          <button
            type="button"
            className={`erp-tab-btn ${activeTab === "finance" ? "active" : ""}`}
            data-erp="finance"
            data-cursor="TAB"
            onClick={() => handleTabClick("finance")}
          >
            02 // GST &amp; INVOICING
          </button>
          <button
            type="button"
            className={`erp-tab-btn ${activeTab === "hrms" ? "active" : ""}`}
            data-erp="hrms"
            data-cursor="TAB"
            onClick={() => handleTabClick("hrms")}
          >
            03 // TEAM &amp; ATTENDANCE
          </button>
          <button
            type="button"
            className={`erp-tab-btn ${activeTab === "bi" ? "active" : ""}`}
            data-erp="bi"
            data-cursor="TAB"
            onClick={() => handleTabClick("bi")}
          >
            04 // REPORTING &amp; METRICS
          </button>
        </div>

        <div className="erp-console-output">
          <h4 id="erpTitle">{current.title}</h4>
          <p id="erpDesc">{current.desc}</p>
          <div className="erp-telemetry-row">
            <span className="telemetry-chip">
              LIVE SYNC: <strong id="erpMetric1">{current.m1}</strong>
            </span>
            <span className="telemetry-chip">
              ACCURACY: <strong id="erpMetric2">{current.m2}</strong>
            </span>
            <span className="telemetry-chip">
              SEATS: <strong id="erpMetric3">{current.m3}</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
