export default function CaseStudiesSection() {
  return (
    <section className="section-wrap content-grid" id="cases">
      <div className="section-header-left">
        <span className="section-tag">// 06 — CLIENT WORK</span>
        <h2 className="section-title">
          Practical results for <em>growing</em> businesses.
        </h2>
        <p className="section-subtext">
          Real software and interactive digital experiences delivered for logistics hubs, modern D2C
          lifestyle brands, and healthcare practices.
        </p>
      </div>

      <div className="cases-row-deck interactive-zone">
        <article className="case-card case-01 tilt-card" data-cursor="CASE 01">
          <span className="case-num">CASE STUDY // 01</span>
          <h3>Shree Balaji Logistics — Unified Warehouse Inventory &amp; Invoicing Portal</h3>
          <p>
            Unified 48,000 inventory items across Bhiwandi, Pune &amp; Ahmedabad hubs with
            real-time barcode scanner support and automated GST e-way bill generation in 6 weeks.
          </p>
          <div className="case-stat-grid">
            <div>
              <strong className="stat-count-str">6 Wks</strong>
              <span>Deployment Time</span>
            </div>
            <div>
              <strong className="stat-count-str">100%</strong>
              <span>Custom Workflow Fit</span>
            </div>
          </div>
        </article>

        <article className="case-card case-02 tilt-card" data-cursor="CASE 02">
          <span className="case-num">CASE STUDY // 02</span>
          <h3>Zenith Lifestyle — Interactive 360° Footwear Customizer</h3>
          <p>
            Engineered a fast, responsive interactive product visualizer allowing customers to
            inspect materials in 360° and customize colorways directly in the browser.
          </p>
          <div className="case-stat-grid">
            <div>
              <strong className="stat-count-str">+42%</strong>
              <span>Avg. Time On Site</span>
            </div>
            <div>
              <strong className="stat-count-str">60 FPS</strong>
              <span>Smooth Mobile Experience</span>
            </div>
          </div>
        </article>

        <article className="case-card case-03 tilt-card" data-cursor="CASE 03">
          <span className="case-num">CASE STUDY // 03</span>
          <h3>Kavach Health — Patient Records &amp; Clinic Operations Portal</h3>
          <p>
            Replaced a slow legacy interface with a clean, fast web portal for doctors and staff,
            enabling instant patient record lookups and automated billing.
          </p>
          <div className="case-stat-grid">
            <div>
              <strong className="stat-count-str">&lt; 0.4s</strong>
              <span>Record Load Time</span>
            </div>
            <div>
              <strong className="stat-count-str">Zero</strong>
              <span>Monthly Per-User Fees</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
