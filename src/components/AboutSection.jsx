export default function AboutSection() {
  return (
    <section className="section-wrap content-grid" id="about">
      <div className="section-header-left">
        <span className="section-tag">// 01 — WHO WE ARE</span>
        <h2 className="section-title">
          Two senior builders. <br />
          <em>No</em> corporate bureaucracy.
        </h2>
        <p className="section-subtext">
          We are a focused two-person engineering and design studio. By staying lean, you work
          directly with the two senior specialists who architect your database, design your UI, and
          write your code—delivering faster results with complete transparency.
        </p>
      </div>

      <div className="about-cards-deck interactive-zone">
        <div className="about-card tilt-card">
          <span className="about-badge">01 // DIRECT FOUNDER ACCESS</span>
          <h3>Work Directly With The Builders</h3>
          <p>
            You speak directly with the engineers building your product. No account managers, no
            commission salespeople, and no endless chain of meetings. We take on only a handful of
            clients at a time so your project gets dedicated attention.
          </p>
          <div className="about-pod-tags">
            <span className="pod-tag">
              📍 BENGALURU &amp; MUMBAI // Working with clients across India &amp; remotely
            </span>
          </div>
        </div>

        <div className="about-card tilt-card">
          <span className="about-badge">02 // 100% OWNERSHIP</span>
          <h3>You Own The Code, Keys &amp; Database</h3>
          <p>
            Unlike rented software platforms that hold your business data hostage, we hand over clean
            Git repositories, Docker files, and complete database access to your team. Zero
            recurring license fees and total independence.
          </p>
        </div>

        <div className="about-card tilt-card">
          <span className="about-badge">03 // RAPID SPRINTS</span>
          <h3>Working Releases Every 2 Weeks</h3>
          <p>
            No multi-year delays or corporate red tape. We work in agile 2-week sprints, deploying
            testable working software on live staging links so you can test features and give
            feedback as we build.
          </p>
        </div>
      </div>

      <div className="about-creds-strip interactive-zone tilt-card">
        <div>
          <strong>Founder-Led</strong>
          <span>Direct Senior Collaboration</span>
        </div>
        <div>
          <strong>Full-Stack + 3D</strong>
          <span>Design, 3D Models &amp; Code</span>
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
