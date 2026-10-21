export default function MissionSection() {
  return (
    <section className="section-wrap content-grid" id="mission">
      <div className="section-header-right">
        <span className="section-tag">// 02 — OUR APPROACH</span>
        <h2 className="section-title">
          Sensible software built for <em>real</em> businesses.
        </h2>
        <p className="section-subtext">
          Growing companies shouldn&apos;t bleed lakhs every month paying per-user software fees for
          rigid platforms that don&apos;t match how your business actually runs.
        </p>
      </div>

      <div className="mission-grid interactive-zone">
        <div className="mission-card tilt-card">
          <div>
            <span className="mission-num">01</span>
            <h3>No Monthly Seat Fees</h3>
            <p>
              Stop paying recurring fees every time you hire a new employee. You pay once to build
              your system, and it is yours forever.
            </p>
          </div>
        </div>

        <div className="mission-card tilt-card">
          <div>
            <span className="mission-num">02</span>
            <h3>Built for Real Business Needs</h3>
            <p>
              Built around your team&apos;s real operations: multi-location inventory sync, instant
              GST e-invoices, automated e-way bills, and WhatsApp customer updates.
            </p>
          </div>
        </div>

        <div className="mission-card tilt-card">
          <div>
            <span className="mission-num">03</span>
            <h3>Blazing Fast Everywhere</h3>
            <p>
              Clean, lightweight modern code that loads instantly on office desktops, mobile
              devices, factory floors, and warehouse networks.
            </p>
          </div>
        </div>

        <div className="mission-card tilt-card">
          <div>
            <span className="mission-num">04</span>
            <h3>Clear, Honest Pricing</h3>
            <p>
              Transparent sprint pricing in ₹ Lakhs. Clear project scopes, bi-weekly demos, direct
              WhatsApp communication, and zero hidden costs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
