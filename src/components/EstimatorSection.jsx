"use client";

import { useEffect, useState } from "react";

const moduleData = {
  erp: { name: "Custom Operations Tool / ERP", inr: 1.8, inrTag: "1.8L", usd: 2200, usdTag: "2.2k", hrs: 80, face: 0 },
  webgl: { name: "Interactive Web & Product Visualizer", inr: 1.2, inrTag: "1.2L", usd: 1500, usdTag: "1.5k", hrs: 55, face: 1 },
  ai: { name: "WhatsApp & Workflow Automation", inr: 0.95, inrTag: "95k", usd: 1200, usdTag: "1.2k", hrs: 45, face: 2 },
  video: { name: "Motion Design & Visual Assets", inr: 0.65, inrTag: "65k", usd: 850, usdTag: "850", hrs: 30, face: 3 },
  seo: { name: "Search & Speed Optimization", inr: 0.45, inrTag: "45k", usd: 600, usdTag: "600", hrs: 25, face: 4 },
  mobile: { name: "Mobile App (iOS & Android)", inr: 1.4, inrTag: "1.4L", usd: 1800, usdTag: "1.8k", hrs: 65, face: 5 },
};

const scopeTiers = [
  { id: "mvp", label: "MVP / CORE BUILD", mult: 0.85, squad: "Core Focused Release // 3–4 Weeks" },
  { id: "standard", label: "STANDARD BUILD", mult: 1.0, squad: "Complete Custom System // 5–7 Weeks" },
  { id: "expanded", label: "EXPANDED PLATFORM", mult: 1.45, squad: "Multi-Module System + Extended Polish // 8–10 Weeks" },
];

