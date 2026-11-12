export default function AboutSection() {
  return (
    <section className="section-wrap content-grid" id="about">
      <div className="section-header-left">
        <span className="section-tag">{"// 01 — WHO WE ARE"}</span>
        <h2 className="section-title">
          A dedicated engineering team. <br />
          <em>Zero</em> corporate bureaucracy.
        </h2>
        <p className="section-subtext">
          We are a full-service engineering and product design studio. You work directly with senior
          specialists who architect your database, craft your user interfaces, and write your code—delivering
          faster results, uncompromised quality, and complete transparency.
        </p>
      </div>

      <div className="about-cards-deck interactive-zone">
        <div className="about-card tilt-card">
          <span className="about-badge">01 // DIRECT TEAM COLLABORATION</span>
          <h3>Work Directly With The Builders</h3>
          <p>
            You collaborate directly with the engineers and designers building your product. No layers
            of account managers, no commission salespeople, and no endless chain of meetings. We take
            on select projects so your build gets dedicated, high-focus attention.
          </p>
          <div className="about-pod-tags">
            <span className="pod-tag">
              📍 BENGALURU &amp; MUMBAI // Working with clients across India &amp; globally
            </span>
          </div>
        </div>

        <div className="about-card tilt-card">
          <span className="about-badge">02 // 100% CODE &amp; DATA OWNERSHIP</span>
          <h3>You Own The Code, Keys &amp; Database</h3>
          <p>
            Unlike rented SaaS platforms that lock your data and charge per user, we hand over clean
            Git repositories, Docker configurations, and complete database access to your team. Zero
            recurring license fees and total independence.
          </p>
        </div>

        <div className="about-card tilt-card">
          <span className="about-badge">03 // RAPID SPRINT CYCLES</span>
          <h3>Working Releases Every 2 Weeks</h3>
          <p>
            No multi-month delays or vague roadmaps. We build in agile 2-week sprints, deploying
            testable working software to live staging environments so your team can test features and give
            feedback in real time.
          </p>
        </div>
      </div>

      <div className="about-creds-strip interactive-zone tilt-card">
        <div>
          <strong>Senior-Led</strong>
          <span>Direct Technical Collaboration</span>
        </div>
        <div>
          <strong>Full-Stack Craft</strong>
          <span>Architecture, UI &amp; Code</span>
        </div>
        <div>
          <strong>Production-Ready</strong>
          <span>Clean, Tested &amp; Documented</span>
        </div>
        <div>
          <strong>Zero</strong>
          <span>Monthly Per-User Fees</span>
        </div>
      </div>
    </section>
  );
}
