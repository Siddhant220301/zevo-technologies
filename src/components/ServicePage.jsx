import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import FaqList from "@/components/FaqList";
import JsonLd from "@/components/JsonLd";
import { SERVICES, PROJECT_STEPS, getService } from "@/lib/services";
import { SITE } from "@/lib/site";

// The page for one service, and the search-engine details that go with it.
// Each service has a small route file in app/services/<slug>/page.js that
// names its slug; everything else comes from lib/services.js.

// A service uses its own share image when one exists, the general one otherwise
function shareImage(service) {
  const own = `/og/${service.slug}.jpg`;
  const exists = fs.existsSync(path.join(process.cwd(), "public", own));
  return { url: exists ? own : "/og/home.jpg", width: 1200, height: 630, alt: service.name };
}

export function serviceMetadata(slug) {
  const service = getService(slug);
  if (!service) return {};
  const url = `/services/${service.slug}`;
  const image = shareImage(service);
  const fullTitle = `${service.metaTitle} | ${SITE.name}`;
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE.name,
      title: fullTitle,
      description: service.metaDescription,
      locale: "en_IN",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: service.metaDescription,
      images: [image.url],
    },
  };
}

function structuredData(service) {
  const url = `${SITE.url}/services/${service.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.name,
        serviceType: service.name,
        description: service.metaDescription,
        url,
        provider: { "@id": `${SITE.url}/#organization` },
        areaServed: { "@type": "Country", name: "India" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
          { "@type": "ListItem", position: 2, name: "Services", item: `${SITE.url}/services` },
          { "@type": "ListItem", position: 3, name: service.name, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };
}

export default function ServicePage({ slug }) {
  const service = getService(slug);
  if (!service) notFound();

  const others = SERVICES.filter((other) => other.slug !== service.slug);
  // Opens the enquiry form with this service already picked
  const startHref = `/?need=${service.chip}#contact`;

  return (
    <PageShell face={service.face} actionHref={startHref} untilId="service-cta">
      <JsonLd data={structuredData(service)} />

      <section className="svc-hero content-grid" id="hero">
        <nav className="svc-crumbs interactive-zone" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span aria-hidden="true">/</span>
          <a href="/services">Services</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{service.name}</span>
        </nav>

        {/* Phones only: reserved space where the 3D die sits above the heading */}
        <div className="stage-slot stage-slot--hero" aria-hidden="true" />

        <span className="section-tag">{`// SERVICE ${service.code.replace(" // ", " — ")}`}</span>
        <h1 className="section-title svc-title">
          {service.titleLead} <em>{service.titleAccent}</em>
          {service.titleTail ? ` ${service.titleTail}` : ""}.
        </h1>
        <p className="svc-lead">{service.lead}</p>

        <div className="hero-cta-cluster interactive-zone">
          <a href={startHref} className="btn-action-primary" data-cursor="START">
            <span>START A PROJECT</span>
            <span>→</span>
          </a>
          <a href="/services" className="btn-action-secondary" data-cursor="ALL">
            <span>ALL SERVICES</span>
          </a>
        </div>

        <div className="svc-card svc-body interactive-zone">
          {service.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="section-wrap svc-section content-grid">
        <div className="section-header-left">
          <span className="section-tag">{"// WHAT YOU GET"}</span>
          <h2 className="section-title">
            What is <em>included</em>.
          </h2>
        </div>
        <div className="svc-grid interactive-zone">
          {service.includes.map((item, i) => (
            <div key={item.title} className="svc-card tilt-card">
              <span className="mission-num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
        <div className="svc-fit-list interactive-zone">
          <h3>A GOOD FIT WHEN</h3>
          <ul>
            {service.fit.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-wrap svc-section content-grid">
        <div className="section-header-left">
          <span className="section-tag">{"// HOW A PROJECT RUNS"}</span>
          <h2 className="section-title">
            Four steps, <em>no</em> surprises.
          </h2>
        </div>
        <div className="svc-grid interactive-zone">
          {PROJECT_STEPS.map((step) => (
            <div key={step.code} className="svc-card tilt-card">
              <span className="mission-num">{step.code}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-wrap svc-section content-grid">
        <div className="section-header-left">
          <span className="section-tag">{"// QUESTIONS"}</span>
          <h2 className="section-title">
            Questions, <em>answered</em>.
          </h2>
        </div>
        <FaqList items={service.faqs} idPrefix="svc-faq" />
      </section>

      <section className="section-wrap svc-section content-grid">
        <div className="section-header-left">
          <span className="section-tag">{"// MORE FROM THE STUDIO"}</span>
          <h2 className="section-title">
            Other things we <em>build</em>.
          </h2>
        </div>
        <div className="svc-other-list interactive-zone">
          {others.map((other) => (
            <a key={other.slug} href={`/services/${other.slug}`} className="svc-other-row" data-cursor="OPEN">
              <span className="cap-face-code">{`[${other.code}]`}</span>
              <span className="svc-other-name">{other.name}</span>
              <span className="cap-arrow-icon" aria-hidden="true">
                ↗
              </span>
            </a>
          ))}
        </div>

        <div className="svc-cta-band interactive-zone" id="service-cta">
          <h2>Tell us what you need built.</h2>
          <p>You get a scope breakdown and a milestone estimate within 24 hours.</p>
          <a href={startHref} className="btn-action-primary" data-cursor="START">
            <span>START A PROJECT</span>
            <span>→</span>
          </a>
        </div>
      </section>
    </PageShell>
  );
}
