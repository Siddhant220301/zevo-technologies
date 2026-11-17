export default function MissionSection() {
  return (
    <section className="section-wrap content-grid" id="mission">
      <div className="section-header-right">
        <span className="section-tag">{"// 02 — VISION & MISSION"}</span>
        <h2 className="section-title">
          Empowering businesses with software they <em>truly own</em>.
        </h2>
        <p className="section-subtext">
          We believe ambitious companies deserve high-performance digital tools built around their
          exact workflows—free from recurring seat fees, vendor lock-in, and legacy software bloat.
        </p>
      </div>

      <div className="mission-grid interactive-zone">
        <div className="mission-card tilt-card">
          <div>
            <span className="mission-num">OUR VISION</span>
            <h3>Software Independence for Every Enterprise</h3>
            <p>
              A future where businesses operate on high-speed, custom-crafted digital infrastructure
              they completely control—eliminating perpetual per-user licensing taxes, rigid vendor
              constraints, and fragmented workarounds.
            </p>
          </div>
        </div>

        <div className="mission-card tilt-card">
          <div>
            <span className="mission-num">OUR MISSION</span>
            <h3>Engineering High-Performance Custom Systems</h3>
            <p>
              To architect and deploy robust, production-grade software tailored precisely to
              real-world operations—delivering 100% intellectual property ownership, rapid 2-week
              agile delivery cycles, and lasting operational advantage.
            </p>
          </div>
        </div>

        <div className="mission-divider">{"// HOW A PROJECT RUNS"}</div>

        <div className="mission-card tilt-card">
          <div>
            <span className="mission-num">01 // TALK</span>
            <h3>Start With a Conversation</h3>
            <p>
              Send a short brief. You talk directly with the engineers and designers who will build
              your product, and receive a scope breakdown and milestone estimate within 24 hours.
            </p>
          </div>
        </div>

        <div className="mission-card tilt-card">
          <div>
            <span className="mission-num">02 // SCOPE</span>
            <h3>Clear Milestones, Honest Pricing</h3>
            <p>
              Every milestone has a defined scope and a predictable price in ₹ Lakhs, agreed before
              work begins. Zero hidden costs.
            </p>
          </div>
        </div>

        <div className="mission-card tilt-card">
          <div>
            <span className="mission-num">03 // BUILD</span>
            <h3>Working Releases Every 2 Weeks</h3>
            <p>
              No multi-month delays or vague roadmaps. We build in agile 2-week sprints and deploy
              testable software to a live staging environment, so your team can try features and give
              feedback in real time.
            </p>
          </div>
        </div>

        <div className="mission-card tilt-card">
          <div>
            <span className="mission-num">04 // HAND OVER</span>
            <h3>Launched, Then Fully Yours</h3>
            <p>
              We deploy to production and hand over the Git repositories, Docker configurations, and
              complete database access. From day one it runs on your terms.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
