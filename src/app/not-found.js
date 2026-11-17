import PageShell from "@/components/PageShell";

export const metadata = {
  title: "Page not found",
};

// Shown for any address that does not exist
export default function NotFound() {
  return (
    <PageShell face={4} actionHref="/#contact" untilId="no-action-bar">
      <section className="svc-hero content-grid" id="hero">
        {/* Phones only: reserved space where the 3D die sits above the heading */}
        <div className="stage-slot stage-slot--hero" aria-hidden="true" />

        <span className="section-tag">{"// 404 — PAGE NOT FOUND"}</span>
        <h1 className="section-title svc-title">
          This page rolled <em>away</em>.
        </h1>
        <p className="svc-lead">
          The address may be old or mistyped. Everything we build is one click from here.
        </p>

        <div className="hero-cta-cluster interactive-zone">
          <a href="/" className="btn-action-primary" data-cursor="HOME">
            <span>BACK TO HOME</span>
            <span>→</span>
          </a>
          <a href="/services" className="btn-action-secondary" data-cursor="ALL">
            <span>ALL SERVICES</span>
          </a>
        </div>
      </section>
    </PageShell>
  );
}
