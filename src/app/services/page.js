import PageShell from "@/components/PageShell";
import JsonLd from "@/components/JsonLd";
import { SERVICES } from "@/lib/services";
import { SITE } from "@/lib/site";

const TITLE = "Services";
const DESCRIPTION =
  "What Zevo Technologies builds: custom ERP software, web applications, interactive web experiences, WhatsApp automation, motion design and mobile apps.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/services" },
  openGraph: {
    type: "website",
    url: "/services",
    siteName: SITE.name,
    title: `${TITLE} | ${SITE.name}`,
    description: DESCRIPTION,
    locale: "en_IN",
    images: [{ url: "/og/home.jpg", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | ${SITE.name}`,
    description: DESCRIPTION,
    images: ["/og/home.jpg"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
        { "@type": "ListItem", position: 2, name: "Services", item: `${SITE.url}/services` },
      ],
    },
    {
      "@type": "ItemList",
      itemListElement: SERVICES.map((service, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: service.name,
        url: `${SITE.url}/services/${service.slug}`,
      })),
    },
  ],
};

// Index of the service pages
export default function ServicesPage() {
  return (
    <PageShell face={0} actionHref="/#contact" untilId="service-cta">
      <JsonLd data={structuredData} />

      <section className="svc-hero content-grid" id="hero">
        <nav className="svc-crumbs interactive-zone" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Services</span>
        </nav>

        {/* Phones only: reserved space where the 3D die sits above the heading */}
        <div className="stage-slot stage-slot--hero" aria-hidden="true" />

        <span className="section-tag">{"// WHAT WE BUILD"}</span>
        <h1 className="section-title svc-title">
          Six things we build. <em>One</em> focused studio.
        </h1>
        <p className="svc-lead">
          Custom ERP, web apps, automations, motion and mobile, designed, engineered and shipped by
          one team. You own everything we build.
        </p>

        <div className="hero-cta-cluster interactive-zone">
          <a href="/#contact" className="btn-action-primary" data-cursor="START">
            <span>START A PROJECT</span>
            <span>→</span>
          </a>
        </div>

        <div className="svc-other-list svc-index-list interactive-zone">
          {SERVICES.map((service) => (
            <a key={service.slug} href={`/services/${service.slug}`} className="svc-other-row svc-index-row" data-cursor="OPEN">
              <span className="cap-face-code">{`[${service.code}]`}</span>
              <span className="svc-other-name">
                {service.name}
                <small>{service.lead}</small>
              </span>
              <span className="cap-arrow-icon" aria-hidden="true">
                ↗
              </span>
            </a>
          ))}
        </div>

        <div className="svc-cta-band interactive-zone" id="service-cta">
          <h2>Tell us what you need built.</h2>
          <p>You get a scope breakdown and a milestone estimate within 24 hours.</p>
          <a href="/#contact" className="btn-action-primary" data-cursor="START">
            <span>START A PROJECT</span>
            <span>→</span>
          </a>
        </div>
      </section>
    </PageShell>
  );
}