export default function EstimatorSection({ onSelectFace, onRandomizeSpec }) {
  const [curr, setCurr] = useState("INR");
  const [activeTierId, setActiveTierId] = useState("standard");
  const [selectedModules, setSelectedModules] = useState({
    erp: true,
    webgl: true,
    ai: false,
    video: false,
    seo: false,
    mobile: false,
  });

  const activeTier = scopeTiers.find((t) => t.id === activeTierId) || scopeTiers[1];

  // Tell the 3D stage which modules are selected so their cubes can dock
  useEffect(() => {
    const detail = {
      faces: Object.keys(selectedModules)
        .filter((k) => selectedModules[k])
        .map((k) => moduleData[k].face),
      tier: activeTierId,
    };
    window.__zevoModules = detail;
    window.dispatchEvent(new CustomEvent("zevo:modules", { detail }));
  }, [selectedModules, activeTierId]);

  const handleCurrToggle = (newCurr) => {
    setCurr(newCurr);
  };

  const handleModuleToggle = (key) => {
    const nextState = !selectedModules[key];
    setSelectedModules((prev) => ({ ...prev, [key]: nextState }));

    if (nextState && onSelectFace) {
      onSelectFace(moduleData[key].face);
    }
  };

  const handleTierSelect = (tier) => {
    setActiveTierId(tier.id);
  };

  // Calculations
  let baseInr = 0;
  let baseUsd = 0;
  let baseHrs = 0;

  Object.keys(selectedModules).forEach((k) => {
    if (selectedModules[k] && moduleData[k]) {
      baseInr += moduleData[k].inr;
      baseUsd += moduleData[k].usd;
      baseHrs += moduleData[k].hrs;
    }
  });

  const estMult = activeTier.mult;
  const minInr = (baseInr * estMult).toFixed(1);
  const maxInr = (baseInr * estMult * 1.35).toFixed(1);
  const minUsd = Math.round(baseUsd * estMult);
  const maxUsd = Math.round(baseUsd * estMult * 1.35);
  const minHrs = Math.round(baseHrs * estMult);
  const maxHrs = Math.round(baseHrs * estMult * 1.25);
  const weeks = Math.max(3, Math.round(minHrs / 32));

  let priceDisplay = "₹0 (Select Modules)";
  if (baseInr > 0) {
    priceDisplay = curr === "INR" ? `₹${minInr}L — ₹${maxInr}L` : `$${minUsd.toLocaleString()} — $${maxUsd.toLocaleString()}`;
  } else if (curr === "USD") {
    priceDisplay = "$0 (Select Modules)";
  }

  const hoursDisplay = baseHrs === 0 ? "0 HOURS" : `${minHrs} — ${maxHrs} HOURS (${weeks}–${weeks + 2} WEEKS)`;

  const handleRandomizeClick = () => {
    const keys = Object.keys(moduleData);
    const shuffled = [...keys].sort(() => 0.5 - Math.random());
    const countToPick = 2 + Math.floor(Math.random() * 3); // 2, 3, or 4
    const newSelected = {};
    keys.forEach((k) => (newSelected[k] = false));
    for (let i = 0; i < countToPick && i < shuffled.length; i++) {
      newSelected[shuffled[i]] = true;
    }
    setSelectedModules(newSelected);

    const randomTier = scopeTiers[Math.floor(Math.random() * scopeTiers.length)];
    setActiveTierId(randomTier.id);

    const activeKeys = Object.keys(newSelected).filter((k) => newSelected[k]);
    if (activeKeys.length > 0) {
      const chosen = activeKeys[Math.floor(Math.random() * activeKeys.length)];
      if (onSelectFace) onSelectFace(moduleData[chosen].face);
    }

    if (onRandomizeSpec) onRandomizeSpec();
  };

  const handleLockEstimate = () => {
    const chosenNames = Object.keys(selectedModules)
      .filter((k) => selectedModules[k])
      .map((k) => moduleData[k].name);

    const scopeBox = document.getElementById("fScope");
    if (scopeBox) {
      scopeBox.value = `Hi Zevo team, we want to discuss building a project with:
• Selected Modules: ${chosenNames.length > 0 ? chosenNames.join(", ") : "Custom Build"}
• Scope Tier: ${activeTier.label} (${activeTier.squad})
• Target Estimate: ${priceDisplay}`;
    }

    setTimeout(() => {
      const nameInput = document.getElementById("fName");
      if (nameInput) nameInput.focus();
    }, 600);
  };

  return (
    <section className="section-wrap content-grid" id="estimator">
      <div className="section-header-left">
        <span className="section-tag">{"// 07 — TRANSPARENT ESTIMATION"}</span>
        <h2 className="section-title">
          Estimate your <em>project</em>.
          <span className="currency-switch-box">
            <button
              type="button"
              className={`curr-btn ${curr === "INR" ? "active" : ""}`}
              id="currBtnInr"
              data-curr="INR"
              onClick={() => handleCurrToggle("INR")}
            >
              ₹ INR (Lakhs)
            </button>
            <button
              type="button"
              className={`curr-btn ${curr === "USD" ? "active" : ""}`}
              id="currBtnUsd"
              data-curr="USD"
              onClick={() => handleCurrToggle("USD")}
            >
              $ USD
            </button>
          </span>
        </h2>
        <p className="section-subtext">
          Select the capabilities your project needs. Pricing is straightforward and based on project
          scope—with zero recurring software license fees.
        </p>
      </div>

      <div className="estimator-box interactive-zone tilt-card">
        <div className="est-controls-col">
          <span className="section-tag" style={{ color: "var(--ink-muted)" }}>
            STEP 01 // SELECT DESIRED CAPABILITIES
          </span>
          <div className="modules-deck" id="calcModules">
            {Object.keys(moduleData).map((key) => {
              const mod = moduleData[key];
              const isChecked = !!selectedModules[key];
              return (
                <label
                  key={key}
                  className={`module-card-item tilt-card ${isChecked ? "active" : ""}`}
                  data-cursor="SELECT"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleModuleToggle(key)}
                  />
                  <div>
                    <strong>{mod.name}</strong>
                    <span>
                      {key === "erp" && "Inventory, orders, GST & invoicing"}
                      {key === "webgl" && "Interactive 60fps product experience"}
                      {key === "ai" && "Automated customer alerts & integrations"}
                      {key === "video" && "Product trailers, explainers & visual reels"}
                      {key === "seo" && "Technical SEO & fast landing pages"}
                      {key === "mobile" && "Cross-platform React Native / Flutter"}
                    </span>
                  </div>
                  <span className="mod-tag">
                    {curr === "INR" ? `[+₹${mod.inrTag}]` : `[+$${mod.usdTag}]`}
                  </span>
                </label>
              );
            })}
          </div>

          <span className="section-tag" style={{ color: "var(--ink-muted)" }}>
            STEP 02 // PROJECT SCOPE TIER
          </span>
          <div className="tier-pills-row" id="scalePills">
            {scopeTiers.map((tier) => (
              <button
                key={tier.id}
                type="button"
                className={`tier-btn ${activeTierId === tier.id ? "active" : ""}`}
                data-mult={tier.mult}
                data-squad={tier.squad}
                onClick={() => handleTierSelect(tier)}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>

        <div className="est-summary-col">
          <div>
            <span className="section-tag" style={{ color: "var(--acid-gold)" }}>
              ESTIMATED PROJECT RANGE
            </span>
            <div className="price-giant" id="estPriceDisplay">
              {priceDisplay}
            </div>
            <p style={{ fontSize: "0.85rem", opacity: 0.85, lineHeight: 1.5 }}>
              Sprint milestone pricing with 100% source code ownership and zero recurring seat fees.
            </p>

            <div className="summary-meta-row">
              <span>ESTIMATED TIMELINE:</span>
              <br />
              <strong id="estHoursDisplay">{hoursDisplay}</strong>
            </div>

            <div className="summary-meta-row">
              <span>DELIVERY APPROACH:</span>
              <br />
              <strong id="estSquadDisplay" style={{ color: "var(--acid-gold)" }}>
                {activeTier.squad}
              </strong>
            </div>
          </div>

          <a
            href="#contact"
            id="lockEstimateBtn"
            className="btn-action-primary"
            style={{ marginTop: "24px", justifyContent: "space-between" }}
            data-cursor="LOCK"
            onClick={handleLockEstimate}
          >
            <span>DISCUSS THIS PROJECT</span>
            <span>→</span>
          </a>
        </div>
      </div>

      {/* Empty window the 3D die rides in while this section is on screen */}
      <div className="est-stage-window" aria-hidden="true" />

      <div className="est-spatial-companion interactive-zone tilt-card">
        <div>
          <span className="section-tag" style={{ color: "var(--klein-blue)" }}>
            {"// INTERACTIVE STAGE CO-PILOT"}
          </span>
          <h3>Die Responds To Your Stack</h3>
          <p>
            Every module you check or uncheck dynamically commands the visual monolith, orienting the
            relevant capability into focus.
          </p>
          <div className="est-spec-pills">
            <span className="telemetry-chip">
              <strong>100%</strong> Code Ownership
            </span>
            <span className="telemetry-chip">
              <strong>Fast</strong> Turnaround
            </span>
            <span className="telemetry-chip">
              <strong>Zero</strong> Recurring Fees
            </span>
          </div>
        </div>
        <div style={{ marginTop: "28px" }}>
          <button
            type="button"
            className="roll-dice-header-btn"
            id="estRollSpecBtn"
            style={{ width: "100%", justifyContent: "center" }}
            data-cursor="ROLL"
            onClick={handleRandomizeClick}
          >
            <span>🎲 ROLL DIE &amp; RANDOMIZE SPEC</span>
          </button>
        </div>
      </div>
    </section>
  );
}
