import Image from "next/image";
import { TEAM_PHOTO } from "@/lib/photos";

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
          We are a full-service custom software and product design studio based in Bengaluru and
          Mumbai. You work directly with the senior specialists who architect your database, craft
          your interfaces, and write your code.
        </p>
      </div>

      <div className="about-cards-deck interactive-zone">
        {TEAM_PHOTO.src && (
          <figure className="about-photo">
            <div className="photo-frame">
              <Image src={TEAM_PHOTO.src} alt={TEAM_PHOTO.alt} fill sizes="(max-width: 1024px) 100vw, 60vw" />
            </div>
            {TEAM_PHOTO.caption && <figcaption>{TEAM_PHOTO.caption}</figcaption>}
          </figure>
        )}

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
          <span className="about-badge">03 // SPEED ON EVERY DEVICE</span>
          <h3>Blazing Fast Across Every Device</h3>
          <p>
            Clean, lightweight engineering that loads instantaneously across office workstations,
            mobile browsers, warehouse handhelds, and factory floor networks with zero lag.
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
          <strong>24 Hrs</strong>
          <span>First Scope &amp; Estimate</span>
        </div>
      </div>
    </section>
  );
}
